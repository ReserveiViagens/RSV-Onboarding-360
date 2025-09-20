import sys
import os

# Adiciona raiz do projeto ao path para imports relativos
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from shared.config.database import Base
from datetime import datetime

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    event_name = Column(String, index=True, nullable=False)
    event_date = Column(DateTime, nullable=False)
    price = Column(Float, nullable=False)
    customer_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow) 