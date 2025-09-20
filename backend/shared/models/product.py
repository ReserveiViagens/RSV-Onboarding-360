from sqlalchemy import Column, Integer, String, Float
from shared.config.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String)
    price = Column(Float, nullable=False)
    sku = Column(String, unique=True, index=True) # Stock Keeping Unit 