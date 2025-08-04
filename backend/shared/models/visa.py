from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey, Date
from sqlalchemy.sql import func
from shared.config.database import Base

class VisaType(Base):
    __tablename__ = "visa_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    country_code = Column(String(3), nullable=False)  # ISO country code
    visa_category = Column(String, nullable=False)  # tourist, business, student, etc
    duration_days = Column(Integer)  # visa validity in days
    processing_time_days = Column(Integer)  # processing time
    fee_amount = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    requirements = Column(Text)  # JSON string with requirements
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class VisaApplication(Base):
    __tablename__ = "visa_applications"

    id = Column(Integer, primary_key=True, index=True)
    application_number = Column(String, unique=True, nullable=False)
    visa_type_id = Column(Integer, ForeignKey("visa_types.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Applicant information
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    date_of_birth = Column(Date, nullable=False)
    nationality = Column(String, nullable=False)
    passport_number = Column(String, nullable=False)
    passport_expiry = Column(Date, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String)
    address = Column(Text)
    
    # Travel information
    purpose_of_visit = Column(String, nullable=False)
    travel_dates_from = Column(Date)
    travel_dates_to = Column(Date)
    accommodation_info = Column(Text)
    
    # Application status
    status = Column(String, default="submitted")  # submitted, processing, approved, rejected
    submission_date = Column(DateTime(timezone=True), server_default=func.now())
    processing_date = Column(DateTime(timezone=True))
    decision_date = Column(DateTime(timezone=True))
    notes = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class VisaDocument(Base):
    __tablename__ = "visa_documents"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("visa_applications.id"), nullable=False)
    document_type = Column(String, nullable=False)  # passport, photo, invitation, etc
    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(Integer)
    upload_date = Column(DateTime(timezone=True), server_default=func.now())
    is_verified = Column(Boolean, default=False)
    verification_notes = Column(Text)

class VisaPayment(Base):
    __tablename__ = "visa_payments"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("visa_applications.id"), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    payment_method = Column(String, nullable=False)  # credit_card, bank_transfer, etc
    transaction_id = Column(String, unique=True)
    payment_date = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="pending")  # pending, completed, failed, refunded
    payment_gateway_response = Column(Text)  # JSON response from payment gateway

class VisaStatus(Base):
    __tablename__ = "visa_status_history"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("visa_applications.id"), nullable=False)
    status = Column(String, nullable=False)
    status_date = Column(DateTime(timezone=True), server_default=func.now())
    notes = Column(Text)
    updated_by = Column(String)  # staff member who updated status