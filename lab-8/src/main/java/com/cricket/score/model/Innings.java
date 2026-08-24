package com.cricket.score.model;

import java.util.ArrayList;
import java.util.List;

public class Innings {
    private int inningsNumber; // 1 or 2
    private String battingTeam;
    private String bowlingTeam;
    private int totalRuns;
    private int wickets;
    private int legalBalls;
    private double overs; // e.g. 18.2
    private int wides;
    private int noBalls;
    private int byes;
    private int legByes;

    private List<BattingStat> battingStats = new ArrayList<>();
    private List<BowlingStat> bowlingStats = new ArrayList<>();
    private List<FallOfWicket> fallOfWickets = new ArrayList<>();
    private List<BallEvent> ballEvents = new ArrayList<>();

    public Innings() {}

    public Innings(int inningsNumber, String battingTeam, String bowlingTeam) {
        this.inningsNumber = inningsNumber;
        this.battingTeam = battingTeam;
        this.bowlingTeam = bowlingTeam;
        this.totalRuns = 0;
        this.wickets = 0;
        this.legalBalls = 0;
        this.overs = 0.0;
        this.wides = 0;
        this.noBalls = 0;
        this.byes = 0;
        this.legByes = 0;
    }

    public void recalculateOvers() {
        int fullOvers = legalBalls / 6;
        int remBalls = legalBalls % 6;
        this.overs = fullOvers + (remBalls * 0.1);
    }

    public BattingStat getStriker() {
        return battingStats.stream()
                .filter(b -> b.isStriker() && !b.isOut())
                .findFirst()
                .orElse(null);
    }

    public BattingStat getNonStriker() {
        return battingStats.stream()
                .filter(b -> b.isNonStriker() && !b.isOut())
                .findFirst()
                .orElse(null);
    }

    public BowlingStat getCurrentBowler() {
        return bowlingStats.stream()
                .filter(BowlingStat::isCurrentBowler)
                .findFirst()
                .orElse(null);
    }

    public List<BallEvent> getCurrentOverBalls() {
        if (ballEvents.isEmpty()) return new ArrayList<>();
        int currentOver = legalBalls / 6;
        // balls bowled in the current over
        List<BallEvent> result = new ArrayList<>();
        for (int i = ballEvents.size() - 1; i >= 0; i--) {
            BallEvent b = ballEvents.get(i);
            if (b.getOverNumber() == currentOver) {
                result.add(0, b);
            } else {
                break;
            }
        }
        return result;
    }

    public int getTotalExtras() {
        return wides + noBalls + byes + legByes;
    }

    // Getters and Setters
    public int getInningsNumber() {
        return inningsNumber;
    }

    public void setInningsNumber(int inningsNumber) {
        this.inningsNumber = inningsNumber;
    }

    public String getBattingTeam() {
        return battingTeam;
    }

    public void setBattingTeam(String battingTeam) {
        this.battingTeam = battingTeam;
    }

    public String getBowlingTeam() {
        return bowlingTeam;
    }

    public void setBowlingTeam(String bowlingTeam) {
        this.bowlingTeam = bowlingTeam;
    }

    public int getTotalRuns() {
        return totalRuns;
    }

    public void setTotalRuns(int totalRuns) {
        this.totalRuns = totalRuns;
    }

    public int getWickets() {
        return wickets;
    }

    public void setWickets(int wickets) {
        this.wickets = wickets;
    }

    public int getLegalBalls() {
        return legalBalls;
    }

    public void setLegalBalls(int legalBalls) {
        this.legalBalls = legalBalls;
        recalculateOvers();
    }

    public double getOvers() {
        return overs;
    }

    public void setOvers(double overs) {
        this.overs = overs;
    }

    public int getWides() {
        return wides;
    }

    public void setWides(int wides) {
        this.wides = wides;
    }

    public int getNoBalls() {
        return noBalls;
    }

    public void setNoBalls(int noBalls) {
        this.noBalls = noBalls;
    }

    public int getByes() {
        return byes;
    }

    public void setByes(int byes) {
        this.byes = byes;
    }

    public int getLegByes() {
        return legByes;
    }

    public void setLegByes(int legByes) {
        this.legByes = legByes;
    }

    public List<BattingStat> getBattingStats() {
        return battingStats;
    }

    public void setBattingStats(List<BattingStat> battingStats) {
        this.battingStats = battingStats;
    }

    public List<BowlingStat> getBowlingStats() {
        return bowlingStats;
    }

    public void setBowlingStats(List<BowlingStat> bowlingStats) {
        this.bowlingStats = bowlingStats;
    }

    public List<FallOfWicket> getFallOfWickets() {
        return fallOfWickets;
    }

    public void setFallOfWickets(List<FallOfWicket> fallOfWickets) {
        this.fallOfWickets = fallOfWickets;
    }

    public List<BallEvent> getBallEvents() {
        return ballEvents;
    }

    public void setBallEvents(List<BallEvent> ballEvents) {
        this.ballEvents = ballEvents;
    }
}
