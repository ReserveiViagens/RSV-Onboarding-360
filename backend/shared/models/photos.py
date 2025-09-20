from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.sql import func
from shared.config.database import Base

class Photo(Base):
    __tablename__ = "photos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    photo_url = Column(String, nullable=False)
    thumbnail_url = Column(String)
    original_filename = Column(String)
    file_size_mb = Column(Float)
    width = Column(Integer)
    height = Column(Integer)
    format = Column(String)  # jpg, png, gif, etc
    camera_model = Column(String)
    camera_settings = Column(Text)  # JSON with ISO, aperture, etc
    location_latitude = Column(Float)
    location_longitude = Column(Float)
    taken_at = Column(DateTime)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    album_id = Column(Integer, ForeignKey("photo_albums.id"))
    view_count = Column(Integer, default=0)
    like_count = Column(Integer, default=0)
    comment_count = Column(Integer, default=0)
    download_count = Column(Integer, default=0)
    share_count = Column(Integer, default=0)
    is_public = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    tags = Column(Text)  # JSON array of tags
    color_palette = Column(Text)  # JSON with dominant colors
    upload_status = Column(String, default="processing")  # processing, completed, failed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class PhotoAlbum(Base):
    __tablename__ = "photo_albums"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    cover_photo_id = Column(Integer, ForeignKey("photos.id"))
    photo_count = Column(Integer, default=0)
    is_public = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    view_count = Column(Integer, default=0)
    like_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class PhotoAlbumItem(Base):
    __tablename__ = "photo_album_items"

    id = Column(Integer, primary_key=True, index=True)
    album_id = Column(Integer, ForeignKey("photo_albums.id"), nullable=False)
    photo_id = Column(Integer, ForeignKey("photos.id"), nullable=False)
    position = Column(Integer, nullable=False)
    added_at = Column(DateTime(timezone=True), server_default=func.now())

class PhotoView(Base):
    __tablename__ = "photo_views"

    id = Column(Integer, primary_key=True, index=True)
    photo_id = Column(Integer, ForeignKey("photos.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))  # can be null for anonymous views
    ip_address = Column(String)
    device_type = Column(String)  # mobile, desktop, tablet
    browser = Column(String)
    location = Column(String)  # country/city
    viewed_at = Column(DateTime(timezone=True), server_default=func.now())

class PhotoLike(Base):
    __tablename__ = "photo_likes"

    id = Column(Integer, primary_key=True, index=True)
    photo_id = Column(Integer, ForeignKey("photos.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class PhotoComment(Base):
    __tablename__ = "photo_comments"

    id = Column(Integer, primary_key=True, index=True)
    photo_id = Column(Integer, ForeignKey("photos.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    parent_comment_id = Column(Integer, ForeignKey("photo_comments.id"))  # for replies
    content = Column(Text, nullable=False)
    like_count = Column(Integer, default=0)
    reply_count = Column(Integer, default=0)
    is_edited = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class PhotoDownload(Base):
    __tablename__ = "photo_downloads"

    id = Column(Integer, primary_key=True, index=True)
    photo_id = Column(Integer, ForeignKey("photos.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))  # can be null for anonymous downloads
    download_type = Column(String, nullable=False)  # original, medium, small
    ip_address = Column(String)
    downloaded_at = Column(DateTime(timezone=True), server_default=func.now())

class PhotoShare(Base):
    __tablename__ = "photo_shares"

    id = Column(Integer, primary_key=True, index=True)
    photo_id = Column(Integer, ForeignKey("photos.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))  # can be null for anonymous shares
    platform = Column(String, nullable=False)  # facebook, twitter, instagram, email, etc
    shared_url = Column(String)
    ip_address = Column(String)
    shared_at = Column(DateTime(timezone=True), server_default=func.now())