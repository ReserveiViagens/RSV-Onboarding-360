from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Float
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Video(Base):
    __tablename__ = "videos"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    file_name = Column(String(500), nullable=False)
    file_path = Column(String(1000), nullable=False)
    file_size = Column(Integer, nullable=False)
    duration_seconds = Column(Integer, nullable=True)
    resolution = Column(String(20), nullable=True)  # 720p, 1080p, 4K, etc.
    format = Column(String(20), nullable=True)  # mp4, avi, mov, etc.
    video_type = Column(String(50), nullable=False)  # promotional, tutorial, review, live, etc.
    category = Column(String(50), nullable=True)  # travel, hotel, restaurant, attraction, etc.
    tags = Column(Text, nullable=True)  # JSON array of tags
    thumbnail_path = Column(String(1000), nullable=True)
    is_public = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    view_count = Column(Integer, default=0)
    like_count = Column(Integer, default=0)
    dislike_count = Column(Integer, default=0)
    rating = Column(Float, nullable=True)
    status = Column(String(20), default="active")  # active, processing, error, deleted
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    related_location_id = Column(Integer, nullable=True)
    related_booking_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class VideoPlaylist(Base):
    __tablename__ = "video_playlists"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    playlist_type = Column(String(50), nullable=False)  # curated, user_created, auto_generated
    is_public = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    view_count = Column(Integer, default=0)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class VideoPlaylistItem(Base):
    __tablename__ = "video_playlist_items"
    
    id = Column(Integer, primary_key=True, index=True)
    playlist_id = Column(Integer, ForeignKey("video_playlists.id"), nullable=False)
    video_id = Column(Integer, ForeignKey("videos.id"), nullable=False)
    position = Column(Integer, nullable=False)
    added_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    added_at = Column(DateTime, default=datetime.utcnow)

class VideoView(Base):
    __tablename__ = "video_views"
    
    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(Integer, ForeignKey("videos.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    session_id = Column(String(100), nullable=True)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(Text, nullable=True)
    view_duration_seconds = Column(Integer, nullable=True)
    is_completed = Column(Boolean, default=False)
    viewed_at = Column(DateTime, default=datetime.utcnow)

class VideoLike(Base):
    __tablename__ = "video_likes"
    
    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(Integer, ForeignKey("videos.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    like_type = Column(String(20), default="like")  # like, dislike
    created_at = Column(DateTime, default=datetime.utcnow)

class VideoComment(Base):
    __tablename__ = "video_comments"
    
    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(Integer, ForeignKey("videos.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    parent_comment_id = Column(Integer, ForeignKey("video_comments.id"), nullable=True)
    comment_text = Column(Text, nullable=False)
    is_approved = Column(Boolean, default=True)
    is_edited = Column(Boolean, default=False)
    like_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class VideoShare(Base):
    __tablename__ = "video_shares"
    
    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(Integer, ForeignKey("videos.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    share_platform = Column(String(50), nullable=False)  # facebook, twitter, email, whatsapp, etc.
    share_url = Column(String(500), nullable=True)
    shared_at = Column(DateTime, default=datetime.utcnow) 