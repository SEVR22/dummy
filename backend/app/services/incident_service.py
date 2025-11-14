from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from geoalchemy2 import Geography
from app.models.incident import Incident, IncidentType
from app.models.user import User, UserRole
from app.schemas.incident import IncidentCreate, IncidentUpdate

async def create_incident(db: Session, incident_data: IncidentCreate, user_id: int):
    """Crear nuevo incidente"""
    # Crear punto geográfico
    location_point = f"POINT({incident_data.longitude} {incident_data.latitude})"
    
    db_incident = Incident(
        title=incident_data.title,
        description=incident_data.description,
        incident_type=incident_data.incident_type,
        latitude=incident_data.latitude,
        longitude=incident_data.longitude,
        location=location_point,
        address=incident_data.address,
        is_anonymous=incident_data.is_anonymous,
        severity_level=incident_data.severity_level,
        incident_datetime=incident_data.incident_datetime,
        reporter_id=None if incident_data.is_anonymous else user_id
    )
    
    db.add(db_incident)
    db.commit()
    db.refresh(db_incident)
    
    # TODO: Enviar notificaciones a usuarios cercanos
    
    return db_incident

async def get_incidents(
    db: Session,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    radius_km: Optional[float] = 10.0,
    incident_type: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
):
    """Obtener incidentes con filtros"""
    query = db.query(Incident)
    
    # Filtro por ubicación
    if latitude and longitude:
        point = f"POINT({longitude} {latitude})"
        query = query.filter(
            func.ST_DWithin(
                Incident.location,
                point,
                radius_km * 1000  # Convertir km a metros
            )
        )
    
    # Filtro por tipo de incidente
    if incident_type:
        query = query.filter(Incident.incident_type == incident_type)
    
    # Ordenar por fecha más reciente
    query = query.order_by(Incident.created_at.desc())
    
    return query.offset(skip).limit(limit).all()

async def get_incident_by_id(db: Session, incident_id: int):
    """Obtener incidente por ID con detalles"""
    return db.query(Incident).filter(Incident.id == incident_id).first()

async def update_incident(
    db: Session,
    incident_id: int,
    incident_update: IncidentUpdate,
    current_user: User
):
    """Actualizar incidente"""
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        return None
    
    # Verificar permisos
    can_update = (
        incident.reporter_id == current_user.id or
        current_user.role in [UserRole.POLICE, UserRole.ADMIN, UserRole.CIVIL_PROTECTION]
    )
    
    if not can_update:
        raise PermissionError("No tienes permisos para actualizar este incidente")
    
    # Actualizar campos
    update_data = incident_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(incident, field, value)
    
    db.commit()
    db.refresh(incident)
    
    return incident
