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

// Пустой объект для данных из БД
let upgradeCosts = null;
let dataLoaded = false;

// Загрузка данных из БД
async function loadDataFromDB() {
    try {
        console.log('Загрузка данных из базы данных...');
        const response = await fetch('/api/all-costs');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        upgradeCosts = data;
        dataLoaded = true;
        
        console.log('✅ Данные успешно загружены из БД:', upgradeCosts);
        
        // Инициализируем интерфейс после загрузки данных
        initializeAfterDataLoad();
        
    } catch (error) {
        console.error('❌ Ошибка загрузки данных из БД:', error);
        console.error('Проверьте:');
        console.error('1. Запущен ли сервер (python app.py)');
        console.error('2. Правильно ли настроено подключение к БД');
        console.error('3. Есть ли данные в таблицах quantity_gold и quantity_cards');
        
        // Показываем сообщение об ошибке пользователю
        showErrorMessage('Не удалось загрузить данные из базы данных. Проверьте подключение к серверу.');
    }
}

// Показ сообщения об ошибке
function showErrorMessage(message) {
    const resultContainer = document.querySelector('.result-container');
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(231, 76, 60, 0.95);
        color: white;
        padding: 20px;
        border-radius: 15px;
        z-index: 1000;
        text-align: center;
        font-family: 'Barlow', sans-serif;
        border: 2px solid #F0B429;
        max-width: 80%;
    `;
    errorDiv.innerHTML = `
        <h3>⚠️ Ошибка подключения к БД</h3>
        <p>${message}</p>
        <button onclick="location.reload()" style="
            margin-top: 15px;
            padding: 8px 20px;
            background: #F0B429;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
        ">Обновить страницу</button>
    `;
    document.body.appendChild(errorDiv);
}

// Инициализация после загрузки данных
function initializeAfterDataLoad() {
    // Создаем кнопки уровней
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
    
    // Устанавливаем обработчики событий
    setupEventListeners();
    
    // Устанавливаем начальные значения
    setCurrentLevel(1);
    setTargetLevel(1);
    updateSquares();
    updateResults();
    
    console.log('✅ Интерфейс инициализирован с данными из БД');
}

// Настройка обработчиков событий
function setupEventListeners() {
    btnPlus.addEventListener('click', () => setCurrentLevel(currentLevel + 1));
    btnMinus.addEventListener('click', () => setCurrentLevel(currentLevel - 1));
    targetPlus.addEventListener('click', () => setTargetLevel(targetLevel + 1));
    targetMinus.addEventListener('click', () => setTargetLevel(targetLevel - 1));
    
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
        updateResults();
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
        updateResults();
        updateProgressBars();
    });
    
    // Кнопки редкости
    const rarityBtns = document.querySelectorAll('.rarity-btn');
    
    function setActiveRarity(activeBtn) {
        rarityBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }
    
    rarityBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            setActiveRarity(this);
            
            if (this.classList.contains('btn-common')) currentRarity = 'common';
            else if (this.classList.contains('btn-rare')) currentRarity = 'rare';
            else if (this.classList.contains('btn-epic')) currentRarity = 'epic';
            else if (this.classList.contains('btn-legendary')) currentRarity = 'legendary';
            else if (this.classList.contains('btn-champion')) currentRarity = 'champion';
            
            updateResults();
            updateProgressBars();
        });
    });
    
    // Устанавливаем активную кнопку по умолчанию
    const defaultRarityBtn = document.querySelector('.btn-common');
    if (defaultRarityBtn) {
        setActiveRarity(defaultRarityBtn);
    }
}

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
    // Проверяем, загружены ли данные
    if (!dataLoaded || !upgradeCosts || !upgradeCosts[currentRarity]) {
        console.warn('Данные еще не загружены');
        return { 
            neededCards: 0, 
            neededGold: 0, 
            neededGems: 0, 
            remainingCards: 0, 
            remainingGold: 0 
        };
    }
    
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
            if (costs.gems && i < costs.gems.length) {
                totalNeededGems += costs.gems[i] || 0;
            }
        }
    }
    
    let remainingCards = Math.max(0, totalNeededCards - currentCards);
    let remainingGold = Math.max(0, totalNeededGold - currentGold);
    
    return { 
        neededCards: totalNeededCards,
        neededGold: totalNeededGold,
        neededGems: totalNeededGems,
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

    if (cardsProgressFill) cardsProgressFill.style.width = `${cardsPercentValue}%`;
    if (goldProgressFill) goldProgressFill.style.width = `${goldPercentValue}%`;
    if (cardsPercent) cardsPercent.textContent = `${Math.round(cardsPercentValue)}%`;
    if (goldPercent) goldPercent.textContent = `${Math.round(goldPercentValue)}%`;
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
    updateResults();
}

function updateResults() {
    const { remainingCards, remainingGold, neededGems } = calculateNeededResources();
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

// ЗАПУСКАЕМ ЗАГРУЗКУ ДАННЫХ
loadDataFromDB();