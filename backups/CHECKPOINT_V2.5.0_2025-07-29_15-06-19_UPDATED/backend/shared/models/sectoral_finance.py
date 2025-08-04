from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Float, Date
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Sector(Base):
    __tablename__ = "sectors"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    code = Column(String(10), nullable=False, unique=True)
    category = Column(String(50), nullable=False)  # tourism, hospitality, transportation, etc.
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class SectorBudget(Base):
    __tablename__ = "sector_budgets"
    
    id = Column(Integer, primary_key=True, index=True)
    sector_id = Column(Integer, ForeignKey("sectors.id"), nullable=False)
    fiscal_year = Column(Integer, nullable=False)
    budget_type = Column(String(50), nullable=False)  # revenue, expense, investment, etc.
    amount = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    description = Column(Text, nullable=True)
    approved_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    approved_at = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class SectorTransaction(Base):
    __tablename__ = "sector_transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    sector_id = Column(Integer, ForeignKey("sectors.id"), nullable=False)
    transaction_type = Column(String(50), nullable=False)  # income, expense, transfer, etc.
    amount = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    description = Column(Text, nullable=True)
    reference_id = Column(Integer, nullable=True)  # booking_id, order_id, etc.
    reference_type = Column(String(50), nullable=True)  # booking, order, service, etc.
    transaction_date = Column(Date, nullable=False)
    category = Column(String(50), nullable=True)  # accommodation, transportation, food, etc.
    payment_method = Column(String(50), nullable=True)
    status = Column(String(20), default="completed")  # pending, completed, cancelled, failed
    created_at = Column(DateTime, default=datetime.utcnow)

class SectorReport(Base):
    __tablename__ = "sector_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    sector_id = Column(Integer, ForeignKey("sectors.id"), nullable=False)
    report_type = Column(String(50), nullable=False)  # daily, weekly, monthly, quarterly, yearly
    report_period = Column(String(20), nullable=False)  # 2024-01, 2024-Q1, etc.
    total_revenue = Column(Float, default=0.0)
    total_expenses = Column(Float, default=0.0)
    net_profit = Column(Float, default=0.0)
    transaction_count = Column(Integer, default=0)
    average_transaction_value = Column(Float, default=0.0)
    top_performing_category = Column(String(50), nullable=True)
    generated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    generated_at = Column(DateTime, default=datetime.utcnow)
    report_data = Column(Text, nullable=True)  # JSON object with detailed data

class SectorKPI(Base):
    __tablename__ = "sector_kpis"
    
    id = Column(Integer, primary_key=True, index=True)
    sector_id = Column(Integer, ForeignKey("sectors.id"), nullable=False)
    kpi_name = Column(String(100), nullable=False)
    kpi_value = Column(Float, nullable=False)
    kpi_unit = Column(String(20), nullable=True)  # percentage, currency, count, etc.
    target_value = Column(Float, nullable=True)
    measurement_date = Column(Date, nullable=False)
    description = Column(Text, nullable=True)
    is_achieved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class SectorForecast(Base):
    __tablename__ = "sector_forecasts"
    
    id = Column(Integer, primary_key=True, index=True)
    sector_id = Column(Integer, ForeignKey("sectors.id"), nullable=False)
    forecast_type = Column(String(50), nullable=False)  # revenue, demand, growth, etc.
    forecast_period = Column(String(20), nullable=False)  # 2024-Q2, 2024-H2, etc.
    predicted_value = Column(Float, nullable=False)
    confidence_level = Column(Float, nullable=True)  # 0.0 to 1.0
    methodology = Column(Text, nullable=True)
    assumptions = Column(Text, nullable=True)  # JSON array of assumptions
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow) 