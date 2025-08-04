from fastapi import FastAPI, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, date, timedelta
import json

from shared.database import get_db, init_db
from shared.models.sectoral_finance import (
    Sector, SectorBudget, SectorTransaction, SectorReport, 
    SectorKPI, SectorForecast
)
from shared.schemas import (
    SectorCreate, Sector, SectorBudgetCreate, SectorBudget,
    SectorTransactionCreate, SectorTransaction, SectorReportCreate, SectorReport,
    SectorKPICreate, SectorKPI, SectorForecastCreate, SectorForecast
)

app = FastAPI(title="Sectoral Finance Service", version="1.0.0")

# Inicializar banco de dados
init_db()

@app.on_event("startup")
async def startup_event():
    init_db()

# Helper function para log de ações administrativas
def log_admin_action(db: Session, admin_user_id: int, action: str, resource_type: str, resource_id: int = None, description: str = None):
    from shared.models.admin import AdminLog
    log = AdminLog(
        admin_user_id=admin_user_id,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        description=description
    )
    db.add(log)
    db.commit()

# Endpoints para Setores
@app.post("/sectors/", response_model=Sector)
def create_sector(sector: SectorCreate, db: Session = Depends(get_db)):
    db_sector = Sector(**sector.dict())
    db.add(db_sector)
    db.commit()
    db.refresh(db_sector)
    return db_sector

@app.get("/sectors/", response_model=List[Sector])
def get_sectors(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    sectors = db.query(Sector).filter(Sector.is_active == True).offset(skip).limit(limit).all()
    return sectors

@app.get("/sectors/{sector_id}", response_model=Sector)
def get_sector(sector_id: int, db: Session = Depends(get_db)):
    sector = db.query(Sector).filter(Sector.id == sector_id).first()
    if sector is None:
        raise HTTPException(status_code=404, detail="Setor não encontrado")
    return sector

@app.put("/sectors/{sector_id}", response_model=Sector)
def update_sector(sector_id: int, sector: SectorCreate, db: Session = Depends(get_db)):
    db_sector = db.query(Sector).filter(Sector.id == sector_id).first()
    if db_sector is None:
        raise HTTPException(status_code=404, detail="Setor não encontrado")
    
    for key, value in sector.dict().items():
        setattr(db_sector, key, value)
    
    db_sector.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_sector)
    return db_sector

@app.delete("/sectors/{sector_id}")
def deactivate_sector(sector_id: int, db: Session = Depends(get_db)):
    sector = db.query(Sector).filter(Sector.id == sector_id).first()
    if sector is None:
        raise HTTPException(status_code=404, detail="Setor não encontrado")
    
    sector.is_active = False
    sector.updated_at = datetime.utcnow()
    db.commit()
    return {"message": "Setor desativado com sucesso"}

# Endpoints para Orçamentos
@app.post("/budgets/", response_model=SectorBudget)
def create_budget(budget: SectorBudgetCreate, db: Session = Depends(get_db)):
    db_budget = SectorBudget(**budget.dict())
    db.add(db_budget)
    db.commit()
    db.refresh(db_budget)
    return db_budget

@app.get("/budgets/", response_model=List[SectorBudget])
def get_budgets(
    sector_id: Optional[int] = None,
    fiscal_year: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(SectorBudget).filter(SectorBudget.is_active == True)
    
    if sector_id:
        query = query.filter(SectorBudget.sector_id == sector_id)
    if fiscal_year:
        query = query.filter(SectorBudget.fiscal_year == fiscal_year)
    
    budgets = query.offset(skip).limit(limit).all()
    return budgets

@app.put("/budgets/{budget_id}/approve")
def approve_budget(budget_id: int, admin_user_id: int, db: Session = Depends(get_db)):
    budget = db.query(SectorBudget).filter(SectorBudget.id == budget_id).first()
    if budget is None:
        raise HTTPException(status_code=404, detail="Orçamento não encontrado")
    
    budget.approved_by = admin_user_id
    budget.approved_at = datetime.utcnow()
    budget.updated_at = datetime.utcnow()
    db.commit()
    
    log_admin_action(db, admin_user_id, "approve_budget", "sector_budget", budget_id)
    return {"message": "Orçamento aprovado com sucesso"}

# Endpoints para Transações
@app.post("/transactions/", response_model=SectorTransaction)
def create_transaction(transaction: SectorTransactionCreate, db: Session = Depends(get_db)):
    db_transaction = SectorTransaction(**transaction.dict())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@app.get("/transactions/", response_model=List[SectorTransaction])
def get_transactions(
    sector_id: Optional[int] = None,
    transaction_type: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(SectorTransaction)
    
    if sector_id:
        query = query.filter(SectorTransaction.sector_id == sector_id)
    if transaction_type:
        query = query.filter(SectorTransaction.transaction_type == transaction_type)
    if start_date:
        query = query.filter(SectorTransaction.transaction_date >= start_date)
    if end_date:
        query = query.filter(SectorTransaction.transaction_date <= end_date)
    
    transactions = query.offset(skip).limit(limit).all()
    return transactions

@app.get("/transactions/sector/{sector_id}/summary")
def get_sector_transaction_summary(
    sector_id: int,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db)
):
    query = db.query(SectorTransaction).filter(SectorTransaction.sector_id == sector_id)
    
    if start_date:
        query = query.filter(SectorTransaction.transaction_date >= start_date)
    if end_date:
        query = query.filter(SectorTransaction.transaction_date <= end_date)
    
    transactions = query.all()
    
    total_income = sum(t.amount for t in transactions if t.transaction_type == "income")
    total_expenses = sum(t.amount for t in transactions if t.transaction_type == "expense")
    net_profit = total_income - total_expenses
    
    return {
        "sector_id": sector_id,
        "total_income": total_income,
        "total_expenses": total_expenses,
        "net_profit": net_profit,
        "transaction_count": len(transactions),
        "period": {
            "start_date": start_date,
            "end_date": end_date
        }
    }

# Endpoints para Relatórios
@app.post("/reports/", response_model=SectorReport)
def create_report(report: SectorReportCreate, db: Session = Depends(get_db)):
    db_report = SectorReport(**report.dict())
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

@app.get("/reports/", response_model=List[SectorReport])
def get_reports(
    sector_id: Optional[int] = None,
    report_type: Optional[str] = None,
    report_period: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(SectorReport)
    
    if sector_id:
        query = query.filter(SectorReport.sector_id == sector_id)
    if report_type:
        query = query.filter(SectorReport.report_type == report_type)
    if report_period:
        query = query.filter(SectorReport.report_period == report_period)
    
    reports = query.offset(skip).limit(limit).all()
    return reports

@app.post("/reports/generate")
def generate_report(
    sector_id: int,
    report_type: str,
    report_period: str,
    generated_by: int,
    db: Session = Depends(get_db)
):
    # Buscar transações do período
    query = db.query(SectorTransaction).filter(SectorTransaction.sector_id == sector_id)
    
    # Determinar período baseado no tipo de relatório
    if report_type == "monthly":
        # Assumindo formato YYYY-MM
        year, month = report_period.split("-")
        start_date = date(int(year), int(month), 1)
        if int(month) == 12:
            end_date = date(int(year) + 1, 1, 1) - timedelta(days=1)
        else:
            end_date = date(int(year), int(month) + 1, 1) - timedelta(days=1)
    elif report_type == "quarterly":
        # Assumindo formato YYYY-Q1, YYYY-Q2, etc.
        year, quarter = report_period.split("-Q")
        quarter = int(quarter)
        start_month = (quarter - 1) * 3 + 1
        start_date = date(int(year), start_month, 1)
        end_month = start_month + 2
        if end_month > 12:
            end_date = date(int(year) + 1, 1, 1) - timedelta(days=1)
        else:
            end_date = date(int(year), end_month + 1, 1) - timedelta(days=1)
    else:
        # Anual
        start_date = date(int(report_period), 1, 1)
        end_date = date(int(report_period), 12, 31)
    
    query = query.filter(
        SectorTransaction.transaction_date >= start_date,
        SectorTransaction.transaction_date <= end_date
    )
    
    transactions = query.all()
    
    # Calcular métricas
    total_revenue = sum(t.amount for t in transactions if t.transaction_type == "income")
    total_expenses = sum(t.amount for t in transactions if t.transaction_type == "expense")
    net_profit = total_revenue - total_expenses
    transaction_count = len(transactions)
    average_transaction_value = total_revenue / transaction_count if transaction_count > 0 else 0
    
    # Encontrar categoria com melhor performance
    category_revenue = {}
    for t in transactions:
        if t.transaction_type == "income" and t.category:
            category_revenue[t.category] = category_revenue.get(t.category, 0) + t.amount
    
    top_performing_category = max(category_revenue.items(), key=lambda x: x[1])[0] if category_revenue else None
    
    # Criar relatório
    report_data = {
        "transactions": [
            {
                "id": t.id,
                "type": t.transaction_type,
                "amount": t.amount,
                "category": t.category,
                "date": t.transaction_date.isoformat()
            } for t in transactions
        ],
        "category_breakdown": category_revenue
    }
    
    db_report = SectorReport(
        sector_id=sector_id,
        report_type=report_type,
        report_period=report_period,
        total_revenue=total_revenue,
        total_expenses=total_expenses,
        net_profit=net_profit,
        transaction_count=transaction_count,
        average_transaction_value=average_transaction_value,
        top_performing_category=top_performing_category,
        generated_by=generated_by,
        report_data=json.dumps(report_data)
    )
    
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    
    log_admin_action(db, generated_by, "generate_report", "sector_report", db_report.id)
    return db_report

# Endpoints para KPIs
@app.post("/kpis/", response_model=SectorKPI)
def create_kpi(kpi: SectorKPICreate, db: Session = Depends(get_db)):
    db_kpi = SectorKPI(**kpi.dict())
    db.add(db_kpi)
    db.commit()
    db.refresh(db_kpi)
    return db_kpi

@app.get("/kpis/", response_model=List[SectorKPI])
def get_kpis(
    sector_id: Optional[int] = None,
    kpi_name: Optional[str] = None,
    measurement_date: Optional[date] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(SectorKPI)
    
    if sector_id:
        query = query.filter(SectorKPI.sector_id == sector_id)
    if kpi_name:
        query = query.filter(SectorKPI.kpi_name == kpi_name)
    if measurement_date:
        query = query.filter(SectorKPI.measurement_date == measurement_date)
    
    kpis = query.offset(skip).limit(limit).all()
    return kpis

@app.get("/kpis/sector/{sector_id}/latest")
def get_latest_kpis(sector_id: int, db: Session = Depends(get_db)):
    # Buscar os KPIs mais recentes para cada tipo
    kpis = db.query(SectorKPI).filter(
        SectorKPI.sector_id == sector_id
    ).order_by(SectorKPI.measurement_date.desc()).all()
    
    # Agrupar por nome do KPI e pegar o mais recente
    latest_kpis = {}
    for kpi in kpis:
        if kpi.kpi_name not in latest_kpis:
            latest_kpis[kpi.kpi_name] = kpi
    
    return list(latest_kpis.values())

# Endpoints para Previsões
@app.post("/forecasts/", response_model=SectorForecast)
def create_forecast(forecast: SectorForecastCreate, db: Session = Depends(get_db)):
    db_forecast = SectorForecast(**forecast.dict())
    db.add(db_forecast)
    db.commit()
    db.refresh(db_forecast)
    return db_forecast

@app.get("/forecasts/", response_model=List[SectorForecast])
def get_forecasts(
    sector_id: Optional[int] = None,
    forecast_type: Optional[str] = None,
    forecast_period: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(SectorForecast)
    
    if sector_id:
        query = query.filter(SectorForecast.sector_id == sector_id)
    if forecast_type:
        query = query.filter(SectorForecast.forecast_type == forecast_type)
    if forecast_period:
        query = query.filter(SectorForecast.forecast_period == forecast_period)
    
    forecasts = query.offset(skip).limit(limit).all()
    return forecasts

@app.get("/forecasts/sector/{sector_id}/revenue")
def get_revenue_forecasts(sector_id: int, db: Session = Depends(get_db)):
    forecasts = db.query(SectorForecast).filter(
        SectorForecast.sector_id == sector_id,
        SectorForecast.forecast_type == "revenue"
    ).order_by(SectorForecast.forecast_period).all()
    
    return {
        "sector_id": sector_id,
        "forecasts": [
            {
                "period": f.forecast_period,
                "predicted_value": f.predicted_value,
                "confidence_level": f.confidence_level,
                "created_at": f.created_at
            } for f in forecasts
        ]
    }

# Endpoints de Estatísticas
@app.get("/stats/")
def get_stats(db: Session = Depends(get_db)):
    total_sectors = db.query(Sector).filter(Sector.is_active == True).count()
    total_budgets = db.query(SectorBudget).filter(SectorBudget.is_active == True).count()
    total_transactions = db.query(SectorTransaction).count()
    total_reports = db.query(SectorReport).count()
    total_kpis = db.query(SectorKPI).count()
    total_forecasts = db.query(SectorForecast).count()
    
    return {
        "total_sectors": total_sectors,
        "total_budgets": total_budgets,
        "total_transactions": total_transactions,
        "total_reports": total_reports,
        "total_kpis": total_kpis,
        "total_forecasts": total_forecasts
    }

@app.get("/health/")
def health_check():
    return {"status": "healthy", "service": "sectoral_finance"} 