"""
🔐 Sistema de Autenticação JWT - Onion RSV 360
Middleware de segurança centralizado para todos os microserviços
"""

import jwt
import os
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
import secrets

# Configurações de segurança
SECRET_KEY = os.getenv("JWT_SECRET_KEY", secrets.token_urlsafe(32))
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Configuração de hash de senhas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configuração do bearer token
security = HTTPBearer()

class JWTManager:
    """Gerenciador de tokens JWT para autenticação segura"""
    
    def __init__(self):
        self.secret_key = SECRET_KEY
        self.algorithm = ALGORITHM
        
    def create_access_token(self, data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
        """Criar token de acesso JWT"""
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            
        to_encode.update({
            "exp": expire,
            "iat": datetime.utcnow(),
            "type": "access"
        })
        
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt
    
    def create_refresh_token(self, data: Dict[str, Any]) -> str:
        """Criar token de refresh JWT"""
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        
        to_encode.update({
            "exp": expire,
            "iat": datetime.utcnow(),
            "type": "refresh"
        })
        
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt
    
    def verify_token(self, token: str) -> Dict[str, Any]:
        """Verificar e decodificar token JWT"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            
            # Verificar se o token não expirou
            if datetime.fromtimestamp(payload["exp"]) < datetime.utcnow():
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token expirado",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            
            return payload
            
        except jwt.InvalidTokenError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido",
                headers={"WWW-Authenticate": "Bearer"},
            )
    
    def get_current_user(self, credentials: HTTPAuthorizationCredentials = Security(security)) -> Dict[str, Any]:
        """Obter usuário atual a partir do token"""
        token = credentials.credentials
        payload = self.verify_token(token)
        
        # Verificar se é um token de acesso
        if payload.get("type") != "access":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Tipo de token inválido",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return payload

# Instância global do gerenciador JWT
jwt_manager = JWTManager()

class PasswordManager:
    """Gerenciador de senhas com hash seguro"""
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Gerar hash da senha"""
        return pwd_context.hash(password)
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verificar senha contra hash"""
        return pwd_context.verify(plain_password, hashed_password)
    
    @staticmethod
    def generate_secure_password(length: int = 12) -> str:
        """Gerar senha segura aleatória"""
        return secrets.token_urlsafe(length)

# Instância global do gerenciador de senhas
password_manager = PasswordManager()

# Dependências para uso nos endpoints
def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)) -> Dict[str, Any]:
    """Dependência para obter usuário autenticado"""
    return jwt_manager.get_current_user(credentials)

def get_current_active_user(current_user: Dict[str, Any] = Security(get_current_user)) -> Dict[str, Any]:
    """Dependência para obter usuário ativo"""
    if not current_user.get("active", True):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuário inativo"
        )
    return current_user

def require_role(required_role: str):
    """Decorator para exigir role específica"""
    def role_checker(current_user: Dict[str, Any] = Security(get_current_user)) -> Dict[str, Any]:
        user_roles = current_user.get("roles", [])
        if required_role not in user_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Acesso negado. Role '{required_role}' necessária."
            )
        return current_user
    return role_checker

# Roles padrão do sistema
class Roles:
    ADMIN = "admin"
    USER = "user"
    OPERATOR = "operator"
    READONLY = "readonly"
    SUPPORT = "support"

# Funções utilitárias para autenticação
def create_user_tokens(user_data: Dict[str, Any]) -> Dict[str, str]:
    """Criar tokens de acesso e refresh para usuário"""
    access_token = jwt_manager.create_access_token(data={"sub": str(user_data["id"])})
    refresh_token = jwt_manager.create_refresh_token(data={"sub": str(user_data["id"])})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

def validate_api_key(api_key: str) -> bool:
    """Validar chave de API (implementar conforme necessário)"""
    # TODO: Implementar validação de API key no banco de dados
    valid_keys = os.getenv("VALID_API_KEYS", "").split(",")
    return api_key in valid_keys

# Middleware de logging de segurança
import logging

security_logger = logging.getLogger("security")
security_logger.setLevel(logging.INFO)

def log_security_event(event_type: str, user_id: Optional[str] = None, details: Optional[str] = None):
    """Log de eventos de segurança"""
    timestamp = datetime.utcnow().isoformat()
    message = f"[{timestamp}] SECURITY EVENT: {event_type}"
    if user_id:
        message += f" | User: {user_id}"
    if details:
        message += f" | Details: {details}"
    
    security_logger.info(message)