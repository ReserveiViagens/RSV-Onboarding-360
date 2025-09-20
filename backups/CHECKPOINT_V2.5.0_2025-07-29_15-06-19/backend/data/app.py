from fastapi import FastAPI, HTTPException, Depends, Request, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import logging
import os
import requests
import json
import pandas as pd
from datetime import datetime, timedelta
from geopy.geocoders import Nominatim
from prometheus_client import Counter, Gauge, Histogram, start_http_server
import atexit

# LangChain imports
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain.memory import ConversationBufferMemory

from backend.shared.config.database import get_db
from backend.shared.models.booking import Booking
from backend.shared.models.property import Property

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuração do Prometheus
PREDICTION_ERROR = Counter('langchain_prediction_error_total', 'Total de erros em previsões LangChain')
PREDICTED_DEMAND = Gauge('langchain_predicted_demand', 'Demanda prevista por LangChain')
WEATHER_API_CALLS = Counter('weather_api_calls_total', 'Total de chamadas para APIs de clima')
EVENT_API_CALLS = Counter('event_api_calls_total', 'Total de chamadas para APIs de eventos')

# APIs Keys
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
WEATHERAPI_API_KEY = os.getenv("WEATHERAPI_API_KEY")
EVENTBRITE_API_KEY = os.getenv("EVENTBRITE_API_KEY")

app = FastAPI(
    title="Serviço de Dados - Onion RSV 360",
    version="2.1.0",
    description="Serviço de dados com LangChain e previsões inteligentes"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Iniciar servidor de métricas
start_http_server(8000)

def cleanup():
    """Limpeza ao encerrar o serviço"""
    logger.info("Encerrando servidor de métricas")
atexit.register(cleanup)

# Configuração do LangChain
if OPENAI_API_KEY:
    llm = ChatOpenAI(model="gpt-4o-mini", api_key=OPENAI_API_KEY)
    memory = ConversationBufferMemory()
    
    prompt = PromptTemplate(
        input_variables=["booking_data", "historical_data", "context", "weather_condition", "local_events"],
        template="""
        Analise os seguintes dados para fornecer recomendações inteligentes:

        DADOS DA RESERVA:
        {booking_data}

        DADOS HISTÓRICOS:
        {historical_data}

        CONTEXTO:
        {context}

        CONDIÇÕES CLIMÁTICAS:
        {weather_condition}

        EVENTOS LOCAIS:
        {local_events}

        Use Chain of Thought (CoT) e Tree of Thought (ToT) para analisar:
        1. Padrões de demanda baseados no histórico
        2. Impacto do clima na ocupação
        3. Influência de eventos locais nos preços
        4. Recomendações de preços dinâmicos
        5. Sugestões de marketing personalizadas

        Responda em português brasileiro com recomendações específicas e justificativas.
        """
    )
    
    chain = LLMChain(llm=llm, prompt=prompt, memory=memory)
else:
    logger.warning("OpenAI API Key não configurada - funcionalidades de IA desabilitadas")
    chain = None

def load_historical_data():
    """Carregar dados históricos do banco"""
    try:
        db = next(get_db())
        bookings = db.query(Booking).all()
        
        data = []
        for b in bookings:
            data.append({
                'id': b.id,
                'room_rate': b.room_rate,
                'checkin_date': b.checkin_date.isoformat() if b.checkin_date else None,
                'checkout_date': b.checkout_date.isoformat() if b.checkout_date else None,
                'guests_count': b.guests_count,
                'weather_condition': b.weather_condition,
                'local_events': json.dumps(b.local_events) if b.local_events else None,
                'property_id': b.property_id,
                'customer_id': b.customer_id,
                'status': b.status
            })
        
        df = pd.DataFrame(data)
        logger.info(f"Dados históricos carregados: {len(df)} registros")
        return df
    except Exception as e:
        logger.error(f"Erro ao carregar dados históricos: {str(e)}")
        return pd.DataFrame()

def fetch_weather_automatically(property_id: int) -> str:
    """Buscar clima automaticamente para uma propriedade"""
    try:
        db = next(get_db())
        property = db.query(Property).filter(Property.id == property_id).first()
        if not property:
            return "desconhecido"
        
        geolocator = Nominatim(user_agent="onion360rsv")
        location = geolocator.geocode(property.address)
        if location:
            # Tentar OpenWeather primeiro
            response_openweather = requests.get(
                f"http://api.openweathermap.org/data/2.5/weather?lat={location.latitude}&lon={location.longitude}&appid={OPENWEATHER_API_KEY}&units=metric"
            )
            WEATHER_API_CALLS.inc()
            if response_openweather.status_code == 200:
                weather_data = response_openweather.json()
                weather_desc = weather_data.get("weather", [{}])[0].get("description", "desconhecido")
                logger.info(f"Clima OpenWeather para propriedade {property_id}: {weather_desc}")
                return weather_desc
            
            # Fallback para WeatherAPI
            response_weatherapi = requests.get(
                f"http://api.weatherapi.com/v1/current.json?key={WEATHERAPI_API_KEY}&q={location.latitude},{location.longitude}"
            )
            WEATHER_API_CALLS.inc()
            if response_weatherapi.status_code == 200:
                weather_data = response_weatherapi.json()
                weather_desc = weather_data.get("current", {}).get("condition", {}).get("text", "desconhecido")
                logger.info(f"Clima WeatherAPI para propriedade {property_id}: {weather_desc}")
                return weather_desc
    except Exception as e:
        logger.error(f"Erro ao buscar clima automaticamente: {str(e)}")
    return "desconhecido"

def fetch_local_events(property_id: int) -> Dict[str, str]:
    """Buscar eventos locais automaticamente"""
    try:
        db = next(get_db())
        property = db.query(Property).filter(Property.id == property_id).first()
        if not property:
            return {}
        
        geolocator = Nominatim(user_agent="onion360rsv")
        location = geolocator.geocode(property.address)
        if location:
            response = requests.get(
                f"https://www.eventbriteapi.com/v3/events/search/?location.latitude={location.latitude}&location.longitude={location.longitude}&token={EVENTBRITE_API_KEY}"
            )
            EVENT_API_CALLS.inc()
            if response.status_code == 200:
                events = response.json().get("events", [])
                events_dict = {event["name"]["text"]: event["start"]["local"] for event in events[:2]}
                logger.info(f"Eventos locais para propriedade {property_id}: {len(events_dict)} encontrados")
                return events_dict
    except Exception as e:
        logger.error(f"Erro ao buscar eventos locais: {str(e)}")
    return {}

@app.get("/")
def read_root():
    """Endpoint raiz"""
    return {
        "message": "Serviço de Dados - Onion RSV 360",
        "version": "2.1.0",
        "status": "ativo",
        "features": ["LangChain", "Previsões", "Dados Históricos", "Clima", "Eventos"],
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/health")
def health_check():
    """Verificação de saúde"""
    return {
        "status": "saudavel",
        "servico": "data",
        "versao": "2.1.0",
        "integrations": {
            "openai": "disponivel" if OPENAI_API_KEY else "nao_configurado",
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
        "servico": "data",
        "versao": "2.1.0",
        "status": "operacional",
        "features": {
            "langchain": "disponivel" if chain else "nao_configurado",
            "previsoes": "disponivel" if chain else "nao_configurado",
            "dados_historicos": "disponivel",
            "clima_automatico": "disponivel",
            "eventos_automaticos": "disponivel"
        },
        "endpoints": {
            "saude": "/health",
            "recomendacao": "/api/recommendation",
            "teste_previsao": "/api/test-prediction",
            "dados_historicos": "/api/historical-data",
            "clima": "/api/weather/{property_id}",
            "eventos": "/api/events/{property_id}",
            "metricas": "http://localhost:8000"
        }
    }

@app.post("/api/recommendation")
async def get_recommendation(booking_data: dict, context: str = "Análise geral"):
    """Obter recomendação baseada em dados históricos e contexto"""
    if not chain:
        raise HTTPException(status_code=503, detail="Serviço de IA não configurado")
    
    try:
        # Carregar dados históricos
        historical_data = load_historical_data()
        
        # Buscar clima e eventos automaticamente se property_id estiver disponível
        if 'property_id' in booking_data:
            booking_data['weather_condition'] = fetch_weather_automatically(booking_data['property_id'])
            booking_data['local_events'] = fetch_local_events(booking_data['property_id'])
        
        # Executar análise com LangChain
        response = chain.run(
            booking_data=json.dumps(booking_data, indent=2),
            historical_data=historical_data.to_json(orient='records'),
            context=context,
            weather_condition=booking_data.get('weather_condition', 'desconhecido'),
            local_events=json.dumps(booking_data.get('local_events', {}))
        )
        
        # Extrair demanda prevista (simplificado)
        try:
            demand = float(response.split("preço")[0].split()[-1]) if "preço" in response and any(char.isdigit() for char in response) else 100
            PREDICTED_DEMAND.set(demand)
        except:
            PREDICTED_DEMAND.set(100)
        
        return {
            "recommendation": response,
            "booking_data": booking_data,
            "context": context,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        PREDICTION_ERROR.inc()
        logger.error(f"Erro na previsão: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro na previsão: {str(e)}")

@app.post("/api/test-prediction")
async def test_prediction(booking_data: dict):
    """Testar previsão com dados reais e novos atributos"""
    if not chain:
        raise HTTPException(status_code=503, detail="Serviço de IA não configurado")
    
    try:
        # Carregar dados históricos
        historical_data = load_historical_data()
        
        # Adicionar dados de teste
        test_data = pd.DataFrame([{
            **booking_data,
            'weather_condition': fetch_weather_automatically(booking_data.get('property_id', 1)),
            'local_events': json.dumps(fetch_local_events(booking_data.get('property_id', 1)))
        }])
        
        # Mesclar dados
        merged_data = pd.concat([historical_data, test_data], ignore_index=True)
        
        # Executar análise
        context = "Teste de previsão com dados reais e novos atributos"
        response = chain.run(
            booking_data=json.dumps(booking_data, indent=2),
            historical_data=merged_data.to_json(orient='records'),
            context=context,
            weather_condition=booking_data.get('weather_condition', 'desconhecido'),
            local_events=json.dumps(booking_data.get('local_events', {}))
        )
        
        return {
            "test_result": response,
            "test_data": booking_data,
            "merged_records": len(merged_data),
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        PREDICTION_ERROR.inc()
        logger.error(f"Erro no teste de previsão: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro no teste: {str(e)}")

@app.get("/api/historical-data")
async def get_historical_data(limit: int = 100):
    """Obter dados históricos"""
    try:
        df = load_historical_data()
        if len(df) > limit:
            df = df.head(limit)
        
        return {
            "data": df.to_dict(orient='records'),
            "total_records": len(df),
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Erro ao obter dados históricos: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro ao obter dados: {str(e)}")

@app.get("/api/weather/{property_id}")
async def get_weather(property_id: int):
    """Obter clima para uma propriedade"""
    try:
        weather = fetch_weather_automatically(property_id)
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
        events = fetch_local_events(property_id)
        return {
            "property_id": property_id,
            "events": events,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar eventos: {str(e)}")

@app.get("/api/analytics/summary")
async def get_analytics_summary():
    """Obter resumo analítico dos dados"""
    try:
        df = load_historical_data()
        
        if df.empty:
            return {
                "message": "Nenhum dado histórico disponível",
                "timestamp": datetime.utcnow().isoformat()
            }
        
        summary = {
            "total_bookings": len(df),
            "avg_room_rate": df['room_rate'].mean() if 'room_rate' in df.columns else 0,
            "total_revenue": df['room_rate'].sum() if 'room_rate' in df.columns else 0,
            "avg_guests": df['guests_count'].mean() if 'guests_count' in df.columns else 0,
            "weather_conditions": df['weather_condition'].value_counts().to_dict() if 'weather_condition' in df.columns else {},
            "timestamp": datetime.utcnow().isoformat()
        }
        
        return summary
        
    except Exception as e:
        logger.error(f"Erro ao gerar resumo analítico: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro ao gerar resumo: {str(e)}")

@app.get("/metrics")
def get_metrics():
    """Endpoint para métricas do Prometheus"""
    from prometheus_client import generate_latest
    from fastapi.responses import Response
    return Response(generate_latest(), media_type="text/plain")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5004) 