from flask import Flask, render_template, jsonify, request, send_from_directory
from flask_cors import CORS
from sqlalchemy import create_engine, Column, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

app = Flask(__name__)
CORS(app)

# Подключение к SQLite
DATABASE_URL = 'sqlite:///royalstats.db'

try:
    engine = create_engine(DATABASE_URL, echo=False)
    print(f"✅ Подключение к БД:  {DATABASE_URL}")
except Exception as e:
    print(f"❌ Ошибка: {e}")
    engine = None

Base = declarative_base()

class QuantityGold(Base):
    __tablename__ = "quantity_gold"
    
    level = Column(Integer, primary_key=True)
    common = Column(Integer, nullable=False)
    rare = Column(Integer, nullable=False)
    epic = Column(Integer, nullable=False)
    legendary = Column(Integer, nullable=False)
    champions = Column(Integer, nullable=False)

class QuantityCards(Base):
    __tablename__ = "quantity_cards"
    
    level = Column(Integer, primary_key=True)
    common = Column(Integer, nullable=False)
    rare = Column(Integer, nullable=False)
    epic = Column(Integer, nullable=False)
    legendary = Column(Integer, nullable=False)
    champions = Column(Integer, nullable=False)

def init_database():
    if engine is None:
        return False
    try:
        Base.metadata.create_all(engine)
        print("✅ Таблицы созданы")
        return True
    except Exception as e:
        print(f"❌ Ошибка: {e}")
        return False

if engine:
    Session = sessionmaker(bind=engine)
    session = Session()
    init_database()
else:
    session = None

# ============= МАРШРУТЫ ДЛЯ СТАТИЧЕСКИХ ФАЙЛОВ =============

@app.route('/')
def index():
    """Главная страница"""
    return send_from_directory('.', 'index.html')

@app.route('/calculator.html')
def calculator_page():
    """Страница калькулятора"""
    return send_from_directory('.', 'calculator.html')

@app.route('/player.html')
def player_page():
    """Страница базы знаний"""
    return send_from_directory('.', 'player.html')

@app.route('/Meta_decks.html')
def meta_decks_page():
    """Страница метовых колод"""
    return send_from_directory('.', 'Meta_decks.html')

@app.route('/news.html')
def news_page():
    """Страница нововведений"""
    return send_from_directory('.', 'news.html')

# Обслуживание CSS и других статических файлов
@app.route('/<path:filename>')
def serve_static_files(filename):
    """Обслуживание всех статических файлов (CSS, JS, изображения)"""
    # Проверяем, есть ли файл в текущей директории
    if os.path.exists(filename):
        return send_from_directory('.', filename)
    # Если файл в папке static
    elif os.path.exists(os.path.join('static', filename)):
        return send_from_directory('static', filename)
    else:
        return "File not found", 404

# Обслуживание CSS файлов из папки static
@app.route('/static/<path:filename>')
def serve_static(filename):
    """Обслуживание файлов из папки static"""
    return send_from_directory('static', filename)

# ============= API МАРШРУТЫ =============

@app.route('/api/all-costs', methods=['GET'])
def get_all_costs():
    if session is None:
        return jsonify({'error': 'Нет подключения к БД'}), 500
    
    try:
        gold_data = session.query(QuantityGold).order_by(QuantityGold.level).all()
        cards_data = session.query(QuantityCards).order_by(QuantityCards.level).all()
        
        if not gold_data or not cards_data:
            return jsonify({'error': 'Нет данных в таблицах'}), 404
        
        upgrade_costs = {
            'common': {'cards': [0], 'gold': [0], 'gems': [0]},
            'rare': {'cards': [0], 'gold': [0], 'gems': [0]},
            'epic': {'cards': [0], 'gold': [0], 'gems': [0]},
            'legendary': {'cards': [0], 'gold': [0], 'gems': [0]},
            'champion': {'cards': [0], 'gold': [0], 'gems': [0]}
        }
        
        # Маппинг: ключ из фронта -> поле в БД
        rarity_map = {
            'common': 'common',
            'rare': 'rare',
            'epic': 'epic',
            'legendary': 'legendary',
            'champion': 'champions'
        }
        
        # Заполняем данные по картам
        for card in cards_data:
            for rarity_key, db_field in rarity_map.items():
                upgrade_costs[rarity_key]['cards'].append(getattr(card, db_field))
        
        # Заполняем данные по золоту
        for gold in gold_data:
            for rarity_key, db_field in rarity_map.items():
                upgrade_costs[rarity_key]['gold'].append(getattr(gold, db_field))
        
        # Добавляем стоимость в гемах (опционально, можно заменить на реальные данные)
        gems_costs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]  # 16 уровней
        for rarity_key in upgrade_costs:
            upgrade_costs[rarity_key]['gems'] = gems_costs
        
        return jsonify(upgrade_costs)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Дополнительный API маршрут для проверки статуса
@app.route('/api/health', methods=['GET'])
def health_check():
    """Проверка состояния сервера"""
    return jsonify({
        'status': 'ok',
        'database': 'connected' if session else 'disconnected',
        'tables_exist': session.query(QuantityCards).count() > 0 if session else False
    })

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🚀 ЗАПУСК СЕРВЕРА ROYALSTATS")
    print("="*50)
    print(f"📁 Рабочая директория: {os.getcwd()}")
    print(f"🗄️  База данных: {DATABASE_URL}")
    print(f"🌐 Сервер запущен на: http://localhost:5000")
    print(f"📄 Главная страница: http://localhost:5000/")
    print(f"🧮 Калькулятор: http://localhost:5000/calculator.html")
    print("="*50)
    print("\n✨ Для остановки сервера нажмите Ctrl+C\n")
    
    app.run(debug=True, port=5000)