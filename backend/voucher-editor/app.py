from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
import os
from datetime import datetime
import uuid

app = FastAPI(title="Voucher Editor API", version="1.0.0")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos Pydantic
class VoucherElement(BaseModel):
    id: str
    type: str  # text, image, logo, qr-code, barcode, stamp, watermark
    content: str
    x: int
    y: int
    width: int
    height: int
    fontSize: Optional[int] = None
    fontColor: Optional[str] = None
    fontFamily: Optional[str] = None
    rotation: Optional[int] = None
    opacity: Optional[float] = None

class VoucherTemplate(BaseModel):
    id: str
    name: str
    logo: str
    backgroundColor: str
    textColor: str
    borderColor: str
    fontFamily: str
    fontSize: str
    layout: str  # modern, classic, premium, minimal
    elements: List[VoucherElement]

class VoucherData(BaseModel):
    id: str
    code: str
    clientName: str
    destination: str
    startDate: str
    endDate: str
    value: float
    agency: str
    agent: str
    benefits: List[str]
    validity: str
    observations: str
    template: VoucherTemplate

# Armazenamento em memória (em produção, usar banco de dados)
templates_db: Dict[str, VoucherTemplate] = {}
vouchers_db: Dict[str, VoucherData] = {}

# Templates padrão
default_templates = [
    {
        "id": "classic-001",
        "name": "Template Clássico",
        "logo": "/logos/classic-logo.png",
        "backgroundColor": "#ffffff",
        "textColor": "#000000",
        "borderColor": "#1e40af",
        "fontFamily": "Arial, sans-serif",
        "fontSize": "14px",
        "layout": "classic",
        "elements": [
            {
                "id": "logo-001",
                "type": "logo",
                "content": "/logos/classic-logo.png",
                "x": 50,
                "y": 30,
                "width": 120,
                "height": 60
            },
            {
                "id": "title-001",
                "type": "text",
                "content": "VOUCHER",
                "x": 200,
                "y": 50,
                "width": 200,
                "height": 30,
                "fontSize": 24,
                "fontColor": "#1e40af",
                "fontFamily": "Arial, sans-serif"
            },
            {
                "id": "code-label-001",
                "type": "text",
                "content": "Código:",
                "x": 50,
                "y": 120,
                "width": 100,
                "height": 20,
                "fontSize": 14,
                "fontColor": "#374151",
                "fontFamily": "Arial, sans-serif"
            },
            {
                "id": "client-label-001",
                "type": "text",
                "content": "Cliente:",
                "x": 50,
                "y": 150,
                "width": 100,
                "height": 20,
                "fontSize": 14,
                "fontColor": "#374151",
                "fontFamily": "Arial, sans-serif"
            },
            {
                "id": "destination-label-001",
                "type": "text",
                "content": "Destino:",
                "x": 50,
                "y": 180,
                "width": 100,
                "height": 20,
                "fontSize": 14,
                "fontColor": "#374151",
                "fontFamily": "Arial, sans-serif"
            },
            {
                "id": "value-label-001",
                "type": "text",
                "content": "Valor:",
                "x": 50,
                "y": 210,
                "width": 100,
                "height": 20,
                "fontSize": 14,
                "fontColor": "#374151",
                "fontFamily": "Arial, sans-serif"
            },
            {
                "id": "qr-001",
                "type": "qr-code",
                "content": "VCH-2025-001",
                "x": 400,
                "y": 120,
                "width": 80,
                "height": 80
            },
            {
                "id": "stamp-001",
                "type": "stamp",
                "content": "VALIDADO",
                "x": 350,
                "y": 250,
                "width": 100,
                "height": 40,
                "fontSize": 12,
                "fontColor": "#059669",
                "fontFamily": "Arial, sans-serif"
            }
        ]
    },
    {
        "id": "modern-001",
        "name": "Template Moderno",
        "logo": "/logos/modern-logo.png",
        "backgroundColor": "#f8fafc",
        "textColor": "#1e293b",
        "borderColor": "#3b82f6",
        "fontFamily": "Inter, sans-serif",
        "fontSize": "16px",
        "layout": "modern",
        "elements": [
            {
                "id": "logo-002",
                "type": "logo",
                "content": "/logos/modern-logo.png",
                "x": 40,
                "y": 40,
                "width": 100,
                "height": 50
            },
            {
                "id": "title-002",
                "type": "text",
                "content": "VOUCHER DE VIAGEM",
                "x": 160,
                "y": 60,
                "width": 250,
                "height": 30,
                "fontSize": 20,
                "fontColor": "#3b82f6",
                "fontFamily": "Inter, sans-serif"
            },
            {
                "id": "code-label-002",
                "type": "text",
                "content": "Código:",
                "x": 40,
                "y": 130,
                "width": 80,
                "height": 20,
                "fontSize": 12,
                "fontColor": "#64748b",
                "fontFamily": "Inter, sans-serif"
            },
            {
                "id": "client-label-002",
                "type": "text",
                "content": "Cliente:",
                "x": 40,
                "y": 160,
                "width": 80,
                "height": 20,
                "fontSize": 12,
                "fontColor": "#64748b",
                "fontFamily": "Inter, sans-serif"
            },
            {
                "id": "destination-label-002",
                "type": "text",
                "content": "Destino:",
                "x": 40,
                "y": 190,
                "width": 80,
                "height": 20,
                "fontSize": 12,
                "fontColor": "#64748b",
                "fontFamily": "Inter, sans-serif"
            },
            {
                "id": "value-label-002",
                "type": "text",
                "content": "Valor:",
                "x": 40,
                "y": 220,
                "width": 80,
                "height": 20,
                "fontSize": 12,
                "fontColor": "#64748b",
                "fontFamily": "Inter, sans-serif"
            },
            {
                "id": "qr-002",
                "type": "qr-code",
                "content": "VCH-2025-001",
                "x": 380,
                "y": 130,
                "width": 90,
                "height": 90
            },
            {
                "id": "watermark-002",
                "type": "watermark",
                "content": "ONION RSV 360",
                "x": 200,
                "y": 280,
                "width": 150,
                "height": 20,
                "fontSize": 10,
                "fontColor": "#cbd5e1",
                "fontFamily": "Inter, sans-serif",
                "opacity": 0.3
            }
        ]
    },
    {
        "id": "premium-001",
        "name": "Template Premium",
        "logo": "/logos/premium-logo.png",
        "backgroundColor": "#1e293b",
        "textColor": "#f8fafc",
        "borderColor": "#f59e0b",
        "fontFamily": "Playfair Display, serif",
        "fontSize": "18px",
        "layout": "premium",
        "elements": [
            {
                "id": "logo-003",
                "type": "logo",
                "content": "/logos/premium-logo.png",
                "x": 50,
                "y": 50,
                "width": 140,
                "height": 70
            },
            {
                "id": "title-003",
                "type": "text",
                "content": "VOUCHER EXCLUSIVO",
                "x": 220,
                "y": 80,
                "width": 280,
                "height": 40,
                "fontSize": 28,
                "fontColor": "#f59e0b",
                "fontFamily": "Playfair Display, serif"
            },
            {
                "id": "code-label-003",
                "type": "text",
                "content": "Código:",
                "x": 60,
                "y": 150,
                "width": 100,
                "height": 25,
                "fontSize": 16,
                "fontColor": "#cbd5e1",
                "fontFamily": "Playfair Display, serif"
            },
            {
                "id": "client-label-003",
                "type": "text",
                "content": "Cliente:",
                "x": 60,
                "y": 185,
                "width": 100,
                "height": 25,
                "fontSize": 16,
                "fontColor": "#cbd5e1",
                "fontFamily": "Playfair Display, serif"
            },
            {
                "id": "destination-label-003",
                "type": "text",
                "content": "Destino:",
                "x": 60,
                "y": 220,
                "width": 100,
                "height": 25,
                "fontSize": 16,
                "fontColor": "#cbd5e1",
                "fontFamily": "Playfair Display, serif"
            },
            {
                "id": "value-label-003",
                "type": "text",
                "content": "Valor:",
                "x": 60,
                "y": 255,
                "width": 100,
                "height": 25,
                "fontSize": 16,
                "fontColor": "#cbd5e1",
                "fontFamily": "Playfair Display, serif"
            },
            {
                "id": "qr-003",
                "type": "qr-code",
                "content": "VCH-2025-001",
                "x": 400,
                "y": 150,
                "width": 100,
                "height": 100
            },
            {
                "id": "stamp-003",
                "type": "stamp",
                "content": "PREMIUM",
                "x": 350,
                "y": 280,
                "width": 120,
                "height": 50,
                "fontSize": 14,
                "fontColor": "#f59e0b",
                "fontFamily": "Playfair Display, serif"
            }
        ]
    }
]

# Inicializar templates padrão
for template_data in default_templates:
    template = VoucherTemplate(**template_data)
    templates_db[template.id] = template

@app.get("/")
async def root():
    return {"message": "Voucher Editor API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# Endpoints para Templates
@app.get("/templates", response_model=List[VoucherTemplate])
async def get_templates():
    """Listar todos os templates disponíveis"""
    return list(templates_db.values())

@app.get("/templates/{template_id}", response_model=VoucherTemplate)
async def get_template(template_id: str):
    """Obter um template específico"""
    if template_id not in templates_db:
        raise HTTPException(status_code=404, detail="Template não encontrado")
    return templates_db[template_id]

@app.post("/templates", response_model=VoucherTemplate)
async def create_template(template: VoucherTemplate):
    """Criar um novo template"""
    if template.id in templates_db:
        raise HTTPException(status_code=400, detail="Template já existe")
    
    templates_db[template.id] = template
    return template

@app.put("/templates/{template_id}", response_model=VoucherTemplate)
async def update_template(template_id: str, template: VoucherTemplate):
    """Atualizar um template existente"""
    if template_id not in templates_db:
        raise HTTPException(status_code=404, detail="Template não encontrado")
    
    template.id = template_id
    templates_db[template_id] = template
    return template

@app.delete("/templates/{template_id}")
async def delete_template(template_id: str):
    """Excluir um template"""
    if template_id not in templates_db:
        raise HTTPException(status_code=404, detail="Template não encontrado")
    
    del templates_db[template_id]
    return {"message": "Template excluído com sucesso"}

# Endpoints para Vouchers
@app.get("/vouchers", response_model=List[VoucherData])
async def get_vouchers():
    """Listar todos os vouchers"""
    return list(vouchers_db.values())

@app.get("/vouchers/{voucher_id}", response_model=VoucherData)
async def get_voucher(voucher_id: str):
    """Obter um voucher específico"""
    if voucher_id not in vouchers_db:
        raise HTTPException(status_code=404, detail="Voucher não encontrado")
    return vouchers_db[voucher_id]

@app.post("/vouchers", response_model=VoucherData)
async def create_voucher(voucher: VoucherData):
    """Criar um novo voucher"""
    if voucher.id in vouchers_db:
        raise HTTPException(status_code=400, detail="Voucher já existe")
    
    vouchers_db[voucher.id] = voucher
    return voucher

@app.put("/vouchers/{voucher_id}", response_model=VoucherData)
async def update_voucher(voucher_id: str, voucher: VoucherData):
    """Atualizar um voucher existente"""
    if voucher_id not in vouchers_db:
        raise HTTPException(status_code=404, detail="Voucher não encontrado")
    
    voucher.id = voucher_id
    vouchers_db[voucher_id] = voucher
    return voucher

@app.delete("/vouchers/{voucher_id}")
async def delete_voucher(voucher_id: str):
    """Excluir um voucher"""
    if voucher_id not in vouchers_db:
        raise HTTPException(status_code=404, detail="Voucher não encontrado")
    
    del vouchers_db[voucher_id]
    return {"message": "Voucher excluído com sucesso"}

# Endpoints para Upload de Arquivos
@app.post("/upload/logo")
async def upload_logo(file: UploadFile = File(...)):
    """Upload de logo para o voucher"""
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Arquivo deve ser uma imagem")
    
    # Em produção, salvar o arquivo em um sistema de arquivos ou cloud storage
    # Por enquanto, retornar uma URL simulada
    file_id = str(uuid.uuid4())
    logo_url = f"/uploads/logos/{file_id}_{file.filename}"
    
    return {
        "message": "Logo enviado com sucesso",
        "url": logo_url,
        "filename": file.filename
    }

# Endpoints para Exportação
@app.post("/export/voucher/{voucher_id}")
async def export_voucher(voucher_id: str, format: str = "pdf"):
    """Exportar voucher em diferentes formatos"""
    if voucher_id not in vouchers_db:
        raise HTTPException(status_code=404, detail="Voucher não encontrado")
    
    voucher = vouchers_db[voucher_id]
    
    # Em produção, gerar o arquivo real
    export_data = {
        "voucher_id": voucher_id,
        "format": format,
        "download_url": f"/exports/vouchers/{voucher_id}.{format}",
        "generated_at": datetime.now().isoformat()
    }
    
    return export_data

@app.post("/export/template/{template_id}")
async def export_template(template_id: str, format: str = "json"):
    """Exportar template em diferentes formatos"""
    if template_id not in templates_db:
        raise HTTPException(status_code=404, detail="Template não encontrado")
    
    template = templates_db[template_id]
    
    export_data = {
        "template_id": template_id,
        "format": format,
        "download_url": f"/exports/templates/{template_id}.{format}",
        "generated_at": datetime.now().isoformat()
    }
    
    return export_data

# Endpoints para Validação
@app.post("/validate/voucher")
async def validate_voucher(voucher_data: VoucherData):
    """Validar dados do voucher"""
    errors = []
    
    if not voucher_data.code:
        errors.append("Código do voucher é obrigatório")
    
    if not voucher_data.clientName:
        errors.append("Nome do cliente é obrigatório")
    
    if not voucher_data.destination:
        errors.append("Destino é obrigatório")
    
    if not voucher_data.startDate:
        errors.append("Data de início é obrigatória")
    
    if not voucher_data.endDate:
        errors.append("Data de fim é obrigatória")
    
    if voucher_data.value <= 0:
        errors.append("Valor deve ser maior que zero")
    
    if errors:
        return {"valid": False, "errors": errors}
    
    return {"valid": True, "message": "Voucher válido"}

@app.post("/validate/template")
async def validate_template(template: VoucherTemplate):
    """Validar template do voucher"""
    errors = []
    
    if not template.name:
        errors.append("Nome do template é obrigatório")
    
    if not template.elements:
        errors.append("Template deve ter pelo menos um elemento")
    
    for element in template.elements:
        if element.x < 0 or element.y < 0:
            errors.append(f"Elemento {element.id}: posição deve ser positiva")
        
        if element.width <= 0 or element.height <= 0:
            errors.append(f"Elemento {element.id}: dimensões devem ser positivas")
    
    if errors:
        return {"valid": False, "errors": errors}
    
    return {"valid": True, "message": "Template válido"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5029) 