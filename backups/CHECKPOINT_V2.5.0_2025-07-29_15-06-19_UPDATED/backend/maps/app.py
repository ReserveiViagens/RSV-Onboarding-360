from fastapi import FastAPI, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import json
import math

from shared.database import get_db, init_db
from shared.models.maps import (
    MapLocation, MapRoute, MapArea, MapSearch, MapFavorite, MapReview
)
from shared.schemas import (
    MapLocationCreate, MapLocation, MapRouteCreate, MapRoute,
    MapAreaCreate, MapArea, MapSearchCreate, MapSearch,
    MapFavoriteCreate, MapFavorite, MapReviewCreate, MapReview
)

app = FastAPI(title="Maps Service", version="1.0.0")

# Inicializar banco de dados
init_db()

@app.on_event("startup")
async def startup_event():
    init_db()

# Helper function para calcular distância entre coordenadas (fórmula de Haversine)
def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371  # Raio da Terra em km
    
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)
    
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    
    a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    return R * c

# Endpoints para Localizações
@app.post("/locations/", response_model=MapLocation)
def create_location(location: MapLocationCreate, db: Session = Depends(get_db)):
    db_location = MapLocation(**location.dict())
    db.add(db_location)
    db.commit()
    db.refresh(db_location)
    return db_location

@app.get("/locations/", response_model=List[MapLocation])
def get_locations(
    location_type: Optional[str] = None,
    category: Optional[str] = None,
    city: Optional[str] = None,
    country: Optional[str] = None,
    min_rating: Optional[float] = None,
    price_range: Optional[str] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    radius_km: Optional[float] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(MapLocation).filter(MapLocation.is_active == True)
    
    if location_type:
        query = query.filter(MapLocation.location_type == location_type)
    if category:
        query = query.filter(MapLocation.category == category)
    if city:
        query = query.filter(MapLocation.city == city)
    if country:
        query = query.filter(MapLocation.country == country)
    if min_rating:
        query = query.filter(MapLocation.rating >= min_rating)
    if price_range:
        query = query.filter(MapLocation.price_range == price_range)
    
    locations = query.offset(skip).limit(limit).all()
    
    # Filtrar por distância se coordenadas fornecidas
    if latitude and longitude and radius_km:
        filtered_locations = []
        for location in locations:
            distance = calculate_distance(latitude, longitude, location.latitude, location.longitude)
            if distance <= radius_km:
                filtered_locations.append(location)
        locations = filtered_locations
    
    return locations

@app.get("/locations/{location_id}", response_model=MapLocation)
def get_location(location_id: int, db: Session = Depends(get_db)):
    location = db.query(MapLocation).filter(MapLocation.id == location_id).first()
    if location is None:
        raise HTTPException(status_code=404, detail="Localização não encontrada")
    return location

@app.put("/locations/{location_id}", response_model=MapLocation)
def update_location(location_id: int, location: MapLocationCreate, db: Session = Depends(get_db)):
    db_location = db.query(MapLocation).filter(MapLocation.id == location_id).first()
    if db_location is None:
        raise HTTPException(status_code=404, detail="Localização não encontrada")
    
    for key, value in location.dict().items():
        setattr(db_location, key, value)
    
    db_location.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_location)
    return db_location

@app.delete("/locations/{location_id}")
def deactivate_location(location_id: int, db: Session = Depends(get_db)):
    location = db.query(MapLocation).filter(MapLocation.id == location_id).first()
    if location is None:
        raise HTTPException(status_code=404, detail="Localização não encontrada")
    
    location.is_active = False
    location.updated_at = datetime.utcnow()
    db.commit()
    return {"message": "Localização desativada com sucesso"}

@app.get("/locations/nearby")
def get_nearby_locations(
    latitude: float,
    longitude: float,
    radius_km: float = 10.0,
    location_type: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    locations = db.query(MapLocation).filter(MapLocation.is_active == True).all()
    
    nearby_locations = []
    for location in locations:
        distance = calculate_distance(latitude, longitude, location.latitude, location.longitude)
        if distance <= radius_km:
            if location_type is None or location.location_type == location_type:
                nearby_locations.append({
                    "id": location.id,
                    "name": location.name,
                    "latitude": location.latitude,
                    "longitude": location.longitude,
                    "distance_km": round(distance, 2),
                    "location_type": location.location_type,
                    "category": location.category,
                    "rating": location.rating,
                    "address": location.address
                })
    
    # Ordenar por distância
    nearby_locations.sort(key=lambda x: x["distance_km"])
    return nearby_locations[:limit]

# Endpoints para Rotas
@app.post("/routes/", response_model=MapRoute)
def create_route(route: MapRouteCreate, db: Session = Depends(get_db)):
    db_route = MapRoute(**route.dict())
    db.add(db_route)
    db.commit()
    db.refresh(db_route)
    return db_route

@app.get("/routes/", response_model=List[MapRoute])
def get_routes(
    route_type: Optional[str] = None,
    start_location_id: Optional[int] = None,
    end_location_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(MapRoute).filter(MapRoute.is_active == True)
    
    if route_type:
        query = query.filter(MapRoute.route_type == route_type)
    if start_location_id:
        query = query.filter(MapRoute.start_location_id == start_location_id)
    if end_location_id:
        query = query.filter(MapRoute.end_location_id == end_location_id)
    
    routes = query.offset(skip).limit(limit).all()
    return routes

@app.get("/routes/{route_id}", response_model=MapRoute)
def get_route(route_id: int, db: Session = Depends(get_db)):
    route = db.query(MapRoute).filter(MapRoute.id == route_id).first()
    if route is None:
        raise HTTPException(status_code=404, detail="Rota não encontrada")
    return route

@app.post("/routes/calculate")
def calculate_route(
    start_lat: float,
    start_lon: float,
    end_lat: float,
    end_lon: float,
    route_type: str = "driving",
    waypoints: Optional[str] = None,
    db: Session = Depends(get_db)
):
    # Calcular distância usando fórmula de Haversine
    distance_km = calculate_distance(start_lat, start_lon, end_lat, end_lon)
    
    # Estimativa de tempo baseada no tipo de rota
    if route_type == "driving":
        avg_speed_kmh = 50  # Velocidade média urbana
    elif route_type == "walking":
        avg_speed_kmh = 5   # Velocidade média a pé
    elif route_type == "cycling":
        avg_speed_kmh = 15  # Velocidade média de bicicleta
    else:
        avg_speed_kmh = 30  # Velocidade média transporte público
    
    duration_minutes = int((distance_km / avg_speed_kmh) * 60)
    
    # Criar dados da rota (simplificado)
    route_data = {
        "start": {"lat": start_lat, "lng": start_lon},
        "end": {"lat": end_lat, "lng": end_lon},
        "waypoints": json.loads(waypoints) if waypoints else [],
        "distance_km": round(distance_km, 2),
        "duration_minutes": duration_minutes,
        "route_type": route_type
    }
    
    return {
        "distance_km": round(distance_km, 2),
        "duration_minutes": duration_minutes,
        "route_data": json.dumps(route_data),
        "route_type": route_type
    }

# Endpoints para Áreas
@app.post("/areas/", response_model=MapArea)
def create_area(area: MapAreaCreate, db: Session = Depends(get_db)):
    db_area = MapArea(**area.dict())
    db.add(db_area)
    db.commit()
    db.refresh(db_area)
    return db_area

@app.get("/areas/", response_model=List[MapArea])
def get_areas(
    area_type: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(MapArea).filter(MapArea.is_active == True)
    
    if area_type:
        query = query.filter(MapArea.area_type == area_type)
    
    areas = query.offset(skip).limit(limit).all()
    return areas

@app.get("/areas/{area_id}", response_model=MapArea)
def get_area(area_id: int, db: Session = Depends(get_db)):
    area = db.query(MapArea).filter(MapArea.id == area_id).first()
    if area is None:
        raise HTTPException(status_code=404, detail="Área não encontrada")
    return area

@app.get("/areas/{area_id}/locations")
def get_area_locations(area_id: int, db: Session = Depends(get_db)):
    area = db.query(MapArea).filter(MapArea.id == area_id).first()
    if area is None:
        raise HTTPException(status_code=404, detail="Área não encontrada")
    
    # Buscar localizações dentro da área (simplificado - usando raio)
    locations = db.query(MapLocation).filter(MapLocation.is_active == True).all()
    
    area_locations = []
    for location in locations:
        distance = calculate_distance(
            area.center_latitude, area.center_longitude,
            location.latitude, location.longitude
        )
        if distance <= (area.radius_km or 5.0):  # Default 5km se não especificado
            area_locations.append({
                "id": location.id,
                "name": location.name,
                "latitude": location.latitude,
                "longitude": location.longitude,
                "location_type": location.location_type,
                "category": location.category,
                "rating": location.rating,
                "distance_from_center_km": round(distance, 2)
            })
    
    return {
        "area_id": area_id,
        "area_name": area.name,
        "locations": area_locations,
        "total_locations": len(area_locations)
    }

# Endpoints para Buscas
@app.post("/searches/", response_model=MapSearch)
def create_search(search: MapSearchCreate, db: Session = Depends(get_db)):
    db_search = MapSearch(**search.dict())
    db.add(db_search)
    db.commit()
    db.refresh(db_search)
    return db_search

@app.get("/searches/", response_model=List[MapSearch])
def get_searches(
    user_id: Optional[int] = None,
    search_type: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(MapSearch)
    
    if user_id:
        query = query.filter(MapSearch.user_id == user_id)
    if search_type:
        query = query.filter(MapSearch.search_type == search_type)
    
    searches = query.order_by(MapSearch.created_at.desc()).offset(skip).limit(limit).all()
    return searches

@app.get("/searches/popular")
def get_popular_searches(days: int = 7, limit: int = 10, db: Session = Depends(get_db)):
    from datetime import timedelta
    
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Buscar buscas mais populares
    searches = db.query(MapSearch).filter(
        MapSearch.created_at >= start_date
    ).all()
    
    # Contar ocorrências de cada query
    query_counts = {}
    for search in searches:
        query_counts[search.search_query] = query_counts.get(search.search_query, 0) + 1
    
    # Ordenar por popularidade
    popular_searches = sorted(query_counts.items(), key=lambda x: x[1], reverse=True)
    
    return [
        {
            "query": query,
            "count": count,
            "search_type": "location"  # Simplificado
        } for query, count in popular_searches[:limit]
    ]

# Endpoints para Favoritos
@app.post("/favorites/", response_model=MapFavorite)
def create_favorite(favorite: MapFavoriteCreate, db: Session = Depends(get_db)):
    db_favorite = MapFavorite(**favorite.dict())
    db.add(db_favorite)
    db.commit()
    db.refresh(db_favorite)
    return db_favorite

@app.get("/favorites/user/{user_id}", response_model=List[MapFavorite])
def get_user_favorites(user_id: int, db: Session = Depends(get_db)):
    favorites = db.query(MapFavorite).filter(MapFavorite.user_id == user_id).all()
    return favorites

@app.delete("/favorites/{favorite_id}")
def delete_favorite(favorite_id: int, db: Session = Depends(get_db)):
    favorite = db.query(MapFavorite).filter(MapFavorite.id == favorite_id).first()
    if favorite is None:
        raise HTTPException(status_code=404, detail="Favorito não encontrado")
    
    db.delete(favorite)
    db.commit()
    return {"message": "Favorito removido com sucesso"}

# Endpoints para Avaliações
@app.post("/reviews/", response_model=MapReview)
def create_review(review: MapReviewCreate, db: Session = Depends(get_db)):
    db_review = MapReview(**review.dict())
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    
    # Atualizar rating médio da localização
    update_location_rating(db, review.location_id)
    
    return db_review

@app.get("/reviews/", response_model=List[MapReview])
def get_reviews(
    location_id: Optional[int] = None,
    user_id: Optional[int] = None,
    min_rating: Optional[int] = None,
    review_type: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(MapReview).filter(MapReview.is_active == True)
    
    if location_id:
        query = query.filter(MapReview.location_id == location_id)
    if user_id:
        query = query.filter(MapReview.user_id == user_id)
    if min_rating:
        query = query.filter(MapReview.rating >= min_rating)
    if review_type:
        query = query.filter(MapReview.review_type == review_type)
    
    reviews = query.order_by(MapReview.created_at.desc()).offset(skip).limit(limit).all()
    return reviews

@app.get("/reviews/location/{location_id}/summary")
def get_location_reviews_summary(location_id: int, db: Session = Depends(get_db)):
    reviews = db.query(MapReview).filter(
        MapReview.location_id == location_id,
        MapReview.is_active == True
    ).all()
    
    if not reviews:
        return {
            "location_id": location_id,
            "total_reviews": 0,
            "average_rating": 0,
            "rating_distribution": {}
        }
    
    total_reviews = len(reviews)
    average_rating = sum(r.rating for r in reviews) / total_reviews
    
    # Distribuição de ratings
    rating_distribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
    for review in reviews:
        rating_distribution[review.rating] += 1
    
    return {
        "location_id": location_id,
        "total_reviews": total_reviews,
        "average_rating": round(average_rating, 2),
        "rating_distribution": rating_distribution
    }

def update_location_rating(db: Session, location_id: int):
    """Atualizar rating médio de uma localização"""
    reviews = db.query(MapReview).filter(
        MapReview.location_id == location_id,
        MapReview.is_active == True
    ).all()
    
    if reviews:
        avg_rating = sum(r.rating for r in reviews) / len(reviews)
        location = db.query(MapLocation).filter(MapLocation.id == location_id).first()
        if location:
            location.rating = round(avg_rating, 2)
            db.commit()

# Endpoints de Estatísticas
@app.get("/stats/")
def get_stats(db: Session = Depends(get_db)):
    total_locations = db.query(MapLocation).filter(MapLocation.is_active == True).count()
    total_routes = db.query(MapRoute).filter(MapRoute.is_active == True).count()
    total_areas = db.query(MapArea).filter(MapArea.is_active == True).count()
    total_searches = db.query(MapSearch).count()
    total_favorites = db.query(MapFavorite).count()
    total_reviews = db.query(MapReview).filter(MapReview.is_active == True).count()
    
    # Estatísticas por tipo de localização
    location_types = db.query(MapLocation.location_type, db.func.count(MapLocation.id)).filter(
        MapLocation.is_active == True
    ).group_by(MapLocation.location_type).all()
    
    return {
        "total_locations": total_locations,
        "total_routes": total_routes,
        "total_areas": total_areas,
        "total_searches": total_searches,
        "total_favorites": total_favorites,
        "total_reviews": total_reviews,
        "location_types": {location_type: count for location_type, count in location_types}
    }

@app.get("/health/")
def health_check():
    return {"status": "healthy", "service": "maps"} 