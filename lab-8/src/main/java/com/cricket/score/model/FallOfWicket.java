package com.cricket.score.model;

public class FallOfWicket {
    private int wicketNumber;
    private int score;
    private double over;
    private String batsmanName;

    public FallOfWicket() {}

    public FallOfWicket(int wicketNumber, int score, double over, String batsmanName) {
        this.wicketNumber = wicketNumber;
        this.score = score;
        this.over = over;
        this.batsmanName = batsmanName;
    }

    public int getWicketNumber() {
        return wicketNumber;
    }

    public void setWicketNumber(int wicketNumber) {
        this.wicketNumber = wicketNumber;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public double getOver() {
        return over;
    }

    public void setOver(double over) {
        this.over = over;
    }

    public String getBatsmanName() {
        return batsmanName;
    }

    public void setBatsmanName(String batsmanName) {
        this.batsmanName = batsmanName;
    }
}
