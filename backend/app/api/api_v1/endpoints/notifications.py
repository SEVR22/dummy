from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.user import User
from app.services import auth_service

router = APIRouter()

@router.get("/")
async def get_notifications(
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener notificaciones del usuario"""
    # Implementar lógica de notificaciones
    pass

@router.put("/{notification_id}/read")
async def mark_notification_read(
    notification_id: int,
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    """Marcar notificación como leída"""
    # Implementar lógica de marcar como leída
    pass
