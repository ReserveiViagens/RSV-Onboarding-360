from sqlalchemy import Column, Integer, String
from shared.config.database import Base

class Park(Base):
    __tablename__ = "parks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    location = Column(String, nullable=False)
    description = Column(String) 