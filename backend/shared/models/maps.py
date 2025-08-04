from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.sql import func
from shared.config.database import Base

class MapLocation(Base):
    __tablename__ = "map_locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    location_type = Column(String, nullable=False)  # hotel, restaurant, attraction, etc
    category = Column(String)  # subcategory
    address = Column(String)
    city = Column(String)
    country = Column(String)
    rating = Column(Float, default=0.0)
    price_range = Column(String)  # $, $$, $$$, $$$$
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class MapRoute(Base):
    __tablename__ = "map_routes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    start_location_id = Column(Integer, ForeignKey("map_locations.id"))
    end_location_id = Column(Integer, ForeignKey("map_locations.id"))
    route_type = Column(String, nullable=False)  # driving, walking, cycling, transit
    distance_km = Column(Float)
    duration_minutes = Column(Integer)
    route_data = Column(Text)  # JSON with coordinates
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class MapArea(Base):
    __tablename__ = "map_areas"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    area_type = Column(String, nullable=False)  # city, neighborhood, district, region
    center_latitude = Column(Float, nullable=False)
    center_longitude = Column(Float, nullable=False)
    radius_km = Column(Float)
    polygon_data = Column(Text)  # JSON with polygon coordinates
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class MapSearch(Base):
    __tablename__ = "map_searches"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    search_query = Column(String, nullable=False)
    search_type = Column(String, nullable=False)  # location, route, area
    latitude = Column(Float)
    longitude = Column(Float)
    radius_km = Column(Float)
    filters = Column(Text)  # JSON with search filters
    results_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class MapFavorite(Base):
    __tablename__ = "map_favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    location_id = Column(Integer, ForeignKey("map_locations.id"), nullable=False)
    favorite_type = Column(String, default="location")  # location, route, area
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class MapReview(Base):
    __tablename__ = "map_reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    location_id = Column(Integer, ForeignKey("map_locations.id"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5 stars
    title = Column(String)
    comment = Column(Text)
    review_type = Column(String, default="general")  # general, service, food, location
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())