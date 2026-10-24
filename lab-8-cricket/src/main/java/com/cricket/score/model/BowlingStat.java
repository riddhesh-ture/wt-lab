package com.cricket.score.model;

public class BowlingStat {
    private String playerId;
    private String playerName;
    private int legalBalls;
    private double overs; // Formatted as 3.4
    private int maidens;
    private int runsConceded;
    private int wickets;
    private double economy;
    private boolean isCurrentBowler;

    public BowlingStat() {}

    public BowlingStat(String playerId, String playerName) {
        this.playerId = playerId;
        this.playerName = playerName;
        this.legalBalls = 0;
        this.overs = 0.0;
        this.maidens = 0;
        this.runsConceded = 0;
        this.wickets = 0;
        this.economy = 0.0;
        this.isCurrentBowler = false;
    }

    public void recalculateOversAndEconomy() {
        int fullOvers = legalBalls / 6;
        int remBalls = legalBalls % 6;
        this.overs = fullOvers + (remBalls * 0.1);
        if (legalBalls > 0) {
            double totalOversDec = legalBalls / 6.0;
            this.economy = Math.round(((double) runsConceded / totalOversDec) * 100.0) / 100.0;
        } else {
            this.economy = 0.0;
        }
    }

    public void addBall(int runs, boolean isLegal, boolean isWicket) {
        this.runsConceded += runs;
        if (isLegal) {
            this.legalBalls += 1;
        }
        if (isWicket) {
            this.wickets += 1;
        }
        recalculateOversAndEconomy();
    }

    // Getters and Setters
    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public int getLegalBalls() {
        return legalBalls;
    }

    public void setLegalBalls(int legalBalls) {
        this.legalBalls = legalBalls;
        recalculateOversAndEconomy();
    }

    public double getOvers() {
        return overs;
    }

    public void setOvers(double overs) {
        this.overs = overs;
    }

    public int getMaidens() {
        return maidens;
    }

    public void setMaidens(int maidens) {
        this.maidens = maidens;
    }

    public int getRunsConceded() {
        return runsConceded;
    }

    public void setRunsConceded(int runsConceded) {
        this.runsConceded = runsConceded;
        recalculateOversAndEconomy();
    }

    public int getWickets() {
        return wickets;
    }

    public void setWickets(int wickets) {
        this.wickets = wickets;
    }

    public double getEconomy() {
        return economy;
    }

    public void setEconomy(double economy) {
        this.economy = economy;
    }

    public boolean isCurrentBowler() {
        return isCurrentBowler;
    }

    public void setCurrentBowler(boolean currentBowler) {
        isCurrentBowler = currentBowler;
    }
}
