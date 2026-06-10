        const PLAYERS_DB = {
            "L8R2QLLU2": {
                tag: "#L8R2QLLU2",
                name: "denieffect",
                expLevel: 60,
                trophies: 10871,
                bestTrophies: 10958,
                wins: 2022,
                losses: 1892,
                battleCount: 3914,
                threeCrownWins: 846,
                challengeCardsWon: 313,
                challengeMaxWins: 8,
                tournamentCardsWon: 0,
                tournamentBattleCount: 67,
                currentWinLoseStreak: -3,
                donations: 0,
                donationsReceived: 0,
                totalDonations: 9112,
                warDayWins: 0,
                arena: { name: "Royal Road" }
            }
            // Сюда добавляй новых игроков:
            // "ТЕГБЕЗРЕШЁТКИ": { ... }
        };

        // =============================================
        // ПОИСК И РЕНДЕР
        // =============================================
        function loadPlayer() {
            const raw = document.getElementById('tagInput').value.trim().toUpperCase().replace('#', '');
            const hint = document.getElementById('searchHint');

            if (!raw) {
                hint.textContent = 'Введи тег игрока';
                hint.style.color = 'var(--redAkc)';
                return;
            }

            const data = PLAYERS_DB[raw];

            if (!data) {
                hint.textContent = 'Игрок с тегом #' + raw + ' не найден в базе';
                hint.style.color = 'var(--redAkc)';
                resetFields();
                return;
            }

            hint.textContent = '✅ Игрок найден';
            hint.style.color = 'var(--green)';
            renderPlayer(data);
        }

        function resetFields() {
            const ids = [
                'playerName','playerTag','playerArena','playerLevel',
                'playerTrophies','playerBestTrophies','statWins','statLosses',
                'statBattles','statWinrate','statThreeCrown','statStreak',
                'statChallengeCards','statChallengeMax','statTournamentCards',
                'statTournamentBattles','statDonations','statDonationsReceived',
                'statTotalDonations','statWarWins','barWinsLbl','barLossesLbl'
            ];
            ids.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = '—';
            });
            document.getElementById('barWins').style.width = '0%';
            document.getElementById('barLosses').style.width = '0%';
            document.getElementById('playerTag').textContent = 'Игрок не найден';
        }

        function renderPlayer(d) {
            document.getElementById('playerName').textContent = d.name;
            document.getElementById('playerTag').textContent = d.tag;
            document.getElementById('playerArena').textContent = '🏟️ ' + (d.arena?.name || '—');
            document.getElementById('playerLevel').textContent = d.expLevel;
            document.getElementById('playerTrophies').textContent = d.trophies.toLocaleString();
            document.getElementById('playerBestTrophies').textContent = d.bestTrophies.toLocaleString();

            document.getElementById('statWins').textContent = d.wins.toLocaleString();
            document.getElementById('statLosses').textContent = d.losses.toLocaleString();
            document.getElementById('statBattles').textContent = d.battleCount.toLocaleString();

            const wr = ((d.wins / d.battleCount) * 100).toFixed(1);
            document.getElementById('statWinrate').textContent = wr + '%';

            document.getElementById('statThreeCrown').textContent = d.threeCrownWins.toLocaleString();

            const streak = d.currentWinLoseStreak;
            const streakEl = document.getElementById('statStreak');
            streakEl.textContent = streak > 0 ? '+' + streak + ' 🔥' : streak + ' ❄️';
            streakEl.style.color = streak > 0 ? 'var(--green)' : 'var(--redAkc)';

            document.getElementById('statChallengeCards').textContent = d.challengeCardsWon.toLocaleString();
            document.getElementById('statChallengeMax').textContent = d.challengeMaxWins;
            document.getElementById('statTournamentCards').textContent = d.tournamentCardsWon.toLocaleString();
            document.getElementById('statTournamentBattles').textContent = d.tournamentBattleCount.toLocaleString();

            document.getElementById('statDonations').textContent = d.donations.toLocaleString();
            document.getElementById('statDonationsReceived').textContent = d.donationsReceived.toLocaleString();
            document.getElementById('statTotalDonations').textContent = d.totalDonations.toLocaleString();
            document.getElementById('statWarWins').textContent = d.warDayWins.toLocaleString();

            const total = d.wins + d.losses;
            const wPct = ((d.wins / total) * 100).toFixed(1);
            const lPct = ((d.losses / total) * 100).toFixed(1);
            document.getElementById('barWins').style.width = wPct + '%';
            document.getElementById('barLosses').style.width = lPct + '%';
            document.getElementById('barWinsLbl').textContent = `Победы: ${d.wins.toLocaleString()} (${wPct}%)`;
            document.getElementById('barLossesLbl').textContent = `Поражения: ${d.losses.toLocaleString()} (${lPct}%)`;
        }

        document.getElementById('tagInput').addEventListener('keydown', e => {
            if (e.key === 'Enter') loadPlayer();
        });