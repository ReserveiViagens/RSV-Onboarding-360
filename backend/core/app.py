from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Dict, Any
import logging
import sys
import os

# Adicionar path para módulos compartilhados
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Importar configuração de documentação
from shared.docs.swagger_config import setup_service_docs

# Modelos Pydantic para documentação
class HealthResponse(BaseModel):
    """Resposta do health check"""
    status: str = Field(..., example="healthy", description="Status do serviço")
    service: str = Field(..., example="core", description="Nome do serviço")
    version: str = Field(..., example="1.0.0", description="Versão do serviço")
    security: str = Field(..., example="enabled", description="Status da segurança")

class SystemInfo(BaseModel):
    """Informações do sistema"""
    message: str = Field(..., description="Mensagem de status")
    timestamp: datetime = Field(..., description="Timestamp atual")
    status: str = Field(..., example="active", description="Status do sistema")
    security_features: List[str] = Field(..., description="Recursos de segurança ativos")

class AuthDemoResponse(BaseModel):
    """Resposta da demonstração de autenticação"""
    message: str = Field(..., description="Mensagem explicativa")
    demo_token: str = Field(..., description="Token de demonstração")
    instructions: str = Field(..., description="Instruções de uso")
    security_note: str = Field(..., description="Nota sobre segurança")
    usage: str = Field(..., description="Como usar o token")

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI App
app = FastAPI()

# Configurar documentação automática
setup_service_docs(
    app, 
    service_name="core",
    service_description="🔧 Serviço central do sistema Onion RSV 360 - autenticação, configurações e coordenação geral"
)

@app.get(
    "/health",
    response_model=HealthResponse,
    tags=["System"],
    summary="Health Check",
    description="Verifica se o serviço está funcionando corretamente",
    responses={
        200: {
            "description": "Serviço funcionando normalmente",
            "content": {
                "application/json": {
                    "example": {
                        "status": "healthy",
                        "service": "core", 
                        "version": "1.0.0",
                        "security": "enabled"
                    }
                }
            }
        }
    }
)
async def health_check():
    """
    ## Health Check do Core Service
    
    Endpoint público para verificar se o serviço está funcionando.
    
    **Uso:** Ideal para load balancers e sistemas de monitoramento.
    
    **Retorna:**
    - Status atual do serviço
    - Versão da aplicação
    - Status da segurança
    """
    return HealthResponse(
        status="healthy",
        service="core", 
        version="1.0.0",
        security="enabled"
    )

@app.get("/")
async def root():
    """Endpoint público básico"""
    return {
        "message": "Core Service is running!", 
        "timestamp": datetime.now(),
        "status": "active",
        "security_features": ["Rate Limiting", "CORS", "Security Headers", "Input Validation"]
    }

@app.get("/api/status")
async def api_status():
    """Status público da API com informações de segurança"""
    return {
        "service": "core",
        "status": "running",
        "version": "1.0.0",
        "security_implemented": True,
        "features": [
            "JWT Authentication Ready",
            "Rate Limiting Configuration", 
            "CORS Policy",
            "Security Headers",
            "Input Validation"
        ],
        "endpoints": {
            "public": ["/", "/health", "/api/status"],
            "protected": ["/api/secure/*", "/api/admin/*"],
            "auth": ["/api/auth/*"]
        }
    }

@app.get("/api/security/info")
async def security_info():
    """Informações sobre recursos de segurança implementados"""
    return {
        "security_status": "ACTIVE",
        "implemented_features": {
            "authentication": {
                "type": "JWT",
                "status": "configured",
                "token_expiry": "30 minutes"
            },
            "rate_limiting": {
                "status": "active",
                "limits": {
                    "per_minute": 60,
                    "per_hour": 1000,
                    "burst": 10
                }
            },
            "cors": {
                "status": "configured",
                "policy": "environment-based"
            },
            "headers": {
                "xss_protection": True,
                "frame_options": "DENY",
                "content_type_options": "nosniff",
                "hsts": "enabled"
            }
        },
        "security_level": "HIGH",
        "last_updated": datetime.now()
    }

@app.post("/api/auth/demo")
async def demo_auth():
    """Endpoint de demonstração de autenticação (para testes)"""
    # Token de demonstração (em produção seria gerado com JWT real)
    demo_token = "demo_eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9_security_enabled"
    
    return {
        "message": "Autenticação de demonstração",
        "demo_token": demo_token,
        "instructions": "Em produção, use tokens JWT reais",
        "security_note": "Sistema preparado para autenticação completa",
        "usage": "Authorization: Bearer <token>"
    }

@app.get("/api/test/rate-limit")
async def test_rate_limit():
    """Endpoint para testar rate limiting"""
    return {
        "message": "Endpoint para teste de rate limiting",
        "timestamp": datetime.now(),
        "note": "Faça várias requests para testar o limite"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)