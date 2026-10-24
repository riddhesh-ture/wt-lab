package com.cricket.score;

import com.cricket.score.model.*;
import com.cricket.score.service.MatchService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CricketScoreApplicationTests {

    @Autowired
    private MatchService matchService;

    @Test
    void contextLoads() {
        assertNotNull(matchService);
    }

    @Test
    void testInitialMatchesLoaded() {
        assertFalse(matchService.getAllMatches().isEmpty());
        assertTrue(matchService.getMatchById("match-ind-aus").isPresent());
    }

    @Test
    void testBallUpdateStrikeRotationOnSingle() {
        Match match = matchService.getMatchById("match-ind-aus").orElseThrow();
        Innings inn = match.getCurrentInnings();
        String initialStriker = inn.getStriker().getPlayerName();
        String initialNonStriker = inn.getNonStriker().getPlayerName();

        ScoreUpdatePayload payload = new ScoreUpdatePayload();
        payload.setRuns(1);
        payload.setCommentary("Single taken to rotate strike");

        matchService.processBallUpdate("match-ind-aus", payload);

        // After 1 run, strike must have swapped!
        assertEquals(initialNonStriker, inn.getStriker().getPlayerName());
        assertEquals(initialStriker, inn.getNonStriker().getPlayerName());
    }

    @Test
    void testBoundaryFour() {
        Match match = matchService.getMatchById("match-ind-aus").orElseThrow();
        Innings inn = match.getCurrentInnings();
        int initialRuns = inn.getTotalRuns();

        ScoreUpdatePayload payload = new ScoreUpdatePayload();
        payload.setRuns(4);
        payload.setCommentary("FOUR! Beautiful drive");

        matchService.processBallUpdate("match-ind-aus", payload);

        assertEquals(initialRuns + 4, inn.getTotalRuns());
    }
}
