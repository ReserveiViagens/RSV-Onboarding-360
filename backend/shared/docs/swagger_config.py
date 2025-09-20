"""
📜 Configuração Swagger/OpenAPI - Onion RSV 360
Sistema unificado de documentação para todos os microserviços
"""

from fastapi import FastAPI
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi
from typing import Dict, Any, List, Optional
import os

class SwaggerConfig:
    """Configuração centralizada do Swagger para todos os microserviços"""
    
    def __init__(self):
        self.base_config = {
            "title": "Onion RSV 360 API",
            "description": self._get_base_description(),
            "version": "1.0.0",
            "contact": {
                "name": "Equipe Onion RSV 360",
                "email": "api@onionrsv360.com",
                "url": "https://onionrsv360.com"
            },
            "license": {
                "name": "MIT License",
                "url": "https://opensource.org/licenses/MIT"
            },
            "servers": [
                {
                    "url": "http://localhost",
                    "description": "Desenvolvimento Local"
                },
                {
                    "url": "https://api.onionrsv360.com",
                    "description": "Produção"
                }
            ]
        }
    
    def _get_base_description(self) -> str:
        return """
# 🌍 Sistema Completo de Turismo - Onion RSV 360

## 🎯 **Visão Geral**
Sistema integrado de gestão turística com **32 microserviços** especializados.

## 🏗️ **Arquitetura**
- **Load Balancer**: Nginx (portas 80/443/8080)
- **Database**: PostgreSQL 15 Otimizado
- **Security**: JWT + Rate Limiting + CORS
- **Monitoring**: Performance em tempo real

## 🚀 **Grupos de Serviços**

### 🔧 **Core Services**
- **Core**: Serviço central e configurações
- **Travel**: Gestão de viagens e roteiros
- **Finance**: Sistema financeiro integrado
- **Tickets**: Ingressos e reservas

### 💼 **Business Services**
- **Payments**: Processamento de pagamentos
- **Ecommerce**: Loja virtual completa
- **Vouchers**: Sistema de vouchers
- **Attractions**: Atrações turísticas

### 🎯 **Specialized Services**
- **Maps**: Geolocalização e mapas
- **Marketing**: Campanhas publicitárias
- **SEO**: Otimização para buscadores
- **Videos/Photos**: Gestão de mídia

### 📊 **Management Systems**
- **Analytics**: Análises e métricas
- **Reports**: Relatórios executivos
- **Admin**: Painel administrativo
- **Data**: Processamento de dados

### 👥 **User Services**
- **Notifications**: Sistema de notificações
- **Reviews**: Avaliações e comentários
- **Rewards**: Sistema de recompensas
- **Loyalty**: Programa de fidelidade

### 💰 **Business Operations**
- **Sales**: Gestão de vendas
- **Inventory**: Controle de estoque
- **Refunds**: Reembolsos
- **Sectoral Finance**: Finanças setoriais

## 🔐 **Autenticação**
Todas as APIs protegidas utilizam **JWT Bearer Token**.

### Obter Token:
```bash
POST /api/auth/login
{
    "username": "user@example.com",
    "password": "senha123"
}
```

### Usar Token:
```bash
Authorization: Bearer <seu_jwt_token>
```

## 📈 **Rate Limiting**
- **60 requests/minuto** por IP
- **1000 requests/hora** por IP
- **Endpoints críticos**: Limites específicos

## 🌐 **URLs dos Serviços**
Todos os serviços estão disponíveis através do load balancer:
- `http://localhost/[servico]/docs` - Documentação específica
- `http://localhost/api/status` - Status geral do sistema

## 🆘 **Suporte**
- **Documentação**: [/docs](/docs)
- **Status**: [/api/status](/api/status)
- **Health**: [/health](/health)
        """
    
    def get_service_config(self, service_name: str, service_description: str = None) -> Dict[str, Any]:
        """Configuração específica para um microserviço"""
        
        service_configs = {
            "core": {
                "title": "Core Service API",
                "description": "🔧 Serviço central do sistema - configurações, autenticação e coordenação geral",
                "tags": [
                    {"name": "Core", "description": "Operações centrais do sistema"},
                    {"name": "Auth", "description": "Autenticação e autorização"},
                    {"name": "Config", "description": "Configurações do sistema"}
                ]
            },
            "travel": {
                "title": "Travel Service API", 
                "description": "🌍 Gestão de viagens, roteiros, destinos e itinerários turísticos",
                "tags": [
                    {"name": "Destinations", "description": "Gestão de destinos turísticos"},
                    {"name": "Itineraries", "description": "Criação e gestão de roteiros"},
                    {"name": "Bookings", "description": "Reservas de viagens"}
                ]
            },
            "finance": {
                "title": "Finance Service API",
                "description": "💰 Sistema financeiro completo - transações, faturas e contabilidade",
                "tags": [
                    {"name": "Transactions", "description": "Gestão de transações financeiras"},
                    {"name": "Invoices", "description": "Faturamento e notas fiscais"},
                    {"name": "Reports", "description": "Relatórios financeiros"}
                ]
            },
            "tickets": {
                "title": "Tickets Service API",
                "description": "🎫 Sistema de ingressos, reservas e controle de acesso",
                "tags": [
                    {"name": "Tickets", "description": "Gestão de ingressos"},
                    {"name": "Reservations", "description": "Sistema de reservas"},
                    {"name": "Access Control", "description": "Controle de acesso"}
                ]
            },
            "payments": {
                "title": "Payments Service API",
                "description": "💳 Processamento de pagamentos seguro e integrado",
                "tags": [
                    {"name": "Payments", "description": "Processamento de pagamentos"},
                    {"name": "Refunds", "description": "Estornos e reembolsos"},
                    {"name": "Gateway", "description": "Integração com gateways"}
                ]
            },
            "ecommerce": {
                "title": "E-commerce Service API",
                "description": "🛒 Loja virtual completa para produtos turísticos",
                "tags": [
                    {"name": "Products", "description": "Catálogo de produtos"},
                    {"name": "Cart", "description": "Carrinho de compras"},
                    {"name": "Orders", "description": "Gestão de pedidos"}
                ]
            }
        }
        
        config = service_configs.get(service_name, {
            "title": f"{service_name.title()} Service API",
            "description": service_description or f"API do serviço {service_name}",
            "tags": [{"name": service_name.title(), "description": f"Operações do serviço {service_name}"}]
        })
        
        # Merge com configuração base
        final_config = self.base_config.copy()
        final_config.update(config)
        
        return final_config
    
    def setup_swagger(self, app: FastAPI, service_name: str, service_description: str = None):
        """Configurar Swagger para um microserviço específico"""
        
        config = self.get_service_config(service_name, service_description)
        
        def custom_openapi():
            if app.openapi_schema:
                return app.openapi_schema
            
            openapi_schema = get_openapi(
                title=config["title"],
                version=config["version"],
                description=config["description"],
                routes=app.routes,
                servers=config["servers"]
            )
            
            # Adicionar informações de contato e licença
            openapi_schema["info"]["contact"] = config["contact"]
            openapi_schema["info"]["license"] = config["license"]
            
            # Adicionar tags se existirem
            if "tags" in config:
                openapi_schema["tags"] = config["tags"]
            
            # Adicionar esquemas de segurança
            openapi_schema["components"]["securitySchemes"] = {
                "BearerAuth": {
                    "type": "http",
                    "scheme": "bearer",
                    "bearerFormat": "JWT",
                    "description": "Token JWT obtido via /api/auth/login"
                },
                "ApiKeyAuth": {
                    "type": "apiKey",
                    "in": "header",
                    "name": "X-API-Key",
                    "description": "Chave de API para acesso programático"
                }
            }
            
            # Aplicar segurança por padrão
            for path_item in openapi_schema["paths"].values():
                for operation in path_item.values():
                    if isinstance(operation, dict) and "security" not in operation:
                        operation["security"] = [{"BearerAuth": []}]
            
            app.openapi_schema = openapi_schema
            return app.openapi_schema
        
        app.openapi = custom_openapi
        
        # Customizar página de documentação
        @app.get("/docs", include_in_schema=False)
        async def custom_swagger_ui_html():
            return get_swagger_ui_html(
                openapi_url=app.openapi_url,
                title=f"{config['title']} - Documentação",
                swagger_favicon_url="https://fastapi.tiangolo.com/img/favicon.png",
                swagger_ui_parameters={
                    "defaultModelsExpandDepth": 2,
                    "defaultModelExpandDepth": 2,
                    "displayOperationId": True,
                    "filter": True,
                    "showExtensions": True,
                    "showCommonExtensions": True
                }
            )

# Instância global
swagger_config = SwaggerConfig()

# Schemas comuns para reuso
common_schemas = {
    "Error": {
        "type": "object",
        "properties": {
            "error": {"type": "string", "description": "Mensagem de erro"},
            "code": {"type": "integer", "description": "Código do erro"},
            "details": {"type": "string", "description": "Detalhes adicionais"}
        },
        "required": ["error", "code"]
    },
    "HealthCheck": {
        "type": "object", 
        "properties": {
            "status": {"type": "string", "example": "healthy"},
            "service": {"type": "string", "example": "core"},
            "version": {"type": "string", "example": "1.0.0"},
            "timestamp": {"type": "string", "format": "date-time"}
        },
        "required": ["status", "service", "version"]
    },
    "PaginatedResponse": {
        "type": "object",
        "properties": {
            "items": {"type": "array", "items": {}},
            "total": {"type": "integer", "description": "Total de itens"},
            "page": {"type": "integer", "description": "Página atual"},
            "pages": {"type": "integer", "description": "Total de páginas"},
            "per_page": {"type": "integer", "description": "Itens por página"}
        },
        "required": ["items", "total", "page", "pages", "per_page"]
    }
}

def add_common_responses(app: FastAPI):
    """Adicionar respostas comuns a todas as rotas"""
    
    # Respostas padrão para todas as APIs
    common_responses = {
        400: {"description": "Requisição inválida", "content": {"application/json": {"schema": common_schemas["Error"]}}},
        401: {"description": "Não autorizado", "content": {"application/json": {"schema": common_schemas["Error"]}}},
        403: {"description": "Acesso negado", "content": {"application/json": {"schema": common_schemas["Error"]}}},
        404: {"description": "Recurso não encontrado", "content": {"application/json": {"schema": common_schemas["Error"]}}},
        429: {"description": "Muitas requisições", "content": {"application/json": {"schema": common_schemas["Error"]}}},
        500: {"description": "Erro interno do servidor", "content": {"application/json": {"schema": common_schemas["Error"]}}}
    }
    
    # Aplicar a todas as rotas
    for route in app.routes:
        if hasattr(route, 'responses'):
            route.responses.update(common_responses)

# Função utilitária para setup completo
def setup_service_docs(app: FastAPI, service_name: str, service_description: str = None):
    """Setup completo de documentação para um microserviço"""
    swagger_config.setup_swagger(app, service_name, service_description)
    add_common_responses(app)
    
    # Adicionar endpoint de documentação em JSON
    @app.get("/openapi.json", include_in_schema=False)
    async def get_openapi_json():
        return app.openapi()
    
    # Endpoint de informações da API
    @app.get("/api/info", tags=["System"])
    async def api_info():
        """Informações sobre esta API"""
        return {
            "service": service_name,
            "version": "1.0.0",
            "description": service_description or f"API do serviço {service_name}",
            "docs_url": "/docs",
            "openapi_url": "/openapi.json",
            "health_url": "/health"
        }