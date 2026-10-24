package com.cricket.score.model;

public class ScoreUpdatePayload {
    private int runs; // 0, 1, 2, 3, 4, 6
    private boolean isWicket;
    private ExtraType extraType; // NONE, WIDE, NO_BALL, BYE, LEG_BYE
    private String wicketType; // "CAUGHT", "BOWLED", "LBW", "RUN_OUT"
    private String commentary;

    public ScoreUpdatePayload() {
        this.extraType = ExtraType.NONE;
    }

    public int getRuns() {
        return runs;
    }

    public void setRuns(int runs) {
        this.runs = runs;
    }

    public boolean isWicket() {
        return isWicket;
    }

    public void setWicket(boolean wicket) {
        isWicket = wicket;
    }

    public ExtraType getExtraType() {
        return extraType;
    }

    public void setExtraType(ExtraType extraType) {
        this.extraType = extraType;
    }

    public String getWicketType() {
        return wicketType;
    }

    public void setWicketType(String wicketType) {
        this.wicketType = wicketType;
    }

    public String getCommentary() {
        return commentary;
    }

    public void setCommentary(String commentary) {
        this.commentary = commentary;
    }
}
