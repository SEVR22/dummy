from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from app.db.database import Base

class NotificationType(str, enum.Enum):
    INCIDENT_NEARBY = "incident_nearby"
    FRIEND_INCIDENT = "friend_incident"
    OFFICIAL_ALERT = "official_alert"
    COMMENT_REPLY = "comment_reply"
    SYSTEM = "system"

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(Enum(NotificationType), nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relaciones
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="notifications")
    
    incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=True)
    incident = relationship("Incident", back_populates="notifications")
