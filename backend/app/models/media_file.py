from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from app.db.database import Base

class MediaType(str, enum.Enum):
    IMAGE = "image"
    AUDIO = "audio"
    VIDEO = "video"

class MediaFile(Base):
    __tablename__ = "media_files"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    media_type = Column(Enum(MediaType), nullable=False)
    mime_type = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relaciones
    incident_id = Column(Integer, ForeignKey("incidents.id"))
    incident = relationship("Incident", back_populates="media_files")
