from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Float
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class AdminUser(Base):
    __tablename__ = "admin_users"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(String(50), nullable=False)  # super_admin, admin, moderator, support
    permissions = Column(Text, nullable=True)  # JSON array of permissions
    department = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class AdminLog(Base):
    __tablename__ = "admin_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    admin_user_id = Column(Integer, ForeignKey("admin_users.id"), nullable=False)
    action = Column(String(100), nullable=False)  # create, update, delete, approve, reject, etc.
    resource_type = Column(String(50), nullable=False)  # user, booking, order, etc.
    resource_id = Column(Integer, nullable=True)
    description = Column(Text, nullable=True)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class SystemSetting(Base):
    __tablename__ = "system_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    setting_key = Column(String(100), nullable=False, unique=True)
    setting_value = Column(Text, nullable=True)
    setting_type = Column(String(20), default="string")  # string, integer, float, boolean, json
    description = Column(Text, nullable=True)
    category = Column(String(50), nullable=True)  # general, security, email, payment, etc.
    is_public = Column(Boolean, default=False)  # whether this setting can be accessed publicly
    updated_by = Column(Integer, ForeignKey("admin_users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class AdminNotification(Base):
    __tablename__ = "admin_notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    admin_user_id = Column(Integer, ForeignKey("admin_users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), nullable=False)  # info, warning, error, success
    priority = Column(String(20), default="normal")  # low, normal, high, urgent
    action_url = Column(String(500), nullable=True)
    is_read = Column(Boolean, default=False)
    read_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class AdminDashboard(Base):
    __tablename__ = "admin_dashboards"
    
    id = Column(Integer, primary_key=True, index=True)
    admin_user_id = Column(Integer, ForeignKey("admin_users.id"), nullable=False)
    dashboard_name = Column(String(100), nullable=False)
    dashboard_config = Column(Text, nullable=True)  # JSON configuration for widgets and layout
    is_default = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class AdminReport(Base):
    __tablename__ = "admin_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    report_name = Column(String(200), nullable=False)
    report_type = Column(String(50), nullable=False)  # financial, user_activity, system_health, etc.
    report_period = Column(String(20), nullable=True)  # daily, weekly, monthly, custom
    generated_by = Column(Integer, ForeignKey("admin_users.id"), nullable=False)
    parameters = Column(Text, nullable=True)  # JSON parameters used for report generation
    file_path = Column(String(500), nullable=True)
    file_size = Column(Integer, nullable=True)
    status = Column(String(20), default="pending")  # pending, processing, completed, failed
    generated_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True) 