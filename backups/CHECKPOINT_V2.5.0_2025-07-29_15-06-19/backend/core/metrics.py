"""
Middleware de Métricas para FastAPI
Coleta métricas de performance para Prometheus
"""

import time
import logging
from typing import Callable
from fastapi import Request, Response
from prometheus_client import Counter, Histogram, Gauge, generate_latest, CONTENT_TYPE_LATEST
from prometheus_client.metrics import CounterMetricFamily, HistogramMetricFamily, GaugeMetricFamily
import psutil
import threading

logger = logging.getLogger(__name__)

# Métricas HTTP
http_requests_total = Counter(
    'http_requests_total',
    'Total de requisições HTTP',
    ['method', 'endpoint', 'status']
)

http_request_duration_seconds = Histogram(
    'http_request_duration_seconds',
    'Duração das requisições HTTP',
    ['method', 'endpoint'],
    buckets=[0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0]
)

http_request_size_bytes = Histogram(
    'http_request_size_bytes',
    'Tamanho das requisições HTTP',
    ['method', 'endpoint'],
    buckets=[100, 1000, 5000, 10000, 50000, 100000]
)

http_response_size_bytes = Histogram(
    'http_response_size_bytes',
    'Tamanho das respostas HTTP',
    ['method', 'endpoint'],
    buckets=[100, 1000, 5000, 10000, 50000, 100000]
)

# Métricas de negócio
auth_failures_total = Counter(
    'auth_failures_total',
    'Total de falhas de autenticação'
)

rate_limit_exceeded_total = Counter(
    'rate_limit_exceeded_total',
    'Total de excedentes de rate limit'
)

notifications_sent_total = Counter(
    'notifications_sent_total',
    'Total de notificações enviadas',
    ['type', 'status']
)

notifications_failed_total = Counter(
    'notifications_failed_total',
    'Total de notificações que falharam'
)

websocket_connections_total = Gauge(
    'websocket_connections_total',
    'Total de conexões WebSocket ativas'
)

websocket_messages_total = Counter(
    'websocket_messages_total',
    'Total de mensagens WebSocket',
    ['type']
)

# Métricas de banco de dados
db_connections_total = Gauge(
    'db_connections_total',
    'Total de conexões de banco de dados',
    ['database']
)

db_query_duration_seconds = Histogram(
    'db_query_duration_seconds',
    'Duração das queries de banco de dados',
    ['database', 'operation'],
    buckets=[0.01, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0]
)

db_errors_total = Counter(
    'db_errors_total',
    'Total de erros de banco de dados',
    ['database', 'error_type']
)

# Métricas de cache
cache_hits_total = Counter(
    'cache_hits_total',
    'Total de hits no cache',
    ['cache_type']
)

cache_misses_total = Counter(
    'cache_misses_total',
    'Total de misses no cache',
    ['cache_type']
)

cache_requests_total = Counter(
    'cache_requests_total',
    'Total de requisições ao cache',
    ['cache_type']
)

# Métricas de sistema
system_cpu_usage_percent = Gauge(
    'system_cpu_usage_percent',
    'Uso de CPU do sistema'
)

system_memory_usage_bytes = Gauge(
    'system_memory_usage_bytes',
    'Uso de memória do sistema'
)

system_disk_usage_percent = Gauge(
    'system_disk_usage_percent',
    'Uso de disco do sistema'
)

# Métricas de negócio específicas
gift_cards_created_total = Counter(
    'gift_cards_created_total',
    'Total de gift cards criados'
)

gift_cards_used_total = Counter(
    'gift_cards_used_total',
    'Total de gift cards utilizados'
)

gift_cards_value_total = Gauge(
    'gift_cards_value_total',
    'Valor total de gift cards ativos'
)

bookings_created_total = Counter(
    'bookings_created_total',
    'Total de reservas criadas',
    ['status']
)

payments_processed_total = Counter(
    'payments_processed_total',
    'Total de pagamentos processados',
    ['status', 'payment_method']
)

payments_amount_total = Counter(
    'payments_amount_total',
    'Valor total de pagamentos processados',
    ['status', 'payment_method']
)

class MetricsMiddleware:
    """Middleware para coletar métricas de requisições HTTP"""
    
    def __init__(self, app):
        self.app = app
    
    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return
        
        start_time = time.time()
        request = Request(scope, receive)
        
        # Capturar tamanho da requisição
        content_length = request.headers.get("content-length")
        if content_length:
            http_request_size_bytes.labels(
                method=request.method,
                endpoint=request.url.path
            ).observe(float(content_length))
        
        # Processar requisição
        response = await self.app(scope, receive, send)
        
        # Calcular duração
        duration = time.time() - start_time
        
        # Capturar métricas
        status_code = response.status_code if hasattr(response, 'status_code') else 200
        
        http_requests_total.labels(
            method=request.method,
            endpoint=request.url.path,
            status=status_code
        ).inc()
        
        http_request_duration_seconds.labels(
            method=request.method,
            endpoint=request.url.path
        ).observe(duration)
        
        # Capturar tamanho da resposta
        if hasattr(response, 'headers'):
            content_length = response.headers.get("content-length")
            if content_length:
                http_response_size_bytes.labels(
                    method=request.method,
                    endpoint=request.url.path
                ).observe(float(content_length))
        
        return response

class SystemMetricsCollector:
    """Coletor de métricas do sistema"""
    
    def __init__(self):
        self.running = False
        self.thread = None
    
    def start(self):
        """Iniciar coleta de métricas do sistema"""
        if not self.running:
            self.running = True
            self.thread = threading.Thread(target=self._collect_metrics, daemon=True)
            self.thread.start()
            logger.info("📊 Coletor de métricas do sistema iniciado")
    
    def stop(self):
        """Parar coleta de métricas do sistema"""
        self.running = False
        if self.thread:
            self.thread.join()
            logger.info("📊 Coletor de métricas do sistema parado")
    
    def _collect_metrics(self):
        """Coletar métricas do sistema em loop"""
        while self.running:
            try:
                # CPU
                cpu_percent = psutil.cpu_percent(interval=1)
                system_cpu_usage_percent.set(cpu_percent)
                
                # Memória
                memory = psutil.virtual_memory()
                system_memory_usage_bytes.set(memory.used)
                
                # Disco
                disk = psutil.disk_usage('/')
                disk_percent = (disk.used / disk.total) * 100
                system_disk_usage_percent.set(disk_percent)
                
                time.sleep(30)  # Coletar a cada 30 segundos
                
            except Exception as e:
                logger.error(f"Erro ao coletar métricas do sistema: {e}")
                time.sleep(60)  # Aguardar mais tempo em caso de erro

# Instância global do coletor
system_collector = SystemMetricsCollector()

def setup_metrics(app):
    """Configurar métricas na aplicação FastAPI"""
    
    # Adicionar middleware
    app.add_middleware(MetricsMiddleware)
    
    # Iniciar coletor de métricas do sistema
    system_collector.start()
    
    # Endpoint para métricas
    @app.get("/metrics")
    async def metrics():
        """Endpoint para métricas do Prometheus"""
        return Response(
            content=generate_latest(),
            media_type=CONTENT_TYPE_LATEST
        )
    
    # Endpoint de health check com métricas
    @app.get("/health")
    async def health_check():
        """Health check com métricas básicas"""
        return {
            "status": "healthy",
            "timestamp": time.time(),
            "metrics": {
                "cpu_usage": psutil.cpu_percent(),
                "memory_usage": psutil.virtual_memory().percent,
                "disk_usage": (psutil.disk_usage('/').used / psutil.disk_usage('/').total) * 100
            }
        }

# Funções utilitárias para métricas de negócio
def record_auth_failure():
    """Registrar falha de autenticação"""
    auth_failures_total.inc()

def record_rate_limit_exceeded():
    """Registrar excedente de rate limit"""
    rate_limit_exceeded_total.inc()

def record_notification_sent(notification_type: str, status: str = "success"):
    """Registrar notificação enviada"""
    notifications_sent_total.labels(type=notification_type, status=status).inc()
    if status == "failed":
        notifications_failed_total.inc()

def record_websocket_connection(connected: bool):
    """Registrar conexão WebSocket"""
    if connected:
        websocket_connections_total.inc()
    else:
        websocket_connections_total.dec()

def record_websocket_message(message_type: str):
    """Registrar mensagem WebSocket"""
    websocket_messages_total.labels(type=message_type).inc()

def record_db_operation(database: str, operation: str, duration: float, success: bool = True):
    """Registrar operação de banco de dados"""
    db_query_duration_seconds.labels(database=database, operation=operation).observe(duration)
    if not success:
        db_errors_total.labels(database=database, error_type="query_error").inc()

def record_cache_operation(cache_type: str, hit: bool):
    """Registrar operação de cache"""
    cache_requests_total.labels(cache_type=cache_type).inc()
    if hit:
        cache_hits_total.labels(cache_type=cache_type).inc()
    else:
        cache_misses_total.labels(cache_type=cache_type).inc()

def record_gift_card_created():
    """Registrar gift card criado"""
    gift_cards_created_total.inc()

def record_gift_card_used():
    """Registrar gift card utilizado"""
    gift_cards_used_total.inc()

def record_booking_created(status: str):
    """Registrar reserva criada"""
    bookings_created_total.labels(status=status).inc()

def record_payment_processed(status: str, payment_method: str, amount: float):
    """Registrar pagamento processado"""
    payments_processed_total.labels(status=status, payment_method=payment_method).inc()
    payments_amount_total.labels(status=status, payment_method=payment_method).inc(amount) 