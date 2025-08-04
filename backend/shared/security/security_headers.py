"""
🛡️ Headers de Segurança - Onion RSV 360
Middleware para aplicar headers de segurança HTTP
"""

from fastapi import Request, Response
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List, Optional
import os

class SecurityHeaders:
    """Middleware para aplicar headers de segurança"""
    
    def __init__(self):
        # Headers de segurança padrão
        self.security_headers = {
            # Proteção XSS
            "X-XSS-Protection": "1; mode=block",
            
            # Prevent MIME type sniffing
            "X-Content-Type-Options": "nosniff",
            
            # Clickjacking protection
            "X-Frame-Options": "DENY",
            
            # Force HTTPS (em produção)
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
            
            # Referrer policy
            "Referrer-Policy": "strict-origin-when-cross-origin",
            
            # Permissions policy
            "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
            
            # Content Security Policy
            "Content-Security-Policy": self._build_csp(),
            
            # Remove server info
            "Server": "Onion RSV 360",
            
            # API specific headers
            "X-API-Version": "1.0",
            "X-Powered-By": "FastAPI + Onion RSV 360"
        }
    
    def _build_csp(self) -> str:
        """Construir Content Security Policy"""
        csp_directives = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self'",
            "connect-src 'self'",
            "media-src 'self'",
            "object-src 'none'",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'"
        ]
        return "; ".join(csp_directives)
    
    def apply_headers(self, response: Response) -> Response:
        """Aplicar headers de segurança à response"""
        for header, value in self.security_headers.items():
            response.headers[header] = value
        return response

# Instância global
security_headers = SecurityHeaders()

# Configuração CORS para produção
def get_cors_config() -> Dict:
    """Configuração CORS baseada no ambiente"""
    
    # URLs permitidas (configurar conforme ambiente)
    allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001").split(",")
    
    # Em desenvolvimento, ser mais permissivo
    if os.getenv("ENVIRONMENT", "development") == "development":
        allowed_origins.extend([
            "http://localhost:3000",
            "http://localhost:3001", 
            "http://localhost:8080",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:3001"
        ])
    
    return {
        "allow_origins": allowed_origins,
        "allow_credentials": True,
        "allow_methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        "allow_headers": [
            "Accept",
            "Accept-Language",
            "Content-Language",
            "Content-Type",
            "Authorization",
            "X-Requested-With",
            "X-API-Key",
            "X-Client-Version",
            "User-Agent"
        ],
        "expose_headers": [
            "X-Total-Count",
            "X-Page-Count", 
            "X-Rate-Limit-Remaining",
            "X-Response-Time"
        ]
    }

# Middleware para aplicar headers de segurança
async def security_middleware(request: Request, call_next):
    """Middleware que aplica headers de segurança"""
    response = await call_next(request)
    
    # Aplicar headers de segurança
    response = security_headers.apply_headers(response)
    
    # Adicionar tempo de resposta
    import time
    start_time = getattr(request.state, "start_time", time.time())
    process_time = time.time() - start_time
    response.headers["X-Response-Time"] = f"{process_time:.3f}s"
    
    return response

# Headers de segurança específicos para APIs
class APISecurityHeaders:
    """Headers específicos para endpoints de API"""
    
    @staticmethod
    def add_api_headers(response: Response, endpoint: str = None) -> Response:
        """Adicionar headers específicos de API"""
        
        # Rate limiting info (será preenchido pelo rate limiter)
        response.headers["X-RateLimit-Policy"] = "60/minute, 1000/hour"
        
        # API versioning
        response.headers["X-API-Version"] = "1.0"
        
        # Cache control para APIs
        if endpoint and any(x in endpoint for x in ["/health", "/status", "/version"]):
            # Endpoints de saúde podem ser cacheados por pouco tempo
            response.headers["Cache-Control"] = "public, max-age=30"
        else:
            # APIs dinâmicas não devem ser cacheadas
            response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
            response.headers["Pragma"] = "no-cache"
            response.headers["Expires"] = "0"
        
        return response

# Configuração de segurança por ambiente
class EnvironmentSecurity:
    """Configurações de segurança por ambiente"""
    
    @staticmethod
    def get_config() -> Dict:
        """Obter configuração baseada no ambiente"""
        env = os.getenv("ENVIRONMENT", "development")
        
        if env == "production":
            return {
                "debug": False,
                "allowed_hosts": os.getenv("ALLOWED_HOSTS", "").split(","),
                "force_https": True,
                "hsts_enabled": True,
                "secure_cookies": True,
                "log_level": "WARNING"
            }
        elif env == "staging":
            return {
                "debug": False,
                "allowed_hosts": ["staging.onionrsv360.com"],
                "force_https": True,
                "hsts_enabled": True,
                "secure_cookies": True,
                "log_level": "INFO"
            }
        else:  # development
            return {
                "debug": True,
                "allowed_hosts": ["localhost", "127.0.0.1"],
                "force_https": False,
                "hsts_enabled": False,
                "secure_cookies": False,
                "log_level": "DEBUG"
            }

# Validação de input para prevenção de ataques
class InputValidator:
    """Validador de input para prevenção de ataques"""
    
    @staticmethod
    def sanitize_string(input_string: str, max_length: int = 1000) -> str:
        """Sanitizar string de entrada"""
        if not isinstance(input_string, str):
            return ""
        
        # Limitar tamanho
        sanitized = input_string[:max_length]
        
        # Remover caracteres perigosos
        dangerous_chars = ["<", ">", "'", '"', "&", ";", "(", ")", "|", "`"]
        for char in dangerous_chars:
            sanitized = sanitized.replace(char, "")
        
        return sanitized.strip()
    
    @staticmethod
    def validate_email(email: str) -> bool:
        """Validar formato de email"""
        import re
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))
    
    @staticmethod
    def validate_phone(phone: str) -> bool:
        """Validar formato de telefone"""
        import re
        # Aceitar formatos: +55 11 99999-9999, (11) 99999-9999, etc.
        pattern = r'^[\+\(]?[\d\s\-\(\)]{10,15}$'
        return bool(re.match(pattern, phone))
    
    @staticmethod
    def validate_sql_injection(query: str) -> bool:
        """Detectar tentativas de SQL injection"""
        dangerous_patterns = [
            "union", "select", "insert", "update", "delete", "drop", 
            "create", "alter", "exec", "execute", "--", "/*", "*/"
        ]
        
        query_lower = query.lower()
        return not any(pattern in query_lower for pattern in dangerous_patterns)

# Função utilitária para aplicar todas as configurações de segurança
def configure_app_security(app):
    """Configurar todas as medidas de segurança na aplicação FastAPI"""
    
    # CORS
    cors_config = get_cors_config()
    app.add_middleware(
        CORSMiddleware,
        **cors_config
    )
    
    # Middleware de segurança
    app.middleware("http")(security_middleware)
    
    # Adicionar startup event para log de segurança
    @app.on_event("startup")
    async def security_startup():
        import logging
        security_logger = logging.getLogger("security")
        env_config = EnvironmentSecurity.get_config()
        security_logger.info(f"Aplicação iniciada com configurações de segurança: {env_config}")
    
    return app