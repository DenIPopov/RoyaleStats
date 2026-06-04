from flask import Flask, request, jsonify
from flask_cors import CORS
from models import SessionLocal, Upgrade

app = Flask(__name__)
CORS(app)

@app.route('/api/upgrade', methods=['POST'])
def calculate_upgrade():
    data = request.json
    current_level = data.get('current_level')
    target_level = data.get('target_level')

    if not current_level or not target_level:
        return jsonify({"error": "Не хватает данных"}), 400

    session = SessionLocal()
    
    total_gold = 0
    total_cards = 0
    total_crystals = 0

    # Суммируем стоимость с текущего уровня до целевого
    for level in range(current_level, target_level):
        upgrade = session.query(Upgrade).filter_by(level=level).first()
        if upgrade:
            total_gold += upgrade.cost_gold
            total_cards += upgrade.cost_cards
            total_crystals += upgrade.cost_cristals

    session.close()

    return jsonify({
        "gold_needed": total_gold,
        "cards_needed": total_cards,
        "crystals_needed": total_crystals,
        "levels_needed": target_level - current_level
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)