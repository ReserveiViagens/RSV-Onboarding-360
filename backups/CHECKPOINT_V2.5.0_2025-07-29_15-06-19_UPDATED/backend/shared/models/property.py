from sqlalchemy import Column, Integer, String, Float
from backend.shared.config.database import Base

class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    address = Column(String, nullable=False)
    price_per_night = Column(Float, nullable=False)
    description = Column(String) 