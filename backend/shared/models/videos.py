from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.sql import func
from shared.config.database import Base

class Video(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    video_url = Column(String, nullable=False)
    thumbnail_url = Column(String)
    duration_seconds = Column(Integer)
    file_size_mb = Column(Float)
    format = Column(String, default="mp4")
    resolution = Column(String)  # 720p, 1080p, 4K, etc
    category = Column(String)
    tags = Column(Text)  # JSON array of tags
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    view_count = Column(Integer, default=0)
    like_count = Column(Integer, default=0)
    dislike_count = Column(Integer, default=0)
    comment_count = Column(Integer, default=0)
    share_count = Column(Integer, default=0)
    is_public = Column(Boolean, default=True)
    is_monetized = Column(Boolean, default=False)
    is_live = Column(Boolean, default=False)
    language = Column(String, default="pt")
    upload_status = Column(String, default="processing")  # processing, completed, failed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class VideoPlaylist(Base):
    __tablename__ = "video_playlists"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_public = Column(Boolean, default=True)
    video_count = Column(Integer, default=0)
    total_duration_seconds = Column(Integer, default=0)
    thumbnail_url = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class VideoPlaylistItem(Base):
    __tablename__ = "video_playlist_items"

    id = Column(Integer, primary_key=True, index=True)
    playlist_id = Column(Integer, ForeignKey("video_playlists.id"), nullable=False)
    video_id = Column(Integer, ForeignKey("videos.id"), nullable=False)
    position = Column(Integer, nullable=False)
    added_at = Column(DateTime(timezone=True), server_default=func.now())

class VideoView(Base):
    __tablename__ = "video_views"

    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(Integer, ForeignKey("videos.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))  # can be null for anonymous views
    ip_address = Column(String)
    watch_duration_seconds = Column(Integer, default=0)
    completion_percentage = Column(Float, default=0.0)
    device_type = Column(String)  # mobile, desktop, tablet, tv
    browser = Column(String)
    location = Column(String)  # country/city
    viewed_at = Column(DateTime(timezone=True), server_default=func.now())

class VideoLike(Base):
    __tablename__ = "video_likes"

    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(Integer, ForeignKey("videos.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_like = Column(Boolean, nullable=False)  # True = like, False = dislike
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class VideoComment(Base):
    __tablename__ = "video_comments"

    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(Integer, ForeignKey("videos.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    parent_comment_id = Column(Integer, ForeignKey("video_comments.id"))  # for replies
    content = Column(Text, nullable=False)
    like_count = Column(Integer, default=0)
    reply_count = Column(Integer, default=0)
    is_pinned = Column(Boolean, default=False)
    is_edited = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class VideoShare(Base):
    __tablename__ = "video_shares"

    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(Integer, ForeignKey("videos.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))  # can be null for anonymous shares
    platform = Column(String, nullable=False)  # facebook, twitter, whatsapp, email, etc
    shared_url = Column(String)
    ip_address = Column(String)
    shared_at = Column(DateTime(timezone=True), server_default=func.now())