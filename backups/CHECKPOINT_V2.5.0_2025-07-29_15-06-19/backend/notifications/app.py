from fastapi import FastAPI, HTTPException, Depends, Request, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import logging
import os
import requests
import json
from datetime import datetime, timedelta
from geopy.geocoders import Nominatim
from prometheus_client import Counter, Gauge, Histogram, start_http_server
import atexit
import sys

# Adiciona o diretório utils ao path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'utils'))
from retry import retry_weather, retry_events
from cache.service import CacheService

from backend.shared.config.database import get_db
from backend.shared.models.booking import Booking
from backend.shared.models.property import Property

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuração do Prometheus
NOTIFICATION_SENT = Counter('notification_sent_total', 'Total de notificações enviadas', ['type'])
WEATHER_API_CALLS = Counter('weather_api_calls_total', 'Total de chamadas para APIs de clima')
EVENT_API_CALLS = Counter('event_api_calls_total', 'Total de chamadas para APIs de eventos')
WEATHER_SEVERITY = Gauge('weather_condition_severity', 'Gravidade das condições climáticas')
PRICE_COMPARISON_DIFF = Histogram('price_comparison_difference', 'Diferença de preços em comparação')

# APIs Keys
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
WEATHERAPI_API_KEY = os.getenv("WEATHERAPI_API_KEY")
EVENTBRITE_API_KEY = os.getenv("EVENTBRITE_API_KEY")

# Competitor API Keys (simulados para demonstração)
COMPETITOR_API_KEYS = {
    "hotelscom": os.getenv("HOTELSCOM_API_KEY", "test_key"),
    "expedia": os.getenv("EXPEDIA_API_KEY", "test_key"),
    "airbnb": os.getenv("AIRBNB_API_KEY", "test_key"),
    "agoda": os.getenv("AGODA_API_KEY", "test_key"),
    "booking": os.getenv("BOOKING_API_KEY", "test_key")
}

app = FastAPI(
    title="Serviço de Notificações - Onion RSV 360",
    version="2.1.0",
    description="Serviço de notificações com integração de clima e eventos locais"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar cache e retry
cache_service = CacheService()

# Iniciar servidor de métricas
start_http_server(8000)

def cleanup():
    """Limpeza ao encerrar o serviço"""
    logger.info("Encerrando servidor de métricas")
    cache_service.close()
atexit.register(cleanup)

@retry_weather
async def fetch_weather_openweather(property_id: int) -> str:
    """Buscar clima via OpenWeather API com cache e retry"""
    # Verificar cache primeiro
    cache_key = f"weather_openweather_{property_id}"
    cached_data = cache_service.get(cache_key)
    if cached_data:
        logger.info(f"Clima OpenWeather (cache) para propriedade {property_id}")
        return cached_data
    
    try:
        db = next(get_db())
        property = db.query(Property).filter(Property.id == property_id).first()
        if not property:
            return "desconhecido"
        
        geolocator = Nominatim(user_agent="onion360rsv")
        location = geolocator.geocode(property.address)
        if location:
            response = requests.get(
                f"http://api.openweathermap.org/data/2.5/weather?lat={location.latitude}&lon={location.longitude}&appid={OPENWEATHER_API_KEY}&units=metric"
            )
            WEATHER_API_CALLS.inc()
            if response.status_code == 200:
                weather_data = response.json()
                weather_desc = weather_data.get("weather", [{}])[0].get("description", "desconhecido")
                
                # Salvar no cache por 30 minutos
                cache_service.set(cache_key, weather_desc, ttl=1800)
                
                logger.info(f"Clima OpenWeather para propriedade {property_id}: {weather_desc}")
                return weather_desc
    except Exception as e:
        logger.error(f"Erro ao buscar clima OpenWeather: {str(e)}")
    return "desconhecido"

@retry_weather
async def fetch_weather_weatherapi(property_id: int) -> str:
    """Buscar clima via WeatherAPI com cache e retry"""
    # Verificar cache primeiro
    cache_key = f"weather_weatherapi_{property_id}"
    cached_data = cache_service.get(cache_key)
    if cached_data:
        logger.info(f"Clima WeatherAPI (cache) para propriedade {property_id}")
        return cached_data
    
    try:
        db = next(get_db())
        property = db.query(Property).filter(Property.id == property_id).first()
        if not property:
            return "desconhecido"
        
        geolocator = Nominatim(user_agent="onion360rsv")
        location = geolocator.geocode(property.address)
        if location:
            response = requests.get(
                f"http://api.weatherapi.com/v1/current.json?key={WEATHERAPI_API_KEY}&q={location.latitude},{location.longitude}"
            )
            WEATHER_API_CALLS.inc()
            if response.status_code == 200:
                weather_data = response.json()
                weather_desc = weather_data.get("current", {}).get("condition", {}).get("text", "desconhecido")
                
                # Salvar no cache por 30 minutos
                cache_service.set(cache_key, weather_desc, ttl=1800)
                
                logger.info(f"Clima WeatherAPI para propriedade {property_id}: {weather_desc}")
                return weather_desc
    except Exception as e:
        logger.error(f"Erro ao buscar clima WeatherAPI: {str(e)}")
    return "desconhecido"

async def fetch_weather(property_id: int) -> str:
    """Buscar clima com fallback entre APIs"""
    weather_openweather = await fetch_weather_openweather(property_id)
    if weather_openweather != "desconhecido":
        # Avaliar severidade
        severity = 0
        if "tempestade" in weather_openweather.lower() or "storm" in weather_openweather.lower():
            severity = 3
        elif "chuva" in weather_openweather.lower() or "rain" in weather_openweather.lower():
            severity = 2
        WEATHER_SEVERITY.set(severity)
        return weather_openweather
    
    weather_weatherapi = await fetch_weather_weatherapi(property_id)
    if weather_weatherapi != "desconhecido":
        # Avaliar severidade
        severity = 0
        if "tempestade" in weather_weatherapi.lower() or "storm" in weather_weatherapi.lower():
            severity = 3
        elif "chuva" in weather_weatherapi.lower() or "rain" in weather_weatherapi.lower():
            severity = 2
        WEATHER_SEVERITY.set(severity)
        return weather_weatherapi
    
    return "desconhecido"

@retry_events
async def fetch_local_events(property_id: int) -> Dict[str, str]:
    """Buscar eventos locais com cache e retry"""
    # Verificar cache primeiro
    cache_key = f"events_{property_id}"
    cached_data = cache_service.get(cache_key)
    if cached_data:
        logger.info(f"Eventos locais (cache) para propriedade {property_id}")
        return cached_data
    
    try:
        db = next(get_db())
        property = db.query(Property).filter(Property.id == property_id).first()
        if not property:
            return {"events": "Nenhum evento encontrado"}
        
        geolocator = Nominatim(user_agent="onion360rsv")
        location = geolocator.geocode(property.address)
        if location:
            # Simular busca de eventos (substituir por API real)
            events_data = {
                "events": f"Eventos próximos a {property.address}",
                "count": 3,
                "next_event": "Festival Local - Próximo fim de semana"
            }
            
            # Salvar no cache por 1 hora
            cache_service.set(cache_key, events_data, ttl=3600)
            
            EVENT_API_CALLS.inc()
            logger.info(f"Eventos locais para propriedade {property_id}: {events_data}")
            return events_data
    except Exception as e:
        logger.error(f"Erro ao buscar eventos locais: {str(e)}")
    return {"events": "Erro ao buscar eventos"}

async def notify_event(event_type: str, booking_id: int, user_ids: List[int], message: str):
    """Enviar notificação de evento"""
    try:
        # Aqui você implementaria a lógica real de notificação
        # Por exemplo, enviar para WebSocket, email, push notification, etc.
        NOTIFICATION_SENT.labels(type=event_type).inc()
        logger.info(f"Notificação enviada: {event_type} para reserva {booking_id} - {message}")
        return {"status": "success", "message": "Notificação enviada"}
    except Exception as e:
        logger.error(f"Erro ao enviar notificação: {str(e)}")
        return {"status": "error", "message": str(e)}

async def check_price_comparison(booking_id: int):
    """Verificar comparação de preços com competidores"""
    try:
        db = next(get_db())
        booking = db.query(Booking).filter(Booking.id == booking_id).first()
        if not booking:
            return
        
        # Buscar clima e eventos
        weather = await fetch_weather(booking.property_id)
        booking.weather_condition = weather
        local_events = await fetch_local_events(booking.property_id)
        booking.local_events = local_events
        db.commit()
        
        # Comparar preços com competidores
        competitor_prices = {}
        for platform, api_key in COMPETITOR_API_KEYS.items():
            if not api_key or api_key == "test_key":
                continue
            
            url = {
                "hotelscom": "https://offers.hotels.com/v1/search",
                "expedia": "https://api.expedia.com/v1/offers",
                "airbnb": "https://api.airbnb.com/v2/listings",
                "agoda": "https://api.agoda.com/api/availability/search"
            }.get(platform, "")
            
            if url:
                try:
                    response = requests.get(
                        url, 
                        headers={'Authorization': f'Bearer {api_key}'}, 
                        params={
                            'property_id': booking.property_id, 
                            'checkin': booking.checkin_date.isoformat(), 
                            'checkout': booking.checkout_date.isoformat()
                        },
                        timeout=10
                    )
                    if response.status_code == 200:
                        competitor_prices[platform] = response.json().get('price', {}).get('total', booking.room_rate)
                except Exception as e:
                    logger.warning(f"Erro ao buscar preço de {platform}: {str(e)}")
        
        # Simular preço do Booking.com se for test_key
        if COMPETITOR_API_KEYS["booking"] == "test_key":
            competitor_prices["booking"] = booking.room_rate * 0.95
        
        onion_price = booking.room_rate
        masked_email = booking.customer_email[:3] + "***@" + booking.customer_email.split("@")[1] if booking.customer_email else "cliente@***"
        
        for platform, price in competitor_prices.items():
            if price:
                price_diff = ((onion_price - price) / price * 100) if price else 0
                PRICE_COMPARISON_DIFF.observe(abs(price_diff))
                
                if abs(price_diff) > 10:
                    await notify_event(
                        'price_comparison', 
                        booking_id, 
                        [booking.customer_id], 
                        f'Preço da reserva {masked_email} é {price_diff:.2f}% diferente de {platform} (Clima: {weather}, Eventos: {json.dumps(local_events)}).'
                    )
        
        logger.info(f"Comparação de preços concluída para reserva {booking_id}")
        
    except Exception as e:
        logger.error(f"Erro na comparação de preços: {str(e)}")

@app.get("/")
def read_root():
    """Endpoint raiz"""
    return {
        "message": "Serviço de Notificações - Onion RSV 360",
        "version": "2.1.0",
        "status": "ativo",
        "integrations": ["OpenWeather", "WeatherAPI", "Eventbrite"],
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/health")
def health_check():
    """Verificação de saúde"""
    return {
        "status": "saudavel",
        "servico": "notifications",
        "versao": "2.1.0",
        "integrations": {
            "openweather": "disponivel" if OPENWEATHER_API_KEY else "nao_configurado",
            "weatherapi": "disponivel" if WEATHERAPI_API_KEY else "nao_configurado",
            "eventbrite": "disponivel" if EVENTBRITE_API_KEY else "nao_configurado"
        },
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/status")
def api_status():
    """Status detalhado da API"""
    return {
        "servico": "notifications",
        "versao": "2.1.0",
        "status": "operacional",
        "integrations": {
            "clima": ["OpenWeather", "WeatherAPI"],
            "eventos": ["Eventbrite"],
            "monitoring": ["Prometheus"]
        },
        "endpoints": {
            "saude": "/health",
            "clima": "/api/weather/{property_id}",
            "eventos": "/api/events/{property_id}",
            "comparacao_precos": "/api/price-comparison/{booking_id}",
            "metricas": "http://localhost:8000"
        }
    }

@app.get("/api/weather/{property_id}")
async def get_weather(property_id: int):
    """Obter clima para uma propriedade"""
    try:
        weather = await fetch_weather(property_id)
        return {
            "property_id": property_id,
            "weather": weather,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar clima: {str(e)}")

@app.get("/api/events/{property_id}")
async def get_local_events(property_id: int):
    """Obter eventos locais para uma propriedade"""
    try:
        events = await fetch_local_events(property_id)
        return {
            "property_id": property_id,
            "events": events,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar eventos: {str(e)}")

@app.post("/api/price-comparison/{booking_id}")
async def trigger_price_comparison(booking_id: int):
    """Disparar comparação de preços para uma reserva"""
    try:
        await check_price_comparison(booking_id)
        return {
            "message": "Comparação de preços iniciada",
            "booking_id": booking_id,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na comparação: {str(e)}")

@app.post("/api/notifications/send")
async def send_notification(
    user_id: int,
    notification_type: str,
    title: str,
    message: str,
    action_url: Optional[str] = None
):
    """Enviar notificação personalizada"""
    try:
        result = await notify_event(notification_type, 0, [user_id], f"{title}: {message}")
        return {
            "status": "success",
            "notification": {
                "user_id": user_id,
                "type": notification_type,
                "title": title,
                "message": message,
                "action_url": action_url
            },
            "result": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao enviar notificação: {str(e)}")

@app.get("/metrics")
def get_metrics():
    """Endpoint para métricas do Prometheus"""
    from prometheus_client import generate_latest
    return Response(generate_latest(), media_type="text/plain")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5002) 