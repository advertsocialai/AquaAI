from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Boolean, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base


class PLStage(str, enum.Enum):
    PL5 = "PL5"
    PL8 = "PL8"
    PL10 = "PL10"
    PL12 = "PL12"
    PL15_PLUS = "PL15+"


class Batch(Base):
    __tablename__ = "batches"

    id = Column(Integer, primary_key=True, index=True)
    batch_code = Column(String(100), unique=True, index=True, nullable=False)
    hatchery_id = Column(Integer, ForeignKey("hatcheries.id"), nullable=False)
    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=False)
    pond_id = Column(Integer, ForeignKey("ponds.id"), nullable=True)

    ordered_pl_stage = Column(Enum(PLStage), nullable=True)
    ordered_quantity = Column(Integer, nullable=True)
    invoice_number = Column(String(100), nullable=True)
    invoice_quantity = Column(Integer, nullable=True)
    dispatch_date = Column(DateTime(timezone=True), nullable=True)
    received_date = Column(DateTime(timezone=True), nullable=True)

    notes = Column(Text, nullable=True)
    is_stocked = Column(Boolean, default=False)
    stocked_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    hatchery = relationship("Hatchery", back_populates="batches")
    farm = relationship("Farm", back_populates="batches")
    pond = relationship("Pond", back_populates="batches")
    counting_sessions = relationship("CountingSession", back_populates="batch")
    diagnosis_sessions = relationship("DiagnosisSession", back_populates="batch")
    grading_sessions = relationship("GradingSession", back_populates="batch")
    certificates = relationship("QCCertificate", back_populates="batch")
