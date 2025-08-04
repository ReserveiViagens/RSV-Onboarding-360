from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./rsv.db")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Dependency para obter sessão do banco de dados"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    # Import all models here before calling Base.metadata.create_all
    # This ensures they are registered with SQLAlchemy
    try:
        from shared.models import user, booking, property, product, ticket, park, attraction, inventory_item, sale, marketing_campaign, analytics, seo, translation, subscription, giftcard, coupon, reward
        Base.metadata.create_all(bind=engine)
        print("✅ Banco de dados inicializado com sucesso!")
    except ImportError as e:
        print(f"⚠️ Aviso: Alguns modelos não puderam ser importados: {e}")
        # Criar apenas as tabelas básicas
        Base.metadata.create_all(bind=engine) 