from fastapi import FastAPI, HTTPException, Depends, Request, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import logging
import os
import json
from datetime import datetime, timedelta
from prometheus_client import Counter, Histogram, start_http_server
import atexit

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuração do Prometheus
PAYMENT_ATTEMPTED = Counter('payment_attempted_total', 'Total de tentativas de pagamento', ['gateway', 'status'])
PAYMENT_PROCESSING_TIME = Histogram('payment_processing_seconds', 'Tempo de processamento de pagamento', ['gateway'])
PAYMENT_AMOUNT = Histogram('payment_amount', 'Valor dos pagamentos', ['gateway', 'currency'])

# Configuração das APIs de pagamento
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "test_key")
MERCADOPAGO_ACCESS_TOKEN = os.getenv("MERCADOPAGO_ACCESS_TOKEN", "test_token")
PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID", "test_id")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET", "test_secret")

# Cache simples
class SimpleCache:
    def __init__(self):
        self.cache = {}
    def get(self, key):
        return self.cache.get(key)
    def set(self, key, value, ttl=None):
        self.cache[key] = value
    def close(self):
        pass

cache_service = SimpleCache()

app = FastAPI(
    title="Serviço de Pagamentos - Onion RSV 360",
    version="2.1.0",
    description="Serviço de pagamentos com múltiplas gateways"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Iniciar servidor de métricas
start_http_server(8000)

def cleanup():
    """Limpeza ao encerrar o serviço"""
    logger.info("Encerrando servidor de métricas")
    cache_service.close()
atexit.register(cleanup)

class PaymentProcessor:
    """Processador de pagamentos com múltiplas gateways"""
    
    def __init__(self):
        self.gateways = {
            'stripe': self._process_stripe_payment,
            'mercadopago': self._process_mercadopago_payment,
            'paypal': self._process_paypal_payment
        }
    
    async def _process_stripe_payment(self, payment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Processa pagamento via Stripe (simulado)"""
        try:
            # Simular processamento Stripe
            payment_id = f"stripe_{datetime.now().strftime('%Y%m%d%H%M%S')}"
            
            return {
                'gateway': 'stripe',
                'payment_id': payment_id,
                'status': 'succeeded',
                'amount': payment_data['amount'],
                'currency': payment_data.get('currency', 'brl'),
                'created_at': datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Erro no processamento Stripe: {str(e)}")
            raise HTTPException(status_code=500, detail="Erro no processamento do pagamento")
    
    async def _process_mercadopago_payment(self, payment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Processa pagamento via MercadoPago (simulado)"""
        try:
            # Simular processamento MercadoPago
            payment_id = f"mp_{datetime.now().strftime('%Y%m%d%H%M%S')}"
            
            return {
                'gateway': 'mercadopago',
                'payment_id': payment_id,
                'status': 'approved',
                'amount': payment_data['amount'],
                'currency': payment_data.get('currency', 'brl'),
                'created_at': datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Erro no processamento MercadoPago: {str(e)}")
            raise HTTPException(status_code=500, detail="Erro no processamento do pagamento")
    
    async def _process_paypal_payment(self, payment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Processa pagamento via PayPal (simulado)"""
        try:
            # Simular processamento PayPal
            payment_id = f"paypal_{datetime.now().strftime('%Y%m%d%H%M%S')}"
            
            return {
                'gateway': 'paypal',
                'payment_id': payment_id,
                'status': 'completed',
                'amount': payment_data['amount'],
                'currency': payment_data.get('currency', 'brl'),
                'created_at': datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Erro no processamento PayPal: {str(e)}")
            raise HTTPException(status_code=500, detail="Erro no processamento do pagamento")
    
    async def process_payment(self, payment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Processa pagamento usando a gateway especificada"""
        gateway = payment_data.get('gateway', 'stripe')
        
        if gateway not in self.gateways:
            raise HTTPException(status_code=400, detail=f"Gateway {gateway} não suportada")
        
        # Registrar tentativa
        PAYMENT_ATTEMPTED.labels(gateway=gateway, status='attempted').inc()
        
        # Processar pagamento
        start_time = datetime.now()
        result = await self.gateways[gateway](payment_data)
        processing_time = (datetime.now() - start_time).total_seconds()
        
        # Registrar métricas
        PAYMENT_PROCESSING_TIME.labels(gateway=gateway).observe(processing_time)
        PAYMENT_AMOUNT.labels(gateway=gateway, currency=result.get('currency', 'brl')).observe(result['amount'])
        
        # Registrar sucesso
        PAYMENT_ATTEMPTED.labels(gateway=gateway, status='success').inc()
        
        return result

# Instância global do processador
payment_processor = PaymentProcessor()

@app.get("/")
def read_root():
    return {
        "service": "Payments Service",
        "version": "2.1.0",
        "status": "running",
        "supported_gateways": ["stripe", "mercadopago", "paypal"]
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "payments",
        "version": "2.1.0",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/payments/process")
async def process_payment(payment_data: Dict[str, Any]):
    """Processa um pagamento"""
    try:
        # Validar dados obrigatórios
        required_fields = ['amount', 'booking_id', 'user_id']
        for field in required_fields:
            if field not in payment_data:
                raise HTTPException(status_code=400, detail=f"Campo obrigatório: {field}")
        
        # Processar pagamento
        result = await payment_processor.process_payment(payment_data)
        
        # Salvar no cache
        cache_key = f"payment_{result['payment_id']}"
        cache_service.set(cache_key, result, ttl=3600)
        
        logger.info(f"Pagamento processado: {result['payment_id']} via {result['gateway']}")
        
        return {
            "success": True,
            "payment_id": result['payment_id'],
            "gateway": result['gateway'],
            "status": result['status'],
            "amount": result['amount'],
            "currency": result['currency']
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao processar pagamento: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@app.get("/api/payments/{payment_id}")
async def get_payment_status(payment_id: str):
    """Obtém status de um pagamento"""
    try:
        # Buscar no cache
        cache_key = f"payment_{payment_id}"
        payment_data = cache_service.get(cache_key)
        
        if not payment_data:
            raise HTTPException(status_code=404, detail="Pagamento não encontrado")
        
        return payment_data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao buscar pagamento: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")

@app.get("/metrics")
def get_metrics():
    """Endpoint para métricas do Prometheus"""
    from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
    from fastapi.responses import Response
    
    return Response(
        content=generate_latest(),
        media_type=CONTENT_TYPE_LATEST
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5005) 