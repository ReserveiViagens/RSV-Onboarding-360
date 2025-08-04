"""
WebSocket Manager para Sistema de Notificações em Tempo Real
Onion RSV 360 - Core Service
"""

import json
import asyncio
from typing import Dict, Set, Optional
from fastapi import WebSocket, WebSocketDisconnect
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class ConnectionManager:
    """Gerenciador de conexões WebSocket"""
    
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.user_connections: Dict[str, Set[str]] = {}  # user_id -> set of connection_ids
        
    async def connect(self, websocket: WebSocket, connection_id: str, user_id: Optional[str] = None):
        """Conecta um novo cliente WebSocket"""
        await websocket.accept()
        self.active_connections[connection_id] = websocket
        
        if user_id:
            if user_id not in self.user_connections:
                self.user_connections[user_id] = set()
            self.user_connections[user_id].add(connection_id)
        
        logger.info(f"🔌 WebSocket conectado: {connection_id} (user: {user_id})")
        
        # Envia mensagem de confirmação
        await self.send_personal_message({
            "type": "connection_established",
            "connection_id": connection_id,
            "timestamp": datetime.utcnow().isoformat()
        }, connection_id)
    
    def disconnect(self, connection_id: str, user_id: Optional[str] = None):
        """Desconecta um cliente WebSocket"""
        if connection_id in self.active_connections:
            del self.active_connections[connection_id]
        
        if user_id and user_id in self.user_connections:
            self.user_connections[user_id].discard(connection_id)
            if not self.user_connections[user_id]:
                del self.user_connections[user_id]
        
        logger.info(f"🔌 WebSocket desconectado: {connection_id} (user: {user_id})")
    
    async def send_personal_message(self, message: dict, connection_id: str):
        """Envia mensagem para uma conexão específica"""
        if connection_id in self.active_connections:
            try:
                await self.active_connections[connection_id].send_text(json.dumps(message))
            except Exception as e:
                logger.error(f"Erro ao enviar mensagem para {connection_id}: {e}")
                self.disconnect(connection_id)
    
    async def send_to_user(self, message: dict, user_id: str):
        """Envia mensagem para todas as conexões de um usuário"""
        if user_id in self.user_connections:
            for connection_id in self.user_connections[user_id].copy():
                await self.send_personal_message(message, connection_id)
    
    async def broadcast(self, message: dict):
        """Envia mensagem para todas as conexões ativas"""
        disconnected = []
        for connection_id, websocket in self.active_connections.items():
            try:
                await websocket.send_text(json.dumps(message))
            except Exception as e:
                logger.error(f"Erro ao enviar broadcast para {connection_id}: {e}")
                disconnected.append(connection_id)
        
        # Remove conexões desconectadas
        for connection_id in disconnected:
            self.disconnect(connection_id)
    
    def get_connection_count(self) -> int:
        """Retorna o número de conexões ativas"""
        return len(self.active_connections)
    
    def get_user_connection_count(self, user_id: str) -> int:
        """Retorna o número de conexões de um usuário específico"""
        return len(self.user_connections.get(user_id, set()))

# Instância global do gerenciador de conexões
manager = ConnectionManager()

class NotificationService:
    """Serviço de notificações em tempo real"""
    
    @staticmethod
    async def send_notification(
        user_id: str,
        notification_type: str,
        title: str,
        message: str,
        action_url: Optional[str] = None,
        metadata: Optional[dict] = None
    ):
        """Envia uma notificação para um usuário específico"""
        notification = {
            "type": "notification",
            "notification": {
                "id": f"notif_{datetime.utcnow().timestamp()}",
                "type": notification_type,
                "title": title,
                "message": message,
                "timestamp": datetime.utcnow().isoformat(),
                "read": False,
                "action_url": action_url,
                "metadata": metadata or {}
            }
        }
        
        await manager.send_to_user(notification, user_id)
        logger.info(f"📨 Notificação enviada para usuário {user_id}: {title}")
    
    @staticmethod
    async def send_system_notification(
        notification_type: str,
        title: str,
        message: str,
        action_url: Optional[str] = None,
        metadata: Optional[dict] = None
    ):
        """Envia uma notificação do sistema para todos os usuários"""
        notification = {
            "type": "system_notification",
            "notification": {
                "id": f"sys_{datetime.utcnow().timestamp()}",
                "type": notification_type,
                "title": title,
                "message": message,
                "timestamp": datetime.utcnow().isoformat(),
                "read": False,
                "action_url": action_url,
                "metadata": metadata or {}
            }
        }
        
        await manager.broadcast(notification)
        logger.info(f"📢 Notificação do sistema enviada: {title}")
    
    @staticmethod
    async def send_booking_notification(
        user_id: str,
        booking_id: str,
        status: str,
        details: dict
    ):
        """Envia notificação relacionada a reservas"""
        status_messages = {
            "confirmed": "Sua reserva foi confirmada!",
            "cancelled": "Sua reserva foi cancelada.",
            "modified": "Sua reserva foi modificada.",
            "reminder": "Lembrete: sua reserva está chegando!"
        }
        
        await NotificationService.send_notification(
            user_id=user_id,
            notification_type="success" if status == "confirmed" else "info",
            title=f"Reserva {status.title()}",
            message=status_messages.get(status, f"Status da reserva: {status}"),
            action_url=f"/bookings/{booking_id}",
            metadata={"booking_id": booking_id, "status": status, **details}
        )
    
    @staticmethod
    async def send_payment_notification(
        user_id: str,
        payment_id: str,
        status: str,
        amount: float,
        currency: str = "BRL"
    ):
        """Envia notificação relacionada a pagamentos"""
        status_messages = {
            "completed": "Pagamento processado com sucesso!",
            "failed": "Falha no processamento do pagamento.",
            "pending": "Pagamento em processamento.",
            "refunded": "Reembolso processado."
        }
        
        await NotificationService.send_notification(
            user_id=user_id,
            notification_type="success" if status == "completed" else "warning",
            title=f"Pagamento {status.title()}",
            message=f"{status_messages.get(status, f'Status: {status}')} - {currency} {amount:.2f}",
            action_url=f"/payments/{payment_id}",
            metadata={"payment_id": payment_id, "status": status, "amount": amount, "currency": currency}
        )
    
    @staticmethod
    async def send_security_notification(
        user_id: str,
        event_type: str,
        details: dict
    ):
        """Envia notificação de segurança"""
        event_messages = {
            "login": "Novo login detectado",
            "password_change": "Senha alterada com sucesso",
            "suspicious_activity": "Atividade suspeita detectada",
            "account_locked": "Conta bloqueada por segurança"
        }
        
        await NotificationService.send_notification(
            user_id=user_id,
            notification_type="warning" if event_type == "suspicious_activity" else "info",
            title="Alerta de Segurança",
            message=event_messages.get(event_type, f"Evento de segurança: {event_type}"),
            action_url="/security",
            metadata={"event_type": event_type, **details}
        )

async def websocket_endpoint(websocket: WebSocket, connection_id: str, user_id: Optional[str] = None):
    """Endpoint WebSocket para notificações"""
    await manager.connect(websocket, connection_id, user_id)
    
    try:
        while True:
            # Aguarda mensagens do cliente
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Processa diferentes tipos de mensagem
            if message.get("type") == "ping":
                await manager.send_personal_message({"type": "pong"}, connection_id)
            
            elif message.get("type") == "subscribe":
                # Cliente quer se inscrever em um canal específico
                channel = message.get("channel")
                if channel:
                    logger.info(f"📡 Cliente {connection_id} inscrito no canal: {channel}")
                    await manager.send_personal_message({
                        "type": "subscribed",
                        "channel": channel
                    }, connection_id)
            
            elif message.get("type") == "unsubscribe":
                # Cliente quer se desinscrever de um canal
                channel = message.get("channel")
                if channel:
                    logger.info(f"📡 Cliente {connection_id} desinscrito do canal: {channel}")
                    await manager.send_personal_message({
                        "type": "unsubscribed",
                        "channel": channel
                    }, connection_id)
    
    except WebSocketDisconnect:
        manager.disconnect(connection_id, user_id)
    except Exception as e:
        logger.error(f"Erro no WebSocket {connection_id}: {e}")
        manager.disconnect(connection_id, user_id) 