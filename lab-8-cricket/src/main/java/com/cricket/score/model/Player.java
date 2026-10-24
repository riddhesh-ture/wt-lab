package com.cricket.score.model;

public class Player {
    private String id;
    private String name;
    private String role; // "BATSMAN", "BOWLER", "ALL_ROUNDER", "WICKET_KEEPER"

    public Player() {}

    public Player(String id, String name, String role) {
        this.id = id;
        this.name = name;
        this.role = role;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
