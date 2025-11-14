from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey, Enum, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from geoalchemy2 import Geography
import enum
from app.db.database import Base

class OfficialReportType(str, enum.Enum):
    WANTED_CRIMINAL = "wanted_criminal"
    SECURITY_ALERT = "security_alert"
    ROAD_CLOSURE = "road_closure"
    EMERGENCY_ALERT = "emergency_alert"
    PUBLIC_SAFETY = "public_safety"

class OfficialReport(Base):
    __tablename__ = "official_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    report_type = Column(Enum(OfficialReportType), nullable=False)
    
    # Ubicación (opcional para algunos tipos de reportes)
    latitude = Column(Float)
    longitude = Column(Float)
    location = Column(Geography('POINT'))
    area_description = Column(String)
    
    # Metadatos
    priority_level = Column(Integer, default=1)  # 1-5 escala
    is_active = Column(Boolean, default=True)
    expires_at = Column(DateTime(timezone=True))
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relaciones
    created_by_id = Column(Integer, ForeignKey("users.id"))
    created_by = relationship("User")
