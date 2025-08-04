import redis
import json
import logging
from typing import Optional, Any, Dict
from datetime import datetime, timedelta
import os

logger = logging.getLogger(__name__)

class CacheService:
    """Serviço de cache Redis para otimização de APIs"""
    
    def __init__(self):
        self.redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
        self.redis_client = redis.from_url(self.redis_url, decode_responses=True)
        
        # Configurações de TTL (Time To Live) em segundos
        self.ttl_config = {
            "weather": 1800,      # 30 minutos para dados de clima
            "events": 3600,       # 1 hora para eventos
            "geocoding": 86400,   # 24 horas para geocoding
            "price_comparison": 900,  # 15 minutos para comparação de preços
            "langchain": 300,     # 5 minutos para análises LangChain
            "user_data": 1800,    # 30 minutos para dados de usuário
            "admin_stats": 300    # 5 minutos para estatísticas administrativas
        }
    
    def _get_cache_key(self, prefix: str, identifier: str) -> str:
        """Gerar chave de cache padronizada"""
        return f"onion360:{prefix}:{identifier}"
    
    def set(self, prefix: str, identifier: str, data: Any, ttl: Optional[int] = None) -> bool:
        """Armazenar dados no cache"""
        try:
            cache_key = self._get_cache_key(prefix, identifier)
            ttl = ttl or self.ttl_config.get(prefix, 300)
            
            # Serializar dados para JSON
            if isinstance(data, (dict, list)):
                serialized_data = json.dumps(data, default=str)
            else:
                serialized_data = str(data)
            
            # Adicionar timestamp
            cache_data = {
                "data": serialized_data,
                "timestamp": datetime.utcnow().isoformat(),
                "ttl": ttl
            }
            
            self.redis_client.setex(
                cache_key,
                ttl,
                json.dumps(cache_data)
            )
            
            logger.info(f"Cache SET: {cache_key} (TTL: {ttl}s)")
            return True
            
        except Exception as e:
            logger.error(f"Erro ao armazenar no cache: {str(e)}")
            return False
    
    def get(self, prefix: str, identifier: str) -> Optional[Any]:
        """Recuperar dados do cache"""
        try:
            cache_key = self._get_cache_key(prefix, identifier)
            cached_data = self.redis_client.get(cache_key)
            
            if cached_data:
                cache_info = json.loads(cached_data)
                data = json.loads(cache_info["data"])
                logger.info(f"Cache HIT: {cache_key}")
                return data
            else:
                logger.info(f"Cache MISS: {cache_key}")
                return None
                
        except Exception as e:
            logger.error(f"Erro ao recuperar do cache: {str(e)}")
            return None
    
    def delete(self, prefix: str, identifier: str) -> bool:
        """Remover dados do cache"""
        try:
            cache_key = self._get_cache_key(prefix, identifier)
            result = self.redis_client.delete(cache_key)
            logger.info(f"Cache DELETE: {cache_key} (result: {result})")
            return result > 0
        except Exception as e:
            logger.error(f"Erro ao deletar do cache: {str(e)}")
            return False
    
    def exists(self, prefix: str, identifier: str) -> bool:
        """Verificar se dados existem no cache"""
        try:
            cache_key = self._get_cache_key(prefix, identifier)
            return self.redis_client.exists(cache_key) > 0
        except Exception as e:
            logger.error(f"Erro ao verificar cache: {str(e)}")
            return False
    
    def get_ttl(self, prefix: str, identifier: str) -> Optional[int]:
        """Obter TTL restante de uma chave"""
        try:
            cache_key = self._get_cache_key(prefix, identifier)
            return self.redis_client.ttl(cache_key)
        except Exception as e:
            logger.error(f"Erro ao obter TTL: {str(e)}")
            return None
    
    def clear_pattern(self, pattern: str) -> int:
        """Limpar cache por padrão"""
        try:
            keys = self.redis_client.keys(f"onion360:{pattern}")
            if keys:
                deleted = self.redis_client.delete(*keys)
                logger.info(f"Cache CLEAR pattern '{pattern}': {deleted} keys deleted")
                return deleted
            return 0
        except Exception as e:
            logger.error(f"Erro ao limpar cache por padrão: {str(e)}")
            return 0
    
    def get_stats(self) -> Dict[str, Any]:
        """Obter estatísticas do cache"""
        try:
            info = self.redis_client.info()
            keys = self.redis_client.keys("onion360:*")
            
            stats = {
                "total_keys": len(keys),
                "memory_used": info.get("used_memory_human", "N/A"),
                "connected_clients": info.get("connected_clients", 0),
                "uptime": info.get("uptime_in_seconds", 0),
                "keys_by_prefix": {}
            }
            
            # Contar chaves por prefixo
            for key in keys:
                parts = key.split(":")
                if len(parts) >= 3:
                    prefix = parts[1]
                    stats["keys_by_prefix"][prefix] = stats["keys_by_prefix"].get(prefix, 0) + 1
            
            return stats
            
        except Exception as e:
            logger.error(f"Erro ao obter estatísticas do cache: {str(e)}")
            return {"error": str(e)}
    
    def health_check(self) -> Dict[str, Any]:
        """Verificar saúde do cache"""
        try:
            # Teste básico de conectividade
            self.redis_client.ping()
            
            # Teste de escrita/leitura
            test_key = "onion360:health:test"
            test_data = {"test": "data", "timestamp": datetime.utcnow().isoformat()}
            
            self.redis_client.setex(test_key, 60, json.dumps(test_data))
            retrieved = self.redis_client.get(test_key)
            self.redis_client.delete(test_key)
            
            if retrieved and json.loads(retrieved) == test_data:
                return {
                    "status": "healthy",
                    "message": "Cache Redis funcionando corretamente",
                    "timestamp": datetime.utcnow().isoformat()
                }
            else:
                return {
                    "status": "unhealthy",
                    "message": "Falha no teste de escrita/leitura",
                    "timestamp": datetime.utcnow().isoformat()
                }
                
        except Exception as e:
            return {
                "status": "unhealthy",
                "message": f"Erro de conectividade: {str(e)}",
                "timestamp": datetime.utcnow().isoformat()
            }

# Instância global do serviço de cache
cache_service = CacheService() 