package com.cricket.score.service;

import com.cricket.score.model.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MatchSimulationService {

    private static final Logger log = LoggerFactory.getLogger(MatchSimulationService.class);

    private final MatchService matchService;
    private final Random random = new Random();

    private final List<String> dotCommentaries = List.of(
            "Good length delivery outside off, steered defensively towards backward point.",
            "Full and straight, solidly blocked off the front foot back to the bowler.",
            "Short of a length ball, kicks up slightly, left alone through to the keeper.",
            "Beaten! Swings past the outside edge with late movement in the air!",
            "Tapped towards cover point, calls for a quick single but sent back safely."
    );

    private final List<String> singleCommentaries = List.of(
            "Pushed softly into the gap at mid-on for a brisk single.",
            "Worked off the pads towards fine leg to turn over the strike.",
            "Dabbed softly to third man, comfortable single taken.",
            "Driven down to long-off, batters cross over comfortably.",
            "Dropped into the covers with soft hands, smart cricket to keep the scoreboard ticking."
    );

    private final List<String> twoCommentaries = List.of(
            "Whipped away off the hips between deep square leg and fine leg, easy two runs.",
            "Lofted over extra cover, doesn't get all of it, sweeps back for a brace.",
            "Pushed in the gap through deep midwicket, great hustling between the wickets for a double!",
            "Driven through extra cover, good fielding on the boundary saves two runs."
    );

    private final List<String> fourCommentaries = List.of(
            "FOUR! CRUNCHED! Sits back and carves it through point with thunderous power!",
            "FOUR! GLORIOUS COVER DRIVE! High elbow, leaning into the stroke, pure textbook elegance!",
            "FOUR! Short delivery punished! Pulled with authority behind square leg to the rope!",
            "FOUR! Edged but flies safely between slip and gully, racing away down to the fence!",
            "FOUR! Driven straight down the ground, bisects mid-off and mid-on with precision!"
    );

    private final List<String> sixCommentaries = List.of(
            "SIX! STAND AND DELIVER! Cleans out the front leg and sends it soaring 90 meters over long-on!",
            "SIX! MAGNIFICENT PULL SHOT! Deposited onto the stadium roof with sheer disdain!",
            "SIX! High, handsome and into the crowd at deep mid-wicket! Roars from the spectators!",
            "SIX! Upper cut over third man! Uses the bowler's pace to perfection for a maximum!"
    );

    private final List<String> wicketCommentaries = List.of(
            "OUT! CLEAN BOWLED! An absolute peach that sneaks through the gate and shatters the off-stump!",
            "OUT! CAUGHT BEHIND! Feathered edge through to the wicketkeeper! Umpire raises the finger without hesitation!",
            "OUT! GONE! Tries to go over the top, miscues it completely and taken safely at long-off!",
            "OUT! LBW! Trapped right in front of middle! Struck on the back pad, umpire's finger goes up!",
            "OUT! SPECTACULAR CATCH! A flying one-handed stunner at backward point! Incredible fielding!"
    );

    public MatchSimulationService(MatchService matchService) {
        this.matchService = matchService;
    }

    public void startSimulation(String matchId) {
        matchService.getMatchById(matchId).ifPresent(m -> {
            if (m.getStatus() != MatchStatus.COMPLETED) {
                m.setSimulating(true);
                m.setStatus(MatchStatus.LIVE);
                matchService.saveMatch(m);
                log.info("Simulation started for match: {}", matchId);
            }
        });
    }

    public void pauseSimulation(String matchId) {
        matchService.getMatchById(matchId).ifPresent(m -> {
            m.setSimulating(false);
            matchService.saveMatch(m);
            log.info("Simulation paused for match: {}", matchId);
        });
    }

    public Match stepSimulation(String matchId) {
        Match match = matchService.getMatchById(matchId).orElse(null);
        if (match == null || match.getStatus() == MatchStatus.COMPLETED) {
            return match;
        }

        ScoreUpdatePayload payload = generateRandomBallPayload(match);
        return matchService.processBallUpdate(matchId, payload);
    }

    @Scheduled(fixedRate = 3500)
    public void runSimulationTick() {
        for (Match match : matchService.getAllMatches()) {
            if (match.isSimulating() && match.getStatus() == MatchStatus.LIVE) {
                try {
                    ScoreUpdatePayload payload = generateRandomBallPayload(match);
                    matchService.processBallUpdate(match.getId(), payload);
                } catch (Exception e) {
                    log.error("Error executing simulation tick for match {}: {}", match.getId(), e.getMessage());
                }
            }
        }
    }

    private ScoreUpdatePayload generateRandomBallPayload(Match match) {
        ScoreUpdatePayload payload = new ScoreUpdatePayload();
        int roll = random.nextInt(100);

        Innings innings = match.getCurrentInnings();
        String batsman = innings != null && innings.getStriker() != null ? innings.getStriker().getPlayerName() : "Batsman";
        String bowler = innings != null && innings.getCurrentBowler() != null ? innings.getCurrentBowler().getPlayerName() : "Bowler";

        if (roll < 34) {
            // 34% Dot ball
            payload.setRuns(0);
            payload.setCommentary(bowler + " to " + batsman + ": " + getRandom(dotCommentaries));
        } else if (roll < 64) {
            // 30% Single
            payload.setRuns(1);
            payload.setCommentary(bowler + " to " + batsman + ": " + getRandom(singleCommentaries));
        } else if (roll < 76) {
            // 12% Two runs
            payload.setRuns(2);
            payload.setCommentary(bowler + " to " + batsman + ": " + getRandom(twoCommentaries));
        } else if (roll < 78) {
            // 2% Three runs
            payload.setRuns(3);
            payload.setCommentary(bowler + " to " + batsman + ": Driven into the deep corner, super sprint between the wickets for three!");
        } else if (roll < 88) {
            // 10% Four
            payload.setRuns(4);
            payload.setCommentary(getRandom(fourCommentaries) + " (" + batsman + ")");
        } else if (roll < 93) {
            // 5% Six
            payload.setRuns(6);
            payload.setCommentary(getRandom(sixCommentaries) + " (" + batsman + ")");
        } else if (roll < 97) {
            // 4% Wicket
            payload.setRuns(0);
            payload.setWicket(true);
            payload.setWicketType(random.nextBoolean() ? "CAUGHT" : "BOWLED");
            payload.setCommentary(getRandom(wicketCommentaries) + " (" + batsman + " departs!)");
        } else if (roll < 99) {
            // 2% Wide
            payload.setRuns(0);
            payload.setExtraType(ExtraType.WIDE);
            payload.setCommentary(bowler + " sprays it well wide outside the guideline. Signaled WIDE.");
        } else {
            // 1% No-Ball
            payload.setRuns(1);
            payload.setExtraType(ExtraType.NO_BALL);
            payload.setCommentary("NO BALL! " + bowler + " oversteps the crease! Free hit awarded to " + batsman + "!");
        }

        return payload;
    }

    private String getRandom(List<String> list) {
        return list.get(random.nextInt(list.size()));
    }
}
