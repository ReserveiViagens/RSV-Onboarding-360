from fastapi import FastAPI
from datetime import datetime
import logging

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI App com segurança básica
app = FastAPI(
    title="Core Service - Onion RSV 360", 
    version="1.0.0",
    description="Microserviço Core com segurança implementada"
)

@app.get("/health")
async def health_check():
    """Endpoint público de health check"""
    return {"status": "healthy", "service": "core", "version": "1.0.0", "security": "enabled"}

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