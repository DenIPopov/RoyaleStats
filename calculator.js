    const levelsContainer = document.getElementById('levelsContainer');
    const cardsInput = document.getElementById('cardsInput');
    const goldInput = document.getElementById('goldInput');
        const cardsValue = document.getElementById('cardsValue');
        const goldValue = document.getElementById('goldValue');
        const resultCards = document.getElementById('resultCards');
        const resultGold = document.getElementById('resultGold');
        const resultGems = document.getElementById('resultGems');
        
        // Элементы для полосок прогресса
        const cardsProgressFill = document.getElementById('cardsProgressFill');
        const goldProgressFill = document.getElementById('goldProgressFill');
        const cardsPercent = document.getElementById('cardsPercent');
        const goldPercent = document.getElementById('goldPercent');
        
        const targetLevelValue = document.getElementById('targetLevelValue');
        const levelDisplay = document.getElementById('levelDisplay');
        const btnMinus = document.getElementById('btnMinus');
        const btnPlus = document.getElementById('btnPlus');
        
        const targetDisplay = document.getElementById('targetDisplay');
        const targetMinus = document.getElementById('targetMinus');
        const targetPlus = document.getElementById('targetPlus');
        
        let currentLevel = 1;
        let targetLevel = 1;
        let currentRarity = 'common';
        let levelButtons = [];
        let currentCards = 0;
        let currentGold = 0;
        
        const upgradeCosts = {
            common: {
                cards: [0, 2, 4, 10, 20, 50, 100, 200, 400, 800, 1200, 1600, 2000, 2500, 3000, 3500],
                gold: [0, 50, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 24000, 32000, 40000, 50000, 60000, 70000],
                gems: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 100, 150, 200, 250, 300]
            },
            rare: {
                cards: [0, 2, 6, 15, 30, 75, 150, 300, 600, 1200, 1800, 2400, 3000, 3600, 4200, 4800],
                gold: [0, 100, 200, 500, 1000, 2000, 4000, 8000, 16000, 32000, 48000, 64000, 80000, 96000, 112000, 128000],
                gems: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 75, 150, 225, 300, 375, 450]
            },
            epic: {
                cards: [0, 3, 8, 20, 50, 100, 200, 400, 800, 1600, 2400, 3200, 4000, 4800, 5600, 6400],
                gold: [0, 200, 400, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 96000, 128000, 160000, 192000, 224000, 256000],
                gems: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 200, 300, 400, 500, 600]
            },
            legendary: {
                cards: [0, 1, 2, 4, 6, 10, 14, 20, 26, 32, 38, 44, 50, 56, 62, 68],
                gold: [0, 500, 1000, 2500, 5000, 10000, 20000, 40000, 80000, 160000, 240000, 320000, 400000, 480000, 560000, 640000],
                gems: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 300, 450, 600, 750, 900]
            },
            champion: {
                cards: [0, 1, 2, 4, 6, 10, 14, 20, 26, 32, 38, 44, 50, 56, 62, 68],
                gold: [0, 1000, 2000, 5000, 10000, 20000, 40000, 80000, 160000, 320000, 480000, 640000, 800000, 960000, 1120000, 1280000],
                gems: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 200, 400, 600, 800, 1000, 1200]
            }
        };
        
        function updateLevelColors() {
            levelButtons.forEach((btn, index) => {
                const level = index + 1;
                btn.classList.remove('current', 'range', 'target', 'future');
                
                if (level === currentLevel) {
                    btn.classList.add('current');
                } 
                else if (level === targetLevel) {
                    btn.classList.add('target');
                }
                else if ((level > currentLevel && level < targetLevel) || (level < currentLevel && level > targetLevel)) {
                    btn.classList.add('range');
                }
                else {
                    btn.classList.add('future');
                }
            });
        }
        
        function calculateNeededResources() {
            const costs = upgradeCosts[currentRarity];
            let neededCards = 0;
            let neededGold = 0;
            let neededGems = 0;
            
            let start = Math.min(currentLevel, targetLevel);
            let end = Math.max(currentLevel, targetLevel);
            
            for (let i = start + 1; i <= end; i++) {
                if (i < costs.cards.length) {
                    neededCards += costs.cards[i] || 0;
                    neededGold += costs.gold[i] || 0;
                    neededGems += costs.gems[i] || 0;
                }
            }
            return { neededCards, neededGold, neededGems };
        }
        
        function updateProgressBars() {
            const { neededCards, neededGold } = calculateNeededResources();
            
            let cardsPercentValue = 0;
            if (neededCards > 0) {
                cardsPercentValue = Math.min(100, Math.max(0, (currentCards / neededCards) * 100));
            } else {
                cardsPercentValue = 100;
            }
            
            let goldPercentValue = 0;
            if (neededGold > 0) {
                goldPercentValue = Math.min(100, Math.max(0, (currentGold / neededGold) * 100));
            } else {
                goldPercentValue = 100;
            }
            
            cardsProgressFill.style.width = `${cardsPercentValue}%`;
            goldProgressFill.style.width = `${goldPercentValue}%`;
            
            cardsPercent.textContent = `${Math.round(cardsPercentValue)}%`;
            goldPercent.textContent = `${Math.round(goldPercentValue)}%`;
        }
        
        function updateSquares() {
            currentCards = parseInt(cardsInput.value, 10);
            currentGold = parseInt(goldInput.value, 10);
            if (isNaN(currentCards)) { currentCards = 0; cardsInput.value = 0; }
            if (isNaN(currentGold)) { currentGold = 0; goldInput.value = 0; }
            cardsValue.textContent = currentCards;
            goldValue.textContent = currentGold;
            updateProgressBars();
        }
        
        function updateResults() {
            const { neededCards, neededGold, neededGems } = calculateNeededResources();
            resultCards.textContent = neededCards;
            resultGold.textContent = neededGold;
            resultGems.textContent = neededGems;
            updateProgressBars();
        }
        
        function setCurrentLevel(level) {
            if (level < 1) level = 1;
            if (level > 16) level = 16;
            currentLevel = level;
            levelDisplay.textContent = level;
            const bottomText = document.querySelector('.square-bottom-text');
            bottomText.textContent = `текущий уровень: ${level}`;
            updateLevelColors();
            updateResults();
        }
        
        function setTargetLevel(level) {
            if (level < 1) level = 1;
            if (level > 16) level = 16;
            targetLevel = level;
            targetDisplay.textContent = level;
            targetLevelValue.textContent = level;
            updateLevelColors();
            updateResults();
        }
        
        btnPlus.addEventListener('click', () => setCurrentLevel(currentLevel + 1));
        btnMinus.addEventListener('click', () => setCurrentLevel(currentLevel - 1));
        targetPlus.addEventListener('click', () => setTargetLevel(targetLevel + 1));
        targetMinus.addEventListener('click', () => setTargetLevel(targetLevel - 1));
        
        for (let i = 1; i <= 16; i++) {
            const button = document.createElement('button');
            button.className = 'level-btn';
            button.textContent = i;
            button.dataset.level = i;
            button.addEventListener('click', function() {
                setCurrentLevel(parseInt(this.dataset.level, 10));
            });
            levelsContainer.appendChild(button);
            levelButtons.push(button);
        }
        
        cardsInput.addEventListener('input', function(e) {
            let value = parseInt(this.value, 10);
            if (isNaN(value)) value = 0;
            currentCards = value;
            cardsValue.textContent = value;
            cardsInput.value = value;
            updateProgressBars();
        });
        
        goldInput.addEventListener('input', function(e) {
            let value = parseInt(this.value, 10);
            if (isNaN(value)) value = 0;
            currentGold = value;
            goldValue.textContent = value;
            goldInput.value = value;
            updateProgressBars();
        });
        
        document.querySelectorAll('.rarity-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                if (this.classList.contains('btn-common')) currentRarity = 'common';
                else if (this.classList.contains('btn-rare')) currentRarity = 'rare';
                else if (this.classList.contains('btn-epic')) currentRarity = 'epic';
                else if (this.classList.contains('btn-legendary')) currentRarity = 'legendary';
                else if (this.classList.contains('btn-champion')) currentRarity = 'champion';
                updateResults();
            });
        });
        
        setCurrentLevel(1);
        setTargetLevel(1);
        updateSquares();
        updateResults();