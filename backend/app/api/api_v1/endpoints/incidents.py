from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.incident import Incident, IncidentCreate, IncidentUpdate, IncidentWithDetails
from app.schemas.user import User
from app.services import incident_service, auth_service

router = APIRouter()

@router.post("/", response_model=Incident)
async def create_incident(
    incident_data: IncidentCreate,
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    """Crear nuevo reporte de incidente"""
    return await incident_service.create_incident(db, incident_data, current_user.id)

@router.get("/", response_model=List[Incident])
async def get_incidents(
    latitude: Optional[float] = Query(None),
    longitude: Optional[float] = Query(None),
    radius_km: Optional[float] = Query(10.0),
    incident_type: Optional[str] = Query(None),
    skip: int = Query(0),
    limit: int = Query(100),
    db: Session = Depends(get_db)
):
    """Obtener incidentes con filtros opcionales"""
    return await incident_service.get_incidents(
        db, latitude, longitude, radius_km, incident_type, skip, limit
    )

@router.get("/{incident_id}", response_model=IncidentWithDetails)
async def get_incident(
    incident_id: int,
    db: Session = Depends(get_db)
):
    """Obtener detalles de un incidente específico"""
    return await incident_service.get_incident_by_id(db, incident_id)

@router.put("/{incident_id}", response_model=Incident)
async def update_incident(
    incident_id: int,
    incident_update: IncidentUpdate,
    current_user: User = Depends(auth_service.get_current_user),
    db: Session = Depends(get_db)
):
    """Actualizar incidente (solo el reportero o autoridades)"""
    return await incident_service.update_incident(db, incident_id, incident_update, current_user)
