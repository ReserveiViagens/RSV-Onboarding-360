from fastapi import FastAPI, HTTPException, Depends, Query, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import json
import os
import shutil

from shared.database import get_db, init_db
from shared.models.videos import (
    Video, VideoPlaylist, VideoPlaylistItem, VideoView, 
    VideoLike, VideoComment, VideoShare
)
from shared.schemas import (
    VideoCreate, Video, VideoPlaylistCreate, VideoPlaylist,
    VideoPlaylistItemCreate, VideoPlaylistItem, VideoViewCreate, VideoView,
    VideoLikeCreate, VideoLike, VideoCommentCreate, VideoComment,
    VideoShareCreate, VideoShare
)

app = FastAPI(title="Videos Service", version="1.0.0")

# Inicializar banco de dados
init_db()

@app.on_event("startup")
async def startup_event():
    init_db()
    # Criar diretório de uploads se não existir
    os.makedirs("uploads", exist_ok=True)
    os.makedirs("thumbnails", exist_ok=True)

# Endpoints para Vídeos
@app.post("/videos/upload/")
async def upload_video(
    file: UploadFile = File(...),
    title: str = Query(...),
    description: Optional[str] = Query(None),
    video_type: str = Query(...),
    category: Optional[str] = Query(None),
    tags: Optional[str] = Query(None),
    is_public: bool = Query(True),
    uploaded_by: int = Query(...),
    related_location_id: Optional[int] = Query(None),
    related_booking_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    # Validar tipo de arquivo
    allowed_formats = ['.mp4', '.avi', '.mov', '.mkv', '.wmv']
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in allowed_formats:
        raise HTTPException(status_code=400, detail="Formato de arquivo não suportado")
    
    # Salvar arquivo
    file_path = f"uploads/{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}_{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Obter tamanho do arquivo
    file_size = os.path.getsize(file_path)
    
    # Criar registro no banco
    video_data = {
        "title": title,
        "description": description,
        "file_name": file.filename,
        "file_path": file_path,
        "file_size": file_size,
        "format": file_extension[1:],
        "video_type": video_type,
        "category": category,
        "tags": tags,
        "is_public": is_public,
        "uploaded_by": uploaded_by,
        "related_location_id": related_location_id,
        "related_booking_id": related_booking_id,
        "status": "processing"
    }
    
    db_video = Video(**video_data)
    db.add(db_video)
    db.commit()
    db.refresh(db_video)
    
    return {
        "id": db_video.id,
        "title": db_video.title,
        "file_path": db_video.file_path,
        "status": db_video.status,
        "message": "Vídeo enviado com sucesso. Processamento em andamento."
    }

@app.get("/videos/", response_model=List[Video])
def get_videos(
    video_type: Optional[str] = None,
    category: Optional[str] = None,
    is_public: Optional[bool] = None,
    is_featured: Optional[bool] = None,
    uploaded_by: Optional[int] = None,
    related_location_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(Video).filter(Video.status == "active")
    
    if video_type:
        query = query.filter(Video.video_type == video_type)
    if category:
        query = query.filter(Video.category == category)
    if is_public is not None:
        query = query.filter(Video.is_public == is_public)
    if is_featured is not None:
        query = query.filter(Video.is_featured == is_featured)
    if uploaded_by:
        query = query.filter(Video.uploaded_by == uploaded_by)
    if related_location_id:
        query = query.filter(Video.related_location_id == related_location_id)
    
    videos = query.order_by(Video.created_at.desc()).offset(skip).limit(limit).all()
    return videos

@app.get("/videos/{video_id}", response_model=Video)
def get_video(video_id: int, db: Session = Depends(get_db)):
    video = db.query(Video).filter(Video.id == video_id).first()
    if video is None:
        raise HTTPException(status_code=404, detail="Vídeo não encontrado")
    return video

@app.put("/videos/{video_id}", response_model=Video)
def update_video(video_id: int, video: VideoCreate, db: Session = Depends(get_db)):
    db_video = db.query(Video).filter(Video.id == video_id).first()
    if db_video is None:
        raise HTTPException(status_code=404, detail="Vídeo não encontrado")
    
    for key, value in video.dict().items():
        if key not in ["file_name", "file_path", "file_size"]:  # Não permitir alterar arquivo
            setattr(db_video, key, value)
    
    db_video.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_video)
    return db_video

@app.delete("/videos/{video_id}")
def delete_video(video_id: int, db: Session = Depends(get_db)):
    video = db.query(Video).filter(Video.id == video_id).first()
    if video is None:
        raise HTTPException(status_code=404, detail="Vídeo não encontrado")
    
    # Marcar como deletado
    video.status = "deleted"
    video.updated_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Vídeo deletado com sucesso"}

@app.put("/videos/{video_id}/feature")
def toggle_featured(video_id: int, db: Session = Depends(get_db)):
    video = db.query(Video).filter(Video.id == video_id).first()
    if video is None:
        raise HTTPException(status_code=404, detail="Vídeo não encontrado")
    
    video.is_featured = not video.is_featured
    video.updated_at = datetime.utcnow()
    db.commit()
    
    return {"message": f"Vídeo {'destacado' if video.is_featured else 'removido dos destaques'}"}

# Endpoints para Playlists
@app.post("/playlists/", response_model=VideoPlaylist)
def create_playlist(playlist: VideoPlaylistCreate, db: Session = Depends(get_db)):
    db_playlist = VideoPlaylist(**playlist.dict())
    db.add(db_playlist)
    db.commit()
    db.refresh(db_playlist)
    return db_playlist

@app.get("/playlists/", response_model=List[VideoPlaylist])
def get_playlists(
    playlist_type: Optional[str] = None,
    is_public: Optional[bool] = None,
    is_featured: Optional[bool] = None,
    created_by: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(VideoPlaylist)
    
    if playlist_type:
        query = query.filter(VideoPlaylist.playlist_type == playlist_type)
    if is_public is not None:
        query = query.filter(VideoPlaylist.is_public == is_public)
    if is_featured is not None:
        query = query.filter(VideoPlaylist.is_featured == is_featured)
    if created_by:
        query = query.filter(VideoPlaylist.created_by == created_by)
    
    playlists = query.order_by(VideoPlaylist.created_at.desc()).offset(skip).limit(limit).all()
    return playlists

@app.get("/playlists/{playlist_id}", response_model=VideoPlaylist)
def get_playlist(playlist_id: int, db: Session = Depends(get_db)):
    playlist = db.query(VideoPlaylist).filter(VideoPlaylist.id == playlist_id).first()
    if playlist is None:
        raise HTTPException(status_code=404, detail="Playlist não encontrada")
    return playlist

@app.post("/playlists/{playlist_id}/videos")
def add_video_to_playlist(
    playlist_id: int,
    video_id: int,
    position: Optional[int] = None,
    added_by: int = Query(...),
    db: Session = Depends(get_db)
):
    # Verificar se playlist existe
    playlist = db.query(VideoPlaylist).filter(VideoPlaylist.id == playlist_id).first()
    if playlist is None:
        raise HTTPException(status_code=404, detail="Playlist não encontrada")
    
    # Verificar se vídeo existe
    video = db.query(Video).filter(Video.id == video_id).first()
    if video is None:
        raise HTTPException(status_code=404, detail="Vídeo não encontrado")
    
    # Se posição não especificada, adicionar no final
    if position is None:
        last_item = db.query(VideoPlaylistItem).filter(
            VideoPlaylistItem.playlist_id == playlist_id
        ).order_by(VideoPlaylistItem.position.desc()).first()
        position = (last_item.position + 1) if last_item else 1
    
    # Verificar se vídeo já está na playlist
    existing_item = db.query(VideoPlaylistItem).filter(
        VideoPlaylistItem.playlist_id == playlist_id,
        VideoPlaylistItem.video_id == video_id
    ).first()
    
    if existing_item:
        raise HTTPException(status_code=400, detail="Vídeo já está na playlist")
    
    playlist_item = VideoPlaylistItem(
        playlist_id=playlist_id,
        video_id=video_id,
        position=position,
        added_by=added_by
    )
    db.add(playlist_item)
    db.commit()
    
    return {"message": "Vídeo adicionado à playlist com sucesso"}

@app.get("/playlists/{playlist_id}/videos")
def get_playlist_videos(playlist_id: int, db: Session = Depends(get_db)):
    playlist = db.query(VideoPlaylist).filter(VideoPlaylist.id == playlist_id).first()
    if playlist is None:
        raise HTTPException(status_code=404, detail="Playlist não encontrada")
    
    playlist_items = db.query(VideoPlaylistItem).filter(
        VideoPlaylistItem.playlist_id == playlist_id
    ).order_by(VideoPlaylistItem.position).all()
    
    videos = []
    for item in playlist_items:
        video = db.query(Video).filter(Video.id == item.video_id).first()
        if video and video.status == "active":
            videos.append({
                "id": video.id,
                "title": video.title,
                "description": video.description,
                "thumbnail_path": video.thumbnail_path,
                "duration_seconds": video.duration_seconds,
                "view_count": video.view_count,
                "position": item.position
            })
    
    return {
        "playlist_id": playlist_id,
        "playlist_name": playlist.name,
        "videos": videos,
        "total_videos": len(videos)
    }

# Endpoints para Visualizações
@app.post("/videos/{video_id}/view")
def record_video_view(
    video_id: int,
    view: VideoViewCreate,
    db: Session = Depends(get_db)
):
    # Verificar se vídeo existe
    video = db.query(Video).filter(Video.id == video_id).first()
    if video is None:
        raise HTTPException(status_code=404, detail="Vídeo não encontrado")
    
    # Criar registro de visualização
    view_data = view.dict()
    view_data["video_id"] = video_id
    
    db_view = VideoView(**view_data)
    db.add(db_view)
    
    # Incrementar contador de visualizações
    video.view_count += 1
    
    db.commit()
    
    return {"message": "Visualização registrada com sucesso"}

@app.get("/videos/{video_id}/views")
def get_video_views(video_id: int, db: Session = Depends(get_db)):
    views = db.query(VideoView).filter(VideoView.video_id == video_id).all()
    
    total_views = len(views)
    completed_views = len([v for v in views if v.is_completed])
    unique_viewers = len(set(v.user_id for v in views if v.user_id))
    
    return {
        "video_id": video_id,
        "total_views": total_views,
        "completed_views": completed_views,
        "unique_viewers": unique_viewers,
        "completion_rate": (completed_views / total_views * 100) if total_views > 0 else 0
    }

# Endpoints para Likes/Dislikes
@app.post("/videos/{video_id}/like")
def like_video(
    video_id: int,
    user_id: int,
    like_type: str = "like",
    db: Session = Depends(get_db)
):
    # Verificar se vídeo existe
    video = db.query(Video).filter(Video.id == video_id).first()
    if video is None:
        raise HTTPException(status_code=404, detail="Vídeo não encontrado")
    
    # Verificar se já existe like/dislike do usuário
    existing_like = db.query(VideoLike).filter(
        VideoLike.video_id == video_id,
        VideoLike.user_id == user_id
    ).first()
    
    if existing_like:
        if existing_like.like_type == like_type:
            # Remover like/dislike se for o mesmo tipo
            db.delete(existing_like)
            if like_type == "like":
                video.like_count -= 1
            else:
                video.dislike_count -= 1
        else:
            # Alterar tipo de like/dislike
            if existing_like.like_type == "like":
                video.like_count -= 1
                video.dislike_count += 1
            else:
                video.like_count += 1
                video.dislike_count -= 1
            existing_like.like_type = like_type
    else:
        # Criar novo like/dislike
        new_like = VideoLike(
            video_id=video_id,
            user_id=user_id,
            like_type=like_type
        )
        db.add(new_like)
        if like_type == "like":
            video.like_count += 1
        else:
            video.dislike_count += 1
    
    db.commit()
    
    return {"message": f"{like_type.capitalize()} registrado com sucesso"}

# Endpoints para Comentários
@app.post("/videos/{video_id}/comments", response_model=VideoComment)
def create_comment(
    video_id: int,
    comment: VideoCommentCreate,
    db: Session = Depends(get_db)
):
    # Verificar se vídeo existe
    video = db.query(Video).filter(Video.id == video_id).first()
    if video is None:
        raise HTTPException(status_code=404, detail="Vídeo não encontrado")
    
    comment_data = comment.dict()
    comment_data["video_id"] = video_id
    
    db_comment = VideoComment(**comment_data)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@app.get("/videos/{video_id}/comments", response_model=List[VideoComment])
def get_video_comments(
    video_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    comments = db.query(VideoComment).filter(
        VideoComment.video_id == video_id,
        VideoComment.is_approved == True,
        VideoComment.parent_comment_id == None  # Apenas comentários principais
    ).order_by(VideoComment.created_at.desc()).offset(skip).limit(limit).all()
    return comments

@app.get("/comments/{comment_id}/replies", response_model=List[VideoComment])
def get_comment_replies(
    comment_id: int,
    db: Session = Depends(get_db)
):
    replies = db.query(VideoComment).filter(
        VideoComment.parent_comment_id == comment_id,
        VideoComment.is_approved == True
    ).order_by(VideoComment.created_at.asc()).all()
    return replies

# Endpoints para Compartilhamentos
@app.post("/videos/{video_id}/share", response_model=VideoShare)
def share_video(
    video_id: int,
    share: VideoShareCreate,
    db: Session = Depends(get_db)
):
    # Verificar se vídeo existe
    video = db.query(Video).filter(Video.id == video_id).first()
    if video is None:
        raise HTTPException(status_code=404, detail="Vídeo não encontrado")
    
    share_data = share.dict()
    share_data["video_id"] = video_id
    
    db_share = VideoShare(**share_data)
    db.add(db_share)
    db.commit()
    db.refresh(db_share)
    return db_share

# Endpoints de Estatísticas
@app.get("/stats/")
def get_stats(db: Session = Depends(get_db)):
    total_videos = db.query(Video).filter(Video.status == "active").count()
    total_playlists = db.query(VideoPlaylist).count()
    total_views = db.query(VideoView).count()
    total_likes = db.query(VideoLike).filter(VideoLike.like_type == "like").count()
    total_comments = db.query(VideoComment).filter(VideoComment.is_approved == True).count()
    total_shares = db.query(VideoShare).count()
    
    # Vídeos mais populares
    popular_videos = db.query(Video).filter(
        Video.status == "active"
    ).order_by(Video.view_count.desc()).limit(5).all()
    
    return {
        "total_videos": total_videos,
        "total_playlists": total_playlists,
        "total_views": total_views,
        "total_likes": total_likes,
        "total_comments": total_comments,
        "total_shares": total_shares,
        "popular_videos": [
            {
                "id": video.id,
                "title": video.title,
                "view_count": video.view_count,
                "like_count": video.like_count
            } for video in popular_videos
        ]
    }

@app.get("/health/")
def health_check():
    return {"status": "healthy", "service": "videos"} 