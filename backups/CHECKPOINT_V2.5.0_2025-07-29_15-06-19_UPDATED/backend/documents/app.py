from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import os
import shutil
from datetime import datetime
import uuid

from backend.shared.config.database import get_db
from backend.shared.models.documents import Document as DocumentModel, DocumentVersion as DocumentVersionModel, DocumentAccess as DocumentAccessModel, DocumentTemplate as DocumentTemplateModel, DocumentSignature as DocumentSignatureModel
from backend.shared.schemas import DocumentCreate, Document, DocumentVersionCreate, DocumentVersion, DocumentAccessCreate, DocumentAccess, DocumentTemplateCreate, DocumentTemplate, DocumentSignatureCreate, DocumentSignature

app = FastAPI(title="Documents Service", version="1.0.0")

# Create upload directory if it doesn't exist
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Document endpoints
@app.post("/documents/upload/", response_model=Document)
async def upload_document(
    file: UploadFile = File(...),
    title: str = None,
    description: str = None,
    document_type: str = None,
    is_public: bool = False,
    uploaded_by: int = None,
    related_user_id: int = None,
    related_booking_id: int = None,
    related_order_id: int = None,
    tags: str = None,
    db: Session = Depends(get_db)
):
    """Upload a new document"""
    if not file:
        raise HTTPException(status_code=400, detail="No file provided")
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Get file size
    file_size = os.path.getsize(file_path)
    
    # Create document record
    document_data = {
        "title": title or file.filename,
        "description": description,
        "file_name": file.filename,
        "file_path": file_path,
        "file_size": file_size,
        "file_type": file_extension[1:] if file_extension else "unknown",
        "mime_type": file.content_type or "application/octet-stream",
        "document_type": document_type or "general",
        "is_public": is_public,
        "uploaded_by": uploaded_by,
        "related_user_id": related_user_id,
        "related_booking_id": related_booking_id,
        "related_order_id": related_order_id,
        "tags": tags
    }
    
    db_document = DocumentModel(**document_data)
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    
    return db_document

@app.get("/documents/", response_model=List[Document])
def get_documents(
    skip: int = 0,
    limit: int = 100,
    document_type: str = None,
    uploaded_by: int = None,
    related_user_id: int = None,
    db: Session = Depends(get_db)
):
    """Get documents with optional filters"""
    query = db.query(DocumentModel).filter(DocumentModel.status == "active")
    
    if document_type:
        query = query.filter(DocumentModel.document_type == document_type)
    if uploaded_by:
        query = query.filter(DocumentModel.uploaded_by == uploaded_by)
    if related_user_id:
        query = query.filter(DocumentModel.related_user_id == related_user_id)
    
    documents = query.offset(skip).limit(limit).all()
    return documents

@app.get("/documents/{document_id}", response_model=Document)
def get_document(document_id: int, db: Session = Depends(get_db)):
    """Get a specific document"""
    document = db.query(DocumentModel).filter(DocumentModel.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document

@app.put("/documents/{document_id}", response_model=Document)
def update_document(document_id: int, document: DocumentCreate, db: Session = Depends(get_db)):
    """Update a document"""
    db_document = db.query(DocumentModel).filter(DocumentModel.id == document_id).first()
    if not db_document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    for key, value in document.dict().items():
        setattr(db_document, key, value)
    
    db_document.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_document)
    return db_document

@app.delete("/documents/{document_id}")
def delete_document(document_id: int, db: Session = Depends(get_db)):
    """Delete a document"""
    document = db.query(DocumentModel).filter(DocumentModel.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Soft delete
    document.status = "deleted"
    document.updated_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Document deleted successfully"}

# Document Version endpoints
@app.post("/documents/{document_id}/versions/", response_model=DocumentVersion)
async def create_document_version(
    document_id: int,
    file: UploadFile = File(...),
    change_description: str = None,
    uploaded_by: int = None,
    db: Session = Depends(get_db)
):
    """Create a new version of a document"""
    # Check if document exists
    document = db.query(DocumentModel).filter(DocumentModel.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Get current version number
    current_version = db.query(DocumentVersionModel).filter(
        DocumentVersionModel.document_id == document_id
    ).order_by(DocumentVersionModel.version_number.desc()).first()
    
    version_number = (current_version.version_number + 1) if current_version else 1
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Get file size
    file_size = os.path.getsize(file_path)
    
    # Create version record
    version_data = {
        "document_id": document_id,
        "version_number": version_number,
        "file_name": file.filename,
        "file_path": file_path,
        "file_size": file_size,
        "change_description": change_description,
        "uploaded_by": uploaded_by
    }
    
    db_version = DocumentVersionModel(**version_data)
    db.add(db_version)
    db.commit()
    db.refresh(db_version)
    
    return db_version

@app.get("/documents/{document_id}/versions/", response_model=List[DocumentVersion])
def get_document_versions(document_id: int, db: Session = Depends(get_db)):
    """Get all versions of a document"""
    versions = db.query(DocumentVersionModel).filter(
        DocumentVersionModel.document_id == document_id
    ).order_by(DocumentVersionModel.version_number.desc()).all()
    return versions

# Document Access endpoints
@app.post("/documents/{document_id}/access/", response_model=DocumentAccess)
def grant_document_access(document_id: int, access: DocumentAccessCreate, db: Session = Depends(get_db)):
    """Grant access to a document"""
    # Check if document exists
    document = db.query(DocumentModel).filter(DocumentModel.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Check if access already exists
    existing_access = db.query(DocumentAccessModel).filter(
        DocumentAccessModel.document_id == document_id,
        DocumentAccessModel.user_id == access.user_id,
        DocumentAccessModel.is_active == True
    ).first()
    
    if existing_access:
        raise HTTPException(status_code=400, detail="Access already granted to this user")
    
    db_access = DocumentAccessModel(**access.dict())
    db.add(db_access)
    db.commit()
    db.refresh(db_access)
    return db_access

@app.get("/documents/{document_id}/access/", response_model=List[DocumentAccess])
def get_document_access(document_id: int, db: Session = Depends(get_db)):
    """Get all access records for a document"""
    access_records = db.query(DocumentAccessModel).filter(
        DocumentAccessModel.document_id == document_id,
        DocumentAccessModel.is_active == True
    ).all()
    return access_records

@app.delete("/documents/{document_id}/access/{user_id}")
def revoke_document_access(document_id: int, user_id: int, db: Session = Depends(get_db)):
    """Revoke access to a document"""
    access = db.query(DocumentAccessModel).filter(
        DocumentAccessModel.document_id == document_id,
        DocumentAccessModel.user_id == user_id,
        DocumentAccessModel.is_active == True
    ).first()
    
    if not access:
        raise HTTPException(status_code=404, detail="Access record not found")
    
    access.is_active = False
    db.commit()
    return {"message": "Document access revoked successfully"}

# Document Template endpoints
@app.post("/templates/", response_model=DocumentTemplate)
async def create_template(
    file: UploadFile = File(...),
    name: str = None,
    description: str = None,
    template_type: str = None,
    variables: str = None,
    created_by: int = None,
    db: Session = Depends(get_db)
):
    """Create a new document template"""
    if not file:
        raise HTTPException(status_code=400, detail="No file provided")
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"template_{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    template_data = {
        "name": name or file.filename,
        "description": description,
        "template_type": template_type or "general",
        "file_path": file_path,
        "variables": variables,
        "created_by": created_by
    }
    
    db_template = DocumentTemplateModel(**template_data)
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template

@app.get("/templates/", response_model=List[DocumentTemplate])
def get_templates(template_type: str = None, db: Session = Depends(get_db)):
    """Get document templates"""
    query = db.query(DocumentTemplateModel).filter(DocumentTemplateModel.is_active == True)
    
    if template_type:
        query = query.filter(DocumentTemplateModel.template_type == template_type)
    
    templates = query.all()
    return templates

@app.get("/templates/{template_id}", response_model=DocumentTemplate)
def get_template(template_id: int, db: Session = Depends(get_db)):
    """Get a specific template"""
    template = db.query(DocumentTemplateModel).filter(DocumentTemplateModel.id == template_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return template

# Document Signature endpoints
@app.post("/documents/{document_id}/sign/", response_model=DocumentSignature)
def sign_document(document_id: int, signature: DocumentSignatureCreate, db: Session = Depends(get_db)):
    """Sign a document"""
    # Check if document exists
    document = db.query(DocumentModel).filter(DocumentModel.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Check if already signed by this user
    existing_signature = db.query(DocumentSignatureModel).filter(
        DocumentSignatureModel.document_id == document_id,
        DocumentSignatureModel.user_id == signature.user_id,
        DocumentSignatureModel.is_valid == True
    ).first()
    
    if existing_signature:
        raise HTTPException(status_code=400, detail="Document already signed by this user")
    
    db_signature = DocumentSignatureModel(**signature.dict())
    db.add(db_signature)
    db.commit()
    db.refresh(db_signature)
    return db_signature

@app.get("/documents/{document_id}/signatures/", response_model=List[DocumentSignature])
def get_document_signatures(document_id: int, db: Session = Depends(get_db)):
    """Get all signatures for a document"""
    signatures = db.query(DocumentSignatureModel).filter(
        DocumentSignatureModel.document_id == document_id,
        DocumentSignatureModel.is_valid == True
    ).all()
    return signatures

@app.get("/stats/")
def get_documents_stats(db: Session = Depends(get_db)):
    """Get documents system statistics"""
    total_documents = db.query(DocumentModel).count()
    active_documents = db.query(DocumentModel).filter(DocumentModel.status == "active").count()
    total_templates = db.query(DocumentTemplateModel).count()
    active_templates = db.query(DocumentTemplateModel).filter(DocumentTemplateModel.is_active == True).count()
    total_signatures = db.query(DocumentSignatureModel).filter(DocumentSignatureModel.is_valid == True).count()
    
    # Calculate total storage used
    total_storage = db.query(DocumentModel).with_entities(
        db.func.sum(DocumentModel.file_size)
    ).scalar() or 0
    
    return {
        "total_documents": total_documents,
        "active_documents": active_documents,
        "total_templates": total_templates,
        "active_templates": active_templates,
        "total_signatures": total_signatures,
        "total_storage_bytes": total_storage,
        "total_storage_mb": round(total_storage / (1024 * 1024), 2)
    }

@app.get("/health/")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "documents"} 