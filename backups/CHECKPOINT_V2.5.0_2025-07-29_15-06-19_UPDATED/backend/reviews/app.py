from fastapi import FastAPI, HTTPException, Depends, Query, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import json
import os
import shutil

from shared.database import get_db, init_db
from shared.models.reviews import (
    Review, ReviewCategory, ReviewImage, ReviewLike, ReviewComment,
    ReviewReport, ReviewResponse, ReviewAnalytics
)
from shared.schemas import (
    ReviewCreate, Review, ReviewCategoryCreate, ReviewCategory,
    ReviewImageCreate, ReviewImage, ReviewLikeCreate, ReviewLike,
    ReviewCommentCreate, ReviewComment, ReviewReportCreate, ReviewReport,
    ReviewResponseCreate, ReviewResponse, ReviewAnalyticsCreate, ReviewAnalytics
)

app = FastAPI(title="Reviews Service", version="1.0.0")

# Inicializar banco de dados
init_db()

@app.on_event("startup")
async def startup_event():
    init_db()
    # Criar diretório de uploads se não existir
    os.makedirs("review_images", exist_ok=True)

# Endpoints para Avaliações
@app.post("/reviews/", response_model=Review)
def create_review(review: ReviewCreate, db: Session = Depends(get_db)):
    db_review = Review(**review.dict())
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    
    # Atualizar analytics da entidade
    update_entity_analytics(db, review.entity_id, review.entity_type)
    
    return db_review

@app.get("/reviews/", response_model=List[Review])
def get_reviews(
    review_type: Optional[str] = None,
    entity_id: Optional[int] = None,
    entity_type: Optional[str] = None,
    user_id: Optional[int] = None,
    min_rating: Optional[float] = None,
    max_rating: Optional[float] = None,
    is_approved: Optional[bool] = None,
    is_verified_visit: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(Review)
    
    if review_type:
        query = query.filter(Review.review_type == review_type)
    if entity_id:
        query = query.filter(Review.entity_id == entity_id)
    if entity_type:
        query = query.filter(Review.entity_type == entity_type)
    if user_id:
        query = query.filter(Review.user_id == user_id)
    if min_rating:
        query = query.filter(Review.rating >= min_rating)
    if max_rating:
        query = query.filter(Review.rating <= max_rating)
    if is_approved is not None:
        query = query.filter(Review.is_approved == is_approved)
    if is_verified_visit is not None:
        query = query.filter(Review.is_verified_visit == is_verified_visit)
    
    reviews = query.order_by(Review.created_at.desc()).offset(skip).limit(limit).all()
    return reviews

@app.get("/reviews/{review_id}", response_model=Review)
def get_review(review_id: int, db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if review is None:
        raise HTTPException(status_code=404, detail="Avaliação não encontrada")
    return review

@app.put("/reviews/{review_id}", response_model=Review)
def update_review(review_id: int, review: ReviewCreate, db: Session = Depends(get_db)):
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if db_review is None:
        raise HTTPException(status_code=404, detail="Avaliação não encontrada")
    
    for key, value in review.dict().items():
        setattr(db_review, key, value)
    
    db_review.is_edited = True
    db_review.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_review)
    
    # Atualizar analytics da entidade
    update_entity_analytics(db, review.entity_id, review.entity_type)
    
    return db_review

@app.delete("/reviews/{review_id}")
def delete_review(review_id: int, db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if review is None:
        raise HTTPException(status_code=404, detail="Avaliação não encontrada")
    
    # Soft delete - marcar como não aprovada
    review.is_approved = False
    review.updated_at = datetime.utcnow()
    db.commit()
    
    # Atualizar analytics da entidade
    update_entity_analytics(db, review.entity_id, review.entity_type)
    
    return {"message": "Avaliação deletada com sucesso"}

# Endpoints para Categorias de Avaliação
@app.post("/reviews/{review_id}/categories", response_model=ReviewCategory)
def add_review_category(
    review_id: int,
    category: ReviewCategoryCreate,
    db: Session = Depends(get_db)
):
    # Verificar se review existe
    review = db.query(Review).filter(Review.id == review_id).first()
    if review is None:
        raise HTTPException(status_code=404, detail="Avaliação não encontrada")
    
    category_data = category.dict()
    category_data["review_id"] = review_id
    
    db_category = ReviewCategory(**category_data)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@app.get("/reviews/{review_id}/categories", response_model=List[ReviewCategory])
def get_review_categories(review_id: int, db: Session = Depends(get_db)):
    categories = db.query(ReviewCategory).filter(ReviewCategory.review_id == review_id).all()
    return categories

# Endpoints para Imagens de Avaliação
@app.post("/reviews/{review_id}/images/")
async def upload_review_image(
    review_id: int,
    file: UploadFile = File(...),
    image_caption: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    # Verificar se review existe
    review = db.query(Review).filter(Review.id == review_id).first()
    if review is None:
        raise HTTPException(status_code=404, detail="Avaliação não encontrada")
    
    # Validar tipo de arquivo
    allowed_formats = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in allowed_formats:
        raise HTTPException(status_code=400, detail="Formato de arquivo não suportado")
    
    # Salvar arquivo
    file_path = f"review_images/{review_id}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}_{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Criar registro no banco
    image_data = {
        "review_id": review_id,
        "image_path": file_path,
        "image_caption": image_caption
    }
    
    db_image = ReviewImage(**image_data)
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    
    return {
        "id": db_image.id,
        "image_path": db_image.image_path,
        "image_caption": db_image.image_caption,
        "message": "Imagem enviada com sucesso"
    }

@app.get("/reviews/{review_id}/images", response_model=List[ReviewImage])
def get_review_images(review_id: int, db: Session = Depends(get_db)):
    images = db.query(ReviewImage).filter(
        ReviewImage.review_id == review_id,
        ReviewImage.is_approved == True
    ).all()
    return images

# Endpoints para Likes de Avaliação
@app.post("/reviews/{review_id}/like")
def like_review(
    review_id: int,
    user_id: int,
    like_type: str = "helpful",
    db: Session = Depends(get_db)
):
    # Verificar se review existe
    review = db.query(Review).filter(Review.id == review_id).first()
    if review is None:
        raise HTTPException(status_code=404, detail="Avaliação não encontrada")
    
    # Verificar se já existe like do usuário
    existing_like = db.query(ReviewLike).filter(
        ReviewLike.review_id == review_id,
        ReviewLike.user_id == user_id
    ).first()
    
    if existing_like:
        if existing_like.like_type == like_type:
            # Remover like
            db.delete(existing_like)
            review.helpful_count -= 1
            message = "Like removido"
        else:
            # Alterar tipo de like
            existing_like.like_type = like_type
            message = "Tipo de like alterado"
    else:
        # Adicionar novo like
        new_like = ReviewLike(
            review_id=review_id,
            user_id=user_id,
            like_type=like_type
        )
        db.add(new_like)
        if like_type == "helpful":
            review.helpful_count += 1
        message = "Like adicionado"
    
    db.commit()
    
    return {"message": message}

# Endpoints para Comentários de Avaliação
@app.post("/reviews/{review_id}/comments", response_model=ReviewComment)
def create_review_comment(
    review_id: int,
    comment: ReviewCommentCreate,
    db: Session = Depends(get_db)
):
    # Verificar se review existe
    review = db.query(Review).filter(Review.id == review_id).first()
    if review is None:
        raise HTTPException(status_code=404, detail="Avaliação não encontrada")
    
    comment_data = comment.dict()
    comment_data["review_id"] = review_id
    
    db_comment = ReviewComment(**comment_data)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@app.get("/reviews/{review_id}/comments", response_model=List[ReviewComment])
def get_review_comments(
    review_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    comments = db.query(ReviewComment).filter(
        ReviewComment.review_id == review_id,
        ReviewComment.is_approved == True,
        ReviewComment.parent_comment_id == None
    ).order_by(ReviewComment.created_at.desc()).offset(skip).limit(limit).all()
    return comments

@app.get("/comments/{comment_id}/replies", response_model=List[ReviewComment])
def get_comment_replies(
    comment_id: int,
    db: Session = Depends(get_db)
):
    replies = db.query(ReviewComment).filter(
        ReviewComment.parent_comment_id == comment_id,
        ReviewComment.is_approved == True
    ).order_by(ReviewComment.created_at.asc()).all()
    return replies

# Endpoints para Denúncias de Avaliação
@app.post("/reviews/{review_id}/report", response_model=ReviewReport)
def report_review(
    review_id: int,
    report: ReviewReportCreate,
    db: Session = Depends(get_db)
):
    # Verificar se review existe
    review = db.query(Review).filter(Review.id == review_id).first()
    if review is None:
        raise HTTPException(status_code=404, detail="Avaliação não encontrada")
    
    report_data = report.dict()
    report_data["review_id"] = review_id
    
    db_report = ReviewReport(**report_data)
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

@app.get("/reports/", response_model=List[ReviewReport])
def get_reports(
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(ReviewReport)
    
    if status:
        query = query.filter(ReviewReport.status == status)
    
    reports = query.order_by(ReviewReport.created_at.desc()).offset(skip).limit(limit).all()
    return reports

@app.put("/reports/{report_id}/review")
def review_report(
    report_id: int,
    status: str,
    admin_notes: Optional[str] = None,
    reviewed_by: int = Query(...),
    db: Session = Depends(get_db)
):
    report = db.query(ReviewReport).filter(ReviewReport.id == report_id).first()
    if report is None:
        raise HTTPException(status_code=404, detail="Denúncia não encontrada")
    
    report.status = status
    report.admin_notes = admin_notes
    report.reviewed_by = reviewed_by
    report.reviewed_at = datetime.utcnow()
    
    db.commit()
    
    return {"message": "Denúncia revisada com sucesso"}

# Endpoints para Respostas de Avaliação
@app.post("/reviews/{review_id}/response", response_model=ReviewResponse)
def create_review_response(
    review_id: int,
    response: ReviewResponseCreate,
    db: Session = Depends(get_db)
):
    # Verificar se review existe
    review = db.query(Review).filter(Review.id == review_id).first()
    if review is None:
        raise HTTPException(status_code=404, detail="Avaliação não encontrada")
    
    response_data = response.dict()
    response_data["review_id"] = review_id
    
    db_response = ReviewResponse(**response_data)
    db.add(db_response)
    db.commit()
    db.refresh(db_response)
    return db_response

@app.get("/reviews/{review_id}/responses", response_model=List[ReviewResponse])
def get_review_responses(
    review_id: int,
    db: Session = Depends(get_db)
):
    responses = db.query(ReviewResponse).filter(
        ReviewResponse.review_id == review_id,
        ReviewResponse.is_approved == True,
        ReviewResponse.is_public == True
    ).order_by(ReviewResponse.created_at.asc()).all()
    return responses

# Endpoints para Analytics
@app.get("/analytics/entity/{entity_id}")
def get_entity_analytics(entity_id: int, entity_type: str, db: Session = Depends(get_db)):
    analytics = db.query(ReviewAnalytics).filter(
        ReviewAnalytics.entity_id == entity_id,
        ReviewAnalytics.entity_type == entity_type
    ).first()
    
    if analytics is None:
        # Calcular analytics em tempo real
        reviews = db.query(Review).filter(
            Review.entity_id == entity_id,
            Review.entity_type == entity_type,
            Review.is_approved == True
        ).all()
        
        if not reviews:
            return {
                "entity_id": entity_id,
                "entity_type": entity_type,
                "total_reviews": 0,
                "average_rating": 0.0,
                "rating_distribution": {},
                "category_ratings": {},
                "helpful_reviews_count": 0,
                "verified_reviews_count": 0
            }
        
        total_reviews = len(reviews)
        average_rating = sum(r.rating for r in reviews) / total_reviews
        
        # Distribuição de ratings
        rating_distribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        for review in reviews:
            rating_distribution[int(review.rating)] += 1
        
        # Contadores
        helpful_reviews_count = len([r for r in reviews if r.is_helpful])
        verified_reviews_count = len([r for r in reviews if r.is_verified_visit])
        
        return {
            "entity_id": entity_id,
            "entity_type": entity_type,
            "total_reviews": total_reviews,
            "average_rating": round(average_rating, 2),
            "rating_distribution": rating_distribution,
            "category_ratings": {},  # Seria calculado baseado nas categorias
            "helpful_reviews_count": helpful_reviews_count,
            "verified_reviews_count": verified_reviews_count
        }
    
    return {
        "entity_id": analytics.entity_id,
        "entity_type": analytics.entity_type,
        "total_reviews": analytics.total_reviews,
        "average_rating": analytics.average_rating,
        "rating_distribution": json.loads(analytics.rating_distribution) if analytics.rating_distribution else {},
        "category_ratings": json.loads(analytics.category_ratings) if analytics.category_ratings else {},
        "helpful_reviews_count": analytics.helpful_reviews_count,
        "verified_reviews_count": analytics.verified_reviews_count,
        "last_review_date": analytics.last_review_date
    }

def update_entity_analytics(db: Session, entity_id: int, entity_type: str):
    """Atualizar analytics de uma entidade"""
    reviews = db.query(Review).filter(
        Review.entity_id == entity_id,
        Review.entity_type == entity_type,
        Review.is_approved == True
    ).all()
    
    if not reviews:
        return
    
    total_reviews = len(reviews)
    average_rating = sum(r.rating for r in reviews) / total_reviews
    
    # Distribuição de ratings
    rating_distribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
    for review in reviews:
        rating_distribution[int(review.rating)] += 1
    
    # Contadores
    helpful_reviews_count = len([r for r in reviews if r.is_helpful])
    verified_reviews_count = len([r for r in reviews if r.is_verified_visit])
    last_review_date = max(r.created_at for r in reviews)
    
    # Buscar ou criar analytics
    analytics = db.query(ReviewAnalytics).filter(
        ReviewAnalytics.entity_id == entity_id,
        ReviewAnalytics.entity_type == entity_type
    ).first()
    
    if analytics:
        analytics.total_reviews = total_reviews
        analytics.average_rating = average_rating
        analytics.rating_distribution = json.dumps(rating_distribution)
        analytics.helpful_reviews_count = helpful_reviews_count
        analytics.verified_reviews_count = verified_reviews_count
        analytics.last_review_date = last_review_date
        analytics.updated_at = datetime.utcnow()
    else:
        analytics = ReviewAnalytics(
            entity_id=entity_id,
            entity_type=entity_type,
            total_reviews=total_reviews,
            average_rating=average_rating,
            rating_distribution=json.dumps(rating_distribution),
            helpful_reviews_count=helpful_reviews_count,
            verified_reviews_count=verified_reviews_count,
            last_review_date=last_review_date
        )
        db.add(analytics)
    
    db.commit()

# Endpoints de Estatísticas
@app.get("/stats/")
def get_stats(db: Session = Depends(get_db)):
    total_reviews = db.query(Review).filter(Review.is_approved == True).count()
    total_reports = db.query(ReviewReport).count()
    pending_reports = db.query(ReviewReport).filter(ReviewReport.status == "pending").count()
    total_responses = db.query(ReviewResponse).count()
    total_images = db.query(ReviewImage).filter(ReviewImage.is_approved == True).count()
    
    # Estatísticas por tipo de review
    review_types = db.query(Review.review_type, db.func.count(Review.id)).filter(
        Review.is_approved == True
    ).group_by(Review.review_type).all()
    
    return {
        "total_reviews": total_reviews,
        "total_reports": total_reports,
        "pending_reports": pending_reports,
        "total_responses": total_responses,
        "total_images": total_images,
        "review_types": {review_type: count for review_type, count in review_types}
    }

@app.get("/health/")
def health_check():
    return {"status": "healthy", "service": "reviews"} 