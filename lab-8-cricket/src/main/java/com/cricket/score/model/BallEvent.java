package com.cricket.score.model;

import java.time.Instant;

public class BallEvent {
    private String id;
    private int overNumber;     // 0-indexed over or 1-indexed? e.g. 18 for over 18.x
    private int ballNumber;     // 1 to 6
    private double overFormatted; // e.g. 18.4
    private int runs;
    private ExtraType extraType;
    private int extraRuns;
    private boolean isWicket;
    private String wicketType;  // "BOWLED", "CAUGHT", "LBW", "RUN_OUT"
    private String batsmanName;
    private String bowlerName;
    private String commentary;
    private String displayBadge; // "0", "1", "4", "6", "W", "Wd", "Nb"
    private long timestamp;

    public BallEvent() {
        this.timestamp = Instant.now().toEpochMilli();
        this.extraType = ExtraType.NONE;
    }

    public BallEvent(int overNumber, int ballNumber, int runs, ExtraType extraType,
                     boolean isWicket, String batsmanName, String bowlerName, String commentary) {
        this.id = System.currentTimeMillis() + "-" + (int)(Math.random() * 1000);
        this.overNumber = overNumber;
        this.ballNumber = ballNumber;
        this.overFormatted = overNumber + (ballNumber * 0.1);
        this.runs = runs;
        this.extraType = extraType != null ? extraType : ExtraType.NONE;
        this.isWicket = isWicket;
        this.batsmanName = batsmanName;
        this.bowlerName = bowlerName;
        this.commentary = commentary;
        this.timestamp = Instant.now().toEpochMilli();

        // compute display badge
        if (isWicket) {
            this.displayBadge = "W";
        } else if (this.extraType == ExtraType.WIDE) {
            this.displayBadge = "Wd";
        } else if (this.extraType == ExtraType.NO_BALL) {
            this.displayBadge = "Nb";
        } else if (runs == 4) {
            this.displayBadge = "4";
        } else if (runs == 6) {
            this.displayBadge = "6";
        } else if (runs == 0) {
            this.displayBadge = "•";
        } else {
            this.displayBadge = String.valueOf(runs);
        }
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getOverNumber() {
        return overNumber;
    }

    public void setOverNumber(int overNumber) {
        this.overNumber = overNumber;
    }

    public int getBallNumber() {
        return ballNumber;
    }

    public void setBallNumber(int ballNumber) {
        this.ballNumber = ballNumber;
    }

    public double getOverFormatted() {
        return overFormatted;
    }

    public void setOverFormatted(double overFormatted) {
        this.overFormatted = overFormatted;
    }

    public int getRuns() {
        return runs;
    }

    public void setRuns(int runs) {
        this.runs = runs;
    }

    public ExtraType getExtraType() {
        return extraType;
    }

    public void setExtraType(ExtraType extraType) {
        this.extraType = extraType;
    }

    public int getExtraRuns() {
        return extraRuns;
    }

    public void setExtraRuns(int extraRuns) {
        this.extraRuns = extraRuns;
    }

    public boolean isWicket() {
        return isWicket;
    }

    public void setWicket(boolean wicket) {
        isWicket = wicket;
    }

    public String getWicketType() {
        return wicketType;
    }

    public void setWicketType(String wicketType) {
        this.wicketType = wicketType;
    }

    public String getBatsmanName() {
        return batsmanName;
    }

    public void setBatsmanName(String batsmanName) {
        this.batsmanName = batsmanName;
    }

    public String getBowlerName() {
        return bowlerName;
    }

    public void setBowlerName(String bowlerName) {
        this.bowlerName = bowlerName;
    }

    public String getCommentary() {
        return commentary;
    }

    public void setCommentary(String commentary) {
        this.commentary = commentary;
    }

    public String getDisplayBadge() {
        return displayBadge;
    }

    public void setDisplayBadge(String displayBadge) {
        this.displayBadge = displayBadge;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
}
