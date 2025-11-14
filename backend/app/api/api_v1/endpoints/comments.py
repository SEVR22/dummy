from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.user import User
from app.services import auth_service

router = APIRouter()

@router.post("/incidents/{incident_id}/comments")
async def create_comment(
    incident_id: int,
    content: str,
    is_anonymous: bool = False,
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    """Crear comentario en un incidente"""
    # Implementar lógica de comentarios
    pass

@router.get("/incidents/{incident_id}/comments")
async def get_comments(
    incident_id: int,
    db: Session = Depends(get_db)
):
    """Obtener comentarios de un incidente"""
    # Implementar lógica de obtener comentarios
    pass
