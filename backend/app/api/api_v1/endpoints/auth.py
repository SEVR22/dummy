from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.auth import Token, LoginRequest
from app.schemas.user import UserCreate, User
from app.services import auth_service

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/register", response_model=User)
async def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """Registrar nuevo usuario"""
    return await auth_service.register_user(db, user_data)

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Iniciar sesión"""
    return await auth_service.authenticate_user(db, form_data.username, form_data.password)

@router.post("/refresh", response_model=Token)
async def refresh_token(
    current_user: User = Depends(auth_service.get_current_user)
):
    """Refrescar token de acceso"""
    return await auth_service.create_access_token(current_user.id)
