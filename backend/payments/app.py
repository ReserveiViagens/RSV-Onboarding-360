from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
import logging
import json
from datetime import datetime
import uuid

# Configuração de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Payments Service",
    description="Serviço de pagamentos para Onion RSV 360",
    version="2.2.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cache simples em memória
class SimpleCache:
    def __init__(self):
        self._cache = {}
    
    def set(self, key: str, value: Any, ttl: int = 300):
        self._cache[key] = {
            'value': value,
            'expires_at': datetime.now().timestamp() + ttl
        }
    
    def get(self, key: str) -> Optional[Any]:
        if key in self._cache:
            item = self._cache[key]
            if datetime.now().timestamp() < item['expires_at']:
                return item['value']
            else:
                del self._cache[key]
        return None
    
    def delete(self, key: str):
        if key in self._cache:
            del self._cache[key]

cache = SimpleCache()

# Modelos Pydantic
class PaymentRequest(BaseModel):
    amount: float
    currency: str = "BRL"
    payment_method: str
    description: str
    customer_email: str
    customer_name: str

class PaymentResponse(BaseModel):
    payment_id: str
    status: str
    amount: float
    currency: str
    created_at: str
    payment_method: str

class RefundRequest(BaseModel):
    payment_id: str
    amount: float
    reason: str

class RefundResponse(BaseModel):
    refund_id: str
    payment_id: str
    status: str
    amount: float
    created_at: str

# Simulação de processamento de pagamento
def process_payment_simulation(payment_data: PaymentRequest) -> Dict[str, Any]:
    """Simula o processamento de um pagamento"""
    payment_id = str(uuid.uuid4())
    
    # Simula diferentes cenários de pagamento
    if payment_data.amount > 1000:
        status = "pending"
    elif payment_data.amount < 0:
        status = "failed"
    else:
        status = "completed"
    
    return {
        "payment_id": payment_id,
        "status": status,
        "amount": payment_data.amount,
        "currency": payment_data.currency,
        "created_at": datetime.now().isoformat(),
        "payment_method": payment_data.payment_method,
        "description": payment_data.description,
        "customer_email": payment_data.customer_email,
        "customer_name": payment_data.customer_name
    }

# Simulação de processamento de reembolso
def process_refund_simulation(refund_data: RefundRequest) -> Dict[str, Any]:
    """Simula o processamento de um reembolso"""
    refund_id = str(uuid.uuid4())
    
    # Simula diferentes cenários de reembolso
    if refund_data.amount <= 0:
        status = "failed"
    else:
        status = "completed"
    
    return {
        "refund_id": refund_id,
        "payment_id": refund_data.payment_id,
        "status": status,
        "amount": refund_data.amount,
        "created_at": datetime.now().isoformat(),
        "reason": refund_data.reason
    }

@app.get("/")
async def root():
    return {
        "service": "Payments Service",
        "version": "2.2.0",
        "status": "running",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    try:
        # Verifica se o cache está funcionando
        cache.set("health_check", "ok", 60)
        cache_status = cache.get("health_check") == "ok"
        
        return {
            "status": "healthy",
            "service": "payments",
            "timestamp": datetime.now().isoformat(),
            "cache": "ok" if cache_status else "error",
            "version": "2.2.0"
        }
    except Exception as e:
        logger.error(f"Erro no health check: {e}")
        raise HTTPException(status_code=500, detail="Service unhealthy")

@app.post("/api/payments/process", response_model=PaymentResponse)
async def process_payment(payment: PaymentRequest):
    """Processa um pagamento"""
    try:
        logger.info(f"Processando pagamento: {payment.amount} {payment.currency}")
        
        # Simula processamento
        result = process_payment_simulation(payment)
        
        # Cache do resultado
        cache.set(f"payment_{result['payment_id']}", result, 3600)
        
        return PaymentResponse(**result)
    
    except Exception as e:
        logger.error(f"Erro ao processar pagamento: {e}")
        raise HTTPException(status_code=500, detail="Erro ao processar pagamento")

@app.get("/api/payments/{payment_id}")
async def get_payment(payment_id: str):
    """Obtém detalhes de um pagamento"""
    try:
        # Tenta buscar do cache
        cached_payment = cache.get(f"payment_{payment_id}")
        if cached_payment:
            return cached_payment
        
        # Simula pagamento não encontrado
        raise HTTPException(status_code=404, detail="Pagamento não encontrado")
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao buscar pagamento: {e}")
        raise HTTPException(status_code=500, detail="Erro interno")

@app.post("/api/payments/{payment_id}/refund", response_model=RefundResponse)
async def refund_payment(payment_id: str, refund: RefundRequest):
    """Processa um reembolso"""
    try:
        logger.info(f"Processando reembolso para pagamento: {payment_id}")
        
        # Verifica se o pagamento existe
        cached_payment = cache.get(f"payment_{payment_id}")
        if not cached_payment:
            raise HTTPException(status_code=404, detail="Pagamento não encontrado")
        
        # Simula processamento do reembolso
        result = process_refund_simulation(refund)
        
        # Cache do resultado
        cache.set(f"refund_{result['refund_id']}", result, 3600)
        
        return RefundResponse(**result)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao processar reembolso: {e}")
        raise HTTPException(status_code=500, detail="Erro ao processar reembolso")

@app.get("/api/payments/stats")
async def get_payment_stats():
    """Obtém estatísticas de pagamentos"""
    try:
        # Simula estatísticas
        stats = {
            "total_payments": 150,
            "total_amount": 25000.50,
            "successful_payments": 142,
            "failed_payments": 8,
            "average_amount": 166.67,
            "currency": "BRL",
            "last_updated": datetime.now().isoformat()
        }
        
        return stats
    
    except Exception as e:
        logger.error(f"Erro ao obter estatísticas: {e}")
        raise HTTPException(status_code=500, detail="Erro ao obter estatísticas")

@app.get("/api/payments/methods")
async def get_payment_methods():
    """Lista métodos de pagamento disponíveis"""
    try:
        methods = [
            {
                "id": "credit_card",
                "name": "Cartão de Crédito",
                "enabled": True,
                "processing_time": "instant"
            },
            {
                "id": "pix",
                "name": "PIX",
                "enabled": True,
                "processing_time": "instant"
            },
            {
                "id": "boleto",
                "name": "Boleto Bancário",
                "enabled": True,
                "processing_time": "1-3 days"
            },
            {
                "id": "transfer",
                "name": "Transferência Bancária",
                "enabled": True,
                "processing_time": "1-2 days"
            }
        ]
        
        return {"methods": methods}
    
    except Exception as e:
        logger.error(f"Erro ao listar métodos de pagamento: {e}")
        raise HTTPException(status_code=500, detail="Erro interno")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5005) 