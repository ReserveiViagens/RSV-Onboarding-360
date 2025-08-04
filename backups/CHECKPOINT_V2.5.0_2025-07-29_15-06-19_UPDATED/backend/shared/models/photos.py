from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Float
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Photo(Base):
    __tablename__ = "photos"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    file_name = Column(String(500), nullable=False)
    file_path = Column(String(1000), nullable=False)
    file_size = Column(Integer, nullable=False)
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    format = Column(String(20), nullable=True)  # jpg, png, gif, etc.
    photo_type = Column(String(50), nullable=False)  # gallery, profile, cover, thumbnail, etc.
    category = Column(String(50), nullable=True)  # travel, hotel, restaurant, attraction, etc.
    tags = Column(Text, nullable=True)  # JSON array of tags
    is_public = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    is_approved = Column(Boolean, default=True)
    view_count = Column(Integer, default=0)
    like_count = Column(Integer, default=0)
    download_count = Column(Integer, default=0)
    rating = Column(Float, nullable=True)
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    related_location_id = Column(Integer, nullable=True)
    related_booking_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class PhotoAlbum(Base):
    __tablename__ = "photo_albums"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    album_type = Column(String(50), nullable=False)  # personal, shared, public, curated
    cover_photo_id = Column(Integer, ForeignKey("photos.id"), nullable=True)
    is_public = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    view_count = Column(Integer, default=0)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class PhotoAlbumItem(Base):
    __tablename__ = "photo_album_items"
    
    id = Column(Integer, primary_key=True, index=True)
    album_id = Column(Integer, ForeignKey("photo_albums.id"), nullable=False)
    photo_id = Column(Integer, ForeignKey("photos.id"), nullable=False)
    position = Column(Integer, nullable=False)
    added_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    added_at = Column(DateTime, default=datetime.utcnow)

class PhotoView(Base):
    __tablename__ = "photo_views"
    
    id = Column(Integer, primary_key=True, index=True)
    photo_id = Column(Integer, ForeignKey("photos.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    session_id = Column(String(100), nullable=True)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(Text, nullable=True)
    viewed_at = Column(DateTime, default=datetime.utcnow)

class PhotoLike(Base):
    __tablename__ = "photo_likes"
    
    id = Column(Integer, primary_key=True, index=True)
    photo_id = Column(Integer, ForeignKey("photos.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class PhotoComment(Base):
    __tablename__ = "photo_comments"
    
    id = Column(Integer, primary_key=True, index=True)
    photo_id = Column(Integer, ForeignKey("photos.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    parent_comment_id = Column(Integer, ForeignKey("photo_comments.id"), nullable=True)
    comment_text = Column(Text, nullable=False)
    is_approved = Column(Boolean, default=True)
    is_edited = Column(Boolean, default=False)
    like_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class PhotoDownload(Base):
    __tablename__ = "photo_downloads"
    
    id = Column(Integer, primary_key=True, index=True)
    photo_id = Column(Integer, ForeignKey("photos.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    download_type = Column(String(20), default="original")  # original, thumbnail, medium, large
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(Text, nullable=True)
    downloaded_at = Column(DateTime, default=datetime.utcnow)

class PhotoShare(Base):
    __tablename__ = "photo_shares"
    
    id = Column(Integer, primary_key=True, index=True)
    photo_id = Column(Integer, ForeignKey("photos.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    share_platform = Column(String(50), nullable=False)  # facebook, twitter, email, whatsapp, etc.
    share_url = Column(String(500), nullable=True)
    shared_at = Column(DateTime, default=datetime.utcnow) 