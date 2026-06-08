from flask import Flask, render_template, jsonify, request
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
    print(f"✅ Подключение к БД: {DATABASE_URL}")
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

@app.route('/')
def index():
    return render_template('calculator.html')

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
        
        return jsonify(upgrade_costs)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)