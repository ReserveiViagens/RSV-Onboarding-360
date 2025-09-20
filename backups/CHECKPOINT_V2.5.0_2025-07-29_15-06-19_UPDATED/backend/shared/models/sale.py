from sqlalchemy import Column, Integer, Float, DateTime
from backend.shared.config.database import Base
from datetime import datetime

class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, nullable=False)
    sale_date = Column(DateTime, default=datetime.utcnow)
    amount = Column(Float, nullable=False)
    customer_id = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow) 