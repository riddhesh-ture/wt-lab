package com.cricket.score.model;

public class HistoricalMatchSummary {
    private String id;
    private String title;
    private String tournament;
    private String year;
    private String team1;
    private String team2;
    private String scoreSummary;
    private String result;
    private String playerOfTheMatch;
    private String venue;
    private String highlights;

    public HistoricalMatchSummary() {}

    public HistoricalMatchSummary(String id, String title, String tournament, String year,
                                  String team1, String team2, String scoreSummary,
                                  String result, String playerOfTheMatch, String venue, String highlights) {
        this.id = id;
        this.title = title;
        this.tournament = tournament;
        this.year = year;
        this.team1 = team1;
        this.team2 = team2;
        this.scoreSummary = scoreSummary;
        this.result = result;
        this.playerOfTheMatch = playerOfTheMatch;
        this.venue = venue;
        this.highlights = highlights;
    }

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

    public String getTournament() {
        return tournament;
    }

    public void setTournament(String tournament) {
        this.tournament = tournament;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getTeam1() {
        return team1;
    }

    public void setTeam1(String team1) {
        this.team1 = team1;
    }

    public String getTeam2() {
        return team2;
    }

    public void setTeam2(String team2) {
        this.team2 = team2;
    }

    public String getScoreSummary() {
        return scoreSummary;
    }

    public void setScoreSummary(String scoreSummary) {
        this.scoreSummary = scoreSummary;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getPlayerOfTheMatch() {
        return playerOfTheMatch;
    }

    public void setPlayerOfTheMatch(String playerOfTheMatch) {
        this.playerOfTheMatch = playerOfTheMatch;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public String getHighlights() {
        return highlights;
    }

    public void setHighlights(String highlights) {
        this.highlights = highlights;
    }
}
