from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.user import User, UserUpdate
from app.services import user_service, auth_service

router = APIRouter()

@router.get("/me", response_model=User)
async def get_current_user(
    current_user: User = Depends(auth_service.get_current_user)
):
    """Obtener información del usuario actual"""
    return current_user

@router.put("/me", response_model=User)
async def update_current_user(
    user_update: UserUpdate,
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    """Actualizar información del usuario actual"""
    return await user_service.update_user(db, current_user.id, user_update)

@router.post("/friends/{friend_id}")
async def send_friend_request(
    friend_id: int,
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    """Enviar solicitud de amistad"""
    return await user_service.send_friend_request(db, current_user.id, friend_id)

@router.get("/friends", response_model=List[User])
async def get_friends(
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener lista de amigos"""
    return await user_service.get_friends(db, current_user.id)
