// Professional Cricket Score Center & Real-Time Win Predictor Client
(function() {
    'use strict';

    const state = {
        matches: [],
        activeMatchId: 'match-ind-aus',
        activeMatch: null,
        stompClient: null,
        isConnected: false,
        pollInterval: null
    };

    const dom = {
        matchTickerList: document.getElementById('matchTickerList'),
        headerMatchTitle: document.getElementById('headerMatchTitle'),
        btnLiveAutoSim: document.getElementById('btnLiveAutoSim'),
        simToggleText: document.getElementById('simToggleText'),
        btnStepNextBall: document.getElementById('btnStepNextBall'),

        // Match Summary
        matchSeries: document.getElementById('matchSeries'),
        matchVenue: document.getElementById('matchVenue'),
        matchFormat: document.getElementById('matchFormat'),
        matchStatusBadge: document.getElementById('matchStatusBadge'),

        team1Flag: document.getElementById('team1Flag'),
        team1Name: document.getElementById('team1Name'),
        team1Score: document.getElementById('team1Score'),
        team2Flag: document.getElementById('team2Flag'),
        team2Name: document.getElementById('team2Name'),
        mainRunsWickets: document.getElementById('mainRunsWickets'),
        mainOversDisplay: document.getElementById('mainOversDisplay'),

        matchSituationText: document.getElementById('matchSituationText'),
        crrValue: document.getElementById('crrValue'),
        rrrValue: document.getElementById('rrrValue'),
        targetValue: document.getElementById('targetValue'),

        // Win Probability
        winProbLeader: document.getElementById('winProbLeader'),
        winBarTeam1: document.getElementById('winBarTeam1'),
        winBarTeam2: document.getElementById('winBarTeam2'),
        probTeam1Name: document.getElementById('probTeam1Name'),
        probTeam1Val: document.getElementById('probTeam1Val'),
        probTeam2Name: document.getElementById('probTeam2Name'),
        probTeam2Val: document.getElementById('probTeam2Val'),

        // Over Timeline & Insights
        thisOverBalls: document.getElementById('thisOverBalls'),
        partnershipVal: document.getElementById('partnershipVal'),
        last5OversVal: document.getElementById('last5OversVal'),

        // Matchup Tables
        strikerName: document.getElementById('strikerName'),
        strikerRuns: document.getElementById('strikerRuns'),
        strikerBalls: document.getElementById('strikerBalls'),
        strikerFours: document.getElementById('strikerFours'),
        strikerSixes: document.getElementById('strikerSixes'),
        strikerSr: document.getElementById('strikerSr'),

        nonStrikerName: document.getElementById('nonStrikerName'),
        nonStrikerRuns: document.getElementById('nonStrikerRuns'),
        nonStrikerBalls: document.getElementById('nonStrikerBalls'),
        nonStrikerFours: document.getElementById('nonStrikerFours'),
        nonStrikerSixes: document.getElementById('nonStrikerSixes'),
        nonStrikerSr: document.getElementById('nonStrikerSr'),

        bowlerName: document.getElementById('bowlerName'),
        bowlerOvers: document.getElementById('bowlerOvers'),
        bowlerMaidens: document.getElementById('bowlerMaidens'),
        bowlerRuns: document.getElementById('bowlerRuns'),
        bowlerWickets: document.getElementById('bowlerWickets'),
        bowlerEcon: document.getElementById('bowlerEcon'),

        // Tabs
        tabBtnCommentary: document.getElementById('tabBtnCommentary'),
        tabBtnScorecard: document.getElementById('tabBtnScorecard'),
        tabBtnMatchInfo: document.getElementById('tabBtnMatchInfo'),
        tabCommentary: document.getElementById('tabCommentary'),
        tabScorecard: document.getElementById('tabScorecard'),
        tabMatchInfo: document.getElementById('tabMatchInfo'),
        commentaryFeed: document.getElementById('commentaryFeed'),
        scorecardContent: document.getElementById('scorecardContent'),
        matchInfoContent: document.getElementById('matchInfoContent'),

        // Historic Modal
        btnHistoricModal: document.getElementById('btnHistoricModal'),
        historicModal: document.getElementById('historicModal'),
        closeHistoricModal: document.getElementById('closeHistoricModal'),
        historicListContent: document.getElementById('historicListContent')
    };

    async function init() {
        bindEvents();
        await fetchMatches();
        initWebSocket();
        startPollingFallback();
    }

    function bindEvents() {
        // Tab Switching
        const tabs = [
            { btn: dom.tabBtnCommentary, pane: dom.tabCommentary },
            { btn: dom.tabBtnScorecard, pane: dom.tabScorecard },
            { btn: dom.tabBtnMatchInfo, pane: dom.tabMatchInfo }
        ];
        tabs.forEach(t => {
            t.btn.addEventListener('click', () => {
                tabs.forEach(item => {
                    item.btn.classList.toggle('active', item.btn === t.btn);
                    item.pane.classList.toggle('active', item.pane === t.pane);
                });
            });
        });

        // Live Simulation Toggle
        dom.btnLiveAutoSim.addEventListener('click', toggleLiveSimulation);
        dom.btnStepNextBall.addEventListener('click', stepNextBall);

        // Historic Modal
        dom.btnHistoricModal.addEventListener('click', openHistoricModal);
        dom.closeHistoricModal.addEventListener('click', () => dom.historicModal.classList.remove('open'));
        dom.historicModal.addEventListener('click', (e) => {
            if (e.target === dom.historicModal) dom.historicModal.classList.remove('open');
        });
    }

    async function fetchMatches() {
        try {
            const res = await fetch('/api/matches');
            if (!res.ok) return;
            state.matches = await res.json();
            renderTicker();

            if (!state.activeMatch) {
                const current = state.matches.find(m => m.id === state.activeMatchId) || state.matches[0];
                if (current) setActiveMatch(current.id);
            } else {
                const updated = state.matches.find(m => m.id === state.activeMatchId);
                if (updated) {
                    state.activeMatch = updated;
                    renderMatchCenter(updated);
                }
            }
        } catch (e) {
            console.error('Error fetching matches:', e);
        }
    }

    function renderTicker() {
        if (!dom.matchTickerList) return;
        dom.matchTickerList.innerHTML = '';

        state.matches.forEach(m => {
            const card = document.createElement('div');
            card.className = `fixture-card ${m.id === state.activeMatchId ? 'active' : ''}`;
            const currInnings = m.currentInningsIndex === 1 ? m.innings1 : m.innings2;
            const scoreStr = currInnings ? `${currInnings.totalRuns}/${currInnings.wickets} (${currInnings.overs.toFixed(1)} ov)` : 'Upcoming';

            card.innerHTML = `
                <div class="fixture-status">${m.status}</div>
                <div class="fixture-teams-row">
                    <span>${m.team1Short || m.team1}</span>
                    <span style="color:var(--text-muted);">vs</span>
                    <span>${m.team2Short || m.team2}</span>
                </div>
                <div class="fixture-score-row">${scoreStr}</div>
            `;
            card.addEventListener('click', () => setActiveMatch(m.id));
            dom.matchTickerList.appendChild(card);
        });
    }

    async function setActiveMatch(matchId) {
        state.activeMatchId = matchId;
        renderTicker();
        try {
            const res = await fetch(`/api/matches/${matchId}`);
            if (res.ok) {
                const match = await res.json();
                state.activeMatch = match;
                renderMatchCenter(match);
                subscribeToMatch(matchId);
            }
        } catch (e) {
            console.error('Error loading match:', e);
        }
    }

    function renderMatchCenter(match) {
        if (!match) return;

        dom.headerMatchTitle.textContent = match.title;
        dom.matchSeries.textContent = match.series || match.title;
        dom.matchVenue.textContent = match.venue || 'International Stadium';
        dom.matchFormat.textContent = match.matchType || 'T20I';

        dom.matchStatusBadge.textContent = match.status;
        dom.matchStatusBadge.className = `live-status-tag ${match.status.toLowerCase()}`;

        // Teams meta
        dom.team1Name.textContent = match.team1;
        dom.team1Flag.textContent = (match.team1Short || match.team1.substring(0, 3)).toUpperCase();
        dom.team2Name.textContent = match.team2;
        dom.team2Flag.textContent = (match.team2Short || match.team2.substring(0, 3)).toUpperCase();

        const inn1 = match.innings1;
        const inn2 = match.innings2;
        const curr = match.currentInningsIndex === 1 ? inn1 : inn2;

        if (inn1) {
            dom.team1Score.innerHTML = `${inn1.totalRuns}/${inn1.wickets} <span class="overs-dim">(${inn1.overs.toFixed(1)} ov)</span>`;
        }

        if (inn2) {
            dom.mainRunsWickets.textContent = `${inn2.totalRuns}/${inn2.wickets}`;
            dom.mainOversDisplay.textContent = `(${inn2.overs.toFixed(1)} / ${match.maxOvers} ov)`;
        } else if (inn1) {
            dom.mainRunsWickets.textContent = `${inn1.totalRuns}/${inn1.wickets}`;
            dom.mainOversDisplay.textContent = `(${inn1.overs.toFixed(1)} / ${match.maxOvers} ov)`;
        }

        // Equation bar
        dom.matchSituationText.textContent = match.statusMessage || (match.result || 'Live In Play');
        dom.crrValue.textContent = match.crr ? match.crr.toFixed(2) : '0.00';
        dom.rrrValue.textContent = (match.rrr !== null && match.rrr !== undefined) ? match.rrr.toFixed(2) : '--';
        dom.targetValue.textContent = match.target || '--';

        // GOOGLE WIN PROBABILITY UPDATE
        renderWinProbability(match);

        // Over Timeline & Insights
        if (curr) {
            renderRecentOver(curr);
            renderOnCreaseTable(curr);
            renderCommentary(curr.ballEvents || []);
            renderScorecard(match);
        }

        renderMatchDetails(match);

        // Simulation status button
        if (match.simulating) {
            dom.btnLiveAutoSim.className = 'sim-toggle-btn active';
            dom.simToggleText.textContent = 'LIVE STREAMING';
        } else {
            dom.btnLiveAutoSim.className = 'sim-toggle-btn paused';
            dom.simToggleText.textContent = 'STREAM PAUSED';
        }
    }

    // Render Google Sports Win Probability Bar
    function renderWinProbability(match) {
        const p1 = typeof match.winProbabilityTeam1 === 'number' ? match.winProbabilityTeam1 : 50.0;
        const p2 = typeof match.winProbabilityTeam2 === 'number' ? match.winProbabilityTeam2 : 50.0;

        dom.winBarTeam1.style.width = `${p1}%`;
        dom.winBarTeam2.style.width = `${p2}%`;

        dom.probTeam1Name.textContent = match.team1;
        dom.probTeam1Val.textContent = `${p1.toFixed(1)}%`;

        dom.probTeam2Name.textContent = match.team2;
        dom.probTeam2Val.textContent = `${p2.toFixed(1)}%`;

        if (p1 > p2) {
            dom.winProbLeader.textContent = `${match.team1} has a ${p1.toFixed(1)}% chance of winning`;
            dom.probTeam1Val.classList.add('highlight');
            dom.probTeam2Val.classList.remove('highlight');
        } else if (p2 > p1) {
            dom.winProbLeader.textContent = `${match.team2} has a ${p2.toFixed(1)}% chance of winning`;
            dom.probTeam2Val.classList.add('highlight');
            dom.probTeam1Val.classList.remove('highlight');
        } else {
            dom.winProbLeader.textContent = 'Match evenly balanced (50% - 50%)';
            dom.probTeam1Val.classList.remove('highlight');
            dom.probTeam2Val.classList.remove('highlight');
        }

        // Partnership & Last 5 Overs
        if (match.currentPartnershipRuns !== undefined) {
            dom.partnershipVal.textContent = `${match.currentPartnershipRuns} (${match.currentPartnershipBalls})`;
        }
        if (match.last5OversSummary) {
            dom.last5OversVal.textContent = match.last5OversSummary;
        }
    }

    function renderRecentOver(innings) {
        if (!dom.thisOverBalls) return;
        dom.thisOverBalls.innerHTML = '';

        if (!innings.ballEvents || innings.ballEvents.length === 0) {
            dom.thisOverBalls.innerHTML = '<span style="color:var(--text-muted); font-size:0.75rem;">New over</span>';
            return;
        }

        const currentOverNum = Math.floor(innings.legalBalls / 6);
        const overBalls = innings.ballEvents.filter(b => b.overNumber === currentOverNum).reverse();

        if (overBalls.length === 0) {
            dom.thisOverBalls.innerHTML = '<span style="color:var(--text-muted); font-size:0.75rem;">Over start</span>';
            return;
        }

        overBalls.forEach(b => {
            const dot = document.createElement('div');
            let cls = 'ball-dot';
            if (b.wicket) cls += ' wicket';
            else if (b.runs === 4) cls += ' four';
            else if (b.runs === 6) cls += ' six';
            else if (b.extraType !== 'NONE') cls += ' extra';

            dot.className = cls;
            dot.textContent = b.displayBadge;
            dom.thisOverBalls.appendChild(dot);
        });
    }

    function renderOnCreaseTable(innings) {
        const striker = innings.battingStats ? innings.battingStats.find(b => b.striker && !b.out) : null;
        if (striker) {
            dom.strikerName.textContent = striker.playerName;
            dom.strikerRuns.textContent = striker.runs;
            dom.strikerBalls.textContent = striker.balls;
            dom.strikerFours.textContent = striker.fours;
            dom.strikerSixes.textContent = striker.sixes;
            dom.strikerSr.textContent = striker.strikeRate.toFixed(1);
        }

        const nonStriker = innings.battingStats ? innings.battingStats.find(b => b.nonStriker && !b.out) : null;
        if (nonStriker) {
            dom.nonStrikerName.textContent = nonStriker.playerName;
            dom.nonStrikerRuns.textContent = nonStriker.runs;
            dom.nonStrikerBalls.textContent = nonStriker.balls;
            dom.nonStrikerFours.textContent = nonStriker.fours;
            dom.nonStrikerSixes.textContent = nonStriker.sixes;
            dom.nonStrikerSr.textContent = nonStriker.strikeRate.toFixed(1);
        }

        const bowler = innings.bowlingStats ? innings.bowlingStats.find(b => b.currentBowler) : null;
        if (bowler) {
            dom.bowlerName.textContent = bowler.playerName;
            dom.bowlerOvers.textContent = bowler.overs.toFixed(1);
            dom.bowlerMaidens.textContent = bowler.maidens;
            dom.bowlerRuns.textContent = bowler.runsConceded;
            dom.bowlerWickets.textContent = bowler.wickets;
            dom.bowlerEcon.textContent = bowler.economy.toFixed(2);
        }
    }

    function renderCommentary(ballEvents) {
        if (!dom.commentaryFeed) return;
        dom.commentaryFeed.innerHTML = '';

        if (!ballEvents || ballEvents.length === 0) {
            dom.commentaryFeed.innerHTML = '<div style="color:var(--text-muted); padding:1rem; text-align:center;">Waiting for live ball deliveries...</div>';
            return;
        }

        ballEvents.slice(0, 35).forEach(b => {
            const item = document.createElement('div');
            let itemClass = 'comm-item';
            let badgeClass = 'comm-ball-badge';

            if (b.wicket) {
                itemClass += ' wicket-ball';
                badgeClass += ' wicket';
            } else if (b.runs === 4) {
                itemClass += ' boundary-four';
                badgeClass += ' four';
            } else if (b.runs === 6) {
                itemClass += ' boundary-six';
                badgeClass += ' six';
            } else if (b.extraType !== 'NONE') {
                badgeClass += ' extra';
            }

            item.className = itemClass;
            item.innerHTML = `
                <div class="comm-over-col">
                    <span class="comm-over-text">${b.overNumber}.${b.ballNumber}</span>
                    <div class="${badgeClass}">${b.displayBadge}</div>
                </div>
                <div class="comm-content-col">
                    <div class="comm-headline">${b.bowlerName} to ${b.batsmanName}</div>
                    <div class="comm-body">${b.commentary}</div>
                </div>
            `;
            dom.commentaryFeed.appendChild(item);
        });
    }

    function renderScorecard(match) {
        if (!dom.scorecardContent) return;
        const curr = match.currentInningsIndex === 1 ? match.innings1 : match.innings2;
        if (!curr) return;

        let battingRows = '';
        (curr.battingStats || []).forEach(b => {
            battingRows += `
                <tr>
                    <td class="player-name-cell">${b.playerName} ${b.striker ? '<span class="strike-marker">*</span>' : ''}</td>
                    <td style="color:var(--text-muted); font-size:0.78rem;">${b.dismissal || 'not out'}</td>
                    <td class="num bold">${b.runs}</td>
                    <td class="num">${b.balls}</td>
                    <td class="num">${b.fours}</td>
                    <td class="num">${b.sixes}</td>
                    <td class="num">${b.strikeRate.toFixed(1)}</td>
                </tr>
            `;
        });

        let bowlingRows = '';
        (curr.bowlingStats || []).forEach(b => {
            bowlingRows += `
                <tr>
                    <td class="player-name-cell">${b.playerName} ${b.currentBowler ? '<span style="color:#60a5fa;">*</span>' : ''}</td>
                    <td class="num">${b.overs.toFixed(1)}</td>
                    <td class="num">${b.maidens}</td>
                    <td class="num">${b.runsConceded}</td>
                    <td class="num bold text-wicket">${b.wickets}</td>
                    <td class="num">${b.economy.toFixed(2)}</td>
                </tr>
            `;
        });

        let fowText = 'None';
        if (curr.fallOfWickets && curr.fallOfWickets.length > 0) {
            fowText = curr.fallOfWickets.map(f => `${f.score}/${f.wicketNumber} (${f.batsmanName}, ${f.over.toFixed(1)} ov)`).join('  •  ');
        }

        dom.scorecardContent.innerHTML = `
            <h4>${curr.battingTeam} Batting</h4>
            <table class="sports-table" style="margin-bottom:1rem;">
                <thead>
                    <tr><th>Batter</th><th>Dismissal</th><th class="num">R</th><th class="num">B</th><th class="num">4s</th><th class="num">6s</th><th class="num">SR</th></tr>
                </thead>
                <tbody>${battingRows}</tbody>
            </table>

            <div class="fow-strip"><strong>Fall of Wickets:</strong> ${fowText}</div>

            <h4>${curr.bowlingTeam} Bowling</h4>
            <table class="sports-table">
                <thead>
                    <tr><th>Bowler</th><th class="num">O</th><th class="num">M</th><th class="num">R</th><th class="num">W</th><th class="num">ECO</th></tr>
                </thead>
                <tbody>${bowlingRows}</tbody>
            </table>
        `;
    }

    function renderMatchDetails(match) {
        if (!dom.matchInfoContent) return;
        dom.matchInfoContent.innerHTML = `
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.25rem;">
                <div style="background:rgba(0,0,0,0.25); padding:1rem; border-radius:8px; border:1px solid var(--border);">
                    <h5 style="margin-bottom:0.5rem; color:var(--text-secondary);">Match Details</h5>
                    <p style="font-size:0.85rem; margin-bottom:0.3rem;"><strong>Event:</strong> ${match.title}</p>
                    <p style="font-size:0.85rem; margin-bottom:0.3rem;"><strong>Venue:</strong> ${match.venue}</p>
                    <p style="font-size:0.85rem; margin-bottom:0.3rem;"><strong>Toss:</strong> ${match.tossDecision}</p>
                    <p style="font-size:0.85rem;"><strong>Format:</strong> ${match.matchType} (${match.maxOvers} Overs)</p>
                </div>
                <div style="background:rgba(0,0,0,0.25); padding:1rem; border-radius:8px; border:1px solid var(--border);">
                    <h5 style="margin-bottom:0.5rem; color:var(--text-secondary);">Current Status</h5>
                    <p style="font-size:0.85rem; margin-bottom:0.3rem;"><strong>Status:</strong> ${match.status}</p>
                    <p style="font-size:0.85rem; margin-bottom:0.3rem;"><strong>Equation:</strong> ${match.statusMessage}</p>
                    <p style="font-size:0.85rem;"><strong>Target:</strong> ${match.target || 'Setting target'}</p>
                </div>
            </div>
        `;
    }

    async function toggleLiveSimulation() {
        if (!state.activeMatchId) return;
        const isSim = state.activeMatch && state.activeMatch.simulating;
        const endpoint = isSim ? `/api/matches/${state.activeMatchId}/simulate/pause` : `/api/matches/${state.activeMatchId}/simulate/start`;
        try {
            await fetch(endpoint, { method: 'POST' });
            fetchMatches();
        } catch (e) {
            console.error(e);
        }
    }

    async function stepNextBall() {
        if (!state.activeMatchId) return;
        try {
            const res = await fetch(`/api/matches/${state.activeMatchId}/simulate/step`, { method: 'POST' });
            if (res.ok) {
                const match = await res.json();
                state.activeMatch = match;
                renderMatchCenter(match);
            }
        } catch (e) {
            console.error(e);
        }
    }

    async function openHistoricModal() {
        dom.historicModal.classList.add('open');
        dom.historicListContent.innerHTML = '<div style="color:var(--text-muted); text-align:center; padding:1rem;">Loading historic archives...</div>';
        try {
            const res = await fetch('/api/historic');
            if (res.ok) {
                const list = await res.json();
                dom.historicListContent.innerHTML = '';
                list.forEach(item => {
                    const row = document.createElement('div');
                    row.className = 'historic-row';
                    row.innerHTML = `
                        <div class="historic-row-title">
                            <span>${item.title}</span>
                            <span style="color:var(--google-yellow); font-family:var(--font-mono);">${item.year}</span>
                        </div>
                        <div class="historic-row-score">${item.scoreSummary}</div>
                        <div style="font-weight:600; font-size:0.84rem; margin-bottom:0.25rem;">${item.result}</div>
                        <div style="font-size:0.78rem; color:var(--google-yellow); margin-bottom:0.25rem;">🏆 POTM: ${item.playerOfTheMatch}</div>
                        <div class="historic-row-desc">${item.highlights}</div>
                    `;
                    dom.historicListContent.appendChild(row);
                });
            }
        } catch (e) {
            dom.historicListContent.innerHTML = '<div style="color:#ef4444;">Failed to load historic matches.</div>';
        }
    }

    let matchSub = null;
    function initWebSocket() {
        try {
            if (typeof SockJS === 'undefined' || typeof Stomp === 'undefined') return;
            const socket = new SockJS('/ws-cricket');
            state.stompClient = Stomp.over(socket);
            state.stompClient.debug = null;

            state.stompClient.connect({}, function() {
                state.isConnected = true;
                state.stompClient.subscribe('/topic/matches', function(msg) {
                    if (msg.body) {
                        try {
                            state.matches = JSON.parse(msg.body);
                            renderTicker();
                        } catch (e) {}
                    }
                });
                subscribeToMatch(state.activeMatchId);
            });
        } catch (e) {}
    }

    function subscribeToMatch(matchId) {
        if (!state.stompClient || !state.isConnected) return;
        if (matchSub) matchSub.unsubscribe();
        matchSub = state.stompClient.subscribe(`/topic/matches/${matchId}`, function(msg) {
            if (msg.body) {
                try {
                    const match = JSON.parse(msg.body);
                    state.activeMatch = match;
                    renderMatchCenter(match);
                } catch (e) {}
            }
        });
    }

    function startPollingFallback() {
        if (state.pollInterval) clearInterval(state.pollInterval);
        state.pollInterval = setInterval(async () => {
            if (state.activeMatchId) {
                try {
                    const res = await fetch(`/api/matches/${state.activeMatchId}`);
                    if (res.ok) {
                        const match = await res.json();
                        state.activeMatch = match;
                        renderMatchCenter(match);
                    }
                } catch (e) {}
            }
        }, 2500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
