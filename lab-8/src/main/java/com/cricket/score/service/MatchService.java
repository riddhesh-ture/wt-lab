package com.cricket.score.service;

import com.cricket.score.model.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class MatchService {

    private static final Logger log = LoggerFactory.getLogger(MatchService.class);

    private final Map<String, Match> matchRepository = new ConcurrentHashMap<>();
    private final SimpMessagingTemplate messagingTemplate;

    public MatchService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public List<Match> getAllMatches() {
        return new ArrayList<>(matchRepository.values());
    }

    public Optional<Match> getMatchById(String id) {
        return Optional.ofNullable(matchRepository.get(id));
    }

    public Match saveMatch(Match match) {
        matchRepository.put(match.getId(), match);
        broadcastMatchUpdate(match);
        return match;
    }

    public void broadcastMatchUpdate(Match match) {
        try {
            if (messagingTemplate != null) {
                messagingTemplate.convertAndSend("/topic/matches", getAllMatches());
                messagingTemplate.convertAndSend("/topic/matches/" + match.getId(), match);
            }
        } catch (Exception e) {
            log.warn("Could not broadcast via WebSocket: {}", e.getMessage());
        }
    }

    public synchronized Match processBallUpdate(String matchId, ScoreUpdatePayload payload) {
        Match match = matchRepository.get(matchId);
        if (match == null) {
            throw new IllegalArgumentException("Match not found: " + matchId);
        }

        if (match.getStatus() == MatchStatus.COMPLETED) {
            return match;
        }

        if (match.getStatus() == MatchStatus.UPCOMING) {
            match.setStatus(MatchStatus.LIVE);
        }

        Innings innings = match.getCurrentInnings();
        if (innings == null) {
            throw new IllegalStateException("Current innings not found for match " + matchId);
        }

        BattingStat striker = innings.getStriker();
        BattingStat nonStriker = innings.getNonStriker();
        BowlingStat bowler = innings.getCurrentBowler();

        if (striker == null || bowler == null) {
            log.warn("Incomplete on-crease players for match: {}", matchId);
            return match;
        }

        ExtraType extraType = payload.getExtraType() != null ? payload.getExtraType() : ExtraType.NONE;
        boolean isLegal = (extraType != ExtraType.WIDE && extraType != ExtraType.NO_BALL);
        int runsScored = payload.getRuns();
        int totalBallRuns = runsScored;

        if (extraType == ExtraType.WIDE) {
            innings.setWides(innings.getWides() + 1 + runsScored);
            totalBallRuns += 1; // 1 run penalty for wide + any runs taken
            bowler.addBall(totalBallRuns, false, false);
        } else if (extraType == ExtraType.NO_BALL) {
            innings.setNoBalls(innings.getNoBalls() + 1);
            totalBallRuns += 1; // 1 run penalty for no ball
            striker.addRuns(runsScored);
            bowler.addBall(totalBallRuns, false, false);
        } else if (extraType == ExtraType.BYE) {
            innings.setByes(innings.getByes() + runsScored);
            striker.addDotBall(); // faced ball, runs are byes
            bowler.addBall(0, true, false); // byes not charged to bowler
        } else if (extraType == ExtraType.LEG_BYE) {
            innings.setLegByes(innings.getLegByes() + runsScored);
            striker.addDotBall();
            bowler.addBall(0, true, false);
        } else {
            // Normal legal delivery
            if (runsScored > 0) {
                striker.addRuns(runsScored);
            } else if (!payload.isWicket()) {
                striker.addDotBall();
            }
            bowler.addBall(runsScored, true, payload.isWicket());
        }

        innings.setTotalRuns(innings.getTotalRuns() + totalBallRuns);

        if (isLegal) {
            innings.setLegalBalls(innings.getLegalBalls() + 1);
        }

        // Calculate over and ball numbers
        int overNumber = isLegal ? ((innings.getLegalBalls() - 1) / 6) : (innings.getLegalBalls() / 6);
        int ballNumberInOver = isLegal ? (((innings.getLegalBalls() - 1) % 6) + 1) : ((innings.getLegalBalls() % 6) + 1);

        // Handle Wicket
        if (payload.isWicket()) {
            innings.setWickets(innings.getWickets() + 1);
            striker.setOut(true);
            String dismissalDesc = (payload.getWicketType() != null && !payload.getWicketType().isEmpty())
                    ? payload.getWicketType() + " b " + bowler.getPlayerName()
                    : "c & b " + bowler.getPlayerName();
            striker.setDismissal(dismissalDesc);
            striker.setStriker(false);

            innings.getFallOfWickets().add(new FallOfWicket(
                    innings.getWickets(),
                    innings.getTotalRuns(),
                    innings.getOvers(),
                    striker.getPlayerName()
            ));

            // Bring in next batsman if available
            bringNextBatsman(innings);
        }

        // Construct Ball Event
        String commentary = payload.getCommentary();
        if (commentary == null || commentary.trim().isEmpty()) {
            commentary = generateDefaultCommentary(bowler.getPlayerName(), striker.getPlayerName(),
                    runsScored, extraType, payload.isWicket());
        }

        BallEvent ballEvent = new BallEvent(
                overNumber,
                ballNumberInOver,
                runsScored,
                extraType,
                payload.isWicket(),
                striker.getPlayerName(),
                bowler.getPlayerName(),
                commentary
        );
        if (payload.isWicket()) {
            ballEvent.setWicketType(payload.getWicketType() != null ? payload.getWicketType() : "CAUGHT");
        }
        innings.getBallEvents().add(0, ballEvent); // Latest ball at the beginning of the list

        // Strike Rotation on odd runs (1 or 3 runs)
        if (runsScored % 2 != 0) {
            swapStrike(innings);
        }

        // End of Over checks
        if (isLegal && innings.getLegalBalls() % 6 == 0) {
            // Swap strike at the end of the over
            swapStrike(innings);
            // Rotate Bowler
            rotateBowler(innings);
        }

        // Recalculate match state, run rates and targets
        match.recalculateRunRates();
        match.setLastUpdated(System.currentTimeMillis());

        // Broadcast to WebSocket clients
        broadcastMatchUpdate(match);

        return match;
    }

    private void swapStrike(Innings innings) {
        BattingStat s = innings.getStriker();
        BattingStat ns = innings.getNonStriker();
        if (s != null && ns != null) {
            s.setStriker(false);
            s.setNonStriker(true);
            ns.setStriker(true);
            ns.setNonStriker(false);
        }
    }

    private void bringNextBatsman(Innings innings) {
        // Find first player not out and not non-striker
        for (BattingStat b : innings.getBattingStats()) {
            if (!b.isOut() && !b.isNonStriker() && !b.isStriker()) {
                b.setStriker(true);
                return;
            }
        }
    }

    private void rotateBowler(Innings innings) {
        List<BowlingStat> bowlers = innings.getBowlingStats();
        if (bowlers.size() < 2) return;

        int currentIdx = -1;
        for (int i = 0; i < bowlers.size(); i++) {
            if (bowlers.get(i).isCurrentBowler()) {
                currentIdx = i;
                bowlers.get(i).setCurrentBowler(false);
                break;
            }
        }
        int nextIdx = (currentIdx + 1) % bowlers.size();
        bowlers.get(nextIdx).setCurrentBowler(true);
    }

    private String generateDefaultCommentary(String bowler, String batsman, int runs, ExtraType extra, boolean isWicket) {
        if (isWicket) {
            return "OUT! " + bowler + " strikes! " + batsman + " has to walk back to the pavilion.";
        }
        if (extra == ExtraType.WIDE) {
            return bowler + " sprays it down the leg side. Umpire signals WIDE.";
        }
        if (extra == ExtraType.NO_BALL) {
            return "NO BALL called against " + bowler + "! Front foot overstepping. Free hit upcoming!";
        }
        return switch (runs) {
            case 0 -> bowler + " to " + batsman + ", no run, defensive stroke.";
            case 1 -> bowler + " to " + batsman + ", 1 run, pushed into gaps for a single.";
            case 2 -> bowler + " to " + batsman + ", 2 runs, nicely placed into deep mid-wicket.";
            case 3 -> bowler + " to " + batsman + ", 3 runs, great running between the wickets!";
            case 4 -> "FOUR! " + bowler + " to " + batsman + ", crunched through extra cover for a glorious boundary!";
            case 6 -> "SIX! " + bowler + " to " + batsman + ", DISPATCHED high and handsome over deep mid-wicket!";
            default -> bowler + " to " + batsman + ", " + runs + " runs.";
        };
    }
}
