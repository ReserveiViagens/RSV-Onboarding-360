from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Float, Date
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class InsuranceType(Base):
    __tablename__ = "insurance_types"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(50), nullable=False)  # travel, health, life, property, etc.
    coverage_type = Column(String(50), nullable=False)  # basic, standard, premium, etc.
    coverage_amount = Column(Float, nullable=False)
    premium_amount = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    duration_days = Column(Integer, nullable=False)
    max_age = Column(Integer, nullable=True)
    min_age = Column(Integer, nullable=True)
    exclusions = Column(Text, nullable=True)  # JSON array of exclusions
    benefits = Column(Text, nullable=True)  # JSON array of benefits
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class InsurancePolicy(Base):
    __tablename__ = "insurance_policies"
    
    id = Column(Integer, primary_key=True, index=True)
    policy_number = Column(String(50), nullable=False, unique=True)
    insurance_type_id = Column(Integer, ForeignKey("insurance_types.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String(20), default="active")  # active, expired, cancelled, claimed
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    coverage_amount = Column(Float, nullable=False)
    premium_amount = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    payment_status = Column(String(20), default="pending")  # pending, paid, overdue
    insured_persons = Column(Text, nullable=True)  # JSON array of insured person details
    travel_destination = Column(String(200), nullable=True)
    travel_dates = Column(Text, nullable=True)  # JSON object with start and end dates
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class InsuranceClaim(Base):
    __tablename__ = "insurance_claims"
    
    id = Column(Integer, primary_key=True, index=True)
    claim_number = Column(String(50), nullable=False, unique=True)
    policy_id = Column(Integer, ForeignKey("insurance_policies.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    claim_type = Column(String(50), nullable=False)  # medical, cancellation, loss, damage, etc.
    claim_amount = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    status = Column(String(20), default="submitted")  # submitted, under_review, approved, rejected, paid
    description = Column(Text, nullable=False)
    incident_date = Column(Date, nullable=False)
    incident_location = Column(String(200), nullable=True)
    police_report = Column(String(500), nullable=True)
    medical_reports = Column(Text, nullable=True)  # JSON array of medical report file paths
    receipts = Column(Text, nullable=True)  # JSON array of receipt file paths
    approved_amount = Column(Float, nullable=True)
    rejection_reason = Column(Text, nullable=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    processed_at = Column(DateTime, nullable=True)
    paid_at = Column(DateTime, nullable=True)

class InsurancePayment(Base):
    __tablename__ = "insurance_payments"
    
    id = Column(Integer, primary_key=True, index=True)
    policy_id = Column(Integer, ForeignKey("insurance_policies.id"), nullable=False)
    payment_type = Column(String(20), nullable=False)  # premium, claim
    amount = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    payment_method = Column(String(50), nullable=False)  # credit_card, bank_transfer, etc.
    transaction_id = Column(String(100), nullable=True)
    payment_status = Column(String(20), default="pending")  # pending, completed, failed, refunded
    payment_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class InsuranceDocument(Base):
    __tablename__ = "insurance_documents"
    
    id = Column(Integer, primary_key=True, index=True)
    policy_id = Column(Integer, ForeignKey("insurance_policies.id"), nullable=False)
    claim_id = Column(Integer, ForeignKey("insurance_claims.id"), nullable=True)
    document_type = Column(String(50), nullable=False)  # policy, claim_form, medical_report, receipt, etc.
    file_name = Column(String(500), nullable=False)
    file_path = Column(String(1000), nullable=False)
    file_size = Column(Integer, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow) 