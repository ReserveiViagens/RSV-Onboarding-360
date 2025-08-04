from fastapi import FastAPI, HTTPException, Depends, Query, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import json
import os
import shutil
from PIL import Image

from shared.database import get_db, init_db
from shared.models.photos import (
    Photo, PhotoAlbum, PhotoAlbumItem, PhotoView, 
    PhotoLike, PhotoComment, PhotoDownload, PhotoShare
)
from shared.schemas import (
    PhotoCreate, Photo, PhotoAlbumCreate, PhotoAlbum,
    PhotoAlbumItemCreate, PhotoAlbumItem, PhotoViewCreate, PhotoView,
    PhotoLikeCreate, PhotoLike, PhotoCommentCreate, PhotoComment,
    PhotoDownloadCreate, PhotoDownload, PhotoShareCreate, PhotoShare
)

app = FastAPI(title="Photos Service", version="1.0.0")

# Inicializar banco de dados
init_db()

@app.on_event("startup")
async def startup_event():
    init_db()
    # Criar diretórios se não existirem
    os.makedirs("uploads", exist_ok=True)
    os.makedirs("thumbnails", exist_ok=True)
    os.makedirs("medium", exist_ok=True)
    os.makedirs("large", exist_ok=True)

# Helper function para criar thumbnails
def create_thumbnails(file_path: str, filename: str):
    """Criar versões em diferentes tamanhos da imagem"""
    try:
        with Image.open(file_path) as img:
            # Thumbnail (150x150)
            thumb = img.copy()
            thumb.thumbnail((150, 150))
            thumb_path = f"thumbnails/{filename}"
            thumb.save(thumb_path, quality=85)
            
            # Medium (800x800)
            medium = img.copy()
            medium.thumbnail((800, 800))
            medium_path = f"medium/{filename}"
            medium.save(medium_path, quality=90)
            
            # Large (1920x1920)
            large = img.copy()
            large.thumbnail((1920, 1920))
            large_path = f"large/{filename}"
            large.save(large_path, quality=95)
            
            return {
                "thumbnail": thumb_path,
                "medium": medium_path,
                "large": large_path
            }
    except Exception as e:
        print(f"Erro ao criar thumbnails: {e}")
        return None

# Endpoints para Fotos
@app.post("/photos/upload/")
async def upload_photo(
    file: UploadFile = File(...),
    title: str = Query(...),
    description: Optional[str] = Query(None),
    photo_type: str = Query(...),
    category: Optional[str] = Query(None),
    tags: Optional[str] = Query(None),
    is_public: bool = Query(True),
    uploaded_by: int = Query(...),
    related_location_id: Optional[int] = Query(None),
    related_booking_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    # Validar tipo de arquivo
    allowed_formats = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in allowed_formats:
        raise HTTPException(status_code=400, detail="Formato de arquivo não suportado")
    
    # Salvar arquivo original
    file_path = f"uploads/{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}_{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Obter informações da imagem
    try:
        with Image.open(file_path) as img:
            width, height = img.size
            format = img.format.lower()
    except Exception as e:
        raise HTTPException(status_code=400, detail="Arquivo de imagem inválido")
    
    # Obter tamanho do arquivo
    file_size = os.path.getsize(file_path)
    
    # Criar thumbnails
    thumbnails = create_thumbnails(file_path, os.path.basename(file_path))
    
    # Criar registro no banco
    photo_data = {
        "title": title,
        "description": description,
        "file_name": file.filename,
        "file_path": file_path,
        "file_size": file_size,
        "width": width,
        "height": height,
        "format": format,
        "photo_type": photo_type,
        "category": category,
        "tags": tags,
        "is_public": is_public,
        "uploaded_by": uploaded_by,
        "related_location_id": related_location_id,
        "related_booking_id": related_booking_id
    }
    
    db_photo = Photo(**photo_data)
    db.add(db_photo)
    db.commit()
    db.refresh(db_photo)
    
    return {
        "id": db_photo.id,
        "title": db_photo.title,
        "file_path": db_photo.file_path,
        "thumbnails": thumbnails,
        "message": "Foto enviada com sucesso"
    }

@app.get("/photos/", response_model=List[Photo])
def get_photos(
    photo_type: Optional[str] = None,
    category: Optional[str] = None,
    is_public: Optional[bool] = None,
    is_featured: Optional[bool] = None,
    uploaded_by: Optional[int] = None,
    related_location_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(Photo).filter(Photo.is_approved == True)
    
    if photo_type:
        query = query.filter(Photo.photo_type == photo_type)
    if category:
        query = query.filter(Photo.category == category)
    if is_public is not None:
        query = query.filter(Photo.is_public == is_public)
    if is_featured is not None:
        query = query.filter(Photo.is_featured == is_featured)
    if uploaded_by:
        query = query.filter(Photo.uploaded_by == uploaded_by)
    if related_location_id:
        query = query.filter(Photo.related_location_id == related_location_id)
    
    photos = query.order_by(Photo.created_at.desc()).offset(skip).limit(limit).all()
    return photos

@app.get("/photos/{photo_id}", response_model=Photo)
def get_photo(photo_id: int, db: Session = Depends(get_db)):
    photo = db.query(Photo).filter(Photo.id == photo_id).first()
    if photo is None:
        raise HTTPException(status_code=404, detail="Foto não encontrada")
    return photo

@app.put("/photos/{photo_id}", response_model=Photo)
def update_photo(photo_id: int, photo: PhotoCreate, db: Session = Depends(get_db)):
    db_photo = db.query(Photo).filter(Photo.id == photo_id).first()
    if db_photo is None:
        raise HTTPException(status_code=404, detail="Foto não encontrada")
    
    for key, value in photo.dict().items():
        if key not in ["file_name", "file_path", "file_size", "width", "height", "format"]:
            setattr(db_photo, key, value)
    
    db_photo.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_photo)
    return db_photo

@app.delete("/photos/{photo_id}")
def delete_photo(photo_id: int, db: Session = Depends(get_db)):
    photo = db.query(Photo).filter(Photo.id == photo_id).first()
    if photo is None:
        raise HTTPException(status_code=404, detail="Foto não encontrada")
    
    # Marcar como não aprovada (soft delete)
    photo.is_approved = False
    photo.updated_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Foto deletada com sucesso"}

@app.put("/photos/{photo_id}/feature")
def toggle_featured(photo_id: int, db: Session = Depends(get_db)):
    photo = db.query(Photo).filter(Photo.id == photo_id).first()
    if photo is None:
        raise HTTPException(status_code=404, detail="Foto não encontrada")
    
    photo.is_featured = not photo.is_featured
    photo.updated_at = datetime.utcnow()
    db.commit()
    
    return {"message": f"Foto {'destacada' if photo.is_featured else 'removida dos destaques'}"}

# Endpoints para Álbuns
@app.post("/albums/", response_model=PhotoAlbum)
def create_album(album: PhotoAlbumCreate, db: Session = Depends(get_db)):
    db_album = PhotoAlbum(**album.dict())
    db.add(db_album)
    db.commit()
    db.refresh(db_album)
    return db_album

@app.get("/albums/", response_model=List[PhotoAlbum])
def get_albums(
    album_type: Optional[str] = None,
    is_public: Optional[bool] = None,
    is_featured: Optional[bool] = None,
    created_by: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(PhotoAlbum)
    
    if album_type:
        query = query.filter(PhotoAlbum.album_type == album_type)
    if is_public is not None:
        query = query.filter(PhotoAlbum.is_public == is_public)
    if is_featured is not None:
        query = query.filter(PhotoAlbum.is_featured == is_featured)
    if created_by:
        query = query.filter(PhotoAlbum.created_by == created_by)
    
    albums = query.order_by(PhotoAlbum.created_at.desc()).offset(skip).limit(limit).all()
    return albums

@app.get("/albums/{album_id}", response_model=PhotoAlbum)
def get_album(album_id: int, db: Session = Depends(get_db)):
    album = db.query(PhotoAlbum).filter(PhotoAlbum.id == album_id).first()
    if album is None:
        raise HTTPException(status_code=404, detail="Álbum não encontrado")
    return album

@app.post("/albums/{album_id}/photos")
def add_photo_to_album(
    album_id: int,
    photo_id: int,
    position: Optional[int] = None,
    added_by: int = Query(...),
    db: Session = Depends(get_db)
):
    # Verificar se álbum existe
    album = db.query(PhotoAlbum).filter(PhotoAlbum.id == album_id).first()
    if album is None:
        raise HTTPException(status_code=404, detail="Álbum não encontrado")
    
    # Verificar se foto existe
    photo = db.query(Photo).filter(Photo.id == photo_id).first()
    if photo is None:
        raise HTTPException(status_code=404, detail="Foto não encontrada")
    
    # Se posição não especificada, adicionar no final
    if position is None:
        last_item = db.query(PhotoAlbumItem).filter(
            PhotoAlbumItem.album_id == album_id
        ).order_by(PhotoAlbumItem.position.desc()).first()
        position = (last_item.position + 1) if last_item else 1
    
    # Verificar se foto já está no álbum
    existing_item = db.query(PhotoAlbumItem).filter(
        PhotoAlbumItem.album_id == album_id,
        PhotoAlbumItem.photo_id == photo_id
    ).first()
    
    if existing_item:
        raise HTTPException(status_code=400, detail="Foto já está no álbum")
    
    album_item = PhotoAlbumItem(
        album_id=album_id,
        photo_id=photo_id,
        position=position,
        added_by=added_by
    )
    db.add(album_item)
    db.commit()
    
    return {"message": "Foto adicionada ao álbum com sucesso"}

@app.get("/albums/{album_id}/photos")
def get_album_photos(album_id: int, db: Session = Depends(get_db)):
    album = db.query(PhotoAlbum).filter(PhotoAlbum.id == album_id).first()
    if album is None:
        raise HTTPException(status_code=404, detail="Álbum não encontrado")
    
    album_items = db.query(PhotoAlbumItem).filter(
        PhotoAlbumItem.album_id == album_id
    ).order_by(PhotoAlbumItem.position).all()
    
    photos = []
    for item in album_items:
        photo = db.query(Photo).filter(Photo.id == item.photo_id).first()
        if photo and photo.is_approved:
            photos.append({
                "id": photo.id,
                "title": photo.title,
                "description": photo.description,
                "file_path": photo.file_path,
                "width": photo.width,
                "height": photo.height,
                "view_count": photo.view_count,
                "like_count": photo.like_count,
                "position": item.position
            })
    
    return {
        "album_id": album_id,
        "album_name": album.name,
        "photos": photos,
        "total_photos": len(photos)
    }

# Endpoints para Visualizações
@app.post("/photos/{photo_id}/view")
def record_photo_view(
    photo_id: int,
    view: PhotoViewCreate,
    db: Session = Depends(get_db)
):
    # Verificar se foto existe
    photo = db.query(Photo).filter(Photo.id == photo_id).first()
    if photo is None:
        raise HTTPException(status_code=404, detail="Foto não encontrada")
    
    # Criar registro de visualização
    view_data = view.dict()
    view_data["photo_id"] = photo_id
    
    db_view = PhotoView(**view_data)
    db.add(db_view)
    
    # Incrementar contador de visualizações
    photo.view_count += 1
    
    db.commit()
    
    return {"message": "Visualização registrada com sucesso"}

# Endpoints para Likes
@app.post("/photos/{photo_id}/like")
def like_photo(
    photo_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):
    # Verificar se foto existe
    photo = db.query(Photo).filter(Photo.id == photo_id).first()
    if photo is None:
        raise HTTPException(status_code=404, detail="Foto não encontrada")
    
    # Verificar se já existe like do usuário
    existing_like = db.query(PhotoLike).filter(
        PhotoLike.photo_id == photo_id,
        PhotoLike.user_id == user_id
    ).first()
    
    if existing_like:
        # Remover like
        db.delete(existing_like)
        photo.like_count -= 1
        message = "Like removido"
    else:
        # Adicionar like
        new_like = PhotoLike(
            photo_id=photo_id,
            user_id=user_id
        )
        db.add(new_like)
        photo.like_count += 1
        message = "Like adicionado"
    
    db.commit()
    
    return {"message": message}

# Endpoints para Comentários
@app.post("/photos/{photo_id}/comments", response_model=PhotoComment)
def create_comment(
    photo_id: int,
    comment: PhotoCommentCreate,
    db: Session = Depends(get_db)
):
    # Verificar se foto existe
    photo = db.query(Photo).filter(Photo.id == photo_id).first()
    if photo is None:
        raise HTTPException(status_code=404, detail="Foto não encontrada")
    
    comment_data = comment.dict()
    comment_data["photo_id"] = photo_id
    
    db_comment = PhotoComment(**comment_data)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@app.get("/photos/{photo_id}/comments", response_model=List[PhotoComment])
def get_photo_comments(
    photo_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    comments = db.query(PhotoComment).filter(
        PhotoComment.photo_id == photo_id,
        PhotoComment.is_approved == True,
        PhotoComment.parent_comment_id == None
    ).order_by(PhotoComment.created_at.desc()).offset(skip).limit(limit).all()
    return comments

# Endpoints para Downloads
@app.post("/photos/{photo_id}/download")
def record_photo_download(
    photo_id: int,
    download: PhotoDownloadCreate,
    db: Session = Depends(get_db)
):
    # Verificar se foto existe
    photo = db.query(Photo).filter(Photo.id == photo_id).first()
    if photo is None:
        raise HTTPException(status_code=404, detail="Foto não encontrada")
    
    download_data = download.dict()
    download_data["photo_id"] = photo_id
    
    db_download = PhotoDownload(**download_data)
    db.add(db_download)
    
    # Incrementar contador de downloads
    photo.download_count += 1
    
    db.commit()
    
    return {"message": "Download registrado com sucesso"}

@app.get("/photos/{photo_id}/download/{size}")
def get_photo_download_url(photo_id: int, size: str, db: Session = Depends(get_db)):
    photo = db.query(Photo).filter(Photo.id == photo_id).first()
    if photo is None:
        raise HTTPException(status_code=404, detail="Foto não encontrada")
    
    # Determinar caminho baseado no tamanho solicitado
    if size == "thumbnail":
        file_path = f"thumbnails/{os.path.basename(photo.file_path)}"
    elif size == "medium":
        file_path = f"medium/{os.path.basename(photo.file_path)}"
    elif size == "large":
        file_path = f"large/{os.path.basename(photo.file_path)}"
    else:
        file_path = photo.file_path  # Original
    
    if not os.path.exists(file_path):
        file_path = photo.file_path  # Fallback para original
    
    return {
        "photo_id": photo_id,
        "size": size,
        "file_path": file_path,
        "download_url": f"/download/{file_path}"
    }

# Endpoints para Compartilhamentos
@app.post("/photos/{photo_id}/share", response_model=PhotoShare)
def share_photo(
    photo_id: int,
    share: PhotoShareCreate,
    db: Session = Depends(get_db)
):
    # Verificar se foto existe
    photo = db.query(Photo).filter(Photo.id == photo_id).first()
    if photo is None:
        raise HTTPException(status_code=404, detail="Foto não encontrada")
    
    share_data = share.dict()
    share_data["photo_id"] = photo_id
    
    db_share = PhotoShare(**share_data)
    db.add(db_share)
    db.commit()
    db.refresh(db_share)
    return db_share

# Endpoints de Estatísticas
@app.get("/stats/")
def get_stats(db: Session = Depends(get_db)):
    total_photos = db.query(Photo).filter(Photo.is_approved == True).count()
    total_albums = db.query(PhotoAlbum).count()
    total_views = db.query(PhotoView).count()
    total_likes = db.query(PhotoLike).count()
    total_comments = db.query(PhotoComment).filter(PhotoComment.is_approved == True).count()
    total_downloads = db.query(PhotoDownload).count()
    total_shares = db.query(PhotoShare).count()
    
    # Fotos mais populares
    popular_photos = db.query(Photo).filter(
        Photo.is_approved == True
    ).order_by(Photo.view_count.desc()).limit(5).all()
    
    return {
        "total_photos": total_photos,
        "total_albums": total_albums,
        "total_views": total_views,
        "total_likes": total_likes,
        "total_comments": total_comments,
        "total_downloads": total_downloads,
        "total_shares": total_shares,
        "popular_photos": [
            {
                "id": photo.id,
                "title": photo.title,
                "view_count": photo.view_count,
                "like_count": photo.like_count
            } for photo in popular_photos
        ]
    }

@app.get("/health/")
def health_check():
    return {"status": "healthy", "service": "photos"} 