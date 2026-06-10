// ========== ПОДКЛЮЧЕНИЕ К БАЗЕ ДАННЫХ ==========
let db = null;
let upgradeCosts = {
    common: { cards: [], gold: [] },
    rare: { cards: [], gold: [] },
    epic: { cards: [], gold: [] },
    legendary: { cards: [], gold: [] },
    champion: { cards: [], gold: [] }
};

// Загрузка базы данных
async function initDatabase() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js';
        script.onload = async () => {
            try {
                const SQL = await initSqlJs({
                    locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
                });
                
                const response = await fetch('royalestats.db');
                const arrayBuffer = await response.arrayBuffer();
                const uint8Array = new Uint8Array(arrayBuffer);
                db = new SQL.Database(uint8Array);
                
                loadDataFromDB();
                resolve();
            } catch (err) {
                console.error('Ошибка загрузки БД:', err);
                reject(err);
            }
        };
        script.onerror = () => {
            console.error('Не удалось загрузить SQL.js');
            reject(new Error('SQL.js не загрузился'));
        };
        document.head.appendChild(script);
    });
}

// Загрузка данных из базы данных
function loadDataFromDB() {
    const cardsResult = db.exec("SELECT * FROM quantity_cards ORDER BY level");
    if (cardsResult.length > 0) {
        const cardsData = cardsResult[0].values;
        cardsData.forEach(row => {
            const level = row[0];
            upgradeCosts.common.cards[level] = row[1];
            upgradeCosts.rare.cards[level] = row[2];
            upgradeCosts.epic.cards[level] = row[3];
            upgradeCosts.legendary.cards[level] = row[4];
            upgradeCosts.champion.cards[level] = row[5];
        });
    }
    
    const goldResult = db.exec("SELECT * FROM quantity_gold ORDER BY level");
    if (goldResult.length > 0) {
        const goldData = goldResult[0].values;
        goldData.forEach(row => {
            const level = row[0];
            upgradeCosts.common.gold[level] = row[1];
            upgradeCosts.rare.gold[level] = row[2];
            upgradeCosts.epic.gold[level] = row[3];
            upgradeCosts.legendary.gold[level] = row[4];
            upgradeCosts.champion.gold[level] = row[5];
        });
    }
    
    for (let rarity of ['common', 'rare', 'epic', 'legendary', 'champion']) {
        for (let i = 0; i <= 16; i++) {
            if (upgradeCosts[rarity].cards[i] === undefined) upgradeCosts[rarity].cards[i] = 0;
            if (upgradeCosts[rarity].gold[i] === undefined) upgradeCosts[rarity].gold[i] = 0;
        }
    }
}

const levelsContainer = document.getElementById('levelsContainer');
const cardsInput = document.getElementById('cardsInput');
const goldInput = document.getElementById('goldInput');
const cardsValue = document.getElementById('cardsValue');
const goldValue = document.getElementById('goldValue');
const resultCards = document.getElementById('resultCards');
const resultGold = document.getElementById('resultGold');
const resultGems = document.getElementById('resultGems');

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

const MAX_CARDS = 9999999;
const MAX_GOLD = 999999999;

function calculateNeededResources() {
    const costs = upgradeCosts[currentRarity];
    let totalNeededCards = 0;
    let totalNeededGold = 0;

    let start = Math.min(currentLevel, targetLevel);
    let end = Math.max(currentLevel, targetLevel);

    for (let i = start + 1; i <= end; i++) {
        totalNeededCards += costs.cards[i] || 0;
        totalNeededGold += costs.gold[i] || 0;
    }
    
    let remainingCards = Math.max(0, totalNeededCards - currentCards);
    let remainingGold = Math.max(0, totalNeededGold - currentGold);
    
    return { 
        neededCards: totalNeededCards,
        neededGold: totalNeededGold,
        remainingCards: remainingCards,
        remainingGold: remainingGold
    };
}

function updateProgressBars() {
    const { neededCards, neededGold, remainingCards, remainingGold } = calculateNeededResources();

    let cardsPercentValue = 0;
    if (neededCards > 0) {
        let haveCards = neededCards - remainingCards;
        cardsPercentValue = Math.min(100, Math.max(0, (haveCards / neededCards) * 100));
    } else {
        cardsPercentValue = 100;
    }

    let goldPercentValue = 0;
    if (neededGold > 0) {
        let haveGold = neededGold - remainingGold;
        goldPercentValue = Math.min(100, Math.max(0, (haveGold / neededGold) * 100));
    } else {
        goldPercentValue = 100;
    }

    cardsProgressFill.style.width = `${cardsPercentValue}%`;
    goldProgressFill.style.width = `${goldPercentValue}%`;
    cardsPercent.textContent = `${Math.round(cardsPercentValue)}%`;
    goldPercent.textContent = `${Math.round(goldPercentValue)}%`;
}

function updateLevelColors() {
    levelButtons.forEach((btn, index) => {
        const level = index + 1;
        btn.classList.remove('current', 'range', 'target', 'future');

        if (level === currentLevel) {
            btn.classList.add('current');
        } else if (level === targetLevel) {
            btn.classList.add('target');
        } else if ((level > currentLevel && level < targetLevel) || (level < currentLevel && level > targetLevel)) {
            btn.classList.add('range');
        } else {
            btn.classList.add('future');
        }
    });
}

function updateSquares() {
    currentCards = parseInt(cardsInput.value, 10);
    currentGold = parseInt(goldInput.value, 10);
    if (isNaN(currentCards)) currentCards = 0;
    if (isNaN(currentGold)) currentGold = 0;
    
    if (currentCards < 0) currentCards = 0;
    if (currentCards > MAX_CARDS) currentCards = MAX_CARDS;
    if (currentGold < 0) currentGold = 0;
    if (currentGold > MAX_GOLD) currentGold = MAX_GOLD;
    
    cardsInput.value = currentCards;
    goldInput.value = currentGold;
    cardsValue.textContent = currentCards;
    goldValue.textContent = currentGold;
    updateProgressBars();
    updateResults();
}

function updateResults() {
    const { remainingCards, remainingGold } = calculateNeededResources();
    resultCards.textContent = remainingCards;
    resultGold.textContent = remainingGold;
    resultGems.textContent = 0;
    updateProgressBars();
}

function setCurrentLevel(level) {
    if (level < 1) level = 1;
    if (level > 16) level = 16;
    currentLevel = level;
    levelDisplay.textContent = level;
    const squareBottomText = document.querySelector('.square-bottom-text');
    if (squareBottomText) {
        squareBottomText.innerHTML = `текущий уровень: <span>${level}</span>`;
    }
    
    if (targetLevel < currentLevel) setTargetLevel(currentLevel);
    else updateLevelColors();
    updateResults();
}

function setTargetLevel(level) {
    if (level < currentLevel) level = currentLevel;
    if (level < 1) level = 1;
    if (level > 16) level = 16;
    targetLevel = level;
    if (targetDisplay) targetDisplay.textContent = level;
    if (targetLevelValue) targetLevelValue.textContent = level;
    updateLevelColors();
    updateResults();
}

// Функция для создания кнопок уровней
function createLevelButtons() {
    if (!levelsContainer) {
        console.error('levelsContainer не найден!');
        return;
    }
    
    for (let i = 1; i <= 16; i++) {
        const button = document.createElement('button');
        button.className = 'level-btn';
        button.textContent = i;
        button.dataset.level = i;
        button.addEventListener('click', () => setCurrentLevel(parseInt(button.dataset.level, 10)));
        levelsContainer.appendChild(button);
        levelButtons.push(button);
    }
    
    updateLevelColors();
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
async function init() {
    createLevelButtons();
    
    try {
        await initDatabase();
    } catch (err) {
        console.error('База данных не загрузилась:', err);
        alert('Ошибка загрузки базы данных. Проверьте подключение.');
    }
    
    if (btnPlus) btnPlus.addEventListener('click', () => setCurrentLevel(currentLevel + 1));
    if (btnMinus) btnMinus.addEventListener('click', () => setCurrentLevel(currentLevel - 1));
    if (targetPlus) targetPlus.addEventListener('click', () => setTargetLevel(targetLevel + 1));
    if (targetMinus) targetMinus.addEventListener('click', () => setTargetLevel(targetLevel - 1));
    
    if (cardsInput) cardsInput.addEventListener('input', () => updateSquares());
    if (goldInput) goldInput.addEventListener('input', () => updateSquares());
    
    const rarityBtns = document.querySelectorAll('.rarity-btn');
    const setActiveRarity = (activeBtn) => {
        rarityBtns.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    };
    
    rarityBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            setActiveRarity(this);
            if (this.classList.contains('btn-common')) currentRarity = 'common';
            else if (this.classList.contains('btn-rare')) currentRarity = 'rare';
            else if (this.classList.contains('btn-epic')) currentRarity = 'epic';
            else if (this.classList.contains('btn-legendary')) currentRarity = 'legendary';
            else if (this.classList.contains('btn-champion')) currentRarity = 'champion';
            updateResults();
        });
    });
    
    const defaultBtn = document.querySelector('.btn-common');
    if (defaultBtn) defaultBtn.classList.add('active');
    
    setCurrentLevel(1);
    setTargetLevel(1);
    updateSquares();
}

// Запускаем инициализацию после загрузки DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}