import redis
import json
import logging
from typing import Any, Optional, Dict, List, Union
from datetime import datetime, timedelta
import hashlib
import pickle
from dataclasses import dataclass
import asyncio
from contextlib import asynccontextmanager

logger = logging.getLogger(__name__)

@dataclass
class ClusterNode:
    """Configuração de nó do cluster"""
    host: str
    port: int
    password: Optional[str] = None
    db: int = 0
    weight: int = 1

class ClusterCacheService:
    """Serviço de cache distribuído com Redis Cluster"""
    
    def __init__(self, nodes: List[ClusterNode], enable_cluster: bool = True):
        self.nodes = nodes
        self.enable_cluster = enable_cluster
        self.clients = {}
        self.node_weights = {}
        self.health_status = {}
        
        # Inicializar conexões
        self._initialize_clients()
        
        # Configurações de TTL por tipo de dados
        self.ttl_config = {
            'weather': 1800,        # 30 minutos
            'events': 3600,         # 1 hora
            'geocoding': 86400,     # 24 horas
            'price_comparison': 900, # 15 minutos
            'langchain': 3600,      # 1 hora
            'user_data': 300,       # 5 minutos
            'admin_stats': 600,     # 10 minutos
            'ml_predictions': 1800, # 30 minutos
            'payment_data': 300,    # 5 minutos
            'session_data': 3600    # 1 hora
        }
    
    def _initialize_clients(self):
        """Inicializa conexões com os nós do cluster"""
        for i, node in enumerate(self.nodes):
            try:
                client = redis.Redis(
                    host=node.host,
                    port=node.port,
                    password=node.password,
                    db=node.db,
                    decode_responses=True,
                    socket_timeout=5,
                    socket_connect_timeout=5,
                    retry_on_timeout=True,
                    health_check_interval=30
                )
                
                # Testar conexão
                client.ping()
                self.clients[f"node_{i}"] = client
                self.node_weights[f"node_{i}"] = node.weight
                self.health_status[f"node_{i}"] = True
                
                logger.info(f"Nó {i} ({node.host}:{node.port}) conectado com sucesso")
                
            except Exception as e:
                logger.error(f"Erro ao conectar com nó {i} ({node.host}:{node.port}): {str(e)}")
                self.health_status[f"node_{i}"] = False
    
    def _get_node_for_key(self, key: str) -> str:
        """Determina qual nó deve armazenar a chave"""
        if not self.enable_cluster or len(self.clients) == 1:
            return list(self.clients.keys())[0]
        
        # Hash da chave para distribuição
        hash_value = int(hashlib.md5(key.encode()).hexdigest(), 16)
        
        # Distribuição baseada em peso
        total_weight = sum(self.node_weights.values())
        target_weight = hash_value % total_weight
        
        current_weight = 0
        for node_id, weight in self.node_weights.items():
            if self.health_status.get(node_id, False):
                current_weight += weight
                if current_weight > target_weight:
                    return node_id
        
        # Fallback para primeiro nó saudável
        for node_id, healthy in self.health_status.items():
            if healthy:
                return node_id
        
        # Último recurso
        return list(self.clients.keys())[0]
    
    def _serialize_value(self, value: Any) -> str:
        """Serializa valor para armazenamento"""
        try:
            if isinstance(value, (dict, list)):
                return json.dumps(value, ensure_ascii=False)
            elif isinstance(value, (int, float, str, bool)):
                return str(value)
            else:
                return pickle.dumps(value).hex()
        except Exception as e:
            logger.error(f"Erro ao serializar valor: {str(e)}")
            return str(value)
    
    def _deserialize_value(self, value: str, original_type: str = 'str') -> Any:
        """Deserializa valor do armazenamento"""
        try:
            if original_type == 'json':
                return json.loads(value)
            elif original_type == 'int':
                return int(value)
            elif original_type == 'float':
                return float(value)
            elif original_type == 'bool':
                return value.lower() == 'true'
            elif original_type == 'pickle':
                return pickle.loads(bytes.fromhex(value))
            else:
                return value
        except Exception as e:
            logger.error(f"Erro ao deserializar valor: {str(e)}")
            return value
    
    def set(self, key: str, value: Any, ttl: Optional[int] = None, data_type: str = 'str') -> bool:
        """Armazena valor no cache distribuído"""
        try:
            node_id = self._get_node_for_key(key)
            client = self.clients.get(node_id)
            
            if not client:
                logger.error(f"Nó {node_id} não disponível")
                return False
            
            # Serializar valor
            serialized_value = self._serialize_value(value)
            
            # Determinar TTL
            if ttl is None:
                ttl = self.ttl_config.get(data_type, 3600)
            
            # Armazenar com metadados
            metadata = {
                'value': serialized_value,
                'type': data_type,
                'created_at': datetime.now().isoformat(),
                'ttl': ttl
            }
            
            result = client.setex(
                f"cache:{key}",
                ttl,
                json.dumps(metadata, ensure_ascii=False)
            )
            
            if result:
                logger.debug(f"Valor armazenado em {node_id}: {key}")
                return True
            else:
                logger.error(f"Erro ao armazenar valor em {node_id}: {key}")
                return False
                
        except Exception as e:
            logger.error(f"Erro ao armazenar valor: {str(e)}")
            return False
    
    def get(self, key: str, data_type: str = 'str') -> Optional[Any]:
        """Recupera valor do cache distribuído"""
        try:
            node_id = self._get_node_for_key(key)
            client = self.clients.get(node_id)
            
            if not client:
                logger.error(f"Nó {node_id} não disponível")
                return None
            
            # Tentar recuperar do nó primário
            cached_data = client.get(f"cache:{key}")
            
            if cached_data:
                try:
                    metadata = json.loads(cached_data)
                    value = self._deserialize_value(metadata['value'], metadata['type'])
                    logger.debug(f"Cache hit em {node_id}: {key}")
                    return value
                except Exception as e:
                    logger.error(f"Erro ao deserializar cache: {str(e)}")
                    return None
            
            # Se não encontrado, tentar outros nós (replicação)
            if self.enable_cluster and len(self.clients) > 1:
                for other_node_id, other_client in self.clients.items():
                    if other_node_id != node_id:
                        cached_data = other_client.get(f"cache:{key}")
                        if cached_data:
                            try:
                                metadata = json.loads(cached_data)
                                value = self._deserialize_value(metadata['value'], metadata['type'])
                                logger.debug(f"Cache hit em réplica {other_node_id}: {key}")
                                return value
                            except Exception:
                                continue
            
            logger.debug(f"Cache miss: {key}")
            return None
            
        except Exception as e:
            logger.error(f"Erro ao recuperar valor: {str(e)}")
            return None
    
    def delete(self, key: str) -> bool:
        """Remove valor do cache distribuído"""
        try:
            success = True
            # Remover de todos os nós
            for node_id, client in self.clients.items():
                try:
                    result = client.delete(f"cache:{key}")
                    if result:
                        logger.debug(f"Valor removido de {node_id}: {key}")
                except Exception as e:
                    logger.error(f"Erro ao remover de {node_id}: {str(e)}")
                    success = False
            
            return success
            
        except Exception as e:
            logger.error(f"Erro ao remover valor: {str(e)}")
            return False
    
    def exists(self, key: str) -> bool:
        """Verifica se chave existe no cache"""
        try:
            node_id = self._get_node_for_key(key)
            client = self.clients.get(node_id)
            
            if not client:
                return False
            
            return client.exists(f"cache:{key}") > 0
            
        except Exception as e:
            logger.error(f"Erro ao verificar existência: {str(e)}")
            return False
    
    def get_ttl(self, key: str) -> Optional[int]:
        """Retorna TTL restante da chave"""
        try:
            node_id = self._get_node_for_key(key)
            client = self.clients.get(node_id)
            
            if not client:
                return None
            
            ttl = client.ttl(f"cache:{key}")
            return ttl if ttl > 0 else None
            
        except Exception as e:
            logger.error(f"Erro ao obter TTL: {str(e)}")
            return None
    
    def clear_pattern(self, pattern: str) -> int:
        """Remove chaves que correspondem ao padrão"""
        try:
            total_deleted = 0
            
            for node_id, client in self.clients.items():
                try:
                    keys = client.keys(f"cache:{pattern}")
                    if keys:
                        deleted = client.delete(*keys)
                        total_deleted += deleted
                        logger.debug(f"Removidas {deleted} chaves de {node_id}")
                except Exception as e:
                    logger.error(f"Erro ao limpar padrão em {node_id}: {str(e)}")
            
            return total_deleted
            
        except Exception as e:
            logger.error(f"Erro ao limpar padrão: {str(e)}")
            return 0
    
    def get_stats(self) -> Dict[str, Any]:
        """Retorna estatísticas do cluster"""
        try:
            stats = {
                'nodes': {},
                'total_keys': 0,
                'total_memory': 0,
                'healthy_nodes': 0
            }
            
            for node_id, client in self.clients.items():
                try:
                    info = client.info()
                    keys = client.dbsize()
                    memory = info.get('used_memory_human', '0B')
                    
                    stats['nodes'][node_id] = {
                        'keys': keys,
                        'memory': memory,
                        'healthy': self.health_status.get(node_id, False),
                        'weight': self.node_weights.get(node_id, 1)
                    }
                    
                    stats['total_keys'] += keys
                    stats['healthy_nodes'] += 1 if self.health_status.get(node_id, False) else 0
                    
                except Exception as e:
                    logger.error(f"Erro ao obter stats de {node_id}: {str(e)}")
                    stats['nodes'][node_id] = {
                        'keys': 0,
                        'memory': '0B',
                        'healthy': False,
                        'weight': self.node_weights.get(node_id, 1)
                    }
            
            return stats
            
        except Exception as e:
            logger.error(f"Erro ao obter estatísticas: {str(e)}")
            return {}
    
    def health_check(self) -> Dict[str, bool]:
        """Verifica saúde de todos os nós"""
        try:
            for node_id, client in self.clients.items():
                try:
                    client.ping()
                    self.health_status[node_id] = True
                except Exception as e:
                    logger.warning(f"Nó {node_id} não responde: {str(e)}")
                    self.health_status[node_id] = False
            
            return self.health_status.copy()
            
        except Exception as e:
            logger.error(f"Erro no health check: {str(e)}")
            return {}
    
    def close(self):
        """Fecha todas as conexões"""
        try:
            for node_id, client in self.clients.items():
                try:
                    client.close()
                    logger.info(f"Conexão fechada: {node_id}")
                except Exception as e:
                    logger.error(f"Erro ao fechar conexão {node_id}: {str(e)}")
        except Exception as e:
            logger.error(f"Erro ao fechar conexões: {str(e)}")

# Configuração padrão do cluster
default_nodes = [
    ClusterNode(host="localhost", port=6379, weight=1),
    ClusterNode(host="localhost", port=6380, weight=1),
    ClusterNode(host="localhost", port=6381, weight=1)
]

# Instância global
cluster_cache = ClusterCacheService(default_nodes, enable_cluster=True) 