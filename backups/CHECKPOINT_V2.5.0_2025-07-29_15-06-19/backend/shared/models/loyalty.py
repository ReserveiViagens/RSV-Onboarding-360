from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class LoyaltyTier(Base):
    __tablename__ = "loyalty_tiers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    min_points = Column(Integer, nullable=False)
    max_points = Column(Integer, nullable=True)
    benefits = Column(Text, nullable=True)  # JSON string of benefits
    discount_percentage = Column(Float, default=0.0)
    free_shipping = Column(Boolean, default=False)
    priority_support = Column(Boolean, default=False)
    exclusive_offers = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class UserLoyalty(Base):
    __tablename__ = "user_loyalty"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    tier_id = Column(Integer, ForeignKey("loyalty_tiers.id"), nullable=False)
    points_balance = Column(Integer, default=0)
    lifetime_points = Column(Integer, default=0)
    tier_start_date = Column(DateTime, default=datetime.utcnow)
    tier_expiry_date = Column(DateTime, nullable=True)
    status = Column(String(20), default="active")  # active, suspended, expired
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class LoyaltyTransaction(Base):
    __tablename__ = "loyalty_transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    transaction_type = Column(String(20), nullable=False)  # earned, spent, expired, bonus
    points = Column(Integer, nullable=False)
    description = Column(Text, nullable=True)
    order_id = Column(Integer, nullable=True)
    campaign_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class LoyaltyCampaign(Base):
    __tablename__ = "loyalty_campaigns"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    points_multiplier = Column(Float, default=1.0)
    bonus_points = Column(Integer, default=0)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True)
    applicable_tiers = Column(Text, nullable=True)  # JSON array of tier IDs
    created_at = Column(DateTime, default=datetime.utcnow) 