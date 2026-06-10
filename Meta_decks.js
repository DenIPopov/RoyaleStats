const decks = {
  arena1: [
    { img: "https://sun9-34.userapi.com/s/v1/ig2/xOJde9MaxaAuFoZ4JCAkQSqtL_fHgsJwW9R5DA7w3zpu_0TlkqNaeAbcTZfhYDmwbKr6iX7HQ-x3VyUh9WINellL.jpg?quality=95&as=32x30,48x44,72x67,108x100,160x148,240x222,360x333,480x444,540x500,640x593,720x667,1080x1000&from=bu&u=7zQaZal2eod3UsUB3FN10hwvRdzry_NxQDDyxDZEHzs&cs=1080x0", elixir: 2.9 },
    { img: "https://sun9-34.userapi.com/s/v1/ig2/xOJde9MaxaAuFoZ4JCAkQSqtL_fHgsJwW9R5DA7w3zpu_0TlkqNaeAbcTZfhYDmwbKr6iX7HQ-x3VyUh9WINellL.jpg?quality=95&as=32x30,48x44,72x67,108x100,160x148,240x222,360x333,480x444,540x500,640x593,720x667,1080x1000&from=bu&u=7zQaZal2eod3UsUB3FN10hwvRdzry_NxQDDyxDZEHzs&cs=1080x0", elixir: 3.8 },
    { img: "https://sun9-34.userapi.com/s/v1/ig2/xOJde9MaxaAuFoZ4JCAkQSqtL_fHgsJwW9R5DA7w3zpu_0TlkqNaeAbcTZfhYDmwbKr6iX7HQ-x3VyUh9WINellL.jpg?quality=95&as=32x30,48x44,72x67,108x100,160x148,240x222,360x333,480x444,540x500,640x593,720x667,1080x1000&from=bu&u=7zQaZal2eod3UsUB3FN10hwvRdzry_NxQDDyxDZEHzs&cs=1080x0", elixir: 4.1 },
  ],
  arena2: [
    { img: "decksImg/deck1Arena2.jpg", elixir: 2.8 },
    { img: "decksImg/deck2Arena2.jpg", elixir: 3.5 },
    { img: "decksImg/deck3Arena2.jpg", elixir: 3.9 },
  ],
  // ... добавляй остальные арены по той же схеме
};

let currentArena = null;
let deck3Index = 0;

const select    = document.querySelector('.meta_arena-select');
const deck3Wrap = document.querySelector('.meta_deck3-wrapper');

// Берём карточки по порядку через querySelectorAll
const deckItems = document.querySelectorAll('.meta_decks-row .meta_deck-item');
const slot1 = deckItems[0];
const slot2 = deckItems[1];
const slot3 = document.querySelector('.meta_deck3-item');

function showDeck(slot, deck) {
  slot.querySelector('img').src = deck.img;
  slot.querySelector('.meta_elixir').textContent = `Сред. стоимость: ${deck.elixir}`;
}

function render(arenaKey) {
  const list = decks[arenaKey];
  if (!list) return;
  showDeck(slot1, list[0]);
  showDeck(slot2, list[1]);
  showDeck(slot3, list[deck3Index]);
  deck3Wrap.style.display = 'flex';
}

select.addEventListener('change', e => {
  currentArena = e.target.value;
  deck3Index = 0;
  render(currentArena);
});

document.querySelector('.meta_btn-minus').addEventListener('click', () => {
  if (!currentArena) return;
  const len = decks[currentArena].length;
  deck3Index = (deck3Index - 1 + len) % len;
  showDeck(slot3, decks[currentArena][deck3Index]);
  slot3.querySelector('.meta_deck3-title').textContent = `Колода ${deck3Index + 1}`;
});

document.querySelector('.meta_btn-plus').addEventListener('click', () => {
  if (!currentArena) return;
  const len = decks[currentArena].length;
  deck3Index = (deck3Index + 1) % len;
  showDeck(slot3, decks[currentArena][deck3Index]);
  slot3.querySelector('.meta_deck3-title').textContent = `Колода ${deck3Index + 1}`;
});
