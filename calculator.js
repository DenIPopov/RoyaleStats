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

// Максимальные значения для полей ввода
const MAX_CARDS = 9999999;
const MAX_GOLD = 999999999;

const upgradeCosts = {
    common: {
        cards: [0, 0, 2, 4, 10, 20, 50, 100, 200, 400, 800, 1000, 1500, 2500, 3500, 5500, 7500],
        gold: [0, 0, 5, 20, 50, 150, 400, 1000, 2000, 4000, 8000, 15000, 25000, 40000, 60000, 90000, 120000],
        gems: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 100, 150, 200, 250, 300]
    },
    rare: {
        cards: [0, 0, 0, 1, 2, 4, 10, 20, 50, 100, 200, 300, 400, 550, 750, 1000, 1400],
        gold: [0, 0, 0, 0, 50, 150, 400, 1000, 2000, 4000, 8000, 15000, 25000, 40000, 60000, 90000, 120000],
        gems: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 75, 150, 225, 300, 375, 450]
    },
    epic: {
        cards: [0, 0, 0, 0, 0, 0, 0, 2, 4, 10, 20, 30, 50, 70, 100, 130, 180],
        gold: [0, 0, 0, 0, 0, 0, 0, 1000, 2000, 4000, 8000, 15000, 25000, 40000, 60000, 90000, 120000],
        gems: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 200, 300, 400, 500, 600]
    },
    legendary: {
        cards: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 6, 9, 12, 14, 20],
        gold: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5000, 15000, 25000, 40000, 60000, 90000, 120000],
        gems: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150, 300, 450, 600, 750, 900]
    },
    champion: {
        cards: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 5, 8, 11, 15],
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
    let totalNeededCards = 0;
    let totalNeededGold = 0;
    let totalNeededGems = 0;

    let start = Math.min(currentLevel, targetLevel);
    let end = Math.max(currentLevel, targetLevel);

    for (let i = start + 1; i <= end; i++) {
        if (i < costs.cards.length) {
            totalNeededCards += costs.cards[i] || 0;
            totalNeededGold += costs.gold[i] || 0;
            totalNeededGems += costs.gems[i] || 0;
        }
    }
    
    // ВЫЧИТАЕМ то, что уже есть на руках (не может быть меньше 0)
    let remainingCards = Math.max(0, totalNeededCards - currentCards);
    let remainingGold = Math.max(0, totalNeededGold - currentGold);
    
    return { 
        neededCards: totalNeededCards,      // сколько всего нужно
        neededGold: totalNeededGold,        // сколько всего нужно золота
        neededGems: totalNeededGems,        // сколько всего нужно гемов
        remainingCards: remainingCards,     // сколько осталось докупить карт (с учетом имеющихся)
        remainingGold: remainingGold        // сколько осталось золота (с учетом имеющегося)
    };
}

function updateProgressBars() {
    const { neededCards, neededGold, remainingCards, remainingGold } = calculateNeededResources();

    // Для прогресса используем ОСТАВШИЕСЯ ресурсы относительно нужных
    let cardsPercentValue = 0;
    if (neededCards > 0) {
        // Сколько процентов УЖЕ есть (не осталось)
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

function updateSquares() {
    currentCards = parseInt(cardsInput.value, 10);
    currentGold = parseInt(goldInput.value, 10);
    if (isNaN(currentCards)) { currentCards = 0; cardsInput.value = 0; }
    if (isNaN(currentGold)) { currentGold = 0; goldInput.value = 0; }
    
    if (currentCards < 0) {
        currentCards = 0;
        cardsInput.value = 0;
    }
    if (currentCards > MAX_CARDS) {
        currentCards = MAX_CARDS;
        cardsInput.value = MAX_CARDS;
    }
    
    if (currentGold < 0) {
        currentGold = 0;
        goldInput.value = 0;
    }
    if (currentGold > MAX_GOLD) {
        currentGold = MAX_GOLD;
        goldInput.value = MAX_GOLD;
    }
    
    cardsValue.textContent = currentCards;
    goldValue.textContent = currentGold;
    updateProgressBars();
    updateResults(); // Обновляем результаты при изменении полей
}

function updateResults() {
    const { remainingCards, remainingGold, neededGems } = calculateNeededResources();
    // Выводим ОСТАВШИЕСЯ ресурсы (с учетом того, что уже есть)
    resultCards.textContent = remainingCards;
    resultGold.textContent = remainingGold;
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
    
    if (targetLevel < currentLevel) {
        setTargetLevel(currentLevel);
    } else {
        updateLevelColors();
        updateResults();
    }
}

function setTargetLevel(level) {
    if (level < currentLevel) {
        level = currentLevel;
    }
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
    button.addEventListener('click', function () {
        setCurrentLevel(parseInt(this.dataset.level, 10));
    });
    levelsContainer.appendChild(button);
    levelButtons.push(button);
}

cardsInput.addEventListener('input', function (e) {
    let value = parseInt(this.value, 10);
    if (isNaN(value)) value = 0;
    
    if (value < 0) {
        value = 0;
        this.value = 0;
    }
    if (value > MAX_CARDS) {
        value = MAX_CARDS;
        this.value = MAX_CARDS;
    }
    
    currentCards = value;
    cardsValue.textContent = value;
    updateResults(); // Обновляем результаты
    updateProgressBars();
});

goldInput.addEventListener('input', function (e) {
    let value = parseInt(this.value, 10);
    if (isNaN(value)) value = 0;
    
    if (value < 0) {
        value = 0;
        this.value = 0;
    }
    if (value > MAX_GOLD) {
        value = MAX_GOLD;
        this.value = MAX_GOLD;
    }
    
    currentGold = value;
    goldValue.textContent = value;
    updateResults(); // Обновляем результаты
    updateProgressBars();
});

document.querySelectorAll('.rarity-btn').forEach(btn => {
    btn.addEventListener('click', function () {
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