from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None

class User(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True 

# Base schemas para Ticket e Attraction
class TicketBase(BaseModel):
    event_name: str
    event_date: datetime
    price: float
    customer_id: Optional[int]

# Ticket schema
class Ticket(BaseModel):
    id: int
    event_name: str
    event_date: datetime
    price: float
    customer_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True

class TicketCreate(TicketBase):
    pass

class AttractionBase(BaseModel):
    name: str
    description: str
    location: str

# Attraction schema
class Attraction(BaseModel):
    id: int
    name: str
    description: str
    location: str
    created_at: datetime

    class Config:
        from_attributes = True

class AttractionCreate(AttractionBase):
    pass 

# Schemas para Product (utilizado pelo microserviço ecommerce)
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    sku: str

class Product(ProductBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ProductCreate(ProductBase):
    pass 

# Schemas para Park (utilizado pelo microserviço parks)
class ParkBase(BaseModel):
    name: str
    description: Optional[str] = None
    location: str

class Park(ParkBase):
    id: int

    class Config:
        from_attributes = True

class ParkCreate(ParkBase):
    pass

# Schemas para Maps (utilizado pelo microserviço maps)
class MapLocationBase(BaseModel):
    name: str
    description: Optional[str] = None
    latitude: float
    longitude: float
    location_type: str
    category: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    rating: Optional[float] = 0.0
    price_range: Optional[str] = None

class MapLocation(MapLocationBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class MapLocationCreate(MapLocationBase):
    pass

class MapRouteBase(BaseModel):
    name: str
    description: Optional[str] = None
    start_location_id: int
    end_location_id: int
    route_type: str
    distance_km: Optional[float] = None
    duration_minutes: Optional[int] = None
    route_data: Optional[str] = None

class MapRoute(MapRouteBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class MapRouteCreate(MapRouteBase):
    pass

class MapAreaBase(BaseModel):
    name: str
    description: Optional[str] = None
    area_type: str
    center_latitude: float
    center_longitude: float
    radius_km: Optional[float] = None
    polygon_data: Optional[str] = None

class MapArea(MapAreaBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class MapAreaCreate(MapAreaBase):
    pass

class MapSearchBase(BaseModel):
    user_id: Optional[int] = None
    search_query: str
    search_type: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    radius_km: Optional[float] = None
    filters: Optional[str] = None
    results_count: Optional[int] = 0

class MapSearch(MapSearchBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class MapSearchCreate(MapSearchBase):
    pass

class MapFavoriteBase(BaseModel):
    user_id: int
    location_id: int
    favorite_type: Optional[str] = "location"
    notes: Optional[str] = None

class MapFavorite(MapFavoriteBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class MapFavoriteCreate(MapFavoriteBase):
    pass

class MapReviewBase(BaseModel):
    user_id: int
    location_id: int
    rating: int
    title: Optional[str] = None
    comment: Optional[str] = None
    review_type: Optional[str] = "general"

class MapReview(MapReviewBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class MapReviewCreate(MapReviewBase):
    pass

# Schemas para Visa (utilizado pelo microserviço visa)
class VisaTypeBase(BaseModel):
    name: str
    description: Optional[str] = None
    country_code: str
    visa_category: str
    duration_days: Optional[int] = None
    processing_time_days: Optional[int] = None
    fee_amount: float
    currency: Optional[str] = "USD"
    requirements: Optional[str] = None

class VisaType(VisaTypeBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class VisaTypeCreate(VisaTypeBase):
    pass

class VisaApplicationBase(BaseModel):
    visa_type_id: int
    user_id: int
    first_name: str
    last_name: str
    date_of_birth: datetime
    nationality: str
    passport_number: str
    passport_expiry: datetime
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None
    purpose_of_visit: str
    travel_dates_from: Optional[datetime] = None
    travel_dates_to: Optional[datetime] = None
    accommodation_info: Optional[str] = None

class VisaApplication(VisaApplicationBase):
    id: int
    application_number: str
    status: str
    submission_date: datetime
    processing_date: Optional[datetime] = None
    decision_date: Optional[datetime] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class VisaApplicationCreate(VisaApplicationBase):
    pass

class VisaDocumentBase(BaseModel):
    application_id: int
    document_type: str
    file_name: str
    file_path: str
    file_size: Optional[int] = None

class VisaDocument(VisaDocumentBase):
    id: int
    upload_date: datetime
    is_verified: bool
    verification_notes: Optional[str] = None

    class Config:
        from_attributes = True

class VisaDocumentCreate(VisaDocumentBase):
    pass

class VisaPaymentBase(BaseModel):
    application_id: int
    amount: float
    currency: Optional[str] = "USD"
    payment_method: str
    transaction_id: Optional[str] = None

class VisaPayment(VisaPaymentBase):
    id: int
    payment_date: datetime
    status: str
    payment_gateway_response: Optional[str] = None

    class Config:
        from_attributes = True

class VisaPaymentCreate(VisaPaymentBase):
    pass

class VisaStatusBase(BaseModel):
    application_id: int
    status: str
    notes: Optional[str] = None
    updated_by: Optional[str] = None

class VisaStatus(VisaStatusBase):
    id: int
    status_date: datetime

    class Config:
        from_attributes = True

class VisaStatusCreate(VisaStatusBase):
    pass

# Schemas para Videos (utilizado pelo microserviço videos)
class VideoBase(BaseModel):
    title: str
    description: Optional[str] = None
    video_url: str
    thumbnail_url: Optional[str] = None
    duration_seconds: Optional[int] = None
    file_size_mb: Optional[float] = None
    format: Optional[str] = "mp4"
    resolution: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[str] = None
    user_id: int
    is_public: Optional[bool] = True
    is_monetized: Optional[bool] = False
    is_live: Optional[bool] = False
    language: Optional[str] = "pt"

class Video(VideoBase):
    id: int
    view_count: int
    like_count: int
    dislike_count: int
    comment_count: int
    share_count: int
    upload_status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class VideoCreate(VideoBase):
    pass

class VideoPlaylistBase(BaseModel):
    name: str
    description: Optional[str] = None
    user_id: int
    is_public: Optional[bool] = True

class VideoPlaylist(VideoPlaylistBase):
    id: int
    video_count: int
    total_duration_seconds: int
    thumbnail_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class VideoPlaylistCreate(VideoPlaylistBase):
    pass

class VideoPlaylistItemBase(BaseModel):
    playlist_id: int
    video_id: int
    position: int

class VideoPlaylistItem(VideoPlaylistItemBase):
    id: int
    added_at: datetime

    class Config:
        from_attributes = True

class VideoPlaylistItemCreate(VideoPlaylistItemBase):
    pass

class VideoViewBase(BaseModel):
    video_id: int
    user_id: Optional[int] = None
    ip_address: Optional[str] = None
    watch_duration_seconds: Optional[int] = 0
    completion_percentage: Optional[float] = 0.0
    device_type: Optional[str] = None
    browser: Optional[str] = None
    location: Optional[str] = None

class VideoView(VideoViewBase):
    id: int
    viewed_at: datetime

    class Config:
        from_attributes = True

class VideoViewCreate(VideoViewBase):
    pass

class VideoLikeBase(BaseModel):
    video_id: int
    user_id: int
    is_like: bool

class VideoLike(VideoLikeBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class VideoLikeCreate(VideoLikeBase):
    pass

class VideoCommentBase(BaseModel):
    video_id: int
    user_id: int
    parent_comment_id: Optional[int] = None
    content: str

class VideoComment(VideoCommentBase):
    id: int
    like_count: int
    reply_count: int
    is_pinned: bool
    is_edited: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class VideoCommentCreate(VideoCommentBase):
    pass

class VideoShareBase(BaseModel):
    video_id: int
    user_id: Optional[int] = None
    platform: str
    shared_url: Optional[str] = None
    ip_address: Optional[str] = None

class VideoShare(VideoShareBase):
    id: int
    shared_at: datetime

    class Config:
        from_attributes = True

class VideoShareCreate(VideoShareBase):
    pass

# Schemas para Photos (utilizado pelo microserviço photos)
class PhotoBase(BaseModel):
    title: str
    description: Optional[str] = None
    photo_url: str
    thumbnail_url: Optional[str] = None
    original_filename: Optional[str] = None
    file_size_mb: Optional[float] = None
    width: Optional[int] = None
    height: Optional[int] = None
    format: Optional[str] = None
    camera_model: Optional[str] = None
    camera_settings: Optional[str] = None
    location_latitude: Optional[float] = None
    location_longitude: Optional[float] = None
    taken_at: Optional[datetime] = None
    user_id: int
    album_id: Optional[int] = None
    is_public: Optional[bool] = True
    is_featured: Optional[bool] = False
    tags: Optional[str] = None

class Photo(PhotoBase):
    id: int
    view_count: int
    like_count: int
    comment_count: int
    download_count: int
    share_count: int
    color_palette: Optional[str] = None
    upload_status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PhotoCreate(PhotoBase):
    pass

class PhotoAlbumBase(BaseModel):
    name: str
    description: Optional[str] = None
    user_id: int
    cover_photo_id: Optional[int] = None
    is_public: Optional[bool] = True
    is_featured: Optional[bool] = False

class PhotoAlbum(PhotoAlbumBase):
    id: int
    photo_count: int
    view_count: int
    like_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PhotoAlbumCreate(PhotoAlbumBase):
    pass

class PhotoAlbumItemBase(BaseModel):
    album_id: int
    photo_id: int
    position: int

class PhotoAlbumItem(PhotoAlbumItemBase):
    id: int
    added_at: datetime

    class Config:
        from_attributes = True

class PhotoAlbumItemCreate(PhotoAlbumItemBase):
    pass

class PhotoViewBase(BaseModel):
    photo_id: int
    user_id: Optional[int] = None
    ip_address: Optional[str] = None
    device_type: Optional[str] = None
    browser: Optional[str] = None
    location: Optional[str] = None

class PhotoView(PhotoViewBase):
    id: int
    viewed_at: datetime

    class Config:
        from_attributes = True

class PhotoViewCreate(PhotoViewBase):
    pass

class PhotoLikeBase(BaseModel):
    photo_id: int
    user_id: int

class PhotoLike(PhotoLikeBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class PhotoLikeCreate(PhotoLikeBase):
    pass

class PhotoCommentBase(BaseModel):
    photo_id: int
    user_id: int
    parent_comment_id: Optional[int] = None
    content: str

class PhotoComment(PhotoCommentBase):
    id: int
    like_count: int
    reply_count: int
    is_edited: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PhotoCommentCreate(PhotoCommentBase):
    pass

class PhotoDownloadBase(BaseModel):
    photo_id: int
    user_id: Optional[int] = None
    download_type: str
    ip_address: Optional[str] = None

class PhotoDownload(PhotoDownloadBase):
    id: int
    downloaded_at: datetime

    class Config:
        from_attributes = True

class PhotoDownloadCreate(PhotoDownloadBase):
    pass

class PhotoShareBase(BaseModel):
    photo_id: int
    user_id: Optional[int] = None
    platform: str
    shared_url: Optional[str] = None
    ip_address: Optional[str] = None

class PhotoShare(PhotoShareBase):
    id: int
    shared_at: datetime

    class Config:
        from_attributes = True

class PhotoShareCreate(PhotoShareBase):
    pass

# ========================================
# REPORTS SCHEMAS
# ========================================

class ReportBase(BaseModel):
    name: str
    description: Optional[str] = None
    report_type: str
    parameters: Optional[str] = None

class ReportCreate(ReportBase):
    pass

class ReportResponse(ReportBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

class ReportTemplateBase(BaseModel):
    name: str
    description: Optional[str] = None
    template_type: str
    template_config: Optional[str] = None

class ReportTemplateCreate(ReportTemplateBase):
    pass

class ReportScheduleBase(BaseModel):
    report_id: int
    schedule_type: str
    schedule_config: Optional[str] = None
    is_active: bool = True

class ReportScheduleCreate(ReportScheduleBase):
    pass

class ReportFilter(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    filter_type: Optional[str] = None
    filter_value: Optional[str] = None

class ReportExport(BaseModel):
    format: str = "json"
    include_raw_data: bool = False 