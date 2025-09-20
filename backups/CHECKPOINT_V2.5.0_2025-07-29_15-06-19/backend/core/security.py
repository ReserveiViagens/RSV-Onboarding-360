from datetime import datetime, timedelta
from typing import Optional, Union
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
import re
import os
from pydantic import EmailStr, validator

# Configurações de segurança
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Contexto para hash de senhas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/core/token")

class SecurityUtils:
    """Utilitários de segurança"""
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verifica se a senha está correta"""
        return pwd_context.verify(plain_password, hashed_password)
    
    @staticmethod
    def get_password_hash(password: str) -> str:
        """Gera hash da senha usando bcrypt"""
        return pwd_context.hash(password)
    
    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """Cria token de acesso JWT"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire, "type": "access"})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    def create_refresh_token(data: dict) -> str:
        """Cria token de renovação JWT"""
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        to_encode.update({"exp": expire, "type": "refresh"})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    def verify_token(token: str) -> Optional[dict]:
        """Verifica e decodifica token JWT"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except JWTError:
            return None
    
    @staticmethod
    def validate_password_strength(password: str) -> dict:
        """Valida força da senha (0-100)"""
        score = 0
        feedback = []
        
        # Comprimento mínimo
        if len(password) >= 8:
            score += 20
        else:
            feedback.append("Senha deve ter pelo menos 8 caracteres")
        
        # Letras maiúsculas
        if re.search(r'[A-Z]', password):
            score += 20
        else:
            feedback.append("Adicione letras maiúsculas")
        
        # Letras minúsculas
        if re.search(r'[a-z]', password):
            score += 20
        else:
            feedback.append("Adicione letras minúsculas")
        
        # Números
        if re.search(r'\d', password):
            score += 20
        else:
            feedback.append("Adicione números")
        
        # Caracteres especiais
        if re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            score += 20
        else:
            feedback.append("Adicione caracteres especiais")
        
        return {
            "score": score,
            "feedback": feedback,
            "is_strong": score >= 80
        }
    
    @staticmethod
    def sanitize_input(text: str) -> str:
        """Sanitiza input do usuário"""
        import html
        
        # Escape HTML entities
        clean_text = html.escape(text)
        return clean_text
    
    @staticmethod
    def validate_email(email: str) -> bool:
        """Valida formato de email"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None

class RateLimiter:
    """Rate limiting por IP"""
    
    def __init__(self):
        self.requests = {}
        self.max_requests = 100  # 100 requests por minuto
        self.window = 60  # 60 segundos
    
    def is_allowed(self, ip: str) -> bool:
        """Verifica se IP pode fazer requisição"""
        now = datetime.utcnow()
        
        if ip not in self.requests:
            self.requests[ip] = []
        
        # Remove requisições antigas
        self.requests[ip] = [
            req_time for req_time in self.requests[ip]
            if (now - req_time).seconds < self.window
        ]
        
        # Verifica limite
        if len(self.requests[ip]) >= self.max_requests:
            return False
        
        # Adiciona nova requisição
        self.requests[ip].append(now)
        return True

# Instância global do rate limiter
rate_limiter = RateLimiter()

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Middleware para obter usuário atual"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciais inválidas",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = SecurityUtils.verify_token(token)
        if payload is None:
            raise credentials_exception
        
        email: str = payload.get("sub")
        token_type: str = payload.get("type")
        
        if email is None or token_type != "access":
            raise credentials_exception
            
        return {"email": email, "payload": payload}
        
    except JWTError:
        raise credentials_exception

async def check_rate_limit(request: Request):
    """Middleware para rate limiting"""
    client_ip = request.client.host
    
    if not rate_limiter.is_allowed(client_ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Muitas requisições. Tente novamente em 1 minuto."
        )

def setup_security_middleware(app):
    """Configura middleware de segurança"""
    
    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )
    
    # Headers de segurança
    @app.middleware("http")
    async def add_security_headers(request: Request, call_next):
        response = await call_next(request)
        
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https:; "
            "font-src 'self'; "
            "connect-src 'self' http://localhost:5000;"
        )
        
        return response 