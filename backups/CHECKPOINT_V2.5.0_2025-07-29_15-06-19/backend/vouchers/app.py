from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, date
from enum import Enum
import uuid
import json
import os
from pathlib import Path

app = FastAPI(
    title="Vouchers Service",
    description="Serviço de gestão de vouchers e reservas",
    version="1.0.0"
)

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos de dados
class TipoVoucher(str, Enum):
    HOTEL = "hotel"
    VOO = "voo"
    PACOTE = "pacote"
    ATRACAO = "atracao"
    TRANSPORTE = "transporte"
    SERVICO = "servico"

class StatusVoucher(str, Enum):
    ATIVO = "ativo"
    USADO = "usado"
    EXPIRADO = "expirado"
    CANCELADO = "cancelado"
    PENDENTE = "pendente"

class Beneficio(BaseModel):
    nome: str
    descricao: str
    ativo: bool = True

class Documento(BaseModel):
    nome: str
    tipo: str
    url: str
    tamanho: int
    data_upload: datetime

class VoucherBase(BaseModel):
    codigo: str = Field(..., description="Código único do voucher")
    cliente: str = Field(..., description="Nome do cliente")
    tipo: TipoVoucher = Field(..., description="Tipo do voucher")
    destino: str = Field(..., description="Destino da viagem")
    data_inicio: date = Field(..., description="Data de início")
    data_fim: date = Field(..., description="Data de fim")
    valor: float = Field(..., description="Valor do voucher")
    agencia: str = Field(..., description="Nome da agência")
    agente: str = Field(..., description="Nome do agente")
    observacoes: Optional[str] = Field(None, description="Observações adicionais")
    beneficios: List[str] = Field(default_factory=list, description="Lista de benefícios")
    validade: date = Field(..., description="Data de validade")
    documentos: List[str] = Field(default_factory=list, description="Lista de documentos")

class VoucherCreate(VoucherBase):
    pass

class VoucherUpdate(BaseModel):
    codigo: Optional[str] = None
    cliente: Optional[str] = None
    tipo: Optional[TipoVoucher] = None
    destino: Optional[str] = None
    data_inicio: Optional[date] = None
    data_fim: Optional[date] = None
    valor: Optional[float] = None
    agencia: Optional[str] = None
    agente: Optional[str] = None
    observacoes: Optional[str] = None
    beneficios: Optional[List[str]] = None
    validade: Optional[date] = None
    status: Optional[StatusVoucher] = None
    documentos: Optional[List[str]] = None

class VoucherResponse(VoucherBase):
    id: str
    status: StatusVoucher
    criado_em: datetime
    usado_em: Optional[datetime] = None
    qr_code: Optional[str] = None

class VoucherStats(BaseModel):
    total: int
    ativos: int
    usados: int
    expirados: int
    cancelados: int
    valor_total: float
    valor_medio: float
    taxa_utilizacao: float

class VoucherSearch(BaseModel):
    termo: Optional[str] = None
    status: Optional[StatusVoucher] = None
    tipo: Optional[TipoVoucher] = None
    data_inicio: Optional[date] = None
    data_fim: Optional[date] = None
    agencia: Optional[str] = None
    agente: Optional[str] = None

# Armazenamento em memória (em produção seria um banco de dados)
vouchers_db: Dict[str, VoucherResponse] = {}

# Dados iniciais para demonstração
def carregar_dados_iniciais():
    dados_iniciais = [
        {
            "id": "1",
            "codigo": "VCH-2025-001",
            "cliente": "Claudia Helena Ivonika",
            "tipo": TipoVoucher.PACOTE,
            "destino": "Lcqua Diroma Resort",
            "data_inicio": date(2025, 2, 15),
            "data_fim": date(2025, 2, 20),
            "valor": 2850.00,
            "status": StatusVoucher.ATIVO,
            "agencia": "Reservei Viagens",
            "agente": "Maria Silva",
            "observacoes": "Pacote completo com hospedagem e passeios",
            "beneficios": ["Wi-Fi gratuito", "Café da manhã", "Transfer aeroporto"],
            "validade": date(2025, 12, 31),
            "criado_em": datetime(2025, 1, 15, 10, 30, 0),
            "documentos": ["voucher.pdf", "comprovante.pdf"]
        },
        {
            "id": "2",
            "codigo": "VCH-2025-002",
            "cliente": "João Santos",
            "tipo": TipoVoucher.HOTEL,
            "destino": "Hotel Maravilha",
            "data_inicio": date(2025, 3, 10),
            "data_fim": date(2025, 3, 15),
            "valor": 1200.00,
            "status": StatusVoucher.USADO,
            "agencia": "Reservei Viagens",
            "agente": "Pedro Costa",
            "observacoes": "Quarto duplo com vista para o mar",
            "beneficios": ["Estacionamento", "Piscina", "Academia"],
            "validade": date(2025, 6, 30),
            "criado_em": datetime(2025, 1, 20, 14, 15, 0),
            "usado_em": datetime(2025, 3, 10, 9, 0, 0),
            "documentos": ["voucher.pdf"]
        },
        {
            "id": "3",
            "codigo": "VCH-2025-003",
            "cliente": "Ana Oliveira",
            "tipo": TipoVoucher.VOO,
            "destino": "São Paulo - Rio de Janeiro",
            "data_inicio": date(2025, 4, 5),
            "data_fim": date(2025, 4, 5),
            "valor": 450.00,
            "status": StatusVoucher.ATIVO,
            "agencia": "Reservei Viagens",
            "agente": "Carlos Lima",
            "observacoes": "Voo direto, classe econômica",
            "beneficios": ["Bagagem incluída", "Refeição a bordo"],
            "validade": date(2025, 8, 31),
            "criado_em": datetime(2025, 1, 25, 16, 45, 0),
            "documentos": ["passagem.pdf", "voucher.pdf"]
        },
        {
            "id": "4",
            "codigo": "VCH-2025-004",
            "cliente": "Roberto Silva",
            "tipo": TipoVoucher.ATRACAO,
            "destino": "Cristo Redentor",
            "data_inicio": date(2025, 5, 20),
            "data_fim": date(2025, 5, 20),
            "valor": 80.00,
            "status": StatusVoucher.EXPIRADO,
            "agencia": "Reservei Viagens",
            "agente": "Fernanda Santos",
            "observacoes": "Ingresso com guia turístico",
            "beneficios": ["Guia local", "Transporte ida e volta"],
            "validade": date(2025, 5, 20),
            "criado_em": datetime(2025, 2, 1, 11, 20, 0),
            "documentos": ["ingresso.pdf"]
        },
        {
            "id": "5",
            "codigo": "VCH-2025-005",
            "cliente": "Lucia Mendes",
            "tipo": TipoVoucher.TRANSPORTE,
            "destino": "Aluguel de Carro - Rio de Janeiro",
            "data_inicio": date(2025, 6, 10),
            "data_fim": date(2025, 6, 15),
            "valor": 320.00,
            "status": StatusVoucher.ATIVO,
            "agencia": "Reservei Viagens",
            "agente": "Ricardo Alves",
            "observacoes": "Carro compacto com seguro completo",
            "beneficios": ["Seguro completo", "GPS", "Seguro adicional"],
            "validade": date(2025, 9, 30),
            "criado_em": datetime(2025, 2, 5, 13, 30, 0),
            "documentos": ["contrato.pdf", "voucher.pdf"]
        }
    ]
    
    for voucher_data in dados_iniciais:
        vouchers_db[voucher_data["id"]] = VoucherResponse(**voucher_data)

# Carregar dados iniciais
carregar_dados_iniciais()

# Funções auxiliares
def gerar_codigo_voucher() -> str:
    """Gera um código único para o voucher"""
    return f"VCH-{datetime.now().year}-{str(uuid.uuid4())[:8].upper()}"

def calcular_estatisticas() -> VoucherStats:
    """Calcula estatísticas dos vouchers"""
    total = len(vouchers_db)
    ativos = len([v for v in vouchers_db.values() if v.status == StatusVoucher.ATIVO])
    usados = len([v for v in vouchers_db.values() if v.status == StatusVoucher.USADO])
    expirados = len([v for v in vouchers_db.values() if v.status == StatusVoucher.EXPIRADO])
    cancelados = len([v for v in vouchers_db.values() if v.status == StatusVoucher.CANCELADO])
    
    valor_total = sum(v.valor for v in vouchers_db.values())
    valor_medio = valor_total / total if total > 0 else 0
    taxa_utilizacao = (usados / total * 100) if total > 0 else 0
    
    return VoucherStats(
        total=total,
        ativos=ativos,
        usados=usados,
        expirados=expirados,
        cancelados=cancelados,
        valor_total=valor_total,
        valor_medio=valor_medio,
        taxa_utilizacao=taxa_utilizacao
    )

# Rotas da API
@app.get("/")
async def root():
    """Endpoint raiz do serviço"""
    return {
        "service": "Vouchers Service",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "vouchers": "/vouchers",
            "stats": "/vouchers/stats",
            "search": "/vouchers/search",
            "health": "/health"
        }
    }

@app.get("/health")
async def health_check():
    """Verificação de saúde do serviço"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "vouchers",
        "version": "1.0.0"
    }

@app.get("/vouchers", response_model=List[VoucherResponse])
async def listar_vouchers(
    skip: int = 0,
    limit: int = 100,
    status: Optional[StatusVoucher] = None,
    tipo: Optional[TipoVoucher] = None
):
    """Lista todos os vouchers com filtros opcionais"""
    vouchers = list(vouchers_db.values())
    
    if status:
        vouchers = [v for v in vouchers if v.status == status]
    
    if tipo:
        vouchers = [v for v in vouchers if v.tipo == tipo]
    
    return vouchers[skip:skip + limit]

@app.get("/vouchers/{voucher_id}", response_model=VoucherResponse)
async def obter_voucher(voucher_id: str):
    """Obtém um voucher específico por ID"""
    if voucher_id not in vouchers_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Voucher não encontrado"
        )
    return vouchers_db[voucher_id]

@app.post("/vouchers", response_model=VoucherResponse, status_code=status.HTTP_201_CREATED)
async def criar_voucher(voucher: VoucherCreate):
    """Cria um novo voucher"""
    voucher_id = str(uuid.uuid4())
    
    # Verificar se o código já existe
    codigo_existe = any(v.codigo == voucher.codigo for v in vouchers_db.values())
    if codigo_existe:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Código do voucher já existe"
        )
    
    novo_voucher = VoucherResponse(
        id=voucher_id,
        **voucher.dict(),
        status=StatusVoucher.ATIVO,
        criado_em=datetime.now()
    )
    
    vouchers_db[voucher_id] = novo_voucher
    return novo_voucher

@app.put("/vouchers/{voucher_id}", response_model=VoucherResponse)
async def atualizar_voucher(voucher_id: str, voucher_update: VoucherUpdate):
    """Atualiza um voucher existente"""
    if voucher_id not in vouchers_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Voucher não encontrado"
        )
    
    voucher_atual = vouchers_db[voucher_id]
    dados_atualizados = voucher_update.dict(exclude_unset=True)
    
    # Atualizar apenas os campos fornecidos
    for campo, valor in dados_atualizados.items():
        setattr(voucher_atual, campo, valor)
    
    vouchers_db[voucher_id] = voucher_atual
    return voucher_atual

@app.delete("/vouchers/{voucher_id}")
async def excluir_voucher(voucher_id: str):
    """Exclui um voucher"""
    if voucher_id not in vouchers_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Voucher não encontrado"
        )
    
    del vouchers_db[voucher_id]
    return {"message": "Voucher excluído com sucesso"}

@app.get("/vouchers/stats", response_model=VoucherStats)
async def obter_estatisticas():
    """Obtém estatísticas dos vouchers"""
    return calcular_estatisticas()

@app.post("/vouchers/search", response_model=List[VoucherResponse])
async def buscar_vouchers(search: VoucherSearch):
    """Busca vouchers com critérios específicos"""
    vouchers = list(vouchers_db.values())
    
    if search.termo:
        termo_lower = search.termo.lower()
        vouchers = [
            v for v in vouchers
            if (termo_lower in v.codigo.lower() or
                termo_lower in v.cliente.lower() or
                termo_lower in v.destino.lower() or
                termo_lower in v.agencia.lower() or
                termo_lower in v.agente.lower())
        ]
    
    if search.status:
        vouchers = [v for v in vouchers if v.status == search.status]
    
    if search.tipo:
        vouchers = [v for v in vouchers if v.tipo == search.tipo]
    
    if search.data_inicio:
        vouchers = [v for v in vouchers if v.data_inicio >= search.data_inicio]
    
    if search.data_fim:
        vouchers = [v for v in vouchers if v.data_fim <= search.data_fim]
    
    if search.agencia:
        vouchers = [v for v in vouchers if search.agencia.lower() in v.agencia.lower()]
    
    if search.agente:
        vouchers = [v for v in vouchers if search.agente.lower() in v.agente.lower()]
    
    return vouchers

@app.post("/vouchers/{voucher_id}/usar")
async def usar_voucher(voucher_id: str):
    """Marca um voucher como usado"""
    if voucher_id not in vouchers_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Voucher não encontrado"
        )
    
    voucher = vouchers_db[voucher_id]
    
    if voucher.status != StatusVoucher.ATIVO:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Voucher não está ativo"
        )
    
    if voucher.validade < date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Voucher expirado"
        )
    
    voucher.status = StatusVoucher.USADO
    voucher.usado_em = datetime.now()
    vouchers_db[voucher_id] = voucher
    
    return {"message": "Voucher usado com sucesso", "voucher": voucher}

@app.post("/vouchers/{voucher_id}/cancelar")
async def cancelar_voucher(voucher_id: str):
    """Cancela um voucher"""
    if voucher_id not in vouchers_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Voucher não encontrado"
        )
    
    voucher = vouchers_db[voucher_id]
    
    if voucher.status in [StatusVoucher.USADO, StatusVoucher.CANCELADO]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Voucher não pode ser cancelado"
        )
    
    voucher.status = StatusVoucher.CANCELADO
    vouchers_db[voucher_id] = voucher
    
    return {"message": "Voucher cancelado com sucesso", "voucher": voucher}

@app.get("/vouchers/{voucher_id}/qr-code")
async def gerar_qr_code(voucher_id: str):
    """Gera QR code para um voucher"""
    if voucher_id not in vouchers_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Voucher não encontrado"
        )
    
    voucher = vouchers_db[voucher_id]
    
    # Simular geração de QR code
    qr_data = {
        "voucher_id": voucher.id,
        "codigo": voucher.codigo,
        "cliente": voucher.cliente,
        "destino": voucher.destino,
        "validade": voucher.validade.isoformat()
    }
    
    return {
        "qr_code": f"data:image/png;base64,{uuid.uuid4().hex}",
        "qr_data": qr_data
    }

@app.post("/vouchers/batch/export")
async def exportar_vouchers(voucher_ids: List[str]):
    """Exporta vouchers selecionados"""
    vouchers_export = []
    
    for voucher_id in voucher_ids:
        if voucher_id in vouchers_db:
            vouchers_export.append(vouchers_db[voucher_id])
    
    return {
        "total_exportados": len(vouchers_export),
        "vouchers": vouchers_export,
        "formato": "json",
        "data_exportacao": datetime.now().isoformat()
    }

@app.post("/vouchers/batch/status")
async def alterar_status_em_lote(voucher_ids: List[str], novo_status: StatusVoucher):
    """Altera o status de múltiplos vouchers"""
    vouchers_alterados = []
    
    for voucher_id in voucher_ids:
        if voucher_id in vouchers_db:
            voucher = vouchers_db[voucher_id]
            voucher.status = novo_status
            vouchers_db[voucher_id] = voucher
            vouchers_alterados.append(voucher)
    
    return {
        "message": f"Status alterado para {len(vouchers_alterados)} vouchers",
        "vouchers_alterados": vouchers_alterados
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5028) 