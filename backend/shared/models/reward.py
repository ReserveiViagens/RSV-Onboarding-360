from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Reward(Base):
    __tablename__ = "rewards"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    points_required = Column(Integer, nullable=False)
    reward_type = Column(String(50), nullable=False)  # discount, free_product, cashback, gift_card
    reward_value = Column(Float, nullable=False)
    is_active = Column(Boolean, default=True)
    max_redemptions = Column(Integer, nullable=True)
    current_redemptions = Column(Integer, default=0)
    valid_from = Column(DateTime, nullable=True)
    valid_until = Column(DateTime, nullable=True)
    image_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class UserReward(Base):
    __tablename__ = "user_rewards"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    reward_id = Column(Integer, ForeignKey("rewards.id"), nullable=False)
    points_spent = Column(Integer, nullable=False)
    redeemed_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20), default="active")  # active, used, expired
    used_at = Column(DateTime, nullable=True)
    order_id = Column(Integer, nullable=True)

class UserPoints(Base):
    __tablename__ = "user_points"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    points = Column(Integer, default=0)
    total_earned = Column(Integer, default=0)
    total_spent = Column(Integer, default=0)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class PointsTransaction(Base):
    __tablename__ = "points_transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    transaction_type = Column(String(20), nullable=False)  # earned, spent, expired
    points = Column(Integer, nullable=False)
    description = Column(Text, nullable=True)
    order_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow) 