from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Float
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class MapLocation(Base):
    __tablename__ = "map_locations"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(Text, nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)
    postal_code = Column(String(20), nullable=True)
    location_type = Column(String(50), nullable=False)  # hotel, restaurant, attraction, airport, etc.
    category = Column(String(50), nullable=True)  # luxury, budget, family, business, etc.
    rating = Column(Float, nullable=True)
    price_range = Column(String(20), nullable=True)  # $, $$, $$$, $$$$
    phone = Column(String(50), nullable=True)
    website = Column(String(500), nullable=True)
    opening_hours = Column(Text, nullable=True)  # JSON object with hours
    amenities = Column(Text, nullable=True)  # JSON array of amenities
    images = Column(Text, nullable=True)  # JSON array of image URLs
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class MapRoute(Base):
    __tablename__ = "map_routes"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    start_location_id = Column(Integer, ForeignKey("map_locations.id"), nullable=False)
    end_location_id = Column(Integer, ForeignKey("map_locations.id"), nullable=False)
    route_type = Column(String(50), nullable=False)  # driving, walking, cycling, public_transport
    distance_km = Column(Float, nullable=True)
    duration_minutes = Column(Integer, nullable=True)
    route_data = Column(Text, nullable=True)  # JSON object with route coordinates
    waypoints = Column(Text, nullable=True)  # JSON array of waypoint coordinates
    is_active = Column(Boolean, default=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class MapArea(Base):
    __tablename__ = "map_areas"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    area_type = Column(String(50), nullable=False)  # neighborhood, district, zone, region
    boundary_data = Column(Text, nullable=False)  # JSON array of boundary coordinates
    center_latitude = Column(Float, nullable=False)
    center_longitude = Column(Float, nullable=False)
    radius_km = Column(Float, nullable=True)
    population = Column(Integer, nullable=True)
    attractions_count = Column(Integer, default=0)
    hotels_count = Column(Integer, default=0)
    restaurants_count = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class MapSearch(Base):
    __tablename__ = "map_searches"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    search_query = Column(String(500), nullable=False)
    search_type = Column(String(50), nullable=False)  # location, route, nearby, area
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    radius_km = Column(Float, nullable=True)
    filters = Column(Text, nullable=True)  # JSON object with search filters
    results_count = Column(Integer, default=0)
    session_id = Column(String(100), nullable=True)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class MapFavorite(Base):
    __tablename__ = "map_favorites"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    location_id = Column(Integer, ForeignKey("map_locations.id"), nullable=False)
    favorite_type = Column(String(50), default="location")  # location, route, area
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class MapReview(Base):
    __tablename__ = "map_reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    location_id = Column(Integer, ForeignKey("map_locations.id"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5 stars
    title = Column(String(200), nullable=True)
    review_text = Column(Text, nullable=True)
    review_type = Column(String(50), default="general")  # general, service, cleanliness, etc.
    is_verified_visit = Column(Boolean, default=False)
    visit_date = Column(DateTime, nullable=True)
    is_helpful = Column(Boolean, default=False)
    helpful_count = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow) 