"""
🛡️ Sistema de Rate Limiting - Onion RSV 360
Proteção contra ataques DDoS e uso abusivo das APIs
"""

import time
import asyncio
from typing import Dict, Optional, Tuple
from collections import defaultdict, deque
from fastapi import HTTPException, Request, status
from datetime import datetime, timedelta
import logging

# Logger para rate limiting
rate_logger = logging.getLogger("rate_limiter")
rate_logger.setLevel(logging.WARNING)

class RateLimiter:
    """Sistema de rate limiting com sliding window"""
    
    def __init__(self):
        # Armazena requests por IP: {ip: deque[(timestamp, endpoint)]}
        self.requests: Dict[str, deque] = defaultdict(lambda: deque(maxlen=1000))
        
        # Configurações padrão
        self.default_limits = {
            "requests_per_minute": 60,
            "requests_per_hour": 1000,
            "burst_limit": 10  # Máximo de requests em 1 segundo
        }
        
        # Limites específicos por endpoint
        self.endpoint_limits = {
            "/health": {"requests_per_minute": 120, "requests_per_hour": 2000},
            "/api/auth/login": {"requests_per_minute": 5, "requests_per_hour": 50},
            "/api/auth/register": {"requests_per_minute": 3, "requests_per_hour": 20},
            "/api/admin": {"requests_per_minute": 30, "requests_per_hour": 500},
            "/api/reports": {"requests_per_minute": 20, "requests_per_hour": 200},
            "/api/payments": {"requests_per_minute": 10, "requests_per_hour": 100}
        }
        
        # IPs bloqueados temporariamente
        self.blocked_ips: Dict[str, datetime] = {}
        
        # IPs em whitelist (sem limite)
        self.whitelist = set([
            "127.0.0.1",
            "localhost",
            "::1"
        ])
        
        # Cleanup automático a cada 5 minutos
        self._last_cleanup = time.time()
        self._cleanup_interval = 300  # 5 minutos
    
    def _cleanup_old_requests(self):
        """Remove requests antigos para economizar memória"""
        current_time = time.time()
        
        if current_time - self._last_cleanup < self._cleanup_interval:
            return
        
        cutoff_time = current_time - 3600  # Remove requests de mais de 1 hora
        
        for ip, request_queue in self.requests.items():
            # Remove requests antigos
            while request_queue and request_queue[0][0] < cutoff_time:
                request_queue.popleft()
        
        # Remove IPs bloqueados que já expiraram
        expired_blocks = [
            ip for ip, block_until in self.blocked_ips.items()
            if datetime.utcnow() > block_until
        ]
        for ip in expired_blocks:
            del self.blocked_ips[ip]
            rate_logger.info(f"IP {ip} desbloqueado automaticamente")
        
        self._last_cleanup = current_time
    
    def _get_client_ip(self, request: Request) -> str:
        """Obter IP real do cliente considerando proxies"""
        # Verificar headers de proxy
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
        
        # IP direto
        return request.client.host if request.client else "unknown"
    
    def _get_limits_for_endpoint(self, endpoint: str) -> Dict[str, int]:
        """Obter limites específicos para um endpoint"""
        # Buscar match exato primeiro
        if endpoint in self.endpoint_limits:
            return {**self.default_limits, **self.endpoint_limits[endpoint]}
        
        # Buscar match parcial (ex: /api/admin/users -> /api/admin)
        for pattern, limits in self.endpoint_limits.items():
            if endpoint.startswith(pattern):
                return {**self.default_limits, **limits}
        
        return self.default_limits
    
    def _count_requests(self, request_queue: deque, time_window: int) -> int:
        """Contar requests dentro de uma janela de tempo"""
        cutoff_time = time.time() - time_window
        return sum(1 for timestamp, _ in request_queue if timestamp > cutoff_time)
    
    def _check_burst_limit(self, request_queue: deque, burst_limit: int) -> bool:
        """Verificar limite de burst (requests em 1 segundo)"""
        one_second_ago = time.time() - 1
        recent_requests = sum(1 for timestamp, _ in request_queue if timestamp > one_second_ago)
        return recent_requests >= burst_limit
    
    async def check_rate_limit(self, request: Request) -> Optional[HTTPException]:
        """Verificar se request deve ser bloqueado por rate limiting"""
        self._cleanup_old_requests()
        
        client_ip = self._get_client_ip(request)
        endpoint = request.url.path
        current_time = time.time()
        
        # Verificar whitelist
        if client_ip in self.whitelist:
            return None
        
        # Verificar se IP está bloqueado
        if client_ip in self.blocked_ips:
            block_until = self.blocked_ips[client_ip]
            if datetime.utcnow() < block_until:
                rate_logger.warning(f"Request bloqueada de IP {client_ip} (bloqueado até {block_until})")
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"IP temporariamente bloqueado até {block_until.strftime('%H:%M:%S')}",
                    headers={"Retry-After": "3600"}
                )
            else:
                # Remover bloqueio expirado
                del self.blocked_ips[client_ip]
        
        # Obter limites para este endpoint
        limits = self._get_limits_for_endpoint(endpoint)
        request_queue = self.requests[client_ip]
        
        # Verificar limite de burst
        if self._check_burst_limit(request_queue, limits.get("burst_limit", 10)):
            rate_logger.warning(f"Burst limit excedido para IP {client_ip} no endpoint {endpoint}")
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Muitas requests muito rapidamente. Aguarde alguns segundos.",
                headers={"Retry-After": "5"}
            )
        
        # Verificar limite por minuto
        requests_last_minute = self._count_requests(request_queue, 60)
        if requests_last_minute >= limits["requests_per_minute"]:
            rate_logger.warning(f"Rate limit por minuto excedido para IP {client_ip}: {requests_last_minute}/{limits['requests_per_minute']}")
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Limite de {limits['requests_per_minute']} requests por minuto excedido",
                headers={"Retry-After": "60"}
            )
        
        # Verificar limite por hora
        requests_last_hour = self._count_requests(request_queue, 3600)
        if requests_last_hour >= limits["requests_per_hour"]:
            # Bloquear IP por 1 hora
            self.blocked_ips[client_ip] = datetime.utcnow() + timedelta(hours=1)
            rate_logger.error(f"IP {client_ip} bloqueado por exceder limite horário: {requests_last_hour}/{limits['requests_per_hour']}")
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Limite de {limits['requests_per_hour']} requests por hora excedido. IP bloqueado por 1 hora.",
                headers={"Retry-After": "3600"}
            )
        
        # Registrar request válido
        request_queue.append((current_time, endpoint))
        
        return None
    
    def get_stats_for_ip(self, ip: str) -> Dict[str, int]:
        """Obter estatísticas de uso para um IP"""
        request_queue = self.requests.get(ip, deque())
        
        return {
            "requests_last_minute": self._count_requests(request_queue, 60),
            "requests_last_hour": self._count_requests(request_queue, 3600),
            "total_requests": len(request_queue),
            "is_blocked": ip in self.blocked_ips
        }
    
    def add_to_whitelist(self, ip: str):
        """Adicionar IP à whitelist"""
        self.whitelist.add(ip)
        rate_logger.info(f"IP {ip} adicionado à whitelist")
    
    def remove_from_whitelist(self, ip: str):
        """Remover IP da whitelist"""
        self.whitelist.discard(ip)
        rate_logger.info(f"IP {ip} removido da whitelist")
    
    def block_ip(self, ip: str, duration_hours: int = 1):
        """Bloquear IP manualmente"""
        self.blocked_ips[ip] = datetime.utcnow() + timedelta(hours=duration_hours)
        rate_logger.warning(f"IP {ip} bloqueado manualmente por {duration_hours} horas")
    
    def unblock_ip(self, ip: str):
        """Desbloquear IP manualmente"""
        if ip in self.blocked_ips:
            del self.blocked_ips[ip]
            rate_logger.info(f"IP {ip} desbloqueado manualmente")

# Instância global do rate limiter
rate_limiter = RateLimiter()

# Middleware para FastAPI
async def rate_limit_middleware(request: Request, call_next):
    """Middleware de rate limiting para FastAPI"""
    try:
        # Verificar rate limit
        await rate_limiter.check_rate_limit(request)
        
        # Processar request
        response = await call_next(request)
        
        # Adicionar headers informativos
        client_ip = rate_limiter._get_client_ip(request)
        stats = rate_limiter.get_stats_for_ip(client_ip)
        
        response.headers["X-RateLimit-Remaining-Minute"] = str(
            rate_limiter.default_limits["requests_per_minute"] - stats["requests_last_minute"]
        )
        response.headers["X-RateLimit-Remaining-Hour"] = str(
            rate_limiter.default_limits["requests_per_hour"] - stats["requests_last_hour"]
        )
        
        return response
        
    except HTTPException as e:
        # Rate limit excedido
        raise e

# Decorator para proteção de endpoints específicos
def rate_limit(requests_per_minute: int = None, requests_per_hour: int = None):
    """Decorator para aplicar rate limiting específico a um endpoint"""
    def decorator(func):
        # Adicionar limites customizados
        if hasattr(func, '__name__'):
            endpoint_path = f"/api/{func.__name__}"
            custom_limits = {}
            if requests_per_minute:
                custom_limits["requests_per_minute"] = requests_per_minute
            if requests_per_hour:
                custom_limits["requests_per_hour"] = requests_per_hour
            
            rate_limiter.endpoint_limits[endpoint_path] = custom_limits
        
        return func
    return decorator