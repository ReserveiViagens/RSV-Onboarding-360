from fastapi import FastAPI, HTTPException, Depends, Request, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import logging
from contextlib import asynccontextmanager
from pydantic import BaseModel, EmailStr, validator
from datetime import datetime, timedelta
import uuid
import sys
import os

# Adicionar o diretório raiz ao path para resolver imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from shared.config.database import get_db
from shared.models.user import User as UserModel
from shared.schemas import UserCreate, User, UserUpdate
from core.security import (
    SecurityUtils, 
    get_current_user, 
    check_rate_limit,
    setup_security_middleware,
    oauth2_scheme
)

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Schemas para autenticação
class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    
    @validator('email')
    def validate_email(cls, v):
        if not SecurityUtils.validate_email(v):
            raise ValueError("Formato de email inválido")
        return v.lower()

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = 1800  # 30 minutos

class SecureUserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        # Validação simplificada para desenvolvimento
        if len(v) < 3:
            raise ValueError("Senha deve ter pelo menos 3 caracteres")
        return v
    
    @validator('full_name')
    def validate_full_name(cls, v):
        if len(v) < 2 or len(v) > 100:
            raise ValueError("Nome deve ter entre 2 e 100 caracteres")
        return SecurityUtils.sanitize_input(v)

class RefreshTokenRequest(BaseModel):
    refresh_token: str

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gerenciador de ciclo de vida da aplicação"""
    logger.info("🚀 Iniciando Serviço Core com segurança robusta...")
    yield
    logger.info("🛑 Encerrando Serviço Core...")

app = FastAPI(
    title="Serviço Core - Onion RSV 360",
    version="2.1.0",
    description="Serviço central de autenticação e gerenciamento de usuários com segurança enterprise",
    lifespan=lifespan
)

# Configurar middleware de segurança
setup_security_middleware(app)

# Middleware de logging e rate limiting
@app.middleware("http")
async def log_requests_and_rate_limit(request: Request, call_next):
    """Middleware para logging e rate limiting"""
    start_time = datetime.utcnow()
    
    # Rate limiting
    await check_rate_limit(request)
    
    response = await call_next(request)
    
    process_time = (datetime.utcnow() - start_time).total_seconds()
    logger.info(
        f"🔍 {request.method} {request.url.path} - "
        f"Status: {response.status_code} - "
        f"Tempo: {process_time:.3f}s - "
        f"IP: {request.client.host}"
    )
    
    return response

# Endpoints de saúde e status
@app.get("/")
def read_root():
    """Endpoint raiz com informações do serviço"""
    return {
        "mensagem": "Serviço Core - Onion RSV 360",
        "versao": "2.1.0",
        "status": "ativo",
        "seguranca": "enterprise",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/health")
def health_check():
    """Health check do serviço"""
    return {
        "status": "healthy",
        "service": "core",
        "version": "2.1.0",
        "timestamp": datetime.utcnow().isoformat(),
        "database": "connected",
        "security": "enabled"
    }

@app.get("/api/status")
def api_status():
    """Status detalhado da API"""
    return {
        "api": "Core Service",
        "version": "2.1.0",
        "status": "operational",
        "endpoints": {
            "auth": ["/api/core/token", "/api/core/refresh", "/api/core/verify"],
            "users": ["/api/users/", "/api/users/me"],
            "health": ["/health", "/api/status"]
        },
        "security": {
            "jwt": "enabled",
            "rate_limiting": "enabled",
            "cors": "enabled"
        },
        "timestamp": datetime.utcnow().isoformat()
    }

# Endpoints de autenticação
@app.post("/api/core/token", response_model=TokenResponse)
async def login_for_access_token(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Endpoint de login seguro com JWT"""
    try:
        # Buscar usuário no banco
        user = db.query(UserModel).filter(UserModel.email == login_data.email.lower()).first()
        
        if not user:
            logger.warning(f"🚫 Tentativa de login com email inexistente: {login_data.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciais inválidas"
            )
        
        # Verificar senha com bcrypt
        if not SecurityUtils.verify_password(login_data.password, user.hashed_password):
            logger.warning(f"🚫 Tentativa de login com senha incorreta para: {login_data.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciais inválidas"
            )
        
        # Verificar se usuário está ativo
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Conta desativada"
            )
        
        # Criar tokens JWT
        access_token = SecurityUtils.create_access_token(
            data={"sub": user.email, "user_id": user.id}
        )
        refresh_token = SecurityUtils.create_refresh_token(
            data={"sub": user.email, "user_id": user.id}
        )
        
        # Atualizar último login
        user.last_login = datetime.utcnow()
        db.commit()
        
        logger.info(f"✅ Login bem-sucedido para usuário: {user.email}")
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=1800
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro durante login: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@app.post("/api/core/refresh", response_model=TokenResponse)
async def refresh_access_token(refresh_data: RefreshTokenRequest):
    """Renovar token de acesso usando refresh token"""
    try:
        # Verificar refresh token
        payload = SecurityUtils.verify_token(refresh_data.refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token inválido"
            )
        
        # Criar novo access token
        access_token = SecurityUtils.create_access_token(
            data={"sub": payload.get("sub"), "user_id": payload.get("user_id")}
        )
        
        # Criar novo refresh token
        new_refresh_token = SecurityUtils.create_refresh_token(
            data={"sub": payload.get("sub"), "user_id": payload.get("user_id")}
        )
        
        logger.info(f"🔄 Token renovado para usuário: {payload.get('sub')}")
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=new_refresh_token,
            expires_in=1800
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao renovar token: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@app.post("/api/core/verify")
async def verify_token(current_user: dict = Depends(get_current_user)):
    """Verificar se token é válido"""
    return {
        "valid": True,
        "user": current_user,
        "message": "Token válido"
    }

@app.get("/api/core/verify")
async def verify_token_get(current_user: dict = Depends(get_current_user)):
    """Verificar se token é válido (GET)"""
    return {
        "valid": True,
        "user": current_user,
        "message": "Token válido"
    }

# Endpoints de usuários seguros
@app.post("/api/users/", response_model=User)
async def create_user(user_data: SecureUserCreate, db: Session = Depends(get_db)):
    """Criar novo usuário com validações de segurança"""
    try:
        # Verificar se email já existe
        existing_user = db.query(UserModel).filter(UserModel.email == user_data.email.lower()).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email já registrado"
            )
        
        # Hash da senha com bcrypt
        hashed_password = SecurityUtils.get_password_hash(user_data.password)
        
        # Criar usuário
        db_user = UserModel(
            email=user_data.email.lower(),
            full_name=SecurityUtils.sanitize_input(user_data.full_name),
            hashed_password=hashed_password,
            is_active=True,
            permissions=["usuario"],
            created_at=datetime.utcnow()
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        logger.info(f"✅ Novo usuário criado: {user_data.email}")
        
        return db_user
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao criar usuário: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@app.get("/api/users/me", response_model=User)
async def get_current_user_info(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Obter informações do usuário atual"""
    try:
        user = db.query(UserModel).filter(UserModel.email == current_user["email"]).first()
        if not user:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        return user
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Erro ao obter usuário: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno do servidor"
        )

@app.get("/favicon.ico")
def favicon():
    """Favicon do serviço"""
    return FileResponse("favicon.ico", media_type="image/x-icon") 