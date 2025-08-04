import time
import logging
from functools import wraps
from typing import Callable, Any, Optional, List, Union
import requests
from requests.exceptions import RequestException, Timeout, ConnectionError

logger = logging.getLogger(__name__)

class RetryConfig:
    """Configuração para retry automático de APIs"""
    
    def __init__(
        self,
        max_attempts: int = 3,
        base_delay: float = 1.0,
        max_delay: float = 60.0,
        exponential_backoff: bool = True,
        jitter: bool = True,
        exceptions: tuple = (RequestException, Timeout, ConnectionError),
        timeout: Optional[float] = 30.0,
        success_codes: List[int] = None
    ):
        self.max_attempts = max_attempts
        self.base_delay = base_delay
        self.max_delay = max_delay
        self.exponential_backoff = exponential_backoff
        self.jitter = jitter
        self.exceptions = exceptions
        self.timeout = timeout
        self.success_codes = success_codes or [200, 201, 202, 204]

def retry(
    max_attempts: int = 3,
    base_delay: float = 1.0,
    max_delay: float = 60.0,
    exponential_backoff: bool = True,
    jitter: bool = True,
    exceptions: tuple = (RequestException, Timeout, ConnectionError),
    timeout: Optional[float] = 30.0,
    success_codes: List[int] = None,
    log_attempts: bool = True
):
    """
    Decorator para retry automático de APIs
    
    Args:
        max_attempts: Número máximo de tentativas
        base_delay: Delay inicial em segundos
        max_delay: Delay máximo em segundos
        exponential_backoff: Se deve usar backoff exponencial
        jitter: Se deve adicionar jitter para evitar thundering herd
        exceptions: Exceções que devem trigger retry
        timeout: Timeout para requests
        success_codes: Códigos HTTP considerados sucesso
        log_attempts: Se deve logar tentativas
    """
    
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            last_exception = None
            
            for attempt in range(1, max_attempts + 1):
                try:
                    # Adiciona timeout se especificado
                    if timeout and 'timeout' not in kwargs:
                        kwargs['timeout'] = timeout
                    
                    result = func(*args, **kwargs)
                    
                    # Verifica se é uma resposta HTTP e se o código é de sucesso
                    if hasattr(result, 'status_code'):
                        if result.status_code in (success_codes or [200, 201, 202, 204]):
                            if log_attempts and attempt > 1:
                                logger.info(f"✅ Sucesso na tentativa {attempt} para {func.__name__}")
                            return result
                        else:
                            # Código HTTP de erro - não retry para 4xx, retry para 5xx
                            if 400 <= result.status_code < 500:
                                logger.warning(f"❌ Erro 4xx na tentativa {attempt}: {result.status_code}")
                                return result
                            else:
                                raise RequestException(f"HTTP {result.status_code}")
                    
                    # Se não é resposta HTTP, retorna o resultado
                    if log_attempts and attempt > 1:
                        logger.info(f"✅ Sucesso na tentativa {attempt} para {func.__name__}")
                    return result
                    
                except exceptions as e:
                    last_exception = e
                    
                    if log_attempts:
                        logger.warning(f"⚠️ Tentativa {attempt}/{max_attempts} falhou para {func.__name__}: {str(e)}")
                    
                    # Se é a última tentativa, não espera
                    if attempt == max_attempts:
                        break
                    
                    # Calcula delay para próxima tentativa
                    if exponential_backoff:
                        delay = min(base_delay * (2 ** (attempt - 1)), max_delay)
                    else:
                        delay = base_delay
                    
                    # Adiciona jitter se habilitado
                    if jitter:
                        import random
                        delay *= (0.5 + random.random() * 0.5)
                    
                    if log_attempts:
                        logger.info(f"⏳ Aguardando {delay:.2f}s antes da próxima tentativa...")
                    
                    time.sleep(delay)
            
            # Se chegou aqui, todas as tentativas falharam
            logger.error(f"❌ Todas as {max_attempts} tentativas falharam para {func.__name__}")
            raise last_exception
        
        return wrapper
    return decorator

class APIRetryManager:
    """Gerenciador avançado de retry para APIs"""
    
    def __init__(self):
        self.configs = {
            'weather': RetryConfig(
                max_attempts=3,
                base_delay=2.0,
                max_delay=30.0,
                exponential_backoff=True,
                jitter=True,
                timeout=15.0
            ),
            'events': RetryConfig(
                max_attempts=2,
                base_delay=1.0,
                max_delay=10.0,
                exponential_backoff=False,
                jitter=True,
                timeout=10.0
            ),
            'langchain': RetryConfig(
                max_attempts=3,
                base_delay=3.0,
                max_delay=60.0,
                exponential_backoff=True,
                jitter=True,
                timeout=45.0
            ),
            'payment': RetryConfig(
                max_attempts=2,
                base_delay=1.0,
                max_delay=5.0,
                exponential_backoff=False,
                jitter=False,
                timeout=20.0
            ),
            'geocoding': RetryConfig(
                max_attempts=2,
                base_delay=1.0,
                max_delay=10.0,
                exponential_backoff=False,
                jitter=True,
                timeout=10.0
            )
        }
    
    def get_config(self, api_type: str) -> RetryConfig:
        """Retorna configuração para tipo de API específico"""
        return self.configs.get(api_type, RetryConfig())
    
    def retry_with_config(self, api_type: str):
        """Decorator que usa configuração específica para tipo de API"""
        config = self.get_config(api_type)
        return retry(
            max_attempts=config.max_attempts,
            base_delay=config.base_delay,
            max_delay=config.max_delay,
            exponential_backoff=config.exponential_backoff,
            jitter=config.jitter,
            timeout=config.timeout,
            log_attempts=True
        )

# Instância global do gerenciador
retry_manager = APIRetryManager()

# Decorators pré-configurados para uso direto
retry_weather = retry_manager.retry_with_config('weather')
retry_events = retry_manager.retry_with_config('events')
retry_langchain = retry_manager.retry_with_config('langchain')
retry_payment = retry_manager.retry_with_config('payment')
retry_geocoding = retry_manager.retry_with_config('geocoding') 