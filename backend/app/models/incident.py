from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from geoalchemy2 import Geography
import enum
from app.db.database import Base

class IncidentType(str, enum.Enum):
    ASSAULT = "assault"
    ROBBERY = "robbery"
    HOMICIDE = "homicide"
    ACCIDENT = "accident"
    FIRE = "fire"
    NATURAL_DISASTER = "natural_disaster"
    SUSPICIOUS_ACTIVITY = "suspicious_activity"
    OTHER = "other"

class IncidentStatus(str, enum.Enum):
    PENDING = "pending"
    VERIFIED = "verified"
    INVESTIGATING = "investigating"
    RESOLVED = "resolved"
    FALSE_REPORT = "false_report"

class Incident(Base):
    __tablename__ = "incidents"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    incident_type = Column(Enum(IncidentType), nullable=False)
    status = Column(Enum(IncidentStatus), default=IncidentStatus.PENDING)
    
    # Ubicación geográfica
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    location = Column(Geography('POINT'), nullable=False)
    address = Column(String)
    
    # Metadatos
    is_anonymous = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    severity_level = Column(Integer, default=1)  # 1-5 escala
    
    # Timestamps
    incident_datetime = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relaciones
    reporter_id = Column(Integer, ForeignKey("users.id"))
    reporter = relationship("User", back_populates="incidents")
    
    comments = relationship("Comment", back_populates="incident")
    media_files = relationship("MediaFile", back_populates="incident")
    notifications = relationship("Notification", back_populates="incident")
