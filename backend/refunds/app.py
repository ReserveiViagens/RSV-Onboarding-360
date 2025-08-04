from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import os
import shutil
from datetime import datetime, timedelta
import uuid
import random
import string

from backend.shared.config.database import get_db
from backend.shared.models.refunds import RefundRequest as RefundRequestModel, RefundDocument as RefundDocumentModel, RefundStatus as RefundStatusModel, RefundPolicy as RefundPolicyModel
from backend.shared.schemas import RefundRequestCreate, RefundRequest, RefundDocumentCreate, RefundDocument, RefundStatusCreate, RefundStatus, RefundPolicyCreate, RefundPolicy

app = FastAPI(title="Refunds Service", version="1.0.0")

# Create upload directory if it doesn't exist
UPLOAD_DIR = "refund_documents"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def generate_refund_number():
    """Generate a unique refund number"""
    prefix = "REF"
    year = datetime.now().year
    random_chars = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    return f"{prefix}{year}{random_chars}"

# Refund Policy endpoints
@app.post("/policies/", response_model=RefundPolicy)
def create_refund_policy(policy: RefundPolicyCreate, db: Session = Depends(get_db)):
    """Create a new refund policy"""
    db_policy = RefundPolicyModel(**policy.dict())
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy

@app.get("/policies/", response_model=List[RefundPolicy])
def get_refund_policies(product_type: str = None, db: Session = Depends(get_db)):
    """Get refund policies with optional filters"""
    query = db.query(RefundPolicyModel).filter(RefundPolicyModel.is_active == True)
    
    if product_type:
        query = query.filter(RefundPolicyModel.product_type == product_type)
    
    policies = query.all()
    return policies

@app.get("/policies/{policy_id}", response_model=RefundPolicy)
def get_refund_policy(policy_id: int, db: Session = Depends(get_db)):
    """Get a specific refund policy"""
    policy = db.query(RefundPolicyModel).filter(RefundPolicyModel.id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Refund policy not found")
    return policy

@app.put("/policies/{policy_id}", response_model=RefundPolicy)
def update_refund_policy(policy_id: int, policy: RefundPolicyCreate, db: Session = Depends(get_db)):
    """Update a refund policy"""
    db_policy = db.query(RefundPolicyModel).filter(RefundPolicyModel.id == policy_id).first()
    if not db_policy:
        raise HTTPException(status_code=404, detail="Refund policy not found")
    
    for key, value in policy.dict().items():
        setattr(db_policy, key, value)
    
    db_policy.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_policy)
    return db_policy

@app.delete("/policies/{policy_id}")
def deactivate_refund_policy(policy_id: int, db: Session = Depends(get_db)):
    """Deactivate a refund policy"""
    policy = db.query(RefundPolicyModel).filter(RefundPolicyModel.id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Refund policy not found")
    
    policy.is_active = False
    policy.updated_at = datetime.utcnow()
    db.commit()
    return {"message": "Refund policy deactivated successfully"}

# Refund Request endpoints
@app.post("/requests/", response_model=RefundRequest)
def create_refund_request(request: RefundRequestCreate, db: Session = Depends(get_db)):
    """Create a new refund request"""
    # Generate refund number
    request_data = request.dict()
    request_data["refund_number"] = generate_refund_number()
    
    db_request = RefundRequestModel(**request_data)
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    
    # Create initial status
    status = RefundStatusModel(
        refund_id=db_request.id,
        status="pending",
        description="Refund request submitted"
    )
    db.add(status)
    db.commit()
    
    return db_request

@app.get("/requests/", response_model=List[RefundRequest])
def get_refund_requests(
    user_id: int = None,
    status: str = None,
    refund_type: str = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get refund requests with optional filters"""
    query = db.query(RefundRequestModel)
    
    if user_id:
        query = query.filter(RefundRequestModel.user_id == user_id)
    if status:
        query = query.filter(RefundRequestModel.status == status)
    if refund_type:
        query = query.filter(RefundRequestModel.refund_type == refund_type)
    
    requests = query.offset(skip).limit(limit).all()
    return requests

@app.get("/requests/{refund_id}", response_model=RefundRequest)
def get_refund_request(refund_id: int, db: Session = Depends(get_db)):
    """Get a specific refund request"""
    refund_request = db.query(RefundRequestModel).filter(RefundRequestModel.id == refund_id).first()
    if not refund_request:
        raise HTTPException(status_code=404, detail="Refund request not found")
    return refund_request

@app.put("/requests/{refund_id}/approve")
def approve_refund_request(refund_id: int, approved_by: int, admin_notes: str = None, db: Session = Depends(get_db)):
    """Approve a refund request"""
    refund_request = db.query(RefundRequestModel).filter(RefundRequestModel.id == refund_id).first()
    if not refund_request:
        raise HTTPException(status_code=404, detail="Refund request not found")
    
    if refund_request.status != "pending":
        raise HTTPException(status_code=400, detail="Refund request cannot be approved in current status")
    
    refund_request.status = "approved"
    refund_request.approved_at = datetime.utcnow()
    refund_request.approved_by = approved_by
    refund_request.admin_notes = admin_notes
    
    # Create status update
    status = RefundStatusModel(
        refund_id=refund_id,
        status="approved",
        description="Refund request approved",
        updated_by=approved_by
    )
    db.add(status)
    db.commit()
    
    return {"message": "Refund request approved successfully"}

@app.put("/requests/{refund_id}/reject")
def reject_refund_request(refund_id: int, rejection_reason: str, updated_by: int, db: Session = Depends(get_db)):
    """Reject a refund request"""
    refund_request = db.query(RefundRequestModel).filter(RefundRequestModel.id == refund_id).first()
    if not refund_request:
        raise HTTPException(status_code=404, detail="Refund request not found")
    
    if refund_request.status != "pending":
        raise HTTPException(status_code=400, detail="Refund request cannot be rejected in current status")
    
    refund_request.status = "rejected"
    refund_request.rejection_reason = rejection_reason
    
    # Create status update
    status = RefundStatusModel(
        refund_id=refund_id,
        status="rejected",
        description=f"Refund request rejected: {rejection_reason}",
        updated_by=updated_by
    )
    db.add(status)
    db.commit()
    
    return {"message": "Refund request rejected successfully"}

@app.put("/requests/{refund_id}/process")
def process_refund_request(refund_id: int, updated_by: int, db: Session = Depends(get_db)):
    """Process an approved refund request"""
    refund_request = db.query(RefundRequestModel).filter(RefundRequestModel.id == refund_id).first()
    if not refund_request:
        raise HTTPException(status_code=404, detail="Refund request not found")
    
    if refund_request.status != "approved":
        raise HTTPException(status_code=400, detail="Refund request must be approved before processing")
    
    refund_request.status = "processed"
    refund_request.processed_at = datetime.utcnow()
    
    # Create status update
    status = RefundStatusModel(
        refund_id=refund_id,
        status="processed",
        description="Refund is being processed",
        updated_by=updated_by
    )
    db.add(status)
    db.commit()
    
    return {"message": "Refund processing started"}

@app.put("/requests/{refund_id}/complete")
def complete_refund_request(refund_id: int, updated_by: int, db: Session = Depends(get_db)):
    """Mark a refund request as completed"""
    refund_request = db.query(RefundRequestModel).filter(RefundRequestModel.id == refund_id).first()
    if not refund_request:
        raise HTTPException(status_code=404, detail="Refund request not found")
    
    if refund_request.status != "processed":
        raise HTTPException(status_code=400, detail="Refund request must be processed before completion")
    
    refund_request.status = "completed"
    refund_request.completed_at = datetime.utcnow()
    
    # Create status update
    status = RefundStatusModel(
        refund_id=refund_id,
        status="completed",
        description="Refund completed successfully",
        updated_by=updated_by
    )
    db.add(status)
    db.commit()
    
    return {"message": "Refund completed successfully"}

# Refund Document endpoints
@app.post("/requests/{refund_id}/documents/", response_model=RefundDocument)
async def upload_refund_document(
    refund_id: int,
    file: UploadFile = File(...),
    document_type: str = None,
    db: Session = Depends(get_db)
):
    """Upload a document for refund request"""
    # Check if refund request exists
    refund_request = db.query(RefundRequestModel).filter(RefundRequestModel.id == refund_id).first()
    if not refund_request:
        raise HTTPException(status_code=404, detail="Refund request not found")
    
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
        "refund_id": refund_id,
        "document_type": document_type or "general",
        "file_name": file.filename,
        "file_path": file_path,
        "file_size": file_size
    }
    
    db_document = RefundDocumentModel(**document_data)
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document

@app.get("/requests/{refund_id}/documents/", response_model=List[RefundDocument])
def get_refund_documents(refund_id: int, db: Session = Depends(get_db)):
    """Get all documents for a refund request"""
    documents = db.query(RefundDocumentModel).filter(RefundDocumentModel.refund_id == refund_id).all()
    return documents

# Refund Status endpoints
@app.get("/requests/{refund_id}/status/", response_model=List[RefundStatus])
def get_refund_status_history(refund_id: int, db: Session = Depends(get_db)):
    """Get status history for a refund request"""
    statuses = db.query(RefundStatusModel).filter(RefundStatusModel.refund_id == refund_id).order_by(RefundStatusModel.created_at.desc()).all()
    return statuses

# Utility endpoints
@app.get("/calculate-refund/{order_id}")
def calculate_refund_amount(order_id: int, product_type: str, days_since_purchase: int, db: Session = Depends(get_db)):
    """Calculate refund amount based on policy"""
    # Get applicable refund policy
    policy = db.query(RefundPolicyModel).filter(
        RefundPolicyModel.product_type == product_type,
        RefundPolicyModel.is_active == True
    ).first()
    
    if not policy:
        raise HTTPException(status_code=404, detail="No refund policy found for this product type")
    
    # Check if within time limit
    if days_since_purchase > policy.time_limit_days:
        return {
            "eligible": False,
            "reason": f"Refund request is {days_since_purchase - policy.time_limit_days} days past the {policy.time_limit_days}-day limit"
        }
    
    # Calculate refund amount (this would typically get the original amount from the order)
    # For now, we'll return the policy percentage
    return {
        "eligible": True,
        "refund_percentage": policy.refund_percentage,
        "time_limit_days": policy.time_limit_days,
        "conditions": policy.conditions
    }

@app.get("/stats/")
def get_refunds_stats(db: Session = Depends(get_db)):
    """Get refunds system statistics"""
    total_requests = db.query(RefundRequestModel).count()
    pending_requests = db.query(RefundRequestModel).filter(RefundRequestModel.status == "pending").count()
    approved_requests = db.query(RefundRequestModel).filter(RefundRequestModel.status == "approved").count()
    processed_requests = db.query(RefundRequestModel).filter(RefundRequestModel.status == "processed").count()
    completed_requests = db.query(RefundRequestModel).filter(RefundRequestModel.status == "completed").count()
    rejected_requests = db.query(RefundRequestModel).filter(RefundRequestModel.status == "rejected").count()
    
    total_refunded = db.query(RefundRequestModel).filter(
        RefundRequestModel.status == "completed"
    ).with_entities(db.func.sum(RefundRequestModel.refund_amount)).scalar() or 0
    
    total_processing_fees = db.query(RefundRequestModel).with_entities(
        db.func.sum(RefundRequestModel.processing_fee)
    ).scalar() or 0
    
    return {
        "total_requests": total_requests,
        "pending_requests": pending_requests,
        "approved_requests": approved_requests,
        "processed_requests": processed_requests,
        "completed_requests": completed_requests,
        "rejected_requests": rejected_requests,
        "total_refunded": total_refunded,
        "total_processing_fees": total_processing_fees
    }

@app.get("/health/")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "refunds"} 