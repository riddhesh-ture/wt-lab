package com.cricket.score.controller;

import com.cricket.score.model.*;
import com.cricket.score.service.CricketExternalDataService;
import com.cricket.score.service.MatchService;
import com.cricket.score.service.MatchSimulationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class MatchRestController {

    private final MatchService matchService;
    private final MatchSimulationService simulationService;
    private final CricketExternalDataService externalDataService;

    public MatchRestController(MatchService matchService,
                               MatchSimulationService simulationService,
                               CricketExternalDataService externalDataService) {
        this.matchService = matchService;
        this.simulationService = simulationService;
        this.externalDataService = externalDataService;
    }

    @GetMapping("/matches")
    public ResponseEntity<List<Match>> getAllMatches(@RequestParam(required = false) MatchStatus status) {
        List<Match> matches = matchService.getAllMatches();
        if (status != null) {
            matches = matches.stream().filter(m -> m.getStatus() == status).toList();
        }
        return ResponseEntity.ok(matches);
    }

    @GetMapping("/matches/{id}")
    public ResponseEntity<Match> getMatchById(@PathVariable String id) {
        return matchService.getMatchById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/matches/{id}/commentary")
    public ResponseEntity<List<BallEvent>> getCommentary(@PathVariable String id) {
        return matchService.getMatchById(id)
                .map(m -> ResponseEntity.ok(m.getCurrentInnings() != null ? m.getCurrentInnings().getBallEvents() : List.<BallEvent>of()))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/matches/{id}/score-update")
    public ResponseEntity<Match> scoreUpdate(@PathVariable String id, @RequestBody ScoreUpdatePayload payload) {
        Match match = matchService.processBallUpdate(id, payload);
        return ResponseEntity.ok(match);
    }

    @PostMapping("/matches/{id}/simulate/start")
    public ResponseEntity<Map<String, String>> startSimulation(@PathVariable String id) {
        simulationService.startSimulation(id);
        return ResponseEntity.ok(Map.of("message", "Simulation started for match " + id, "status", "SIMULATING"));
    }

    @PostMapping("/matches/{id}/simulate/pause")
    public ResponseEntity<Map<String, String>> pauseSimulation(@PathVariable String id) {
        simulationService.pauseSimulation(id);
        return ResponseEntity.ok(Map.of("message", "Simulation paused for match " + id, "status", "PAUSED"));
    }

    @PostMapping("/matches/{id}/simulate/step")
    public ResponseEntity<Match> stepSimulation(@PathVariable String id) {
        Match match = simulationService.stepSimulation(id);
        return ResponseEntity.ok(match);
    }

    @PostMapping("/matches")
    public ResponseEntity<Match> createMatch(@RequestBody Match match) {
        if (match.getId() == null || match.getId().isEmpty()) {
            match.setId("match-" + System.currentTimeMillis());
        }
        Match saved = matchService.saveMatch(match);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/historic")
    public ResponseEntity<List<HistoricalMatchSummary>> getHistoricMatches() {
        return ResponseEntity.ok(externalDataService.getHistoricMatches());
    }

    @GetMapping("/external/status")
    public ResponseEntity<Map<String, Object>> getExternalApiStatus() {
        return ResponseEntity.ok(externalDataService.getApiIntegrationStatus());
    }
}
