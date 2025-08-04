import re
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Optional
from fastapi import HTTPException, Request, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Configuração básica de segurança
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = HTTPBearer()

class SecurityUtils:
    @staticmethod
    def validate_email(email: str) -> bool:
        """Valida formato de email"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    @staticmethod
    def sanitize_input(text: str) -> str:
        """Sanitiza entrada de texto"""
        return re.sub(r'[<>"\']', '', text)
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash de senha"""
        return hashlib.sha256(password.encode()).hexdigest()
    
    @staticmethod
    def verify_password(password: str, hashed: str) -> bool:
        """Verifica senha"""
        return SecurityUtils.hash_password(password) == hashed

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Cria token de acesso"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    # Implementação simplificada - em produção usar JWT
    return secrets.token_urlsafe(32)

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(oauth2_scheme)):
    """Obtém usuário atual"""
    # Implementação simplificada
    return {"user_id": "test_user", "email": "test@example.com"}

async def check_rate_limit(request: Request):
    """Verifica rate limiting"""
    # Implementação simplificada
    pass

def setup_security_middleware(app):
    """Configura middleware de segurança"""
    # Implementação simplificada
    pass 