const MODAL_DATA = {
    hero: {
        icon: '👑',
        iconBg: '#2a1a3a',
        tag: 'Новый герой',
        tagClass: 'news-tag--new',
        title: 'Геройское Надгробие (Hero Tombstone)',
        date: '1 июня 2026 — событие Undead Bazaar',
        desc: 'Первый герой-здание в Clash Royale. Редкий герой, который вместо обычного здания призывает мощную Королеву гробниц.',
        items: [
            { icon: '💰', text: 'Стоимость: 4 эликсира' },
            { icon: '🏛️', text: 'Тип: герой-здание' },
            { icon: '👸', text: 'Способность «Королевское возрождение» (6 эликсира): призывает Королеву гробниц с 3072 HP' },
            { icon: '💀', text: 'Королева гробниц атакует здания и каждые 5 сек призывает 2 скелетов' },
            { icon: '⚡', text: 'Если активировать способность в течение 1.5 сек после разрушения здания — эффект всё равно сработает' },
            { icon: '🎁', text: 'Как получить: бесплатно на живом событии «Undead Bazaar»' }
        ]
    },
    evo: {
        icon: '❄️',
        iconBg: '#4013AF',
        tag: 'Новая эволюция',
        tagClass: 'news-tag--new',
        title: 'Эволюция Принцессы (Princess Evolution)',
        desc: 'Принцесса получает ледяную эволюцию. Её стрелы замедляют врагов, а при смерти она оставляет ледяную лужу.',
        items: [
            { icon: '🔄', text: 'Цикл эволюции: 2 (каждое 3-е применение)' },
            { icon: '🧊', text: 'Ледяные стрелы: первый и каждый третий выстрел создают область замедления (-30% скорости атаки и передвижения)' },
            { icon: '⏱️', text: 'Длительность замедления: 7 секунд' },
            { icon: '💀', text: 'При смерти: выпускает ледяную область, замедляющую врагов на 3.5 секунды' },
            { icon: '📏', text: 'Радиус замедления: 3 клетки' }
        ]
    },
    nerf: {
        icon: '📉',
        iconBg: '#3A0A0A',
        tag: 'Нёрфы патча 84.1',
        tagClass: 'news-tag--balance',
        title: 'Ослабления заклинаний и карт',
        date: '3 июня 2026',
        desc: 'Главная цель этого сезона — снизить эффективность заклинаний по башням. Также нерф получили некоторые эволюции и герои.',
        items: [
            { icon: '🔥', text: 'Огненный шар: урон по башням 207 → 172' },
            { icon: '⚡', text: 'Молния: урон по башням снижен (примерно на 15%)' },
            { icon: '🚀', text: 'Ракета: урон по башням 371 → 343' },
            { icon: '🌍', text: 'Землетрясение: урон по башням снижен' },
            { icon: '☠️', text: 'Яд и Стрелы: урон по башням также снижен' },
            { icon: '💀', text: 'Кладбище: призывает 12 скелетов вместо 13' },
            { icon: '👑', text: 'Геройский Воздушный Шар: урон скелетроопера снижен' },
            { icon: '🦹', text: 'Эволюция Мега-Рыцарь: отбрасывание тяжёлых целей 4 → 2.5 клеток' },
            { icon: '🐉', text: 'Эволюция Инферно Дракон: длительность усиления уменьшена' }
        ]
    },
    buff: {
        icon: '📈',
        iconBg: '#0A2A0A',
        tag: 'Баффы патча 84.1',
        tagClass: 'news-tag--new',
        title: 'Усиленные карты',
        date: '3 июня 2026',
        desc: 'Несколько карт получили усиления, чтобы разнообразить мету и дать им больше шансов против заклинаний.',
        items: [
            { icon: '🏹', text: 'Эволюция Дротикового Гоблина: увеличен урон ядом' },
            { icon: '⚡', text: 'Электро-Дракон: здоровье 998 → 1049' },
            { icon: '🟢', text: 'Гоблин-Гигант: здоровье 3020 → 3110' },
            { icon: '🛡️', text: 'Стартовые усиленные карты сезона: Принцесса, Надгробие, Банда Гоблинов, Гоблин-Бочка (+1 уровень в бою)' }
        ]
    },
    event: {
        icon: '⚡',
        iconBg: '#1A0C3A',
        tag: 'Календарь ивентов',
        tagClass: 'news-tag--event',
        title: 'События сезона Stone Cold',
        date: '1 июня — 6 июля 2026',
        desc: 'Насыщенная программа: ивенты, режимы, Охоты за коронами и клановые путешествия.',
        items: [
            { icon: '🏪', text: 'Undead Bazaar (1 июня – 6 июля): главное событие сезона, магазин за Могильные жетоны, главный приз — Геройское Надгробие' },
            { icon: '♟️', text: 'Princess Gambit (10–20 июня): соревновательный ивент без Королевских башен, колода из случайных 40 карт' },
            { icon: '🛡️', text: 'Неделя 1 (1–8 июня): Evo Princess Draft — тест новой эволюции' },
            { icon: '🏆', text: 'Неделя 2 и 4: Victory Run — режим победной серии' },
            { icon: '🧟', text: 'Неделя 3 (22–29 июня): Restless Undead — тематический режим с нежитью' },
            { icon: '💧', text: 'Глобальный турнир (2–6 июня): 3x Elixir — тройной эликсир' },
            { icon: '🏴‍☠️', text: 'Охоты за коронами: 1–8 июня (Принцесса), 15–22 июня (Надгробие), 29 июня – 6 июля (Clash Royale League World Cup)' },
            { icon: '⚓', text: 'Clan Voyage: 12–15 июня и 26–29 июня' }
        ]
    },
    fix: {
        icon: '🔧',
        iconBg: '#0C2A5E',
        tag: 'Исправления',
        tagClass: 'news-tag--balance',
        title: 'Фикс багов патча 84.0.1',
        date: '2 июня 2026',
        desc: 'Горячий фикс, исправляющий критические проблемы, обнаруженные в первый день сезона.',
        items: [
            { icon: '🎯', text: 'Арбалет — исправлен баг с перецеливанием после уничтожения цели' },
            { icon: '🐉', text: 'Инферно-дракон — луч теперь корректно прерывается при заморозке' },
            { icon: '💥', text: 'Исправлены вылеты на устройствах с iOS 16 при загрузке матча' },
            { icon: '🎨', text: 'Исправлены визуальные баги анимаций некоторых карт' },
            { icon: '🔊', text: 'Устранены проблемы с дублированием звуков' }
        ]
    }
};

function openModal(type) {
    const data = MODAL_DATA[type];
    if (!data) return;
    document.getElementById('modalIcon').textContent = data.icon;
    document.getElementById('modalIcon').style.background = data.iconBg;
    document.getElementById('modalTag').textContent = data.tag;
    document.getElementById('modalTag').className = 'modal__tag news-tag ' + data.tagClass;
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalDate').textContent = data.date;
    document.getElementById('modalDesc').textContent = data.desc;
    const list = document.getElementById('modalList');
    list.innerHTML = data.items.map(item => `
        <div class="modal__item">
            <span class="modal__item-icon">${item.icon}</span>
            <span>${item.text}</span>
        </div>
    `).join('');
    document.getElementById('modalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeModal(e) {
    if (e.target === document.getElementById('modalOverlay')) {
        closeModalBtn();
    }
}
function closeModalBtn() {
    document.getElementById('modalOverlay').classList.remove('active');
    document.body.style.overflow = '';
}
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModalBtn();
});