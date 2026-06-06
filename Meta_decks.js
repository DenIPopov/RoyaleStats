document.addEventListener('DOMContentLoaded', () => {
  const arenaSelect = document.querySelector('.meta_arena-select');
  const btnMinus = document.querySelector('.meta_btn-minus');
  const btnPlus = document.querySelector('.meta_btn-plus');

  if (arenaSelect) {
    arenaSelect.addEventListener('change', (e) => {
      console.log(`Выбрана арена: ${e.target.options[e.target.selectedIndex].text}`);
    });
  }

  if (btnMinus) {
    btnMinus.addEventListener('click', () => {
      console.log('Нажата кнопка "–" (предыдущая колода)');
    });
  }
  if (btnPlus) {
    btnPlus.addEventListener('click', () => {
      console.log('Нажата кнопка "+" (следующая колода)');
    });
  }
});