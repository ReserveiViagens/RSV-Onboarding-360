from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks, Query
from fastapi.responses import FileResponse, StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import json
import csv
import io
import os
from datetime import datetime, timedelta
import asyncio
from pathlib import Path

from backend.shared.config.database import get_db
from backend.shared.models.reports import Report, ReportTemplate, ReportSchedule
from backend.shared.schemas import (
    ReportCreate, ReportResponse, ReportTemplateCreate, 
    ReportScheduleCreate, ReportFilter, ReportExport
)

app = FastAPI(title="Reports Service", version="1.0.0")

# Configuração de diretórios
REPORTS_DIR = Path("reports")
REPORTS_DIR.mkdir(exist_ok=True)

# Templates de relatórios disponíveis
DEFAULT_TEMPLATES = [
    {
        "id": "financial-summary",
        "name": "Relatório Financeiro Mensal",
        "category": "financial",
        "description": "Resumo completo das finanças do mês",
        "format": "pdf",
        "parameters": ["start_date", "end_date", "include_charts"]
    },
    {
        "id": "sales-performance",
        "name": "Performance de Vendas",
        "category": "sales",
        "description": "Análise detalhada do desempenho de vendas",
        "format": "excel",
        "parameters": ["period", "region", "product_category"]
    },
    {
        "id": "marketing-campaigns",
        "name": "Relatório de Campanhas",
        "category": "marketing",
        "description": "Resultados das campanhas de marketing",
        "format": "pdf",
        "parameters": ["campaign_id", "date_range", "metrics"]
    },
    {
        "id": "user-analytics",
        "name": "Analytics de Usuários",
        "category": "analytics",
        "description": "Comportamento e métricas dos usuários",
        "format": "csv",
        "parameters": ["user_segment", "time_period", "events"]
    },
    {
        "id": "operational-kpis",
        "name": "KPIs Operacionais",
        "category": "operational",
        "description": "Indicadores de performance operacional",
        "format": "excel",
        "parameters": ["department", "metrics", "comparison_period"]
    }
]

class ReportGenerator:
    """Classe para geração de relatórios"""
    
    @staticmethod
    async def generate_financial_report(params: Dict[str, Any]) -> Dict[str, Any]:
        """Gera relatório financeiro"""
        # Simular dados financeiros
        return {
            "total_revenue": 1250000.50,
            "monthly_revenue": 85000.75,
            "growth_rate": 12.5,
            "transactions": 15420,
            "average_ticket": 81.15,
            "payment_methods": {
                "credit_card": 45,
                "debit_card": 25,
                "pix": 20,
                "bank_transfer": 8,
                "gift_card": 2
            },
            "top_products": [
                {"name": "Pacote Disney", "revenue": 250000, "quantity": 1250},
                {"name": "Ingressos Universal", "revenue": 180000, "quantity": 900},
                {"name": "City Tour Miami", "revenue": 120000, "quantity": 800}
            ],
            "revenue_by_month": [
                {"month": "Jan", "revenue": 75000, "transactions": 920},
                {"month": "Fev", "revenue": 82000, "transactions": 1010},
                {"month": "Mar", "revenue": 78000, "transactions": 950}
            ]
        }
    
    @staticmethod
    async def generate_sales_report(params: Dict[str, Any]) -> Dict[str, Any]:
        """Gera relatório de vendas"""
        return {
            "total_sales": 1850000.75,
            "monthly_sales": 125000.50,
            "growth": 18.5,
            "orders": 2340,
            "average_order": 790.60,
            "conversion_rate": 15.2,
            "sales_funnel": {
                "leads": 5000,
                "prospects": 2500,
                "opportunities": 1200,
                "closed": 2340,
                "lost": 800
            },
            "top_products": [
                {"name": "Pacote Disney Completo", "sales": 450, "revenue": 225000},
                {"name": "Ingressos Universal Studios", "sales": 380, "revenue": 152000},
                {"name": "Hotel Premium Miami Beach", "sales": 320, "revenue": 128000}
            ],
            "sales_by_region": [
                {"region": "Sudeste", "sales": 925000, "percentage": 50},
                {"region": "Sul", "sales": 555000, "percentage": 30},
                {"region": "Nordeste", "sales": 277500, "percentage": 15}
            ]
        }
    
    @staticmethod
    async def generate_marketing_report(params: Dict[str, Any]) -> Dict[str, Any]:
        """Gera relatório de marketing"""
        return {
            "total_campaigns": 24,
            "active_campaigns": 8,
            "total_reach": 1250000,
            "total_impressions": 3500000,
            "total_clicks": 87500,
            "conversion_rate": 3.2,
            "ctr": 2.5,
            "cpc": 1.85,
            "roi": 4.2,
            "campaigns": [
                {
                    "name": "Black Friday Disney",
                    "reach": 250000,
                    "conversions": 600,
                    "spent": 34687.50,
                    "revenue": 180000
                },
                {
                    "name": "Verão Universal",
                    "reach": 180000,
                    "conversions": 432,
                    "spent": 24975,
                    "revenue": 129600
                }
            ],
            "channels": {
                "google_ads": 30,
                "email": 25,
                "social_media": 15,
                "facebook_ads": 20,
                "influencer": 8,
                "affiliate": 2
            }
        }
    
    @staticmethod
    async def generate_analytics_report(params: Dict[str, Any]) -> Dict[str, Any]:
        """Gera relatório de analytics"""
        return {
            "total_users": 125000,
            "active_users": 8500,
            "new_users": 1250,
            "user_growth": 15.8,
            "page_views": 450000,
            "unique_visitors": 25000,
            "bounce_rate": 42.5,
            "average_session_duration": 185,
            "traffic_sources": {
                "organic": 45,
                "direct": 25,
                "social": 15,
                "email": 8,
                "referral": 5,
                "paid": 2
            },
            "device_usage": {
                "desktop": 55,
                "mobile": 40,
                "tablet": 5
            },
            "top_pages": [
                {"url": "/", "title": "Página Inicial", "views": 85000, "bounce_rate": 35},
                {"url": "/disney", "title": "Pacotes Disney", "views": 65000, "bounce_rate": 28},
                {"url": "/universal", "title": "Universal Studios", "views": 45000, "bounce_rate": 32}
            ]
        }

class ReportExporter:
    """Classe para exportação de relatórios"""
    
    @staticmethod
    def export_to_pdf(data: Dict[str, Any], template_id: str) -> bytes:
        """Exporta relatório para PDF"""
        # Simular geração de PDF
        pdf_content = f"""
        RELATÓRIO: {template_id.upper()}
        Data: {datetime.now().strftime('%d/%m/%Y %H:%M')}
        
        DADOS:
        {json.dumps(data, indent=2, ensure_ascii=False)}
        """
        return pdf_content.encode('utf-8')
    
    @staticmethod
    def export_to_excel(data: Dict[str, Any], template_id: str) -> bytes:
        """Exporta relatório para Excel (CSV)"""
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Cabeçalho
        writer.writerow([f"RELATÓRIO: {template_id.upper()}"])
        writer.writerow([f"Data: {datetime.now().strftime('%d/%m/%Y %H:%M')}"])
        writer.writerow([])
        
        # Dados principais
        for key, value in data.items():
            if isinstance(value, dict):
                writer.writerow([key.upper()])
                for sub_key, sub_value in value.items():
                    writer.writerow([f"  {sub_key}", sub_value])
                writer.writerow([])
            elif isinstance(value, list):
                writer.writerow([key.upper()])
                if value and isinstance(value[0], dict):
                    writer.writerow(list(value[0].keys()))
                    for item in value:
                        writer.writerow(list(item.values()))
                else:
                    for item in value:
                        writer.writerow([item])
                writer.writerow([])
            else:
                writer.writerow([key, value])
        
        return output.getvalue().encode('utf-8')
    
    @staticmethod
    def export_to_csv(data: Dict[str, Any], template_id: str) -> bytes:
        """Exporta relatório para CSV"""
        return ReportExporter.export_to_excel(data, template_id)
    
    @staticmethod
    def export_to_json(data: Dict[str, Any], template_id: str) -> bytes:
        """Exporta relatório para JSON"""
        report_data = {
            "template_id": template_id,
            "generated_at": datetime.now().isoformat(),
            "data": data
        }
        return json.dumps(report_data, indent=2, ensure_ascii=False).encode('utf-8')

# Endpoints

@app.get("/reports/", response_model=List[ReportResponse])
def get_reports(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    status: Optional[str] = None,
    format: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Lista todos os relatórios com filtros"""
    query = db.query(Report)
    
    if category:
        query = query.filter(Report.category == category)
    if status:
        query = query.filter(Report.status == status)
    if format:
        query = query.filter(Report.format == format)
    
    reports = query.offset(skip).limit(limit).all()
    return reports

@app.get("/reports/{report_id}", response_model=ReportResponse)
def get_report(report_id: int, db: Session = Depends(get_db)):
    """Obtém um relatório específico"""
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Relatório não encontrado")
    return report

@app.post("/reports/", response_model=ReportResponse)
async def create_report(
    report: ReportCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Cria um novo relatório"""
    # Criar registro do relatório
    db_report = Report(
        name=report.name,
        template_id=report.template_id,
        category=report.category,
        format=report.format,
        parameters=report.parameters,
        status="processing"
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    
    # Adicionar tarefa de geração em background
    background_tasks.add_task(generate_report_background, db_report.id, report.parameters)
    
    return db_report

@app.get("/reports/{report_id}/download")
def download_report(report_id: int, db: Session = Depends(get_db)):
    """Download de um relatório"""
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Relatório não encontrado")
    
    if report.status != "completed":
        raise HTTPException(status_code=400, detail="Relatório ainda não foi gerado")
    
    file_path = REPORTS_DIR / f"{report.id}.{report.format}"
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Arquivo não encontrado")
    
    return FileResponse(
        path=str(file_path),
        filename=f"{report.name}.{report.format}",
        media_type="application/octet-stream"
    )

@app.get("/templates/", response_model=List[Dict[str, Any]])
def get_templates():
    """Lista todos os templates disponíveis"""
    return DEFAULT_TEMPLATES

@app.get("/templates/{template_id}")
def get_template(template_id: str):
    """Obtém um template específico"""
    template = next((t for t in DEFAULT_TEMPLATES if t["id"] == template_id), None)
    if not template:
        raise HTTPException(status_code=404, detail="Template não encontrado")
    return template

@app.post("/reports/schedule/")
def schedule_report(
    schedule: ReportScheduleCreate,
    db: Session = Depends(get_db)
):
    """Agenda um relatório para execução periódica"""
    db_schedule = ReportSchedule(
        template_id=schedule.template_id,
        name=schedule.name,
        frequency=schedule.frequency,
        parameters=schedule.parameters,
        recipients=schedule.recipients,
        next_run=schedule.next_run
    )
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    
    return {"message": "Relatório agendado com sucesso", "schedule_id": db_schedule.id}

@app.get("/reports/metrics/")
def get_report_metrics(db: Session = Depends(get_db)):
    """Obtém métricas dos relatórios"""
    total_reports = db.query(Report).count()
    completed_reports = db.query(Report).filter(Report.status == "completed").count()
    failed_reports = db.query(Report).filter(Report.status == "failed").count()
    scheduled_reports = db.query(ReportSchedule).count()
    
    # Relatórios por categoria
    reports_by_category = {}
    for category in ["financial", "marketing", "sales", "analytics", "operational"]:
        count = db.query(Report).filter(Report.category == category).count()
        reports_by_category[category] = count
    
    return {
        "total_reports": total_reports,
        "completed_reports": completed_reports,
        "failed_reports": failed_reports,
        "scheduled_reports": scheduled_reports,
        "success_rate": (completed_reports / total_reports * 100) if total_reports > 0 else 0,
        "reports_by_category": reports_by_category
    }

@app.delete("/reports/{report_id}")
def delete_report(report_id: int, db: Session = Depends(get_db)):
    """Deleta um relatório"""
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Relatório não encontrado")
    
    # Remover arquivo se existir
    file_path = REPORTS_DIR / f"{report.id}.{report.format}"
    if file_path.exists():
        file_path.unlink()
    
    db.delete(report)
    db.commit()
    
    return {"message": "Relatório deletado com sucesso"}

# Funções auxiliares

async def generate_report_background(report_id: int, parameters: Dict[str, Any]):
    """Gera relatório em background"""
    try:
        # Simular tempo de processamento
        await asyncio.sleep(2)
        
        # Determinar template e gerar dados
        template_id = parameters.get("template_id", "financial-summary")
        
        if template_id == "financial-summary":
            data = await ReportGenerator.generate_financial_report(parameters)
        elif template_id == "sales-performance":
            data = await ReportGenerator.generate_sales_report(parameters)
        elif template_id == "marketing-campaigns":
            data = await ReportGenerator.generate_marketing_report(parameters)
        elif template_id == "user-analytics":
            data = await ReportGenerator.generate_analytics_report(parameters)
        else:
            data = await ReportGenerator.generate_financial_report(parameters)
        
        # Exportar para o formato desejado
        format_type = parameters.get("format", "pdf")
        
        if format_type == "pdf":
            content = ReportExporter.export_to_pdf(data, template_id)
        elif format_type == "excel":
            content = ReportExporter.export_to_excel(data, template_id)
        elif format_type == "csv":
            content = ReportExporter.export_to_csv(data, template_id)
        elif format_type == "json":
            content = ReportExporter.export_to_json(data, template_id)
        else:
            content = ReportExporter.export_to_pdf(data, template_id)
        
        # Salvar arquivo
        file_path = REPORTS_DIR / f"{report_id}.{format_type}"
        with open(file_path, "wb") as f:
            f.write(content)
        
        # Atualizar status no banco
        # Nota: Em produção, você precisaria de uma sessão de banco separada
        print(f"Relatório {report_id} gerado com sucesso: {file_path}")
        
    except Exception as e:
        print(f"Erro ao gerar relatório {report_id}: {str(e)}")
        # Atualizar status para failed no banco

@app.get("/health/")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "reports"} 