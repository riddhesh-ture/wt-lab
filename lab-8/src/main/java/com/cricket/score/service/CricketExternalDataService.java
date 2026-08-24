package com.cricket.score.service;

import com.cricket.score.model.HistoricalMatchSummary;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CricketExternalDataService {

    private static final Logger log = LoggerFactory.getLogger(CricketExternalDataService.class);

    @Value("${cricket.api.enabled:false}")
    private boolean apiEnabled;

    @Value("${cricket.api.provider:mock}")
    private String apiProvider;

    @Value("${cricket.api.key:YOUR_API_KEY_HERE}")
    private String apiKey;

    private final List<HistoricalMatchSummary> historicMatches = new ArrayList<>();

    public CricketExternalDataService() {
        seedHistoricMatches();
    }

    private void seedHistoricMatches() {
        historicMatches.add(new HistoricalMatchSummary(
                "hist-2024-t20-final",
                "ICC Men's T20 World Cup Final 2024",
                "ICC T20 World Cup",
                "2024",
                "India",
                "South Africa",
                "IND: 176/7 (20.0) | SA: 169/8 (20.0)",
                "India won by 7 runs",
                "Virat Kohli (76 off 59)",
                "Kensington Oval, Bridgetown, Barbados",
                "Historic victory for India! Hardik Pandya defended 16 runs in the final over, with Suryakumar Yadav taking a breathtaking boundary catch to dismiss David Miller."
        ));

        historicMatches.add(new HistoricalMatchSummary(
                "hist-2022-t20-mcg",
                "India vs Pakistan - Super 12",
                "ICC T20 World Cup",
                "2022",
                "Pakistan",
                "India",
                "PAK: 159/8 (20.0) | IND: 160/6 (20.0)",
                "India won by 4 wickets (last-ball finish)",
                "Virat Kohli (82* off 53)",
                "Melbourne Cricket Ground (MCG), Australia",
                "Virat Kohli's iconic masterclass with twin sixes against Haris Rauf in the 19th over to pull off an unbelievable chase in front of 90,293 fans at the MCG."
        ));

        historicMatches.add(new HistoricalMatchSummary(
                "hist-2019-wc-final",
                "ICC Men's Cricket World Cup Final 2019",
                "ICC Cricket World Cup",
                "2019",
                "New Zealand",
                "England",
                "NZ: 241/8 (50.0) & 15/1 | ENG: 241 all out (50.0) & 15/0",
                "Match tied - England won on boundary count after Super Over",
                "Ben Stokes (84* off 98)",
                "Lord's, London, England",
                "The most dramatic World Cup final in cricket history. Ben Stokes led England to a tie, followed by a tied Super Over, decided by boundary count."
        ));

        historicMatches.add(new HistoricalMatchSummary(
                "hist-2011-wc-final",
                "ICC Cricket World Cup Final 2011",
                "ICC Cricket World Cup",
                "2011",
                "Sri Lanka",
                "India",
                "SL: 274/6 (50.0) | IND: 277/4 (48.2)",
                "India won by 6 wickets",
                "MS Dhoni (91* off 79)",
                "Wankhede Stadium, Mumbai, India",
                "MS Dhoni finishes off in style with a magnificent six into the Mumbai crowd! India lifted the World Cup after 28 years under Tendulkar's homecoming."
        ));

        historicMatches.add(new HistoricalMatchSummary(
                "hist-2007-t20-final",
                "ICC World Twenty20 Final 2007",
                "ICC World Twenty20",
                "2007",
                "India",
                "Pakistan",
                "IND: 157/5 (20.0) | PAK: 152 all out (19.3)",
                "India won by 5 runs",
                "Irfan Pathan (3/16)",
                "Wanderers Stadium, Johannesburg, South Africa",
                "Inaugural T20 World Cup victory for young MS Dhoni's side. Joginder Sharma bowled the fateful final over, with Sreesanth taking Misbah's scoop catch."
        ));
    }

    public List<HistoricalMatchSummary> getHistoricMatches() {
        return historicMatches;
    }

    public Map<String, Object> getApiIntegrationStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("apiEnabled", apiEnabled);
        status.put("apiProvider", apiProvider);
        status.put("supportedProviders", List.of(
                "CricketData.org (Free Tier - Current & Historical Matches)",
                "RapidAPI Cricbuzz / Live Cricket Score API",
                "Sportmonks Cricket API",
                "Cricsheet.org (Open Data - Over 10,000 Historical Matches in JSON)"
        ));
        status.put("note", "By default, this system simulates real-time matches locally and provides verified historic fixtures. Set cricket.api.enabled=true and provide cricket.api.key in application.properties to stream third-party vendor APIs.");
        return status;
    }
}
