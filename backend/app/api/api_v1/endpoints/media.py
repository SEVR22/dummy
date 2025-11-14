from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.user import User
from app.services import auth_service

router = APIRouter()

@router.post("/upload/{incident_id}")
async def upload_media(
    incident_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    """Subir archivo multimedia a un incidente"""
    # Implementar lógica de subida de archivos
    pass

@router.get("/{media_id}")
async def get_media(
    media_id: int,
    db: Session = Depends(get_db)
):
    """Obtener archivo multimedia"""
    # Implementar lógica de descarga de archivos
    pass
