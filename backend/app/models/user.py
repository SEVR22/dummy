from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from app.db.database import Base

class UserRole(str, enum.Enum):
    CITIZEN = "citizen"
    POLICE = "police"
    RED_CROSS = "red_cross"
    CIVIL_PROTECTION = "civil_protection"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    phone = Column(String)
    role = Column(Enum(UserRole), default=UserRole.CITIZEN)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relaciones
    incidents = relationship("Incident", back_populates="reporter")
    comments = relationship("Comment", back_populates="author")
    notifications = relationship("Notification", back_populates="user")
    
    # Amigos (relación many-to-many)
    friends = relationship(
        "User",
        secondary="friendships",
        primaryjoin="User.id==Friendship.user_id",
        secondaryjoin="User.id==Friendship.friend_id",
        back_populates="friends"
    )
