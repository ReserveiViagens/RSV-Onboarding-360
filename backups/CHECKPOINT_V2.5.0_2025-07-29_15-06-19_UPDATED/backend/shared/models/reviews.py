from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Float
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Review(Base):
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    review_type = Column(String(50), nullable=False)  # hotel, restaurant, attraction, service, etc.
    entity_id = Column(Integer, nullable=False)  # ID do hotel, restaurante, etc.
    entity_type = Column(String(50), nullable=False)  # hotel, restaurant, attraction, etc.
    rating = Column(Float, nullable=False)  # 1-5 stars
    title = Column(String(200), nullable=True)
    review_text = Column(Text, nullable=False)
    review_date = Column(DateTime, nullable=False)
    visit_date = Column(DateTime, nullable=True)
    is_verified_visit = Column(Boolean, default=False)
    is_helpful = Column(Boolean, default=False)
    helpful_count = Column(Integer, default=0)
    is_approved = Column(Boolean, default=True)
    is_edited = Column(Boolean, default=False)
    edit_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ReviewCategory(Base):
    __tablename__ = "review_categories"
    
    id = Column(Integer, primary_key=True, index=True)
    review_id = Column(Integer, ForeignKey("reviews.id"), nullable=False)
    category_name = Column(String(100), nullable=False)  # cleanliness, service, location, etc.
    rating = Column(Float, nullable=False)  # 1-5 stars
    weight = Column(Float, default=1.0)  # Peso da categoria no rating geral

class ReviewImage(Base):
    __tablename__ = "review_images"
    
    id = Column(Integer, primary_key=True, index=True)
    review_id = Column(Integer, ForeignKey("reviews.id"), nullable=False)
    image_path = Column(String(1000), nullable=False)
    image_caption = Column(String(200), nullable=True)
    is_approved = Column(Boolean, default=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

class ReviewLike(Base):
    __tablename__ = "review_likes"
    
    id = Column(Integer, primary_key=True, index=True)
    review_id = Column(Integer, ForeignKey("reviews.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    like_type = Column(String(20), default="helpful")  # helpful, not_helpful
    created_at = Column(DateTime, default=datetime.utcnow)

class ReviewComment(Base):
    __tablename__ = "review_comments"
    
    id = Column(Integer, primary_key=True, index=True)
    review_id = Column(Integer, ForeignKey("reviews.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    parent_comment_id = Column(Integer, ForeignKey("review_comments.id"), nullable=True)
    comment_text = Column(Text, nullable=False)
    is_approved = Column(Boolean, default=True)
    is_edited = Column(Boolean, default=False)
    like_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ReviewReport(Base):
    __tablename__ = "review_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    review_id = Column(Integer, ForeignKey("reviews.id"), nullable=False)
    reported_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    report_reason = Column(String(100), nullable=False)  # spam, inappropriate, fake, etc.
    report_description = Column(Text, nullable=True)
    status = Column(String(20), default="pending")  # pending, reviewed, resolved, dismissed
    admin_notes = Column(Text, nullable=True)
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ReviewResponse(Base):
    __tablename__ = "review_responses"
    
    id = Column(Integer, primary_key=True, index=True)
    review_id = Column(Integer, ForeignKey("reviews.id"), nullable=False)
    responder_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    responder_type = Column(String(20), nullable=False)  # owner, manager, staff, admin
    response_text = Column(Text, nullable=False)
    is_public = Column(Boolean, default=True)
    is_approved = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ReviewAnalytics(Base):
    __tablename__ = "review_analytics"
    
    id = Column(Integer, primary_key=True, index=True)
    entity_id = Column(Integer, nullable=False)
    entity_type = Column(String(50), nullable=False)
    total_reviews = Column(Integer, default=0)
    average_rating = Column(Float, default=0.0)
    rating_distribution = Column(Text, nullable=True)  # JSON object with 1-5 star counts
    category_ratings = Column(Text, nullable=True)  # JSON object with category averages
    helpful_reviews_count = Column(Integer, default=0)
    verified_reviews_count = Column(Integer, default=0)
    last_review_date = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow) 