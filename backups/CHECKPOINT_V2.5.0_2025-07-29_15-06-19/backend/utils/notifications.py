import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import requests
import json
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime
import os
from dataclasses import dataclass

logger = logging.getLogger(__name__)

@dataclass
class NotificationConfig:
    """Configuração para notificações"""
    slack_webhook_url: str
    slack_channel: str
    smtp_server: str
    smtp_port: int
    smtp_username: str
    smtp_password: str
    from_email: str
    admin_emails: List[str]

class NotificationService:
    """Serviço de notificações integrado"""
    
    def __init__(self, config: NotificationConfig):
        self.config = config
        self.notification_types = {
            'critical': {'slack': True, 'email': True, 'priority': 'high'},
            'warning': {'slack': True, 'email': False, 'priority': 'medium'},
            'info': {'slack': False, 'email': False, 'priority': 'low'},
            'success': {'slack': False, 'email': False, 'priority': 'low'}
        }
    
    async def send_notification(
        self,
        title: str,
        message: str,
        notification_type: str = 'info',
        recipients: Optional[List[str]] = None,
        data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, bool]:
        """Envia notificação via múltiplos canais"""
        
        results = {
            'slack': False,
            'email': False
        }
        
        config = self.notification_types.get(notification_type, self.notification_types['info'])
        
        # Enviar para Slack se configurado
        if config['slack']:
            results['slack'] = await self._send_slack_notification(
                title, message, notification_type, data
            )
        
        # Enviar email se configurado
        if config['email']:
            email_recipients = recipients or self.config.admin_emails
            results['email'] = await self._send_email_notification(
                title, message, notification_type, email_recipients, data
            )
        
        logger.info(f"Notificação enviada: {title} - Slack: {results['slack']}, Email: {results['email']}")
        return results
    
    async def _send_slack_notification(
        self,
        title: str,
        message: str,
        notification_type: str,
        data: Optional[Dict[str, Any]] = None
    ) -> bool:
        """Envia notificação para Slack"""
        try:
            # Definir cor baseada no tipo
            colors = {
                'critical': '#ff0000',  # Vermelho
                'warning': '#ffa500',   # Laranja
                'info': '#0000ff',      # Azul
                'success': '#00ff00'    # Verde
            }
            
            color = colors.get(notification_type, '#0000ff')
            
            # Criar payload do Slack
            payload = {
                "channel": self.config.slack_channel,
                "attachments": [
                    {
                        "color": color,
                        "title": title,
                        "text": message,
                        "fields": [],
                        "footer": "Onion RSV 360",
                        "ts": int(datetime.now().timestamp())
                    }
                ]
            }
            
            # Adicionar campos se houver dados extras
            if data:
                for key, value in data.items():
                    payload["attachments"][0]["fields"].append({
                        "title": key.title(),
                        "value": str(value),
                        "short": True
                    })
            
            # Enviar para Slack
            response = requests.post(
                self.config.slack_webhook_url,
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                logger.info(f"Notificação Slack enviada: {title}")
                return True
            else:
                logger.error(f"Erro ao enviar para Slack: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"Erro ao enviar notificação Slack: {str(e)}")
            return False
    
    async def _send_email_notification(
        self,
        title: str,
        message: str,
        notification_type: str,
        recipients: List[str],
        data: Optional[Dict[str, Any]] = None
    ) -> bool:
        """Envia notificação por email"""
        try:
            # Criar mensagem
            msg = MIMEMultipart()
            msg['From'] = self.config.from_email
            msg['To'] = ', '.join(recipients)
            msg['Subject'] = f"[{notification_type.upper()}] {title}"
            
            # Criar corpo do email
            body = f"""
            <html>
            <body>
                <h2>{title}</h2>
                <p><strong>Tipo:</strong> {notification_type.upper()}</p>
                <p><strong>Data/Hora:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
                <hr>
                <p>{message}</p>
            """
            
            # Adicionar dados extras se houver
            if data:
                body += "<h3>Detalhes Adicionais:</h3><ul>"
                for key, value in data.items():
                    body += f"<li><strong>{key}:</strong> {value}</li>"
                body += "</ul>"
            
            body += """
                <hr>
                <p><em>Esta é uma notificação automática do sistema Onion RSV 360.</em></p>
            </body>
            </html>
            """
            
            msg.attach(MIMEText(body, 'html'))
            
            # Enviar email
            context = ssl.create_default_context()
            with smtplib.SMTP_SSL(self.config.smtp_server, self.config.smtp_port, context=context) as server:
                server.login(self.config.smtp_username, self.config.smtp_password)
                server.send_message(msg)
            
            logger.info(f"Email enviado para {len(recipients)} destinatários: {title}")
            return True
            
        except Exception as e:
            logger.error(f"Erro ao enviar email: {str(e)}")
            return False
    
    async def send_alert(
        self,
        alert_type: str,
        message: str,
        severity: str = 'warning',
        data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, bool]:
        """Envia alerta específico do sistema"""
        
        title = f"Alerta do Sistema - {alert_type}"
        
        # Personalizar mensagem baseada no tipo de alerta
        if alert_type == 'weather':
            title = f"🌤️ Alerta Climático - {alert_type}"
        elif alert_type == 'payment':
            title = f"💳 Alerta de Pagamento - {alert_type}"
        elif alert_type == 'ml':
            title = f"🤖 Alerta de ML - {alert_type}"
        elif alert_type == 'api':
            title = f"🔌 Alerta de API - {alert_type}"
        
        return await self.send_notification(title, message, severity, data=data)
    
    async def send_weather_alert(
        self,
        location: str,
        weather_condition: str,
        severity: str,
        recommendations: List[str]
    ) -> Dict[str, bool]:
        """Envia alerta específico de clima"""
        
        message = f"""
        Localização: {location}
        Condição: {weather_condition}
        Severidade: {severity}
        
        Recomendações:
        {chr(10).join(f"• {rec}" for rec in recommendations)}
        """
        
        return await self.send_alert('weather', message, severity, {
            'location': location,
            'condition': weather_condition,
            'recommendations': recommendations
        })
    
    async def send_payment_alert(
        self,
        payment_id: int,
        amount: float,
        status: str,
        gateway: str,
        error_message: Optional[str] = None
    ) -> Dict[str, bool]:
        """Envia alerta específico de pagamento"""
        
        message = f"""
        ID do Pagamento: {payment_id}
        Valor: R$ {amount:.2f}
        Status: {status}
        Gateway: {gateway}
        """
        
        if error_message:
            message += f"\nErro: {error_message}"
        
        severity = 'critical' if status == 'failed' else 'warning'
        
        return await self.send_alert('payment', message, severity, {
            'payment_id': payment_id,
            'amount': amount,
            'status': status,
            'gateway': gateway,
            'error': error_message
        })
    
    async def send_ml_alert(
        self,
        model_type: str,
        error_rate: float,
        prediction_count: int,
        recommendations: List[str]
    ) -> Dict[str, bool]:
        """Envia alerta específico de Machine Learning"""
        
        message = f"""
        Modelo: {model_type}
        Taxa de Erro: {error_rate:.2%}
        Previsões: {prediction_count}
        
        Recomendações:
        {chr(10).join(f"• {rec}" for rec in recommendations)}
        """
        
        severity = 'critical' if error_rate > 0.1 else 'warning'
        
        return await self.send_alert('ml', message, severity, {
            'model_type': model_type,
            'error_rate': error_rate,
            'prediction_count': prediction_count,
            'recommendations': recommendations
        })
    
    async def send_api_alert(
        self,
        api_name: str,
        endpoint: str,
        status_code: int,
        response_time: float,
        error_message: Optional[str] = None
    ) -> Dict[str, bool]:
        """Envia alerta específico de API"""
        
        message = f"""
        API: {api_name}
        Endpoint: {endpoint}
        Status: {status_code}
        Tempo de Resposta: {response_time:.2f}s
        """
        
        if error_message:
            message += f"\nErro: {error_message}"
        
        severity = 'critical' if status_code >= 500 else 'warning'
        
        return await self.send_alert('api', message, severity, {
            'api_name': api_name,
            'endpoint': endpoint,
            'status_code': status_code,
            'response_time': response_time,
            'error': error_message
        })

# Configuração padrão (será sobrescrita por variáveis de ambiente)
default_config = NotificationConfig(
    slack_webhook_url=os.getenv("SLACK_WEBHOOK_URL", ""),
    slack_channel=os.getenv("SLACK_CHANNEL", "#alerts"),
    smtp_server=os.getenv("SMTP_SERVER", "smtp.gmail.com"),
    smtp_port=int(os.getenv("SMTP_PORT", "587")),
    smtp_username=os.getenv("SMTP_USERNAME", ""),
    smtp_password=os.getenv("SMTP_PASSWORD", ""),
    from_email=os.getenv("FROM_EMAIL", "alerts@onionrsv.com"),
    admin_emails=os.getenv("ADMIN_EMAILS", "").split(",") if os.getenv("ADMIN_EMAILS") else []
)

# Instância global
notification_service = NotificationService(default_config) 