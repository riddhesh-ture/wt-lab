package com.cricket.score.model;

public class BattingStat {
    private String playerId;
    private String playerName;
    private int runs;
    private int balls;
    private int fours;
    private int sixes;
    private double strikeRate;
    private boolean isStriker;
    private boolean isNonStriker;
    private boolean isOut;
    private String dismissal; // e.g. "c Starc b Cummins" or "not out"

    public BattingStat() {
        this.dismissal = "not out";
    }

    public BattingStat(String playerId, String playerName) {
        this.playerId = playerId;
        this.playerName = playerName;
        this.runs = 0;
        this.balls = 0;
        this.fours = 0;
        this.sixes = 0;
        this.strikeRate = 0.0;
        this.isStriker = false;
        this.isNonStriker = false;
        this.isOut = false;
        this.dismissal = "not out";
    }

    public void recalculateStrikeRate() {
        if (balls > 0) {
            this.strikeRate = Math.round(((double) runs / balls * 100.0) * 100.0) / 100.0;
        } else {
            this.strikeRate = 0.0;
        }
    }

    public void addRuns(int r) {
        this.runs += r;
        this.balls += 1;
        if (r == 4) this.fours++;
        if (r == 6) this.sixes++;
        recalculateStrikeRate();
    }

    public void addDotBall() {
        this.balls += 1;
        recalculateStrikeRate();
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

    public int getRuns() {
        return runs;
    }

    public void setRuns(int runs) {
        this.runs = runs;
        recalculateStrikeRate();
    }

    public int getBalls() {
        return balls;
    }

    public void setBalls(int balls) {
        this.balls = balls;
        recalculateStrikeRate();
    }

    public int getFours() {
        return fours;
    }

    public void setFours(int fours) {
        this.fours = fours;
    }

    public int getSixes() {
        return sixes;
    }

    public void setSixes(int sixes) {
        this.sixes = sixes;
    }

    public double getStrikeRate() {
        return strikeRate;
    }

    public void setStrikeRate(double strikeRate) {
        this.strikeRate = strikeRate;
    }

    public boolean isStriker() {
        return isStriker;
    }

    public void setStriker(boolean striker) {
        isStriker = striker;
    }

    public boolean isNonStriker() {
        return isNonStriker;
    }

    public void setNonStriker(boolean nonStriker) {
        isNonStriker = nonStriker;
    }

    public boolean isOut() {
        return isOut;
    }

    public void setOut(boolean out) {
        isOut = out;
    }

    public String getDismissal() {
        return dismissal;
    }

    public void setDismissal(String dismissal) {
        this.dismissal = dismissal;
    }
}
