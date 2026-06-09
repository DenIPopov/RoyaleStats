from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

# SQLite база данных (файл royalestats.db создастся автоматически)
DATABASE_URL = "sqlite:///royalestats.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# Таблица: количество карт для прокачки
class QuantityCards(Base):
    __tablename__ = "quantity_cards"
    
    level = Column(Integer, primary_key=True)
    common = Column(Integer, nullable=False)
    rare = Column(Integer, nullable=False)
    epic = Column(Integer, nullable=False)
    legendary = Column(Integer, nullable=False)
    champions = Column(Integer, nullable=False)

# Таблица: количество золота для прокачки
class QuantityGold(Base):
    __tablename__ = "quantity_gold"
    
    level = Column(Integer, primary_key=True)
    common = Column(Integer, nullable=False)
    rare = Column(Integer, nullable=False)
    epic = Column(Integer, nullable=False)
    legendary = Column(Integer, nullable=False)
    champions = Column(Integer, nullable=False)

# Таблица: игроки (главная)
class Player(Base):
    __tablename__ = "players"
    
    id = Column(Integer, primary_key=True)
    tag = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    exp_level = Column(Integer, default=1)
    trophies = Column(Integer, default=0)
    best_trophies = Column(Integer, default=0)
    wins = Column(Integer, default=0)
    losses = Column(Integer, default=0)
    battle_count = Column(Integer, default=0)
    three_crown_wins = Column(Integer, default=0)
    challenge_cards_won = Column(Integer, default=0)
    challenge_max_wins = Column(Integer, default=0)
    tournament_cards_won = Column(Integer, default=0)
    tournament_battle_count = Column(Integer, default=0)
    clan_name = Column(String, nullable=True)
    clan_role = Column(String, nullable=True)
    donations = Column(Integer, default=0)
    donations_received = Column(Integer, default=0)
    total_donations = Column(Integer, default=0)
    war_day_wins = Column(Integer, default=0)
    current_streak = Column(Integer, default=0)
    arena_name = Column(String, nullable=True)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
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
    rarity = Column(String, nullable=False)
    
    players = relationship("PlayerCard", back_populates="card")

if __name__ == "__main__":
    Base.metadata.create_all(engine)
    print("✅ Таблицы созданы в файле royalestats.db")