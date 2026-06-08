from app import engine, Session, QuantityGold, QuantityCards, init_database
from sqlalchemy import text

def add_sample_data():
    """Добавление данных в таблицы"""
    session = Session()
    
    # Проверяем, есть ли уже данные
    existing_gold = session.query(QuantityGold).count()
    existing_cards = session.query(QuantityCards).count()
    
    if existing_gold > 0 or existing_cards > 0:
        print(f"⚠️ Найдены существующие данные:")
        print(f"   - quantity_gold: {existing_gold} записей")
        print(f"   - quantity_cards: {existing_cards} записей")
        response = input("Очистить таблицы перед добавлением? (y/n): ")
        if response.lower() == 'y':
            print("Очищаем таблицы...")
            session.query(QuantityGold).delete()
            session.query(QuantityCards).delete()
            session.commit()
            print("✅ Таблицы очищены")
        else:
            print("❌ Добавление данных отменено")
            session.close()
            return
    
    # Данные о количестве карт для прокачки
    cards_quantity_data = [
        (1, 1, 0, 0, 0, 0),
        (2, 2, 0, 0, 0, 0),
        (3, 4, 1, 0, 0, 0),
        (4, 10, 2, 0, 0, 0),
        (5, 20, 4, 0, 0, 0),
        (6, 50, 10, 1, 0, 0),
        (7, 100, 20, 2, 0, 0),
        (8, 200, 50, 4, 0, 0),
        (9, 400, 100, 10, 1, 0),
        (10, 800, 200, 20, 2, 0),
        (11, 1000, 300, 30, 4, 1),
        (12, 1500, 400, 50, 6, 2),
        (13, 2500, 550, 70, 9, 5),
        (14, 3500, 750, 100, 12, 8),
        (15, 5500, 1000, 130, 14, 11),
        (16, 7500, 1400, 180, 20, 15),
    ]
    
    print("\n📊 Добавление данных в таблицу quantity_cards...")
    for level, common, rare, epic, legendary, champions in cards_quantity_data:
        cards = QuantityCards(
            level=level,
            common=common,
            rare=rare,
            epic=epic,
            legendary=legendary,
            champions=champions
        )
        session.add(cards)
        print(f"   Уровень {level}: common={common}, rare={rare}, epic={epic}, legendary={legendary}, champions={champions}")
    
    # Данные о количестве золота для прокачки
    gold_quantity_data = [
        (1, 0, 0, 0, 0, 0),
        (2, 5, 0, 0, 0, 0),
        (3, 20, 0, 0, 0, 0),
        (4, 50, 50, 0, 0, 0),
        (5, 150, 150, 0, 0, 0),
        (6, 400, 400, 0, 0, 0),
        (7, 1000, 1000, 400, 0, 0),
        (8, 2000, 2000, 2000, 0, 0),
        (9, 4000, 4000, 4000, 0, 0),
        (10, 8000, 8000, 8000, 5000, 0),
        (11, 15000, 15000, 15000, 15000, 0),
        (12, 25000, 25000, 25000, 25000, 25000),
        (13, 40000, 40000, 40000, 40000, 40000),
        (14, 60000, 60000, 60000, 60000, 60000),
        (15, 90000, 90000, 90000, 90000, 90000),
        (16, 120000, 120000, 120000, 120000, 120000),
    ]
    
    print("\n💰 Добавление данных в таблицу quantity_gold...")
    for level, common, rare, epic, legendary, champions in gold_quantity_data:
        gold = QuantityGold(
            level=level,
            common=common,
            rare=rare,
            epic=epic,
            legendary=legendary,
            champions=champions
        )
        session.add(gold)
        print(f"   Уровень {level}: common={common}, rare={rare}, epic={epic}, legendary={legendary}, champions={champions}")
    
    # Сохраняем изменения
    try:
        session.commit()
        print("\n" + "="*50)
        print("✅ ДАННЫЕ УСПЕШНО ДОБАВЛЕНЫ!")
        print("="*50)
        print(f"📊 Добавлено {len(cards_quantity_data)} записей в quantity_cards")
        print(f"💰 Добавлено {len(gold_quantity_data)} записей в quantity_gold")
        print("="*50)
    except Exception as e:
        session.rollback()
        print(f"\n❌ Ошибка при добавлении данных: {e}")
    finally:
        session.close()

def verify_data():
    """Проверка добавленных данных"""
    session = Session()
    
    print("\n🔍 ПРОВЕРКА ДАННЫХ:")
    print("-"*50)
    
    # Проверяем данные по картам
    cards = session.query(QuantityCards).order_by(QuantityCards.level).all()
    print(f"\n📊 Таблица quantity_cards ({len(cards)} записей):")
    print("level | common | rare | epic | legendary | champions")
    print("-"*50)
    for c in cards:
        print(f"{c.level:5} | {c.common:6} | {c.rare:4} | {c.epic:4} | {c.legendary:9} | {c.champions:8}")
    
    # Проверяем данные по золоту
    gold = session.query(QuantityGold).order_by(QuantityGold.level).all()
    print(f"\n💰 Таблица quantity_gold ({len(gold)} записей):")
    print("level | common | rare | epic | legendary | champions")
    print("-"*50)
    for g in gold:
        print(f"{g.level:5} | {g.common:6} | {g.rare:4} | {g.epic:4} | {g.legendary:9} | {g.champions:8}")
    
    session.close()

if __name__ == "__main__":
    print("="*50)
    print("ИНИЦИАЛИЗАЦИЯ БАЗЫ ДАННЫХ ROYALSTATS")
    print("="*50)
    
    # Инициализируем базу данных
    init_database()
    
    # Добавляем данные
    add_sample_data()
    
    # Проверяем добавленные данные
    verify_data()
    
    print("\n✨ Готово! Теперь можно запускать сервер:")
    print("   python app.py")
    print("\n🌐 После запуска открой в браузере:")
    print("   http://localhost:5000")