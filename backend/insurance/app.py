from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import os
import shutil
from datetime import datetime, date
import uuid
import random
import string

from backend.shared.config.database import get_db
from backend.shared.models.insurance import InsuranceType as InsuranceTypeModel, InsurancePolicy as InsurancePolicyModel, InsuranceClaim as InsuranceClaimModel, InsurancePayment as InsurancePaymentModel, InsuranceDocument as InsuranceDocumentModel
from backend.shared.schemas import InsuranceTypeCreate, InsuranceType, InsurancePolicyCreate, InsurancePolicy, InsuranceClaimCreate, InsuranceClaim, InsurancePaymentCreate, InsurancePayment, InsuranceDocumentCreate, InsuranceDocument

app = FastAPI(title="Insurance Service", version="1.0.0")

# Create upload directory if it doesn't exist
UPLOAD_DIR = "insurance_documents"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def generate_policy_number():
    """Generate a unique policy number"""
    prefix = "POL"
    year = datetime.now().year
    random_chars = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    return f"{prefix}{year}{random_chars}"

def generate_claim_number():
    """Generate a unique claim number"""
    prefix = "CLM"
    year = datetime.now().year
    random_chars = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    return f"{prefix}{year}{random_chars}"

# Insurance Type endpoints
@app.post("/types/", response_model=InsuranceType)
def create_insurance_type(insurance_type: InsuranceTypeCreate, db: Session = Depends(get_db)):
    """Create a new insurance type"""
    db_insurance_type = InsuranceTypeModel(**insurance_type.dict())
    db.add(db_insurance_type)
    db.commit()
    db.refresh(db_insurance_type)
    return db_insurance_type

@app.get("/types/", response_model=List[InsuranceType])
def get_insurance_types(category: str = None, coverage_type: str = None, db: Session = Depends(get_db)):
    """Get insurance types with optional filters"""
    query = db.query(InsuranceTypeModel).filter(InsuranceTypeModel.is_active == True)
    
    if category:
        query = query.filter(InsuranceTypeModel.category == category)
    if coverage_type:
        query = query.filter(InsuranceTypeModel.coverage_type == coverage_type)
    
    insurance_types = query.all()
    return insurance_types

@app.get("/types/{insurance_type_id}", response_model=InsuranceType)
def get_insurance_type(insurance_type_id: int, db: Session = Depends(get_db)):
    """Get a specific insurance type"""
    insurance_type = db.query(InsuranceTypeModel).filter(InsuranceTypeModel.id == insurance_type_id).first()
    if not insurance_type:
        raise HTTPException(status_code=404, detail="Insurance type not found")
    return insurance_type

@app.put("/types/{insurance_type_id}", response_model=InsuranceType)
def update_insurance_type(insurance_type_id: int, insurance_type: InsuranceTypeCreate, db: Session = Depends(get_db)):
    """Update an insurance type"""
    db_insurance_type = db.query(InsuranceTypeModel).filter(InsuranceTypeModel.id == insurance_type_id).first()
    if not db_insurance_type:
        raise HTTPException(status_code=404, detail="Insurance type not found")
    
    for key, value in insurance_type.dict().items():
        setattr(db_insurance_type, key, value)
    
    db.commit()
    db.refresh(db_insurance_type)
    return db_insurance_type

@app.delete("/types/{insurance_type_id}")
def deactivate_insurance_type(insurance_type_id: int, db: Session = Depends(get_db)):
    """Deactivate an insurance type"""
    insurance_type = db.query(InsuranceTypeModel).filter(InsuranceTypeModel.id == insurance_type_id).first()
    if not insurance_type:
        raise HTTPException(status_code=404, detail="Insurance type not found")
    
    insurance_type.is_active = False
    db.commit()
    return {"message": "Insurance type deactivated successfully"}

# Insurance Policy endpoints
@app.post("/policies/", response_model=InsurancePolicy)
def create_insurance_policy(policy: InsurancePolicyCreate, db: Session = Depends(get_db)):
    """Create a new insurance policy"""
    # Generate policy number
    policy_data = policy.dict()
    policy_data["policy_number"] = generate_policy_number()
    
    db_policy = InsurancePolicyModel(**policy_data)
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy

@app.get("/policies/", response_model=List[InsurancePolicy])
def get_insurance_policies(
    user_id: int = None,
    status: str = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get insurance policies with optional filters"""
    query = db.query(InsurancePolicyModel)
    
    if user_id:
        query = query.filter(InsurancePolicyModel.user_id == user_id)
    if status:
        query = query.filter(InsurancePolicyModel.status == status)
    
    policies = query.offset(skip).limit(limit).all()
    return policies

@app.get("/policies/{policy_id}", response_model=InsurancePolicy)
def get_insurance_policy(policy_id: int, db: Session = Depends(get_db)):
    """Get a specific insurance policy"""
    policy = db.query(InsurancePolicyModel).filter(InsurancePolicyModel.id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Insurance policy not found")
    return policy

@app.put("/policies/{policy_id}", response_model=InsurancePolicy)
def update_insurance_policy(policy_id: int, policy: InsurancePolicyCreate, db: Session = Depends(get_db)):
    """Update an insurance policy"""
    db_policy = db.query(InsurancePolicyModel).filter(InsurancePolicyModel.id == policy_id).first()
    if not db_policy:
        raise HTTPException(status_code=404, detail="Insurance policy not found")
    
    for key, value in policy.dict().items():
        setattr(db_policy, key, value)
    
    db_policy.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_policy)
    return db_policy

@app.delete("/policies/{policy_id}")
def cancel_insurance_policy(policy_id: int, db: Session = Depends(get_db)):
    """Cancel an insurance policy"""
    policy = db.query(InsurancePolicyModel).filter(InsurancePolicyModel.id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Insurance policy not found")
    
    policy.status = "cancelled"
    policy.updated_at = datetime.utcnow()
    db.commit()
    return {"message": "Insurance policy cancelled successfully"}

# Insurance Claim endpoints
@app.post("/claims/", response_model=InsuranceClaim)
def create_insurance_claim(claim: InsuranceClaimCreate, db: Session = Depends(get_db)):
    """Create a new insurance claim"""
    # Generate claim number
    claim_data = claim.dict()
    claim_data["claim_number"] = generate_claim_number()
    
    # Verify policy exists and is active
    policy = db.query(InsurancePolicyModel).filter(InsurancePolicyModel.id == claim.policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Insurance policy not found")
    
    if policy.status != "active":
        raise HTTPException(status_code=400, detail="Policy must be active to file a claim")
    
    db_claim = InsuranceClaimModel(**claim_data)
    db.add(db_claim)
    db.commit()
    db.refresh(db_claim)
    return db_claim

@app.get("/claims/", response_model=List[InsuranceClaim])
def get_insurance_claims(
    user_id: int = None,
    policy_id: int = None,
    status: str = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get insurance claims with optional filters"""
    query = db.query(InsuranceClaimModel)
    
    if user_id:
        query = query.filter(InsuranceClaimModel.user_id == user_id)
    if policy_id:
        query = query.filter(InsuranceClaimModel.policy_id == policy_id)
    if status:
        query = query.filter(InsuranceClaimModel.status == status)
    
    claims = query.offset(skip).limit(limit).all()
    return claims

@app.get("/claims/{claim_id}", response_model=InsuranceClaim)
def get_insurance_claim(claim_id: int, db: Session = Depends(get_db)):
    """Get a specific insurance claim"""
    claim = db.query(InsuranceClaimModel).filter(InsuranceClaimModel.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Insurance claim not found")
    return claim

@app.put("/claims/{claim_id}/process")
def process_claim(claim_id: int, status: str, approved_amount: float = None, rejection_reason: str = None, db: Session = Depends(get_db)):
    """Process an insurance claim"""
    claim = db.query(InsuranceClaimModel).filter(InsuranceClaimModel.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Insurance claim not found")
    
    if claim.status not in ["submitted", "under_review"]:
        raise HTTPException(status_code=400, detail="Claim cannot be processed in current status")
    
    claim.status = status
    claim.processed_at = datetime.utcnow()
    
    if status == "approved":
        claim.approved_amount = approved_amount
    elif status == "rejected":
        claim.rejection_reason = rejection_reason
    
    db.commit()
    return {"message": f"Claim {status} successfully"}

@app.put("/claims/{claim_id}/pay")
def pay_claim(claim_id: int, db: Session = Depends(get_db)):
    """Mark a claim as paid"""
    claim = db.query(InsuranceClaimModel).filter(InsuranceClaimModel.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Insurance claim not found")
    
    if claim.status != "approved":
        raise HTTPException(status_code=400, detail="Claim must be approved before payment")
    
    claim.status = "paid"
    claim.paid_at = datetime.utcnow()
    db.commit()
    return {"message": "Claim marked as paid successfully"}

# Insurance Payment endpoints
@app.post("/policies/{policy_id}/payments/", response_model=InsurancePayment)
def create_insurance_payment(policy_id: int, payment: InsurancePaymentCreate, db: Session = Depends(get_db)):
    """Create a payment for insurance policy"""
    # Check if policy exists
    policy = db.query(InsurancePolicyModel).filter(InsurancePolicyModel.id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Insurance policy not found")
    
    db_payment = InsurancePaymentModel(**payment.dict())
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment

@app.put("/payments/{payment_id}/complete")
def complete_payment(payment_id: int, transaction_id: str, db: Session = Depends(get_db)):
    """Complete an insurance payment"""
    payment = db.query(InsurancePaymentModel).filter(InsurancePaymentModel.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    payment.payment_status = "completed"
    payment.transaction_id = transaction_id
    payment.payment_date = datetime.utcnow()
    
    # Update policy payment status if it's a premium payment
    if payment.payment_type == "premium":
        policy = db.query(InsurancePolicyModel).filter(InsurancePolicyModel.id == payment.policy_id).first()
        if policy:
            policy.payment_status = "paid"
    
    db.commit()
    return {"message": "Payment completed successfully"}

@app.get("/policies/{policy_id}/payments/", response_model=List[InsurancePayment])
def get_insurance_payments(policy_id: int, db: Session = Depends(get_db)):
    """Get all payments for an insurance policy"""
    payments = db.query(InsurancePaymentModel).filter(InsurancePaymentModel.policy_id == policy_id).all()
    return payments

# Insurance Document endpoints
@app.post("/policies/{policy_id}/documents/", response_model=InsuranceDocument)
async def upload_insurance_document(
    policy_id: int,
    file: UploadFile = File(...),
    document_type: str = None,
    claim_id: int = None,
    db: Session = Depends(get_db)
):
    """Upload a document for insurance policy or claim"""
    # Check if policy exists
    policy = db.query(InsurancePolicyModel).filter(InsurancePolicyModel.id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Insurance policy not found")
    
    # Check if claim exists if claim_id is provided
    if claim_id:
        claim = db.query(InsuranceClaimModel).filter(InsuranceClaimModel.id == claim_id).first()
        if not claim:
            raise HTTPException(status_code=404, detail="Insurance claim not found")
    
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
        "policy_id": policy_id,
        "claim_id": claim_id,
        "document_type": document_type or "general",
        "file_name": file.filename,
        "file_path": file_path,
        "file_size": file_size
    }
    
    db_document = InsuranceDocumentModel(**document_data)
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document

@app.get("/policies/{policy_id}/documents/", response_model=List[InsuranceDocument])
def get_insurance_documents(policy_id: int, db: Session = Depends(get_db)):
    """Get all documents for an insurance policy"""
    documents = db.query(InsuranceDocumentModel).filter(InsuranceDocumentModel.policy_id == policy_id).all()
    return documents

@app.get("/claims/{claim_id}/documents/", response_model=List[InsuranceDocument])
def get_claim_documents(claim_id: int, db: Session = Depends(get_db)):
    """Get all documents for an insurance claim"""
    documents = db.query(InsuranceDocumentModel).filter(InsuranceDocumentModel.claim_id == claim_id).all()
    return documents

@app.get("/stats/")
def get_insurance_stats(db: Session = Depends(get_db)):
    """Get insurance system statistics"""
    total_policies = db.query(InsurancePolicyModel).count()
    active_policies = db.query(InsurancePolicyModel).filter(InsurancePolicyModel.status == "active").count()
    total_claims = db.query(InsuranceClaimModel).count()
    pending_claims = db.query(InsuranceClaimModel).filter(InsuranceClaimModel.status == "submitted").count()
    approved_claims = db.query(InsuranceClaimModel).filter(InsuranceClaimModel.status == "approved").count()
    paid_claims = db.query(InsuranceClaimModel).filter(InsuranceClaimModel.status == "paid").count()
    
    total_premiums = db.query(InsurancePaymentModel).filter(
        InsurancePaymentModel.payment_type == "premium",
        InsurancePaymentModel.payment_status == "completed"
    ).with_entities(db.func.sum(InsurancePaymentModel.amount)).scalar() or 0
    
    total_claim_payments = db.query(InsuranceClaimModel).filter(
        InsuranceClaimModel.status == "paid"
    ).with_entities(db.func.sum(InsuranceClaimModel.approved_amount)).scalar() or 0
    
    return {
        "total_policies": total_policies,
        "active_policies": active_policies,
        "total_claims": total_claims,
        "pending_claims": pending_claims,
        "approved_claims": approved_claims,
        "paid_claims": paid_claims,
        "total_premiums": total_premiums,
        "total_claim_payments": total_claim_payments
    }

@app.get("/health/")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "insurance"} 