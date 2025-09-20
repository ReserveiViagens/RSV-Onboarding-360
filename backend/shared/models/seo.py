from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class SEO(Base):
    __tablename__ = "seo"
    
    id = Column(Integer, primary_key=True, index=True)
    page_url = Column(String(500), nullable=False, unique=True)
    title = Column(String(200), nullable=False)
    meta_description = Column(Text, nullable=True)
    meta_keywords = Column(Text, nullable=True)
    h1_tag = Column(String(200), nullable=True)
    h2_tags = Column(Text, nullable=True)  # JSON array of H2 tags
    canonical_url = Column(String(500), nullable=True)
    robots_txt = Column(String(50), default="index,follow")
    og_title = Column(String(200), nullable=True)
    og_description = Column(Text, nullable=True)
    og_image = Column(String(500), nullable=True)
    twitter_card = Column(String(50), default="summary")
    structured_data = Column(Text, nullable=True)  # JSON-LD structured data
    page_speed_score = Column(Integer, nullable=True)
    mobile_friendly = Column(Boolean, default=True)
    last_updated = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow) 