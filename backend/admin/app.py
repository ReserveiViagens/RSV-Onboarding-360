from fastapi import FastAPI, Depends, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import logging
import os
import json
from datetime import datetime, timedelta
from pydantic import BaseModel, validator

import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from shared.config.database import get_db
from shared.models.booking import Booking
from shared.models.user import User

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuração de segurança
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

app = FastAPI(
    title="Serviço Administrativo - Onion RSV 360",
    version="2.1.0",
    description="Interface administrativa para gerenciamento de eventos personalizados"
)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "admin", "version": "2.1.0"}

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Schemas para eventos personalizados
class CustomEventCreate(BaseModel):
    booking_id: int
    custom_message: str
    user_ids: List[int]
    event_type: Optional[str] = "custom"
    priority: Optional[str] = "normal"  # low, normal, high, critical
    
    @validator('custom_message')
    def validate_message(cls, v):
        if len(v) < 5 or len(v) > 500:
            raise ValueError("Mensagem deve ter entre 5 e 500 caracteres")
        return SecurityUtils.sanitize_input(v)
    
    @validator('user_ids')
    def validate_user_ids(cls, v):
        if not v:
            raise ValueError("Pelo menos um usuário deve ser especificado")
        if len(v) > 100:
            raise ValueError("Máximo de 100 usuários por evento")
        return v

class CustomEventResponse(BaseModel):
    id: str
    booking_id: int
    custom_message: str
    user_ids: List[int]
    event_type: str
    priority: str
    created_at: datetime
    status: str

class EventNotification(BaseModel):
    event_id: str
    title: str
    message: str
    action_url: Optional[str] = None
    expires_at: Optional[datetime] = None

def get_db():
    """Dependency para obter sessão do banco"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def notify_event(event_type: str, booking_id: int, user_ids: List[int], custom_message: str):
    """Enviar notificação de evento personalizado"""
    try:
        # Aqui você implementaria a lógica real de notificação
        # Por exemplo, enviar para WebSocket, email, push notification, etc.
        logger.info(f"Notificação de evento personalizado enviada: {event_type} para reserva {booking_id} - {custom_message}")
        
        # Simular envio para diferentes canais
        notification_data = {
            "event_type": event_type,
            "booking_id": booking_id,
            "user_ids": user_ids,
            "message": custom_message,
            "timestamp": datetime.utcnow().isoformat(),
            "channels": ["websocket", "email", "push"]
        }
        
        # Log da notificação
        logger.info(f"Notificação enviada: {json.dumps(notification_data, indent=2)}")
        
        return {
            "status": "success",
            "message": "Evento personalizado criado e notificações enviadas",
            "notification_data": notification_data
        }
    except Exception as e:
        logger.error(f"Erro ao enviar notificação: {str(e)}")
        return {"status": "error", "message": str(e)}

@app.get("/")
def read_root():
    """Endpoint raiz"""
    return {
        "message": "Serviço Administrativo - Onion RSV 360",
        "version": "2.1.0",
        "status": "ativo",
        "features": ["Eventos Personalizados", "Gestão de Usuários", "Notificações"],
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/health")
def health_check():
    """Verificação de saúde"""
    return {
        "status": "saudavel",
        "servico": "admin",
        "versao": "2.1.0",
        "features": {
            "eventos_personalizados": "disponivel",
            "gestao_usuarios": "disponivel",
            "notificacoes": "disponivel"
        },
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/status")
def api_status():
    """Status detalhado da API"""
    return {
        "servico": "admin",
        "versao": "2.1.0",
        "status": "operacional",
        "features": {
            "eventos_personalizados": "disponivel",
            "gestao_usuarios": "disponivel",
            "notificacoes": "disponivel",
            "validacao": "implementada",
            "feedback_visual": "implementado"
        },
        "endpoints": {
            "saude": "/health",
            "eventos": "/api/admin/custom-events",
            "usuarios": "/api/admin/users",
            "notificacoes": "/api/admin/notifications"
        }
    }

@app.post("/api/admin/custom-events", response_model=CustomEventResponse)
async def create_custom_event(
    event_data: CustomEventCreate,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """Criar evento personalizado com validação e feedback"""
    try:
        # Verificar se o usuário tem permissões de admin
        current_user = await get_current_user(token)
        if not current_user or "admin" not in current_user.get("permissions", []):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permissões insuficientes para criar eventos personalizados"
            )
        
        # Verificar se a reserva existe
        booking = db.query(Booking).filter(Booking.id == event_data.booking_id).first()
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Reserva não encontrada"
            )
        
        # Verificar se os usuários existem
        for user_id in event_data.user_ids:
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Usuário {user_id} não encontrado"
                )
        
        # Gerar ID único para o evento
        event_id = f"custom_{int(datetime.utcnow().timestamp())}"
        
        # Enviar notificação
        notification_result = await notify_event(
            event_data.event_type,
            event_data.booking_id,
            event_data.user_ids,
            event_data.custom_message
        )
        
        # Criar resposta
        response = CustomEventResponse(
            id=event_id,
            booking_id=event_data.booking_id,
            custom_message=event_data.custom_message,
            user_ids=event_data.user_ids,
            event_type=event_data.event_type,
            priority=event_data.priority,
            created_at=datetime.utcnow(),
            status="enviado" if notification_result["status"] == "success" else "erro"
        )
        
        logger.info(f"✅ Evento personalizado criado: {event_id} por {current_user.get('email')}")
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao criar evento personalizado: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@app.get("/api/admin/custom-events", response_model=List[CustomEventResponse])
async def list_custom_events(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
    limit: int = 50,
    offset: int = 0
):
    """Listar eventos personalizados criados"""
    try:
        # Verificar permissões
        current_user = await get_current_user(token)
        if not current_user or "admin" not in current_user.get("permissions", []):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permissões insuficientes"
            )
        
        # Aqui você implementaria a busca real no banco
        # Por enquanto, retornamos uma lista simulada
        events = [
            CustomEventResponse(
                id=f"custom_{i}",
                booking_id=i,
                custom_message=f"Evento personalizado de teste {i}",
                user_ids=[1, 2, 3],
                event_type="custom",
                priority="normal",
                created_at=datetime.utcnow() - timedelta(hours=i),
                status="enviado"
            )
            for i in range(1, min(limit + 1, 6))
        ]
        
        return events[offset:offset + limit]
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao listar eventos: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@app.get("/api/admin/users")
async def list_users(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
    limit: int = 50,
    offset: int = 0
):
    """Listar usuários para seleção em eventos"""
    try:
        # Verificar permissões
        current_user = await get_current_user(token)
        if not current_user or "admin" not in current_user.get("permissions", []):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permissões insuficientes"
            )
        
        # Buscar usuários no banco
        users = db.query(User).offset(offset).limit(limit).all()
        
        user_list = []
        for user in users:
            user_list.append({
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name,
                "is_active": user.is_active,
                "permissions": user.permissions,
                "created_at": user.created_at.isoformat() if user.created_at else None
            })
        
        return {
            "users": user_list,
            "total": len(user_list),
            "limit": limit,
            "offset": offset
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao listar usuários: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@app.get("/api/admin/bookings")
async def list_bookings(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
    limit: int = 50,
    offset: int = 0
):
    """Listar reservas para seleção em eventos"""
    try:
        # Verificar permissões
        current_user = await get_current_user(token)
        if not current_user or "admin" not in current_user.get("permissions", []):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permissões insuficientes"
            )
        
        # Buscar reservas no banco
        bookings = db.query(Booking).offset(offset).limit(limit).all()
        
        booking_list = []
        for booking in bookings:
            booking_list.append({
                "id": booking.id,
                "property_id": booking.property_id,
                "customer_id": booking.customer_id,
                "customer_email": booking.customer_email,
                "room_rate": booking.room_rate,
                "checkin_date": booking.checkin_date.isoformat() if booking.checkin_date else None,
                "checkout_date": booking.checkout_date.isoformat() if booking.checkout_date else None,
                "status": booking.status,
                "created_at": booking.created_at.isoformat() if booking.created_at else None
            })
        
        return {
            "bookings": booking_list,
            "total": len(booking_list),
            "limit": limit,
            "offset": offset
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao listar reservas: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@app.post("/api/admin/notifications/send")
async def send_admin_notification(
    notification: EventNotification,
    token: str = Depends(oauth2_scheme)
):
    """Enviar notificação administrativa"""
    try:
        # Verificar permissões
        current_user = await get_current_user(token)
        if not current_user or "admin" not in current_user.get("permissions", []):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permissões insuficientes"
            )
        
        # Validar dados da notificação
        if len(notification.title) < 3 or len(notification.title) > 100:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Título deve ter entre 3 e 100 caracteres"
            )
        
        if len(notification.message) < 5 or len(notification.message) > 1000:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Mensagem deve ter entre 5 e 1000 caracteres"
            )
        
        # Enviar notificação
        result = await notify_event(
            "admin_notification",
            0,  # booking_id 0 para notificações administrativas
            [],  # user_ids vazio para notificação geral
            f"{notification.title}: {notification.message}"
        )
        
        return {
            "status": "success",
            "message": "Notificação administrativa enviada",
            "notification": notification.dict(),
            "result": result
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao enviar notificação administrativa: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@app.get("/api/admin/dashboard")
async def get_admin_dashboard(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """Obter dados do dashboard administrativo"""
    try:
        # Verificar permissões
        current_user = await get_current_user(token)
        if not current_user or "admin" not in current_user.get("permissions", []):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permissões insuficientes"
            )
        
        # Estatísticas básicas
        total_users = db.query(User).count()
        total_bookings = db.query(Booking).count()
        active_bookings = db.query(Booking).filter(Booking.status == "active").count()
        
        # Eventos recentes (simulado)
        recent_events = [
            {
                "id": f"custom_{i}",
                "type": "custom",
                "message": f"Evento personalizado {i}",
                "created_at": (datetime.utcnow() - timedelta(hours=i)).isoformat(),
                "status": "enviado"
            }
            for i in range(1, 6)
        ]
        
        return {
            "statistics": {
                "total_users": total_users,
                "total_bookings": total_bookings,
                "active_bookings": active_bookings,
                "events_today": len(recent_events)
            },
            "recent_events": recent_events,
            "admin_user": {
                "email": current_user.get("email"),
                "permissions": current_user.get("permissions", [])
            },
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao obter dashboard: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5011) 