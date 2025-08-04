import asyncio
import logging
import time
import random
from typing import Callable, Any, Optional, Dict, List
from functools import wraps
from datetime import datetime, timedelta
import requests
from prometheus_client import Counter, Histogram, Gauge

logger = logging.getLogger(__name__)

# Métricas do Prometheus
API_RETRY_TOTAL = Counter('api_retry_total', 'Total de tentativas de retry', ['api_name', 'endpoint'])
API_RETRY_SUCCESS = Counter('api_retry_success', 'Retries bem-sucedidos', ['api_name', 'endpoint'])
API_RETRY_FAILURE = Counter('api_retry_failure', 'Retries que falharam', ['api_name', 'endpoint'])
API_CIRCUIT_BREAKER_OPEN = Gauge('api_circuit_breaker_open', 'Circuit breaker aberto', ['api_name'])
API_REQUEST_DURATION = Histogram('api_request_duration_seconds', 'Duração das requisições', ['api_name', 'endpoint'])

class CircuitBreaker:
    """Implementação de Circuit Breaker para proteção de APIs"""
    
    def __init__(self, name: str, failure_threshold: int = 5, recovery_timeout: int = 60):
        self.name = name
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.state = "CLOSED"  # CLOSED, OPEN, HALF_OPEN
    
    def call(self, func: Callable, *args, **kwargs) -> Any:
        """Executar função com proteção do circuit breaker"""
        if self.state == "OPEN":
            if self._should_attempt_reset():
                self.state = "HALF_OPEN"
                logger.info(f"Circuit Breaker {self.name}: Tentando reset (HALF_OPEN)")
            else:
                raise Exception(f"Circuit Breaker {self.name} está OPEN")
        
        try:
            result = func(*args, **kwargs)
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise e
    
    def _on_success(self):
        """Chamado quando a operação é bem-sucedida"""
        self.failure_count = 0
        self.last_failure_time = None
        if self.state == "HALF_OPEN":
            self.state = "CLOSED"
            logger.info(f"Circuit Breaker {self.name}: Reset para CLOSED")
    
    def _on_failure(self):
        """Chamado quando a operação falha"""
        self.failure_count += 1
        self.last_failure_time = datetime.utcnow()
        
        if self.failure_count >= self.failure_threshold:
            self.state = "OPEN"
            API_CIRCUIT_BREAKER_OPEN.labels(api_name=self.name).set(1)
            logger.warning(f"Circuit Breaker {self.name}: Aberto após {self.failure_count} falhas")
    
    def _should_attempt_reset(self) -> bool:
        """Verificar se deve tentar reset do circuit breaker"""
        if not self.last_failure_time:
            return True
        
        time_since_failure = (datetime.utcnow() - self.last_failure_time).total_seconds()
        return time_since_failure >= self.recovery_timeout

class RetryService:
    """Serviço de retry com backoff exponencial"""
    
    def __init__(self):
        self.circuit_breakers: Dict[str, CircuitBreaker] = {}
        self.default_config = {
            "max_retries": 3,
            "base_delay": 1.0,
            "max_delay": 60.0,
            "exponential_base": 2,
            "jitter": True
        }
    
    def get_circuit_breaker(self, name: str, **kwargs) -> CircuitBreaker:
        """Obter ou criar circuit breaker"""
        if name not in self.circuit_breakers:
            self.circuit_breakers[name] = CircuitBreaker(name, **kwargs)
        return self.circuit_breakers[name]
    
    def retry_with_backoff(self, 
                          api_name: str, 
                          endpoint: str = "default",
                          config: Optional[Dict] = None,
                          circuit_breaker: bool = True):
        """Decorator para retry com backoff exponencial"""
        config = config or self.default_config
        
        def decorator(func: Callable) -> Callable:
            @wraps(func)
            def wrapper(*args, **kwargs):
                cb = None
                if circuit_breaker:
                    cb = self.get_circuit_breaker(api_name)
                
                last_exception = None
                
                for attempt in range(config["max_retries"] + 1):
                    try:
                        start_time = time.time()
                        
                        if cb:
                            result = cb.call(func, *args, **kwargs)
                        else:
                            result = func(*args, **kwargs)
                        
                        duration = time.time() - start_time
                        API_REQUEST_DURATION.labels(api_name=api_name, endpoint=endpoint).observe(duration)
                        
                        if attempt > 0:
                            API_RETRY_SUCCESS.labels(api_name=api_name, endpoint=endpoint).inc()
                            logger.info(f"Retry bem-sucedido para {api_name}:{endpoint} na tentativa {attempt + 1}")
                        
                        return result
                        
                    except Exception as e:
                        last_exception = e
                        API_RETRY_TOTAL.labels(api_name=api_name, endpoint=endpoint).inc()
                        
                        if attempt == config["max_retries"]:
                            API_RETRY_FAILURE.labels(api_name=api_name, endpoint=endpoint).inc()
                            logger.error(f"Todas as tentativas falharam para {api_name}:{endpoint}: {str(e)}")
                            raise e
                        
                        # Calcular delay com backoff exponencial
                        delay = min(
                            config["base_delay"] * (config["exponential_base"] ** attempt),
                            config["max_delay"]
                        )
                        
                        # Adicionar jitter se habilitado
                        if config["jitter"]:
                            delay *= (0.5 + random.random() * 0.5)
                        
                        logger.warning(f"Tentativa {attempt + 1} falhou para {api_name}:{endpoint}. "
                                     f"Tentando novamente em {delay:.2f}s. Erro: {str(e)}")
                        
                        time.sleep(delay)
                
                raise last_exception
            
            return wrapper
        return decorator
    
    async def async_retry_with_backoff(self, 
                                     api_name: str, 
                                     endpoint: str = "default",
                                     config: Optional[Dict] = None,
                                     circuit_breaker: bool = True):
        """Decorator para retry assíncrono com backoff exponencial"""
        config = config or self.default_config
        
        def decorator(func: Callable) -> Callable:
            @wraps(func)
            async def wrapper(*args, **kwargs):
                cb = None
                if circuit_breaker:
                    cb = self.get_circuit_breaker(api_name)
                
                last_exception = None
                
                for attempt in range(config["max_retries"] + 1):
                    try:
                        start_time = time.time()
                        
                        if cb:
                            result = await cb.call(func, *args, **kwargs)
                        else:
                            result = await func(*args, **kwargs)
                        
                        duration = time.time() - start_time
                        API_REQUEST_DURATION.labels(api_name=api_name, endpoint=endpoint).observe(duration)
                        
                        if attempt > 0:
                            API_RETRY_SUCCESS.labels(api_name=api_name, endpoint=endpoint).inc()
                            logger.info(f"Retry assíncrono bem-sucedido para {api_name}:{endpoint} na tentativa {attempt + 1}")
                        
                        return result
                        
                    except Exception as e:
                        last_exception = e
                        API_RETRY_TOTAL.labels(api_name=api_name, endpoint=endpoint).inc()
                        
                        if attempt == config["max_retries"]:
                            API_RETRY_FAILURE.labels(api_name=api_name, endpoint=endpoint).inc()
                            logger.error(f"Todas as tentativas assíncronas falharam para {api_name}:{endpoint}: {str(e)}")
                            raise e
                        
                        # Calcular delay com backoff exponencial
                        delay = min(
                            config["base_delay"] * (config["exponential_base"] ** attempt),
                            config["max_delay"]
                        )
                        
                        # Adicionar jitter se habilitado
                        if config["jitter"]:
                            delay *= (0.5 + random.random() * 0.5)
                        
                        logger.warning(f"Tentativa assíncrona {attempt + 1} falhou para {api_name}:{endpoint}. "
                                     f"Tentando novamente em {delay:.2f}s. Erro: {str(e)}")
                        
                        await asyncio.sleep(delay)
                
                raise last_exception
            
            return wrapper
        return decorator
    
    def get_circuit_breaker_status(self) -> Dict[str, Any]:
        """Obter status de todos os circuit breakers"""
        status = {}
        for name, cb in self.circuit_breakers.items():
            status[name] = {
                "state": cb.state,
                "failure_count": cb.failure_count,
                "last_failure_time": cb.last_failure_time.isoformat() if cb.last_failure_time else None,
                "failure_threshold": cb.failure_threshold,
                "recovery_timeout": cb.recovery_timeout
            }
        return status
    
    def reset_circuit_breaker(self, name: str) -> bool:
        """Reset manual de um circuit breaker"""
        if name in self.circuit_breakers:
            cb = self.circuit_breakers[name]
            cb.state = "CLOSED"
            cb.failure_count = 0
            cb.last_failure_time = None
            API_CIRCUIT_BREAKER_OPEN.labels(api_name=name).set(0)
            logger.info(f"Circuit Breaker {name} resetado manualmente")
            return True
        return False

# Instância global do serviço de retry
retry_service = RetryService()

# Configurações específicas por API
API_CONFIGS = {
    "openweather": {
        "max_retries": 3,
        "base_delay": 2.0,
        "max_delay": 30.0,
        "exponential_base": 2,
        "jitter": True
    },
    "weatherapi": {
        "max_retries": 3,
        "base_delay": 2.0,
        "max_delay": 30.0,
        "exponential_base": 2,
        "jitter": True
    },
    "eventbrite": {
        "max_retries": 2,
        "base_delay": 1.0,
        "max_delay": 10.0,
        "exponential_base": 2,
        "jitter": True
    },
    "openai": {
        "max_retries": 2,
        "base_delay": 1.0,
        "max_delay": 15.0,
        "exponential_base": 2,
        "jitter": True
    },
    "competitors": {
        "max_retries": 1,
        "base_delay": 0.5,
        "max_delay": 5.0,
        "exponential_base": 2,
        "jitter": True
    }
} 