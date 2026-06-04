from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

# Подключение к БД (замени на свои параметры)
DATABASE_URL = "postgresql://postgres:root_password@localhost:5432/royalestats"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# Таблица: стоимость прокачки по уровням (общая)
class Upgrade(Base):
    __tablename__ = "upgrade"
    
    id = Column(Integer, primary_key=True)
    level = Column(Integer, nullable=False)
    cost_gold = Column(Integer, nullable=False)
    cost_cards = Column(Integer, nullable=False)
    cost_cristals = Column(Integer, nullable=False)

# Таблица: количество карт для прокачки по уровням и редкости
class QuantityCards(Base):
    __tablename__ = "quantity_cards"
    
    level = Column(Integer, primary_key=True)
    common = Column(Integer, nullable=False)
    rare = Column(Integer, nullable=False)
    epic = Column(Integer, nullable=False)
    legendary = Column(Integer, nullable=False)
    champions = Column(Integer, nullable=False)

# Таблица: количество золота для прокачки по уровням и редкости
class QuantityGold(Base):
    __tablename__ = "quantity_gold"
    
    level = Column(Integer, primary_key=True)
    common = Column(Integer, nullable=False)
    rare = Column(Integer, nullable=False)
    epic = Column(Integer, nullable=False)
    legendary = Column(Integer, nullable=False)
    champions = Column(Integer, nullable=False)

# Таблица: игроки
class Player(Base):
    __tablename__ = "players"
    
    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False)
    trophies = Column(Integer, nullable=False)

    # Связь с картами игрока
    cards = relationship("PlayerCard", back_populates="player")

# Таблица: карты игрока
class PlayerCard(Base):
    __tablename__ = "player_cards"
    
    player_id = Column(Integer, ForeignKey("players.id"), primary_key=True)
    card_id = Column(Integer, ForeignKey("cards.id"), primary_key=True)
    card_level = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)
    
    player = relationship("Player", back_populates="cards")
    card = relationship("Card", back_populates="players")

# Таблица: справочник карт
class Card(Base):
    __tablename__ = "cards"
    
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    card_type = Column(String, nullable=False)
    rarity = Column(String, nullable=False)  # common, rare, epic, legendary, champions
    
    players = relationship("PlayerCard", back_populates="card")

if __name__ == "__main__":
    Base.metadata.create_all(engine)
    print("Все таблицы созданы!")