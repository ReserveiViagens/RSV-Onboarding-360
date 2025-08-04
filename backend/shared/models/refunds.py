from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Float
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class RefundRequest(Base):
    __tablename__ = "refund_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    refund_number = Column(String(50), nullable=False, unique=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    order_id = Column(Integer, nullable=False)
    booking_id = Column(Integer, nullable=True)
    original_amount = Column(Float, nullable=False)
    refund_amount = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    reason = Column(Text, nullable=False)
    refund_type = Column(String(50), nullable=False)  # full, partial, cancellation, etc.
    status = Column(String(20), default="pending")  # pending, approved, rejected, processed, completed
    payment_method = Column(String(50), nullable=False)  # credit_card, bank_transfer, etc.
    bank_account = Column(Text, nullable=True)  # JSON object with bank details
    refund_method = Column(String(50), nullable=False)  # original_payment, bank_transfer, credit
    processing_fee = Column(Float, default=0.0)
    admin_notes = Column(Text, nullable=True)
    rejection_reason = Column(Text, nullable=True)
    requested_at = Column(DateTime, default=datetime.utcnow)
    approved_at = Column(DateTime, nullable=True)
    processed_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    approved_by = Column(Integer, ForeignKey("users.id"), nullable=True)

class RefundDocument(Base):
    __tablename__ = "refund_documents"
    
    id = Column(Integer, primary_key=True, index=True)
    refund_id = Column(Integer, ForeignKey("refund_requests.id"), nullable=False)
    document_type = Column(String(50), nullable=False)  # receipt, invoice, cancellation_proof, etc.
    file_name = Column(String(500), nullable=False)
    file_path = Column(String(1000), nullable=False)
    file_size = Column(Integer, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

class RefundStatus(Base):
    __tablename__ = "refund_statuses"
    
    id = Column(Integer, primary_key=True, index=True)
    refund_id = Column(Integer, ForeignKey("refund_requests.id"), nullable=False)
    status = Column(String(20), nullable=False)
    description = Column(Text, nullable=True)
    updated_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class RefundPolicy(Base):
    __tablename__ = "refund_policies"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    product_type = Column(String(50), nullable=False)  # booking, product, service, etc.
    refund_percentage = Column(Float, nullable=False)  # percentage of refund allowed
    time_limit_days = Column(Integer, nullable=False)  # days after purchase/booking
    conditions = Column(Text, nullable=True)  # JSON array of conditions
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow) 