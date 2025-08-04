from sqlalchemy import Column, Integer, String
from backend.shared.config.database import Base

class Attraction(Base):
    __tablename__ = "attractions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    location = Column(String, nullable=False)
    description = Column(String) 