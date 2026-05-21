from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Boolean, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class QCCertificate(Base):
    __tablename__ = "qc_certificates"

    id = Column(Integer, primary_key=True, index=True)
    certificate_id = Column(String(36), unique=True, index=True, nullable=False)  # UUID
    session_type = Column(String(30), nullable=False)  # counting / diagnosis / grading

    batch_id = Column(Integer, ForeignKey("batches.id"), nullable=True)
    counting_session_id = Column(Integer, ForeignKey("counting_sessions.id"), nullable=True)
    diagnosis_session_id = Column(Integer, ForeignKey("diagnosis_sessions.id"), nullable=True)
    grading_session_id = Column(Integer, ForeignKey("grading_sessions.id"), nullable=True)

    farm_name = Column(String(255), nullable=True)
    vle_name = Column(String(255), nullable=True)
    hatchery_name = Column(String(255), nullable=True)

    composite_score = Column(Float, nullable=True)
    grade = Column(String(20), nullable=True)
    is_hard_fail = Column(Boolean, default=False)

    pdf_path = Column(Text, nullable=True)
    qr_code_path = Column(Text, nullable=True)
    hmac_hash = Column(String(64), nullable=True)  # SHA-256 HMAC
    certificate_data = Column(JSON, nullable=True)  # full data snapshot

    language = Column(String(20), default="english")
    is_valid = Column(Boolean, default=True)
    is_revoked = Column(Boolean, default=False)
    revoked_reason = Column(Text, nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    batch = relationship("Batch", back_populates="certificates")
    counting_session = relationship("CountingSession", back_populates="certificate")
    diagnosis_session = relationship("DiagnosisSession", back_populates="certificate")
    grading_session = relationship("GradingSession", back_populates="certificate")
