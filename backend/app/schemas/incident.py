from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
from app.models.incident import IncidentType, IncidentStatus

class IncidentBase(BaseModel):
    title: str
    description: str
    incident_type: IncidentType
    latitude: float
    longitude: float
    address: Optional[str] = None
    is_anonymous: bool = False
    severity_level: int = 1

class IncidentCreate(IncidentBase):
    incident_datetime: datetime

class IncidentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[IncidentStatus] = None
    severity_level: Optional[int] = None

class IncidentInDBBase(IncidentBase):
    id: int
    status: IncidentStatus
    is_verified: bool
    incident_datetime: datetime
    created_at: datetime
    reporter_id: Optional[int] = None
    
    class Config:
        from_attributes = True

class Incident(IncidentInDBBase):
    pass

class IncidentWithDetails(IncidentInDBBase):
    comments: List["Comment"] = []
    media_files: List["MediaFile"] = []
