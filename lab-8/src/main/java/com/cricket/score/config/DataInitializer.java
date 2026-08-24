package com.cricket.score.config;

import com.cricket.score.model.*;
import com.cricket.score.service.MatchService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final MatchService matchService;

    public DataInitializer(MatchService matchService) {
        this.matchService = matchService;
    }

    @Override
    public void run(String... args) {
        initIndVsAusMatch();
        initEngVsSaMatch();
        initCskVsMiMatch();
    }

    private void initIndVsAusMatch() {
        Match match = new Match();
        match.setId("match-ind-aus");
        match.setTitle("ICC Men's T20 World Cup - Grand Final");
        match.setSeries("ICC T20 World Cup 2026");
        match.setMatchType("T20I");
        match.setVenue("Kensington Oval, Bridgetown, Barbados");
        match.setStatus(MatchStatus.LIVE);
        match.setTeam1("Australia");
        match.setTeam1Short("AUS");
        match.setTeam1Color("#fbc02d");
        match.setTeam2("India");
        match.setTeam2Short("IND");
        match.setTeam2Color("#0078FF");
        match.setMaxOvers(20);
        match.setTarget(187);
        match.setCurrentInningsIndex(2);
        match.setTossDecision("Australia won the toss and elected to bat");

        // 1st Innings: Australia
        Innings inn1 = new Innings(1, "Australia", "India");
        inn1.setTotalRuns(186);
        inn1.setWickets(6);
        inn1.setLegalBalls(120);
        inn1.setOvers(20.0);
        inn1.setWides(5);
        inn1.setNoBalls(1);

        BattingStat ausBat1 = new BattingStat("aus-1", "Travis Head");
        ausBat1.setRuns(68); ausBat1.setBalls(43); ausBat1.setFours(7); ausBat1.setSixes(3);
        ausBat1.setOut(true); ausBat1.setDismissal("c Sharma b Bumrah"); ausBat1.recalculateStrikeRate();

        BattingStat ausBat2 = new BattingStat("aus-2", "David Warner");
        ausBat2.setRuns(24); ausBat2.setBalls(16); ausBat2.setFours(3); ausBat2.setSixes(1);
        ausBat2.setOut(true); ausBat2.setDismissal("b Arshdeep"); ausBat2.recalculateStrikeRate();

        BattingStat ausBat3 = new BattingStat("aus-3", "Mitchell Marsh");
        ausBat3.setRuns(38); ausBat3.setBalls(22); ausBat3.setFours(4); ausBat3.setSixes(2);
        ausBat3.setOut(true); ausBat3.setDismissal("c Jadeja b Kuldeep"); ausBat3.recalculateStrikeRate();

        BattingStat ausBat4 = new BattingStat("aus-4", "Glenn Maxwell");
        ausBat4.setRuns(16); ausBat4.setBalls(11); ausBat4.setFours(1); ausBat4.setSixes(1);
        ausBat4.setOut(true); ausBat4.setDismissal("b Bumrah"); ausBat4.recalculateStrikeRate();

        BattingStat ausBat5 = new BattingStat("aus-5", "Marcus Stoinis");
        ausBat5.setRuns(21); ausBat5.setBalls(14); ausBat5.setFours(2); ausBat5.setSixes(1);
        ausBat5.setOut(true); ausBat5.setDismissal("c Pant b Pandya"); ausBat5.recalculateStrikeRate();

        BattingStat ausBat6 = new BattingStat("aus-6", "Tim David");
        ausBat6.setRuns(12); ausBat6.setBalls(8); ausBat6.setFours(1); ausBat6.setSixes(0);
        ausBat6.setOut(false); ausBat6.setDismissal("not out"); ausBat6.recalculateStrikeRate();

        inn1.getBattingStats().addAll(List.of(ausBat1, ausBat2, ausBat3, ausBat4, ausBat5, ausBat6));

        BowlingStat indBowl1 = new BowlingStat("ind-b1", "Jasprit Bumrah");
        indBowl1.setLegalBalls(24); indBowl1.setMaidens(1); indBowl1.setRunsConceded(21); indBowl1.setWickets(3); indBowl1.recalculateOversAndEconomy();

        BowlingStat indBowl2 = new BowlingStat("ind-b2", "Arshdeep Singh");
        indBowl2.setLegalBalls(24); indBowl2.setRunsConceded(38); indBowl2.setWickets(1); indBowl2.recalculateOversAndEconomy();

        BowlingStat indBowl3 = new BowlingStat("ind-b3", "Kuldeep Yadav");
        indBowl3.setLegalBalls(24); indBowl3.setRunsConceded(32); indBowl3.setWickets(1); indBowl3.recalculateOversAndEconomy();

        BowlingStat indBowl4 = new BowlingStat("ind-b4", "Hardik Pandya");
        indBowl4.setLegalBalls(24); indBowl4.setRunsConceded(36); indBowl4.setWickets(1); indBowl4.recalculateOversAndEconomy();

        BowlingStat indBowl5 = new BowlingStat("ind-b5", "Axar Patel");
        indBowl5.setLegalBalls(24); indBowl5.setRunsConceded(39); indBowl5.setWickets(0); indBowl5.recalculateOversAndEconomy();

        inn1.getBowlingStats().addAll(List.of(indBowl1, indBowl2, indBowl3, indBowl4, indBowl5));
        match.setInnings1(inn1);

        // 2nd Innings: India (Chasing 187)
        Innings inn2 = new Innings(2, "India", "Australia");
        inn2.setTotalRuns(175);
        inn2.setWickets(4);
        inn2.setLegalBalls(110); // 18.2 overs
        inn2.setOvers(18.2);
        inn2.setWides(4);
        inn2.setNoBalls(1);

        BattingStat indBat1 = new BattingStat("ind-1", "Rohit Sharma");
        indBat1.setRuns(42); indBat1.setBalls(24); indBat1.setFours(4); indBat1.setSixes(3);
        indBat1.setOut(true); indBat1.setDismissal("c Warner b Starc"); indBat1.recalculateStrikeRate();

        BattingStat indBat2 = new BattingStat("ind-2", "Rishabh Pant");
        indBat2.setRuns(20); indBat2.setBalls(14); indBat2.setFours(3); indBat2.setSixes(0);
        indBat2.setOut(true); indBat2.setDismissal("c Inglis b Hazlewood"); indBat2.recalculateStrikeRate();

        BattingStat indBat3 = new BattingStat("ind-3", "Virat Kohli");
        indBat3.setRuns(72); indBat3.setBalls(48); indBat3.setFours(5); indBat3.setSixes(3);
        indBat3.setOut(false); indBat3.setStriker(true); indBat3.recalculateStrikeRate();

        BattingStat indBat4 = new BattingStat("ind-4", "Suryakumar Yadav");
        indBat4.setRuns(14); indBat4.setBalls(8); indBat4.setFours(1); indBat4.setSixes(1);
        indBat4.setOut(true); indBat4.setDismissal("c Maxwell b Zampa"); indBat4.recalculateStrikeRate();

        BattingStat indBat5 = new BattingStat("ind-5", "Shivam Dube");
        indBat5.setRuns(9); indBat5.setBalls(6); indBat5.setFours(1); indBat5.setSixes(0);
        indBat5.setOut(true); indBat5.setDismissal("b Cummins"); indBat5.recalculateStrikeRate();

        BattingStat indBat6 = new BattingStat("ind-6", "Hardik Pandya");
        indBat6.setRuns(18); indBat6.setBalls(10); indBat6.setFours(1); indBat6.setSixes(1);
        indBat6.setOut(false); indBat6.setNonStriker(true); indBat6.recalculateStrikeRate();

        BattingStat indBat7 = new BattingStat("ind-7", "Ravindra Jadeja");
        BattingStat indBat8 = new BattingStat("ind-8", "Axar Patel");
        BattingStat indBat9 = new BattingStat("ind-9", "Kuldeep Yadav");
        BattingStat indBat10 = new BattingStat("ind-10", "Arshdeep Singh");
        BattingStat indBat11 = new BattingStat("ind-11", "Jasprit Bumrah");

        inn2.getBattingStats().addAll(List.of(indBat1, indBat2, indBat3, indBat4, indBat5, indBat6,
                indBat7, indBat8, indBat9, indBat10, indBat11));

        BowlingStat ausBowl1 = new BowlingStat("aus-b1", "Pat Cummins");
        ausBowl1.setLegalBalls(20); ausBowl1.setRunsConceded(31); ausBowl1.setWickets(2); ausBowl1.setCurrentBowler(true);
        ausBowl1.recalculateOversAndEconomy();

        BowlingStat ausBowl2 = new BowlingStat("aus-b2", "Mitchell Starc");
        ausBowl2.setLegalBalls(24); ausBowl2.setMaidens(1); ausBowl2.setRunsConceded(36); ausBowl2.setWickets(1);
        ausBowl2.recalculateOversAndEconomy();

        BowlingStat ausBowl3 = new BowlingStat("aus-b3", "Josh Hazlewood");
        ausBowl3.setLegalBalls(24); ausBowl3.setRunsConceded(34); ausBowl3.setWickets(1);
        ausBowl3.recalculateOversAndEconomy();

        BowlingStat ausBowl4 = new BowlingStat("aus-b4", "Adam Zampa");
        ausBowl4.setLegalBalls(24); ausBowl4.setRunsConceded(28); ausBowl4.setWickets(1);
        ausBowl4.recalculateOversAndEconomy();

        BowlingStat ausBowl5 = new BowlingStat("aus-b5", "Marcus Stoinis");
        ausBowl5.setLegalBalls(18); ausBowl5.setRunsConceded(32); ausBowl5.setWickets(0);
        ausBowl5.recalculateOversAndEconomy();

        inn2.getBowlingStats().addAll(List.of(ausBowl1, ausBowl2, ausBowl3, ausBowl4, ausBowl5));

        inn2.getFallOfWickets().addAll(List.of(
                new FallOfWicket(1, 48, 5.2, "Rohit Sharma"),
                new FallOfWicket(2, 85, 9.4, "Rishabh Pant"),
                new FallOfWicket(3, 118, 13.1, "Suryakumar Yadav"),
                new FallOfWicket(4, 142, 15.5, "Shivam Dube")
        ));

        // Initial Ball Events for over 18
        inn2.getBallEvents().add(new BallEvent(18, 2, 2, ExtraType.NONE, false, "Virat Kohli", "Pat Cummins",
                "Pat Cummins to Virat Kohli: Whipped away off the pads into the deep midwicket gap, sprint back for two!"));
        inn2.getBallEvents().add(new BallEvent(18, 1, 1, ExtraType.NONE, false, "Hardik Pandya", "Pat Cummins",
                "Pat Cummins to Hardik Pandya: Length ball pushed towards deep point for a brisk single."));
        inn2.getBallEvents().add(new BallEvent(17, 6, 4, ExtraType.NONE, false, "Virat Kohli", "Mitchell Starc",
                "FOUR! Starc to Kohli: GLORIOUS COVER DRIVE! Reaches out and caresses it past mid-off with supreme authority!"));
        inn2.getBallEvents().add(new BallEvent(17, 5, 1, ExtraType.NONE, false, "Hardik Pandya", "Mitchell Starc",
                "Starc to Pandya: Dropped into the off side, snappy single taken."));
        inn2.getBallEvents().add(new BallEvent(17, 4, 6, ExtraType.NONE, false, "Hardik Pandya", "Mitchell Starc",
                "SIX! Starc to Pandya: DISPATCHED! Full in the slot and hammered over long-on for a colossal maximum!"));

        match.setInnings2(inn2);
        match.recalculateRunRates();
        matchService.saveMatch(match);
    }

    private void initEngVsSaMatch() {
        Match match = new Match();
        match.setId("match-eng-sa");
        match.setTitle("ICC Men's T20 World Cup - Super 8s");
        match.setSeries("ICC T20 World Cup 2026");
        match.setMatchType("T20I");
        match.setVenue("Daren Sammy Cricket Ground, Gros Islet, St Lucia");
        match.setStatus(MatchStatus.LIVE);
        match.setTeam1("South Africa");
        match.setTeam1Short("SA");
        match.setTeam1Color("#388e3c");
        match.setTeam2("England");
        match.setTeam2Short("ENG");
        match.setTeam2Color("#d32f2f");
        match.setMaxOvers(20);
        match.setTarget(164);
        match.setCurrentInningsIndex(2);
        match.setTossDecision("England won the toss and elected to field");

        Innings inn1 = new Innings(1, "South Africa", "England");
        inn1.setTotalRuns(163);
        inn1.setWickets(6);
        inn1.setLegalBalls(120);
        inn1.setOvers(20.0);
        BattingStat b1 = new BattingStat("sa-1", "Quinton de Kock");
        b1.setRuns(65); b1.setBalls(38); b1.setFours(4); b1.setSixes(4); b1.setOut(true); b1.setDismissal("c Buttler b Archer");
        inn1.getBattingStats().add(b1);
        match.setInnings1(inn1);

        Innings inn2 = new Innings(2, "England", "South Africa");
        inn2.setTotalRuns(151);
        inn2.setWickets(5);
        inn2.setLegalBalls(107); // 17.5 overs
        inn2.setOvers(17.5);

        BattingStat eng1 = new BattingStat("eng-1", "Jos Buttler");
        eng1.setRuns(48); eng1.setBalls(34); eng1.setFours(4); eng1.setSixes(2); eng1.setStriker(true);

        BattingStat eng2 = new BattingStat("eng-2", "Liam Livingstone");
        eng2.setRuns(16); eng2.setBalls(10); eng2.setFours(1); eng2.setSixes(1); eng2.setNonStriker(true);

        inn2.getBattingStats().addAll(List.of(eng1, eng2,
                new BattingStat("eng-3", "Phil Salt"),
                new BattingStat("eng-4", "Harry Brook"),
                new BattingStat("eng-5", "Moeen Ali"),
                new BattingStat("eng-6", "Sam Curran")));

        BowlingStat saBowl1 = new BowlingStat("sa-b1", "Kagiso Rabada");
        saBowl1.setLegalBalls(23); saBowl1.setRunsConceded(32); saBowl1.setWickets(2); saBowl1.setCurrentBowler(true);
        saBowl1.recalculateOversAndEconomy();

        BowlingStat saBowl2 = new BowlingStat("sa-b2", "Anrich Nortje");
        saBowl2.setLegalBalls(24); saBowl2.setRunsConceded(35); saBowl2.setWickets(2);
        saBowl2.recalculateOversAndEconomy();

        inn2.getBowlingStats().addAll(List.of(saBowl1, saBowl2));

        inn2.getBallEvents().add(new BallEvent(17, 5, 2, ExtraType.NONE, false, "Jos Buttler", "Kagiso Rabada",
                "Kagiso Rabada to Jos Buttler: Punched off the back foot through cover, 2 runs taken!"));
        inn2.getBallEvents().add(new BallEvent(17, 4, 1, ExtraType.NONE, false, "Liam Livingstone", "Kagiso Rabada",
                "Rabada to Livingstone: Squeezed to mid-off for a single."));

        match.setInnings2(inn2);
        match.recalculateRunRates();
        matchService.saveMatch(match);
    }

    private void initCskVsMiMatch() {
        Match match = new Match();
        match.setId("match-csk-mi");
        match.setTitle("IPL El Clasico - Chennai Super Kings vs Mumbai Indians");
        match.setSeries("Indian Premier League 2026");
        match.setMatchType("T20");
        match.setVenue("Wankhede Stadium, Mumbai");
        match.setStatus(MatchStatus.UPCOMING);
        match.setTeam1("Chennai Super Kings");
        match.setTeam1Short("CSK");
        match.setTeam1Color("#FFCC00");
        match.setTeam2("Mumbai Indians");
        match.setTeam2Short("MI");
        match.setTeam2Color("#004BA0");
        match.setMaxOvers(20);
        match.setTossDecision("CSK won the toss and elected to field first");
        match.setStatusMessage("Match starting shortly. Pitch looks great for batting.");

        Innings inn1 = new Innings(1, "Mumbai Indians", "Chennai Super Kings");
        BattingStat mi1 = new BattingStat("mi-1", "Rohit Sharma"); mi1.setStriker(true);
        BattingStat mi2 = new BattingStat("mi-2", "Ishan Kishan"); mi2.setNonStriker(true);
        BattingStat mi3 = new BattingStat("mi-3", "Suryakumar Yadav");
        BattingStat mi4 = new BattingStat("mi-4", "Tilak Varma");
        BattingStat mi5 = new BattingStat("mi-5", "Hardik Pandya");
        inn1.getBattingStats().addAll(List.of(mi1, mi2, mi3, mi4, mi5));

        BowlingStat cskBowl1 = new BowlingStat("csk-b1", "Deepak Chahar"); cskBowl1.setCurrentBowler(true);
        BowlingStat cskBowl2 = new BowlingStat("csk-b2", "Matheesha Pathirana");
        BowlingStat cskBowl3 = new BowlingStat("csk-b3", "Ravindra Jadeja");
        inn1.getBowlingStats().addAll(List.of(cskBowl1, cskBowl2, cskBowl3));

        match.setInnings1(inn1);
        matchService.saveMatch(match);
    }
}
