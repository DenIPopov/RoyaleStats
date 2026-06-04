from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Подключение к БД (замени на свои параметры)
DATABASE_URL = "postgresql://postgres:root_password@localhost:5432/royalestats"
# Для Supabase:
# DATABASE_URL = "postgresql://postgres:твой_пароль@db.xxxxxx.supabase.co:5432/postgres"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# Модель таблицы upgrade
class Upgrade(Base):
    __tablename__ = "upgrade"
    
    id = Column(Integer, primary_key=True)
    level = Column(Integer, nullable=False)
    cost_gold = Column(Integer, nullable=False)
    cost_cards = Column(Integer, nullable=False)
    cost_cristals = Column(Integer, nullable=False)

if __name__ == "__main__":
    Base.metadata.create_all(engine)
    print("Таблицы созданы!")