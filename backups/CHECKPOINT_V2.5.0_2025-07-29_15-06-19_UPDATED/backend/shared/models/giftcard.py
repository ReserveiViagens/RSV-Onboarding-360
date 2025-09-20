from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class GiftCard(Base):
    __tablename__ = "gift_cards"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(20), nullable=False, unique=True, index=True)
    amount = Column(Float, nullable=False)
    balance = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    status = Column(String(20), default="active")  # active, used, expired, cancelled
    recipient_email = Column(String(255), nullable=True)
    sender_name = Column(String(100), nullable=True)
    sender_email = Column(String(255), nullable=True)
    message = Column(Text, nullable=True)
    expires_at = Column(DateTime, nullable=True)
    used_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class GiftCardTransaction(Base):
    __tablename__ = "gift_card_transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    gift_card_id = Column(Integer, nullable=False)
    transaction_type = Column(String(20), nullable=False)  # purchase, usage, refund
    amount = Column(Float, nullable=False)
    description = Column(Text, nullable=True)
    order_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow) 