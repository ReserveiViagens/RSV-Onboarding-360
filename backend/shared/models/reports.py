from sqlalchemy import Column, Integer, String, DateTime, Text, JSON, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Report(Base):
    """Modelo para relatórios gerados"""
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    template_id = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)
    format = Column(String(10), nullable=False)  # pdf, excel, csv, json
    status = Column(String(20), default="processing")  # processing, completed, failed
    parameters = Column(JSON, nullable=True)
    file_path = Column(String(500), nullable=True)
    file_size = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Relacionamentos
    creator = relationship("User", back_populates="reports")

class ReportTemplate(Base):
    """Modelo para templates de relatórios"""
    __tablename__ = "report_templates"
    
    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(String(100), unique=True, nullable=False)
    name = Column(String(255), nullable=False)
    category = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)
    format = Column(String(10), nullable=False)
    parameters_schema = Column(JSON, nullable=True)  # Schema dos parâmetros
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ReportSchedule(Base):
    """Modelo para agendamento de relatórios"""
    __tablename__ = "report_schedules"
    
    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(String(100), nullable=False)
    name = Column(String(255), nullable=False)
    frequency = Column(String(20), nullable=False)  # daily, weekly, monthly, custom
    parameters = Column(JSON, nullable=True)
    recipients = Column(JSON, nullable=True)  # Lista de emails
    next_run = Column(DateTime, nullable=False)
    last_run = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Relacionamentos
    creator = relationship("User", back_populates="report_schedules")

class ReportExecution(Base):
    """Modelo para execuções de relatórios agendados"""
    __tablename__ = "report_executions"
    
    id = Column(Integer, primary_key=True, index=True)
    schedule_id = Column(Integer, ForeignKey("report_schedules.id"), nullable=False)
    report_id = Column(Integer, ForeignKey("reports.id"), nullable=True)
    status = Column(String(20), default="pending")  # pending, running, completed, failed
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    error_message = Column(Text, nullable=True)
    
    # Relacionamentos
    schedule = relationship("ReportSchedule")
    report = relationship("Report")

class ReportAccess(Base):
    """Modelo para controle de acesso aos relatórios"""
    __tablename__ = "report_access"
    
    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    access_type = Column(String(20), default="view")  # view, download, share
    granted_at = Column(DateTime, default=datetime.utcnow)
    granted_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    expires_at = Column(DateTime, nullable=True)
    
    # Relacionamentos
    report = relationship("Report")
    user = relationship("User", foreign_keys=[user_id])
    granter = relationship("User", foreign_keys=[granted_by])

class ReportShare(Base):
    """Modelo para compartilhamento de relatórios"""
    __tablename__ = "report_shares"
    
    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.id"), nullable=False)
    share_token = Column(String(255), unique=True, nullable=False)
    email = Column(String(255), nullable=True)
    access_count = Column(Integer, default=0)
    max_access = Column(Integer, nullable=True)
    expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relacionamentos
    report = relationship("Report")
    creator = relationship("User")

class ReportNotification(Base):
    """Modelo para notificações de relatórios"""
    __tablename__ = "report_notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    notification_type = Column(String(20), nullable=False)  # email, push, in_app
    status = Column(String(20), default="pending")  # pending, sent, failed
    sent_at = Column(DateTime, nullable=True)
    error_message = Column(Text, nullable=True)
    
    # Relacionamentos
    report = relationship("Report")
    user = relationship("User")

# Adicionar relacionamentos ao modelo User (se existir)
# class User(Base):
#     reports = relationship("Report", back_populates="creator")
#     report_schedules = relationship("ReportSchedule", back_populates="creator") 