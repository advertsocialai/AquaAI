from sqlalchemy import Column, String, Integer, Enum, Float, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base


class UserRole(str, enum.Enum):
    farmer = "farmer"
    vle = "vle"
    hatchery_manager = "hatchery_manager"
    farm_supervisor = "farm_supervisor"
    govt_officer = "govt_officer"
    admin = "admin"


class Language(str, enum.Enum):
    english = "english"
    telugu = "telugu"
    tamil = "tamil"
    odia = "odia"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(20), unique=True, index=True, nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.farmer, nullable=False)
    language = Column(Enum(Language), default=Language.english, nullable=False)
    district = Column(String(100), nullable=True)
    mandal = Column(String(100), nullable=True)
    cluster_id = Column(String(50), nullable=True)  # VLE cluster identifier
    is_active = Column(Boolean, default=True)
    fcm_token = Column(Text, nullable=True)  # Firebase Cloud Messaging token
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    farms = relationship("Farm", back_populates="owner", foreign_keys="Farm.owner_id")
    counting_sessions = relationship("CountingSession", back_populates="vle")
    diagnosis_sessions = relationship("DiagnosisSession", back_populates="vle")
    grading_sessions = relationship("GradingSession", back_populates="vle")
