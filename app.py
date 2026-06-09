from flask import Flask, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, QuantityCards, QuantityGold

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

# Подключение к БД
DATABASE_URL = 'sqlite:///royalstats.db'
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
Session = sessionmaker(bind=engine)
session = Session()

Base.metadata.create_all(engine)

@app.route('/')
def index():
    return app.send_static_file('calculator.html')

@app.route('/api/all-costs', methods=['GET'])
def get_all_costs():
    gold_data = session.query(QuantityGold).order_by(QuantityGold.level).all()
    cards_data = session.query(QuantityCards).order_by(QuantityCards.level).all()
    
    rarity_map = {
        'common': 'common',
        'rare': 'rare', 
        'epic': 'epic',
        'legendary': 'legendary',
        'champion': 'champions'
    }
    
    upgrade_costs = {}
    for rarity_key, db_field in rarity_map.items():
        cards = [0]
        gold = [0]
        
        for level in range(1, 17):
            cards_val = next((getattr(c, db_field) for c in cards_data if c.level == level), 0)
            gold_val = next((getattr(g, db_field) for g in gold_data if g.level == level), 0)
            cards.append(cards_val)
            gold.append(gold_val)
        
        upgrade_costs[rarity_key] = {
            'cards': cards,
            'gold': gold,
            'gems': [0] * 17
        }
    
    return jsonify(upgrade_costs)

if __name__ == '__main__':
    print("🚀 Сервер запущен: http://localhost:5000")
    app.run(debug=True, port=5000)