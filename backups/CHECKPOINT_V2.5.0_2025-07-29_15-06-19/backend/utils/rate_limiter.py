import time
import logging
from typing import Dict, Optional, Callable
from functools import wraps
from collections import defaultdict, deque
import asyncio
from datetime import datetime, timedelta
import redis
import json

logger = logging.getLogger(__name__)

class RateLimiter:
    """Sistema de rate limiting avançado com Redis"""
    
    def __init__(self, redis_url: str = "redis://localhost:6379"):
        self.redis_client = redis.from_url(redis_url)
        self.limits = {
            'api_calls': {
                'window': 60,  # 1 minuto
                'max_requests': 100
            },
            'auth_attempts': {
                'window': 300,  # 5 minutos
                'max_requests': 5
            },
            'payment_attempts': {
                'window': 3600,  # 1 hora
                'max_requests': 10
            },
            'ml_predictions': {
                'window': 60,  # 1 minuto
                'max_requests': 20
            },
            'weather_api': {
                'window': 60,  # 1 minuto
                'max_requests': 30
            },
            'event_api': {
                'window': 60,  # 1 minuto
                'max_requests': 20
            }
        }
    
    def is_allowed(self, key: str, limit_type: str = 'api_calls') -> bool:
        """Verifica se a requisição é permitida"""
        try:
            limit_config = self.limits.get(limit_type, self.limits['api_calls'])
            window = limit_config['window']
            max_requests = limit_config['max_requests']
            
            # Criar chave única para o período
            current_time = int(time.time())
            window_start = current_time - (current_time % window)
            redis_key = f"rate_limit:{key}:{limit_type}:{window_start}"
            
            # Verificar requisições atuais
            current_requests = self.redis_client.get(redis_key)
            if current_requests is None:
                current_requests = 0
            else:
                current_requests = int(current_requests)
            
            if current_requests >= max_requests:
                logger.warning(f"Rate limit exceeded for {key} ({limit_type})")
                return False
            
            # Incrementar contador
            pipe = self.redis_client.pipeline()
            pipe.incr(redis_key)
            pipe.expire(redis_key, window)
            pipe.execute()
            
            return True
            
        except Exception as e:
            logger.error(f"Erro no rate limiter: {str(e)}")
            return True  # Permitir em caso de erro
    
    def get_remaining(self, key: str, limit_type: str = 'api_calls') -> Dict[str, int]:
        """Retorna informações sobre o rate limit"""
        try:
            limit_config = self.limits.get(limit_type, self.limits['api_calls'])
            window = limit_config['window']
            max_requests = limit_config['max_requests']
            
            current_time = int(time.time())
            window_start = current_time - (current_time % window)
            redis_key = f"rate_limit:{key}:{limit_type}:{window_start}"
            
            current_requests = self.redis_client.get(redis_key)
            if current_requests is None:
                current_requests = 0
            else:
                current_requests = int(current_requests)
            
            return {
                'remaining': max(0, max_requests - current_requests),
                'limit': max_requests,
                'reset_time': window_start + window,
                'current_requests': current_requests
            }
            
        except Exception as e:
            logger.error(f"Erro ao obter rate limit info: {str(e)}")
            return {'remaining': 0, 'limit': 0, 'reset_time': 0, 'current_requests': 0}

def rate_limit(limit_type: str = 'api_calls', key_func: Optional[Callable] = None):
    """Decorator para aplicar rate limiting"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Determinar chave para rate limiting
            if key_func:
                key = key_func(*args, **kwargs)
            else:
                # Usar IP do cliente ou user_id se disponível
                key = "default"
            
            # Verificar rate limit
            if not rate_limiter.is_allowed(key, limit_type):
                raise HTTPException(
                    status_code=429,
                    detail={
                        "error": "Rate limit exceeded",
                        "limit_type": limit_type,
                        "retry_after": rate_limiter.get_remaining(key, limit_type)['reset_time']
                    }
                )
            
            return await func(*args, **kwargs)
        return wrapper
    return decorator

# Instância global
rate_limiter = RateLimiter() 