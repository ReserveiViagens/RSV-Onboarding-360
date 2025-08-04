from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Coupon(Base):
    __tablename__ = "coupons"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(20), nullable=False, unique=True, index=True)
    discount_type = Column(String(20), nullable=False)  # percentage, fixed_amount
    discount_value = Column(Float, nullable=False)
    minimum_purchase = Column(Float, nullable=True)
    maximum_discount = Column(Float, nullable=True)
    usage_limit = Column(Integer, nullable=True)  # total usage limit
    used_count = Column(Integer, default=0)
    user_limit = Column(Integer, nullable=True)  # usage limit per user
    valid_from = Column(DateTime, nullable=True)
    valid_until = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    description = Column(Text, nullable=True)
    applicable_products = Column(Text, nullable=True)  # JSON array of product IDs
    applicable_categories = Column(Text, nullable=True)  # JSON array of category IDs
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class CouponUsage(Base):
    __tablename__ = "coupon_usage"
    
    id = Column(Integer, primary_key=True, index=True)
    coupon_id = Column(Integer, nullable=False)
    user_id = Column(Integer, nullable=False)
    order_id = Column(Integer, nullable=False)
    discount_amount = Column(Float, nullable=False)
    used_at = Column(DateTime, default=datetime.utcnow) 