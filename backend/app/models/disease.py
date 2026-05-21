from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Boolean, Enum, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base


class RiskLevel(str, enum.Enum):
    green = "green"        # ehp_prob < 0.55
    yellow = "yellow"      # 0.55 - 0.85
    red = "red"            # > 0.85 (HARD FAIL)
    grey = "grey"          # inconclusive


class SporeSeverity(str, enum.Enum):
    low = "low"        # 1-5 spores
    moderate = "moderate"  # 6-20 spores
    high = "high"      # >20 spores


class DiagnosisSession(Base):
    __tablename__ = "diagnosis_sessions"

    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(Integer, ForeignKey("batches.id"), nullable=False)
    vle_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    session_date = Column(DateTime(timezone=True), server_default=func.now())
    gps_lat = Column(Float, nullable=True)
    gps_lng = Column(Float, nullable=True)
    image_paths = Column(JSON, default=list)

    # F09: Camera mode used
    camera_mode = Column(String(20), default="software_mono")  # software_mono / usb_mono

    # F10: EHP primary detection (EfficientNetB0)
    ehp_prob = Column(Float, nullable=True)
    ehp_healthy_prob = Column(Float, nullable=True)
    ehp_suspected_prob = Column(Float, nullable=True)
    ehp_positive_prob = Column(Float, nullable=True)

    # F11: EHP spore bounding box (YOLOv8)
    spore_detected = Column(Boolean, default=False)
    spore_count = Column(Integer, nullable=True)
    spore_severity = Column(Enum(SporeSeverity), nullable=True)
    spore_boxes = Column(JSON, nullable=True)  # list of {x,y,w,h,conf}

    # F12: Multi-disease screening
    wssv_positive = Column(Boolean, default=False)
    wssv_confidence = Column(Float, nullable=True)
    ahpnd_prob = Column(Float, nullable=True)
    bgd_prob = Column(Float, nullable=True)
    hpv_prob = Column(Float, nullable=True)
    gregarines_prob = Column(Float, nullable=True)
    wfs_prob = Column(Float, nullable=True)  # White Feces Syndrome

    # F13: Hard fail
    is_hard_fail = Column(Boolean, default=False)
    hard_fail_disease = Column(String(50), nullable=True)

    # F14: Grad-CAM
    gradcam_available = Column(Boolean, default=False)
    gradcam_image_path = Column(Text, nullable=True)

    # F15: Risk display
    risk_level = Column(Enum(RiskLevel), nullable=True)
    risk_action_text = Column(Text, nullable=True)

    # F08 style sync
    sync_status = Column(String(20), default="pending")
    device_id = Column(String(100), nullable=True)
    synced_at = Column(DateTime(timezone=True), nullable=True)

    batch = relationship("Batch", back_populates="diagnosis_sessions")
    vle = relationship("User", back_populates="diagnosis_sessions")
    pcr_feedback = relationship("PCRFeedback", back_populates="diagnosis_session", uselist=False)
    outbreak_alert = relationship("OutbreakAlert", back_populates="diagnosis_session", uselist=False)
    certificate = relationship("QCCertificate", back_populates="diagnosis_session", uselist=False)


class PCRFeedback(Base):
    __tablename__ = "pcr_feedback"

    id = Column(Integer, primary_key=True, index=True)
    diagnosis_session_id = Column(Integer, ForeignKey("diagnosis_sessions.id"), nullable=False)
    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # F16: PCR result
    pcr_result = Column(String(20), nullable=False)  # positive / negative
    ct_value = Column(Float, nullable=True)
    lab_name = Column(String(255), nullable=True)
    feedback_date = Column(DateTime(timezone=True), server_default=func.now())

    ai_was_correct = Column(Boolean, nullable=True)
    used_in_training = Column(Boolean, default=False)
    training_priority = Column(String(20), default="normal")  # normal / high

    diagnosis_session = relationship("DiagnosisSession", back_populates="pcr_feedback")
