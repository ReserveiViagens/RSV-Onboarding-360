from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import logging
import os
import json
import asyncio
from datetime import datetime
import sys

# Adiciona o diretório utils ao path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'utils'))
from retry import retry_langchain
from cache.service import CacheService
from prompts import prompt_optimizer
from notifications import notification_service

from backend.shared.config.database import get_db
from backend.shared.models.user import User
from backend.shared.models.booking import Booking
from backend.shared.models.property import Property

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuração do LangChain
from langchain_openai import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from langchain.prompts import PromptTemplate

app = FastAPI(
    title="Chatbot Inteligente - Onion RSV 360",
    version="2.2.0",
    description="Chatbot inteligente com integração completa do sistema"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar serviços
cache_service = CacheService()
llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.7,
    api_key=os.getenv("OPENAI_API_KEY")
)

class ChatbotService:
    """Serviço do chatbot inteligente"""
    
    def __init__(self):
        self.conversations = {}
        self.memory = ConversationBufferMemory()
        
        # Templates de prompts especializados
        self.prompts = {
            'booking': prompt_optimizer.get_prompt('travel_recommendation'),
            'weather': prompt_optimizer.get_prompt('weather_analysis'),
            'payment': prompt_optimizer.get_prompt('payment_assistance'),
            'general': prompt_optimizer.get_prompt('general_assistance')
        }
    
    def _get_user_context(self, user_id: int) -> Dict[str, Any]:
        """Obtém contexto do usuário"""
        try:
            db = next(get_db())
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                return {}
            
            # Buscar reservas ativas
            active_bookings = db.query(Booking).filter(
                Booking.user_id == user_id,
                Booking.status.in_(['confirmed', 'active'])
            ).all()
            
            # Buscar histórico de reservas
            booking_history = db.query(Booking).filter(
                Booking.user_id == user_id
            ).order_by(Booking.created_at.desc()).limit(5).all()
            
            return {
                'user_name': user.name,
                'user_email': user.email,
                'active_bookings': [
                    {
                        'id': b.id,
                        'property_name': b.property.name if b.property else 'N/A',
                        'check_in': b.check_in.isoformat() if b.check_in else None,
                        'check_out': b.check_out.isoformat() if b.check_out else None,
                        'status': b.status
                    }
                    for b in active_bookings
                ],
                'booking_history': [
                    {
                        'id': b.id,
                        'property_name': b.property.name if b.property else 'N/A',
                        'check_in': b.check_in.isoformat() if b.check_in else None,
                        'check_out': b.check_out.isoformat() if b.check_out else None,
                        'status': b.status
                    }
                    for b in booking_history
                ]
            }
            
        except Exception as e:
            logger.error(f"Erro ao obter contexto do usuário: {str(e)}")
            return {}
    
    def _get_weather_context(self, location: str) -> Dict[str, Any]:
        """Obtém contexto climático"""
        try:
            # Verificar cache primeiro
            cache_key = f"weather_context_{location}"
            cached_data = cache_service.get(cache_key)
            if cached_data:
                return cached_data
            
            # Simular dados climáticos (em produção, usar APIs reais)
            weather_data = {
                'location': location,
                'temperature': 25,
                'condition': 'Ensolarado',
                'humidity': 65,
                'forecast': 'Tempo estável para os próximos dias'
            }
            
            # Salvar no cache
            cache_service.set(cache_key, weather_data, ttl=1800)
            return weather_data
            
        except Exception as e:
            logger.error(f"Erro ao obter contexto climático: {str(e)}")
            return {}
    
    def _get_property_recommendations(self, user_preferences: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Obtém recomendações de propriedades"""
        try:
            db = next(get_db())
            
            # Buscar propriedades baseado em preferências
            query = db.query(Property).filter(Property.status == 'active')
            
            if 'location' in user_preferences:
                query = query.filter(Property.address.contains(user_preferences['location']))
            
            if 'price_range' in user_preferences:
                min_price, max_price = user_preferences['price_range']
                query = query.filter(Property.price_per_night.between(min_price, max_price))
            
            properties = query.limit(5).all()
            
            return [
                {
                    'id': p.id,
                    'name': p.name,
                    'address': p.address,
                    'price_per_night': p.price_per_night,
                    'rating': p.rating,
                    'description': p.description
                }
                for p in properties
            ]
            
        except Exception as e:
            logger.error(f"Erro ao obter recomendações: {str(e)}")
            return []
    
    @retry_langchain
    async def process_message(
        self,
        message: str,
        user_id: Optional[int] = None,
        conversation_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Processa mensagem do usuário e retorna resposta"""
        
        try:
            # Determinar tipo de intenção
            intent = self._classify_intent(message)
            
            # Obter contexto relevante
            context = {}
            if user_id:
                context['user'] = self._get_user_context(user_id)
            
            if intent == 'weather':
                # Extrair localização da mensagem
                location = self._extract_location(message)
                if location:
                    context['weather'] = self._get_weather_context(location)
            
            elif intent == 'booking':
                # Extrair preferências da mensagem
                preferences = self._extract_preferences(message)
                if preferences:
                    context['recommendations'] = self._get_property_recommendations(preferences)
            
            # Criar prompt contextualizado
            prompt_template = self.prompts.get(intent, self.prompts['general'])
            
            # Formatar prompt com contexto
            formatted_prompt = prompt_optimizer.format_prompt(
                intent,
                user_message=message,
                user_context=context.get('user', {}),
                weather_data=context.get('weather', {}),
                recommendations=context.get('recommendations', []),
                conversation_history=self._get_conversation_history(conversation_id)
            )
            
            # Gerar resposta com LangChain
            response = await llm.ainvoke(formatted_prompt)
            
            # Processar resposta
            processed_response = self._process_response(response.content, intent, context)
            
            # Salvar na memória
            if conversation_id:
                self._save_conversation(conversation_id, message, processed_response)
            
            return {
                'response': processed_response,
                'intent': intent,
                'confidence': 0.85,
                'context_used': list(context.keys()),
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Erro ao processar mensagem: {str(e)}")
            return {
                'response': "Desculpe, tive um problema ao processar sua mensagem. Pode tentar novamente?",
                'intent': 'error',
                'confidence': 0.0,
                'error': str(e)
            }
    
    def _classify_intent(self, message: str) -> str:
        """Classifica a intenção da mensagem"""
        message_lower = message.lower()
        
        # Palavras-chave para classificação
        weather_keywords = ['clima', 'tempo', 'chuva', 'sol', 'temperatura', 'previsão']
        booking_keywords = ['reserva', 'hospedagem', 'hotel', 'pousada', 'alugar', 'disponível']
        payment_keywords = ['pagamento', 'pagar', 'cartão', 'boleto', 'pix', 'preço']
        general_keywords = ['ajuda', 'informação', 'dúvida', 'como', 'quando', 'onde']
        
        if any(keyword in message_lower for keyword in weather_keywords):
            return 'weather'
        elif any(keyword in message_lower for keyword in booking_keywords):
            return 'booking'
        elif any(keyword in message_lower for keyword in payment_keywords):
            return 'payment'
        elif any(keyword in message_lower for keyword in general_keywords):
            return 'general'
        else:
            return 'general'
    
    def _extract_location(self, message: str) -> Optional[str]:
        """Extrai localização da mensagem"""
        # Implementação simples - em produção usar NER
        locations = ['Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador', 'Recife']
        message_lower = message.lower()
        
        for location in locations:
            if location.lower() in message_lower:
                return location
        
        return None
    
    def _extract_preferences(self, message: str) -> Dict[str, Any]:
        """Extrai preferências da mensagem"""
        preferences = {}
        message_lower = message.lower()
        
        # Extrair localização
        location = self._extract_location(message)
        if location:
            preferences['location'] = location
        
        # Extrair faixa de preço (simplificado)
        if 'barato' in message_lower or 'econômico' in message_lower:
            preferences['price_range'] = (50, 150)
        elif 'luxo' in message_lower or 'premium' in message_lower:
            preferences['price_range'] = (300, 1000)
        else:
            preferences['price_range'] = (100, 300)
        
        return preferences
    
    def _process_response(self, response: str, intent: str, context: Dict[str, Any]) -> str:
        """Processa e melhora a resposta"""
        
        # Adicionar informações contextuais
        if intent == 'booking' and context.get('user'):
            user_context = context['user']
            if user_context.get('active_bookings'):
                response += f"\n\nVocê tem {len(user_context['active_bookings'])} reserva(s) ativa(s)."
        
        if intent == 'weather' and context.get('weather'):
            weather = context['weather']
            response += f"\n\nInformações climáticas para {weather.get('location', 'sua região')}: {weather.get('condition', 'N/A')}, {weather.get('temperature', 'N/A')}°C"
        
        return response
    
    def _get_conversation_history(self, conversation_id: Optional[str]) -> List[Dict[str, str]]:
        """Obtém histórico da conversa"""
        if not conversation_id:
            return []
        
        return self.conversations.get(conversation_id, [])
    
    def _save_conversation(self, conversation_id: str, user_message: str, bot_response: str):
        """Salva mensagem na conversa"""
        if conversation_id not in self.conversations:
            self.conversations[conversation_id] = []
        
        self.conversations[conversation_id].append({
            'user': user_message,
            'bot': bot_response,
            'timestamp': datetime.now().isoformat()
        })
        
        # Manter apenas últimas 10 mensagens
        if len(self.conversations[conversation_id]) > 10:
            self.conversations[conversation_id] = self.conversations[conversation_id][-10:]

# Instância global do chatbot
chatbot_service = ChatbotService()

# WebSocket connections
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)
    
    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.get("/")
def read_root():
    return {
        "service": "Chatbot Inteligente",
        "version": "2.2.0",
        "status": "running",
        "capabilities": [
            "Assistência com reservas",
            "Informações climáticas",
            "Suporte a pagamentos",
            "Recomendações personalizadas"
        ]
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "active_connections": len(manager.active_connections)
    }

@app.post("/api/chat/message")
async def send_message(
    message: str,
    user_id: Optional[int] = None,
    conversation_id: Optional[str] = None
):
    """Envia mensagem para o chatbot"""
    try:
        response = await chatbot_service.process_message(message, user_id, conversation_id)
        return response
    except Exception as e:
        logger.error(f"Erro no endpoint de chat: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/chat/history/{conversation_id}")
def get_conversation_history(conversation_id: str):
    """Obtém histórico de conversa"""
    try:
        history = chatbot_service._get_conversation_history(conversation_id)
        return {
            "conversation_id": conversation_id,
            "messages": history,
            "total_messages": len(history)
        }
    except Exception as e:
        logger.error(f"Erro ao obter histórico: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/chat/history/{conversation_id}")
def clear_conversation_history(conversation_id: str):
    """Limpa histórico de conversa"""
    try:
        if conversation_id in chatbot_service.conversations:
            del chatbot_service.conversations[conversation_id]
        return {"message": "Histórico limpo com sucesso"}
    except Exception as e:
        logger.error(f"Erro ao limpar histórico: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws/chat/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Processar mensagem
            response = await chatbot_service.process_message(
                message_data['message'],
                user_id,
                message_data.get('conversation_id')
            )
            
            # Enviar resposta
            await manager.send_personal_message(
                json.dumps(response),
                websocket
            )
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"Erro no WebSocket: {str(e)}")
        manager.disconnect(websocket)

@app.get("/api/chat/intents")
def get_supported_intents():
    """Retorna intenções suportadas pelo chatbot"""
    return {
        "intents": [
            {
                "name": "weather",
                "description": "Informações climáticas",
                "keywords": ["clima", "tempo", "chuva", "sol", "temperatura"]
            },
            {
                "name": "booking",
                "description": "Assistência com reservas",
                "keywords": ["reserva", "hospedagem", "hotel", "disponível"]
            },
            {
                "name": "payment",
                "description": "Suporte a pagamentos",
                "keywords": ["pagamento", "pagar", "cartão", "preço"]
            },
            {
                "name": "general",
                "description": "Assistência geral",
                "keywords": ["ajuda", "informação", "dúvida"]
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5006) 