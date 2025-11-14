from fastapi import APIRouter
from app.api.api_v1.endpoints import auth, users, incidents, comments, notifications, media

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(incidents.router, prefix="/incidents", tags=["incidents"])
api_router.include_router(comments.router, prefix="/comments", tags=["comments"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(media.router, prefix="/media", tags=["media"])
