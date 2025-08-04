from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Translation(Base):
    __tablename__ = "translations"
    
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(200), nullable=False)
    language_code = Column(String(10), nullable=False)  # pt-BR, en-US, es-ES, etc.
    text = Column(Text, nullable=False)
    context = Column(String(100), nullable=True)  # page, component, etc.
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Language(Base):
    __tablename__ = "languages"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(10), nullable=False, unique=True)  # pt-BR, en-US, es-ES
    name = Column(String(100), nullable=False)  # Português, English, Español
    native_name = Column(String(100), nullable=False)  # Português, English, Español
    is_default = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow) 