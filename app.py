from flask import Flask, request, jsonify
from flask_cors import CORS
from models import SessionLocal, Card, QuantityCards, QuantityGold

app = Flask(__name__)
CORS(app)

@app.route('/api/upgrade', methods=['POST'])
def calculate_upgrade():
    data = request.json
    card_id = data.get('card_id')
    current_level = data.get('current_level')
    target_level = data.get('target_level')

    if not card_id or not current_level or not target_level:
        return jsonify({"error": "Не хватает данных"}), 400

    session = SessionLocal()

    # Получаем карту
    card = session.query(Card).filter_by(id=card_id).first()
    if not card:
        session.close()
        return jsonify({"error": "Карта не найдена"}), 404

    rarity = card.rarity
    total_gold = 0
    total_cards = 0

    # Суммируем стоимость с текущего уровня до целевого
    for level in range(current_level, target_level):
        # Получаем количество карт для этого уровня
        cards_q = session.query(QuantityCards).filter_by(level=level).first()
        if cards_q:
            total_cards += getattr(cards_q, rarity)
        
        # Получаем количество золота для этого уровня
        gold_q = session.query(QuantityGold).filter_by(level=level).first()
        if gold_q:
            total_gold += getattr(gold_q, rarity)

    session.close()

    return jsonify({
        "card_name": card.name,
        "rarity": rarity,
        "gold_needed": total_gold,
        "cards_needed": total_cards,
        "levels_needed": target_level - current_level
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)