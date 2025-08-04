from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Float, Date
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class VisaType(Base):
    __tablename__ = "visa_types"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    country_code = Column(String(3), nullable=False)  # ISO country code
    visa_category = Column(String(50), nullable=False)  # tourist, business, student, etc.
    duration_days = Column(Integer, nullable=False)
    processing_time_days = Column(Integer, nullable=False)
    fee_amount = Column(Float, nullable=False)
    fee_currency = Column(String(3), default="USD")
    requirements = Column(Text, nullable=True)  # JSON array of requirements
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class VisaApplication(Base):
    __tablename__ = "visa_applications"
    
    id = Column(Integer, primary_key=True, index=True)
    visa_type_id = Column(Integer, ForeignKey("visa_types.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    application_number = Column(String(50), nullable=False, unique=True)
    status = Column(String(20), default="pending")  # pending, submitted, processing, approved, rejected, cancelled
    travel_purpose = Column(String(100), nullable=False)
    entry_date = Column(Date, nullable=False)
    exit_date = Column(Date, nullable=False)
    destination_city = Column(String(100), nullable=False)
    accommodation_address = Column(Text, nullable=True)
    emergency_contact = Column(Text, nullable=True)
    application_fee = Column(Float, nullable=False)
    processing_fee = Column(Float, nullable=False)
    total_fee = Column(Float, nullable=False)
    payment_status = Column(String(20), default="pending")  # pending, paid, refunded
    submitted_at = Column(DateTime, nullable=True)
    processed_at = Column(DateTime, nullable=True)
    approved_at = Column(DateTime, nullable=True)
    rejected_at = Column(DateTime, nullable=True)
    rejection_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class VisaDocument(Base):
    __tablename__ = "visa_documents"
    
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("visa_applications.id"), nullable=False)
    document_type = Column(String(50), nullable=False)  # passport, photo, bank_statement, etc.
    file_name = Column(String(500), nullable=False)
    file_path = Column(String(1000), nullable=False)
    file_size = Column(Integer, nullable=False)
    is_required = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    verification_notes = Column(Text, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

class VisaPayment(Base):
    __tablename__ = "visa_payments"
    
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("visa_applications.id"), nullable=False)
    payment_method = Column(String(50), nullable=False)  # credit_card, bank_transfer, etc.
    amount = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    transaction_id = Column(String(100), nullable=True)
    payment_status = Column(String(20), default="pending")  # pending, completed, failed, refunded
    payment_date = Column(DateTime, nullable=True)
    refund_date = Column(DateTime, nullable=True)
    refund_amount = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class VisaStatus(Base):
    __tablename__ = "visa_statuses"
    
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("visa_applications.id"), nullable=False)
    status = Column(String(20), nullable=False)
    description = Column(Text, nullable=True)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow) 