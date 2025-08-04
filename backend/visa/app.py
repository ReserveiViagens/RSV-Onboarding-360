from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import os
import shutil
from datetime import datetime, date
import uuid
import random
import string

from shared.config.database import get_db
from shared.models.visa import VisaType as VisaTypeModel, VisaApplication as VisaApplicationModel, VisaDocument as VisaDocumentModel, VisaPayment as VisaPaymentModel, VisaStatus as VisaStatusModel
from shared.schemas import VisaTypeCreate, VisaType, VisaApplicationCreate, VisaApplication, VisaDocumentCreate, VisaDocument, VisaPaymentCreate, VisaPayment, VisaStatusCreate, VisaStatus

app = FastAPI(title="Visa Service", version="1.0.0")

# Create upload directory if it doesn't exist
UPLOAD_DIR = "visa_documents"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def generate_application_number():
    """Generate a unique application number"""
    prefix = "VISA"
    year = datetime.now().year
    random_chars = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"{prefix}{year}{random_chars}"

# Visa Type endpoints
@app.post("/types/", response_model=VisaType)
def create_visa_type(visa_type: VisaTypeCreate, db: Session = Depends(get_db)):
    """Create a new visa type"""
    db_visa_type = VisaTypeModel(**visa_type.dict())
    db.add(db_visa_type)
    db.commit()
    db.refresh(db_visa_type)
    return db_visa_type

@app.get("/types/", response_model=List[VisaType])
def get_visa_types(country_code: str = None, visa_category: str = None, db: Session = Depends(get_db)):
    """Get visa types with optional filters"""
    query = db.query(VisaTypeModel).filter(VisaTypeModel.is_active == True)
    
    if country_code:
        query = query.filter(VisaTypeModel.country_code == country_code)
    if visa_category:
        query = query.filter(VisaTypeModel.visa_category == visa_category)
    
    visa_types = query.all()
    return visa_types

@app.get("/types/{visa_type_id}", response_model=VisaType)
def get_visa_type(visa_type_id: int, db: Session = Depends(get_db)):
    """Get a specific visa type"""
    visa_type = db.query(VisaTypeModel).filter(VisaTypeModel.id == visa_type_id).first()
    if not visa_type:
        raise HTTPException(status_code=404, detail="Visa type not found")
    return visa_type

@app.put("/types/{visa_type_id}", response_model=VisaType)
def update_visa_type(visa_type_id: int, visa_type: VisaTypeCreate, db: Session = Depends(get_db)):
    """Update a visa type"""
    db_visa_type = db.query(VisaTypeModel).filter(VisaTypeModel.id == visa_type_id).first()
    if not db_visa_type:
        raise HTTPException(status_code=404, detail="Visa type not found")
    
    for key, value in visa_type.dict().items():
        setattr(db_visa_type, key, value)
    
    db.commit()
    db.refresh(db_visa_type)
    return db_visa_type

@app.delete("/types/{visa_type_id}")
def deactivate_visa_type(visa_type_id: int, db: Session = Depends(get_db)):
    """Deactivate a visa type"""
    visa_type = db.query(VisaTypeModel).filter(VisaTypeModel.id == visa_type_id).first()
    if not visa_type:
        raise HTTPException(status_code=404, detail="Visa type not found")
    
    visa_type.is_active = False
    db.commit()
    return {"message": "Visa type deactivated successfully"}

# Visa Application endpoints
@app.post("/applications/", response_model=VisaApplication)
def create_visa_application(application: VisaApplicationCreate, db: Session = Depends(get_db)):
    """Create a new visa application"""
    # Generate application number
    application_data = application.dict()
    application_data["application_number"] = generate_application_number()
    
    db_application = VisaApplicationModel(**application_data)
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    
    # Create initial status
    status = VisaStatusModel(
        application_id=db_application.id,
        status="pending",
        description="Application created"
    )
    db.add(status)
    db.commit()
    
    return db_application

@app.get("/applications/", response_model=List[VisaApplication])
def get_visa_applications(
    user_id: int = None,
    status: str = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get visa applications with optional filters"""
    query = db.query(VisaApplicationModel)
    
    if user_id:
        query = query.filter(VisaApplicationModel.user_id == user_id)
    if status:
        query = query.filter(VisaApplicationModel.status == status)
    
    applications = query.offset(skip).limit(limit).all()
    return applications

@app.get("/applications/{application_id}", response_model=VisaApplication)
def get_visa_application(application_id: int, db: Session = Depends(get_db)):
    """Get a specific visa application"""
    application = db.query(VisaApplicationModel).filter(VisaApplicationModel.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Visa application not found")
    return application

@app.put("/applications/{application_id}/submit")
def submit_application(application_id: int, db: Session = Depends(get_db)):
    """Submit a visa application"""
    application = db.query(VisaApplicationModel).filter(VisaApplicationModel.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Visa application not found")
    
    if application.status != "pending":
        raise HTTPException(status_code=400, detail="Application cannot be submitted in current status")
    
    application.status = "submitted"
    application.submitted_at = datetime.utcnow()
    
    # Create status update
    status = VisaStatusModel(
        application_id=application_id,
        status="submitted",
        description="Application submitted for processing"
    )
    db.add(status)
    db.commit()
    
    return {"message": "Application submitted successfully"}

@app.put("/applications/{application_id}/process")
def process_application(application_id: int, updated_by: int, db: Session = Depends(get_db)):
    """Process a visa application"""
    application = db.query(VisaApplicationModel).filter(VisaApplicationModel.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Visa application not found")
    
    if application.status != "submitted":
        raise HTTPException(status_code=400, detail="Application must be submitted before processing")
    
    application.status = "processing"
    application.processed_at = datetime.utcnow()
    
    # Create status update
    status = VisaStatusModel(
        application_id=application_id,
        status="processing",
        description="Application is being processed",
        updated_by=updated_by
    )
    db.add(status)
    db.commit()
    
    return {"message": "Application processing started"}

@app.put("/applications/{application_id}/approve")
def approve_application(application_id: int, updated_by: int, db: Session = Depends(get_db)):
    """Approve a visa application"""
    application = db.query(VisaApplicationModel).filter(VisaApplicationModel.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Visa application not found")
    
    if application.status != "processing":
        raise HTTPException(status_code=400, detail="Application must be processing before approval")
    
    application.status = "approved"
    application.approved_at = datetime.utcnow()
    
    # Create status update
    status = VisaStatusModel(
        application_id=application_id,
        status="approved",
        description="Application approved",
        updated_by=updated_by
    )
    db.add(status)
    db.commit()
    
    return {"message": "Application approved successfully"}

@app.put("/applications/{application_id}/reject")
def reject_application(application_id: int, rejection_reason: str, updated_by: int, db: Session = Depends(get_db)):
    """Reject a visa application"""
    application = db.query(VisaApplicationModel).filter(VisaApplicationModel.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Visa application not found")
    
    if application.status not in ["submitted", "processing"]:
        raise HTTPException(status_code=400, detail="Application cannot be rejected in current status")
    
    application.status = "rejected"
    application.rejected_at = datetime.utcnow()
    application.rejection_reason = rejection_reason
    
    # Create status update
    status = VisaStatusModel(
        application_id=application_id,
        status="rejected",
        description=f"Application rejected: {rejection_reason}",
        updated_by=updated_by
    )
    db.add(status)
    db.commit()
    
    return {"message": "Application rejected successfully"}

# Visa Document endpoints
@app.post("/applications/{application_id}/documents/", response_model=VisaDocument)
async def upload_visa_document(
    application_id: int,
    file: UploadFile = File(...),
    document_type: str = None,
    is_required: bool = True,
    db: Session = Depends(get_db)
):
    """Upload a document for visa application"""
    # Check if application exists
    application = db.query(VisaApplicationModel).filter(VisaApplicationModel.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Visa application not found")
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Get file size
    file_size = os.path.getsize(file_path)
    
    document_data = {
        "application_id": application_id,
        "document_type": document_type or "general",
        "file_name": file.filename,
        "file_path": file_path,
        "file_size": file_size,
        "is_required": is_required
    }
    
    db_document = VisaDocumentModel(**document_data)
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document

@app.get("/applications/{application_id}/documents/", response_model=List[VisaDocument])
def get_visa_documents(application_id: int, db: Session = Depends(get_db)):
    """Get all documents for a visa application"""
    documents = db.query(VisaDocumentModel).filter(VisaDocumentModel.application_id == application_id).all()
    return documents

@app.put("/documents/{document_id}/verify")
def verify_document(document_id: int, is_verified: bool, verification_notes: str = None, db: Session = Depends(get_db)):
    """Verify a visa document"""
    document = db.query(VisaDocumentModel).filter(VisaDocumentModel.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    document.is_verified = is_verified
    document.verification_notes = verification_notes
    db.commit()
    
    return {"message": f"Document {'verified' if is_verified else 'unverified'} successfully"}

# Visa Payment endpoints
@app.post("/applications/{application_id}/payments/", response_model=VisaPayment)
def create_visa_payment(application_id: int, payment: VisaPaymentCreate, db: Session = Depends(get_db)):
    """Create a payment for visa application"""
    # Check if application exists
    application = db.query(VisaApplicationModel).filter(VisaApplicationModel.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Visa application not found")
    
    db_payment = VisaPaymentModel(**payment.dict())
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

@app.put("/payments/{payment_id}/complete")
def complete_payment(payment_id: int, transaction_id: str, db: Session = Depends(get_db)):
    """Complete a visa payment"""
    payment = db.query(VisaPaymentModel).filter(VisaPaymentModel.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    payment.payment_status = "completed"
    payment.transaction_id = transaction_id
    payment.payment_date = datetime.utcnow()
    
    # Update application payment status
    application = db.query(VisaApplicationModel).filter(VisaApplicationModel.id == payment.application_id).first()
    if application:
        application.payment_status = "paid"
    
    db.commit()
    return {"message": "Payment completed successfully"}

@app.get("/applications/{application_id}/payments/", response_model=List[VisaPayment])
def get_visa_payments(application_id: int, db: Session = Depends(get_db)):
    """Get all payments for a visa application"""
    payments = db.query(VisaPaymentModel).filter(VisaPaymentModel.application_id == application_id).all()
    return payments

# Visa Status endpoints
@app.get("/applications/{application_id}/status/", response_model=List[VisaStatus])
def get_visa_status_history(application_id: int, db: Session = Depends(get_db)):
    """Get status history for a visa application"""
    statuses = db.query(VisaStatusModel).filter(VisaStatusModel.application_id == application_id).order_by(VisaStatusModel.created_at.desc()).all()
    return statuses

@app.get("/stats/")
def get_visa_stats(db: Session = Depends(get_db)):
    """Get visa system statistics"""
    total_applications = db.query(VisaApplicationModel).count()
    pending_applications = db.query(VisaApplicationModel).filter(VisaApplicationModel.status == "pending").count()
    submitted_applications = db.query(VisaApplicationModel).filter(VisaApplicationModel.status == "submitted").count()
    processing_applications = db.query(VisaApplicationModel).filter(VisaApplicationModel.status == "processing").count()
    approved_applications = db.query(VisaApplicationModel).filter(VisaApplicationModel.status == "approved").count()
    rejected_applications = db.query(VisaApplicationModel).filter(VisaApplicationModel.status == "rejected").count()
    
    total_revenue = db.query(VisaPaymentModel).filter(VisaPaymentModel.payment_status == "completed").with_entities(
        db.func.sum(VisaPaymentModel.amount)
    ).scalar() or 0
    
    return {
        "total_applications": total_applications,
        "pending_applications": pending_applications,
        "submitted_applications": submitted_applications,
        "processing_applications": processing_applications,
        "approved_applications": approved_applications,
        "rejected_applications": rejected_applications,
        "total_revenue": total_revenue
    }

@app.get("/health/")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "visa"} 