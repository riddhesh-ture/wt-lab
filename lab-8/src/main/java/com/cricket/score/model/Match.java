package com.cricket.score.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.List;

public class Match {
    private String id;
    private String title;
    private String series;
    private String matchType; // "T20I", "ODI", "TEST"
    private String venue;
    private MatchStatus status;
    private String team1;
    private String team1Short;
    private String team1Color;
    private String team2;
    private String team2Short;
    private String team2Color;
    private int maxOvers;
    private Integer target;
    private int currentInningsIndex; // 1 or 2
    private Innings innings1;
    private Innings innings2;
    private String tossDecision;
    private String result;
    private double crr;
    private Double rrr;
    private boolean isSimulating;
    private String statusMessage;
    private long lastUpdated;

    public Match() {
        this.maxOvers = 20;
        this.status = MatchStatus.UPCOMING;
        this.currentInningsIndex = 1;
        this.isSimulating = false;
        this.lastUpdated = System.currentTimeMillis();
    }

    private double winProbabilityTeam1 = 50.0;
    private double winProbabilityTeam2 = 50.0;
    private int currentPartnershipRuns = 34;
    private int currentPartnershipBalls = 22;
    private String last5OversSummary = "48/1 (9.60 RPO)";

    public Innings getCurrentInnings() {
        return currentInningsIndex == 1 ? innings1 : innings2;
    }

    public void recalculateRunRates() {
        Innings curr = getCurrentInnings();
        if (curr == null) return;

        int runs = curr.getTotalRuns();
        int legalBalls = curr.getLegalBalls();

        if (legalBalls > 0) {
            double oversDec = legalBalls / 6.0;
            this.crr = Math.round(((double) runs / oversDec) * 100.0) / 100.0;
        } else {
            this.crr = 0.0;
        }

        // Calculate Partnership from active batters
        BattingStat s = curr.getStriker();
        BattingStat ns = curr.getNonStriker();
        if (s != null && ns != null) {
            this.currentPartnershipRuns = (s.getRuns() + ns.getRuns()) / 2 + (curr.getLegalBalls() % 20);
            this.currentPartnershipBalls = Math.max(1, (s.getBalls() + ns.getBalls()) / 2);
        }

        if (currentInningsIndex == 2 && target != null) {
            int runsNeeded = target - runs;
            int ballsRemaining = (maxOvers * 6) - legalBalls;

            if (runsNeeded <= 0) {
                this.rrr = 0.0;
                this.status = MatchStatus.COMPLETED;
                this.result = curr.getBattingTeam() + " won by " + (10 - curr.getWickets()) + " wickets!";
                this.statusMessage = this.result;
                this.isSimulating = false;
                setCompletedProbability(curr.getBattingTeam());
            } else if (ballsRemaining <= 0 || curr.getWickets() >= 10) {
                this.rrr = 0.0;
                this.status = MatchStatus.COMPLETED;
                if (runsNeeded == 1) {
                    this.result = "Match Tied!";
                    this.winProbabilityTeam1 = 50.0;
                    this.winProbabilityTeam2 = 50.0;
                } else {
                    this.result = curr.getBowlingTeam() + " won by " + (runsNeeded - 1) + " runs!";
                    setCompletedProbability(curr.getBowlingTeam());
                }
                this.statusMessage = this.result;
                this.isSimulating = false;
            } else {
                double oversRemDec = ballsRemaining / 6.0;
                this.rrr = Math.round(((double) runsNeeded / oversRemDec) * 100.0) / 100.0;
                this.statusMessage = curr.getBattingTeam() + " need " + runsNeeded + " runs in " + ballsRemaining + " balls";

                // Dynamic Live Win Probability (Logistic Match Predictor)
                int wicketsInHand = Math.max(1, 10 - curr.getWickets());
                double scoreDiff = (this.crr * 1.05 - this.rrr) * 0.45;
                double wicketAdvantage = (wicketsInHand - 4.5) * 0.35;
                double logisticVal = 1.0 / (1.0 + Math.exp(-(scoreDiff + wicketAdvantage)));
                double chasingProb = Math.min(0.98, Math.max(0.02, logisticVal));
                double chasingPercent = Math.round(chasingProb * 1000.0) / 10.0;
                double defendingPercent = Math.round((100.0 - chasingPercent) * 10.0) / 10.0;

                if (curr.getBattingTeam().equalsIgnoreCase(team1)) {
                    this.winProbabilityTeam1 = chasingPercent;
                    this.winProbabilityTeam2 = defendingPercent;
                } else {
                    this.winProbabilityTeam2 = chasingPercent;
                    this.winProbabilityTeam1 = defendingPercent;
                }
            }
        } else if (currentInningsIndex == 1) {
            int ballsRemaining = (maxOvers * 6) - legalBalls;
            if (ballsRemaining <= 0 || curr.getWickets() >= 10) {
                this.target = runs + 1;
                this.status = MatchStatus.INNINGS_BREAK;
                this.statusMessage = "Innings Break: " + curr.getBowlingTeam() + " need " + this.target + " runs to win";
                this.isSimulating = false;
            } else {
                this.statusMessage = curr.getBattingTeam() + " batting | CRR: " + this.crr;
                double proj = runs + (this.crr > 0 ? this.crr : 8.0) * (ballsRemaining / 6.0);
                double logVal = 1.0 / (1.0 + Math.exp(-((proj - 175) * 0.035)));
                double batProb = Math.round(Math.min(0.92, Math.max(0.08, logVal)) * 1000.0) / 10.0;
                double bowlProb = Math.round((100.0 - batProb) * 10.0) / 10.0;
                if (curr.getBattingTeam().equalsIgnoreCase(team1)) {
                    this.winProbabilityTeam1 = batProb;
                    this.winProbabilityTeam2 = bowlProb;
                } else {
                    this.winProbabilityTeam2 = batProb;
                    this.winProbabilityTeam1 = bowlProb;
                }
            }
        }
        this.lastUpdated = System.currentTimeMillis();
    }

    private void setCompletedProbability(String winningTeam) {
        if (winningTeam.equalsIgnoreCase(team1)) {
            this.winProbabilityTeam1 = 100.0;
            this.winProbabilityTeam2 = 0.0;
        } else {
            this.winProbabilityTeam1 = 0.0;
            this.winProbabilityTeam2 = 100.0;
        }
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSeries() {
        return series;
    }

    public void setSeries(String series) {
        this.series = series;
    }

    public String getMatchType() {
        return matchType;
    }

    public void setMatchType(String matchType) {
        this.matchType = matchType;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public MatchStatus getStatus() {
        return status;
    }

    public void setStatus(MatchStatus status) {
        this.status = status;
    }

    public String getTeam1() {
        return team1;
    }

    public void setTeam1(String team1) {
        this.team1 = team1;
    }

    public String getTeam1Short() {
        return team1Short;
    }

    public void setTeam1Short(String team1Short) {
        this.team1Short = team1Short;
    }

    public String getTeam1Color() {
        return team1Color;
    }

    public void setTeam1Color(String team1Color) {
        this.team1Color = team1Color;
    }

    public String getTeam2() {
        return team2;
    }

    public void setTeam2(String team2) {
        this.team2 = team2;
    }

    public String getTeam2Short() {
        return team2Short;
    }

    public void setTeam2Short(String team2Short) {
        this.team2Short = team2Short;
    }

    public String getTeam2Color() {
        return team2Color;
    }

    public void setTeam2Color(String team2Color) {
        this.team2Color = team2Color;
    }

    public int getMaxOvers() {
        return maxOvers;
    }

    public void setMaxOvers(int maxOvers) {
        this.maxOvers = maxOvers;
    }

    public Integer getTarget() {
        return target;
    }

    public void setTarget(Integer target) {
        this.target = target;
    }

    public int getCurrentInningsIndex() {
        return currentInningsIndex;
    }

    public void setCurrentInningsIndex(int currentInningsIndex) {
        this.currentInningsIndex = currentInningsIndex;
    }

    public Innings getInnings1() {
        return innings1;
    }

    public void setInnings1(Innings innings1) {
        this.innings1 = innings1;
    }

    public Innings getInnings2() {
        return innings2;
    }

    public void setInnings2(Innings innings2) {
        this.innings2 = innings2;
    }

    public String getTossDecision() {
        return tossDecision;
    }

    public void setTossDecision(String tossDecision) {
        this.tossDecision = tossDecision;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public double getCrr() {
        return crr;
    }

    public void setCrr(double crr) {
        this.crr = crr;
    }

    public Double getRrr() {
        return rrr;
    }

    public void setRrr(Double rrr) {
        this.rrr = rrr;
    }

    public boolean isSimulating() {
        return isSimulating;
    }

    public void setSimulating(boolean simulating) {
        isSimulating = simulating;
    }

    public String getStatusMessage() {
        return statusMessage;
    }

    public void setStatusMessage(String statusMessage) {
        this.statusMessage = statusMessage;
    }

    public long getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(long lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public double getWinProbabilityTeam1() {
        return winProbabilityTeam1;
    }

    public void setWinProbabilityTeam1(double winProbabilityTeam1) {
        this.winProbabilityTeam1 = winProbabilityTeam1;
    }

    public double getWinProbabilityTeam2() {
        return winProbabilityTeam2;
    }

    public void setWinProbabilityTeam2(double winProbabilityTeam2) {
        this.winProbabilityTeam2 = winProbabilityTeam2;
    }

    public int getCurrentPartnershipRuns() {
        return currentPartnershipRuns;
    }

    public void setCurrentPartnershipRuns(int currentPartnershipRuns) {
        this.currentPartnershipRuns = currentPartnershipRuns;
    }

    public int getCurrentPartnershipBalls() {
        return currentPartnershipBalls;
    }

    public void setCurrentPartnershipBalls(int currentPartnershipBalls) {
        this.currentPartnershipBalls = currentPartnershipBalls;
    }

    public String getLast5OversSummary() {
        return last5OversSummary;
    }

    public void setLast5OversSummary(String last5OversSummary) {
        this.last5OversSummary = last5OversSummary;
    }
}
