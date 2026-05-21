from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Boolean, Enum, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base


class QualityGrade(str, enum.Enum):
    premium = "PREMIUM"       # 85-100
    good = "GOOD"             # 70-84
    conditional = "CONDITIONAL"  # 55-69
    caution = "CAUTION"       # 40-54
    reject = "REJECT"         # < 40 or hard-fail


class GradingSession(Base):
    __tablename__ = "grading_sessions"

    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(Integer, ForeignKey("batches.id"), nullable=False)
    vle_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    session_date = Column(DateTime(timezone=True), server_default=func.now())
    gps_lat = Column(Float, nullable=True)
    gps_lng = Column(Float, nullable=True)
    image_paths = Column(JSON, default=list)
    total_session_minutes = Column(Float, nullable=True)

    # F17: Composite Quality Score
    composite_score = Column(Float, nullable=True)  # 0-100
    composite_grade = Column(Enum(QualityGrade), nullable=True)
    is_hard_fail = Column(Boolean, default=False)
    hard_fail_reason = Column(String(100), nullable=True)

    # F18: Visual Health Assessment (EfficientNetB0 regression, 0-30 pts)
    visual_health_score = Column(Float, nullable=True)
    body_colour_score = Column(Float, nullable=True)   # 0-7
    gut_visibility_score = Column(Float, nullable=True)  # 0-5
    tail_muscle_score = Column(Float, nullable=True)   # 0-6
    appendage_score = Column(Float, nullable=True)     # 0-4
    posture_score = Column(Float, nullable=True)       # 0-4
    activity_score_visual = Column(Float, nullable=True)  # 0-4

    # F19: PL Stage Identification (MobileNetV3)
    detected_pl_stage = Column(String(10), nullable=True)
    stage_confidence = Column(Float, nullable=True)
    stage_score = Column(Float, nullable=True)  # 0-15
    stage_mismatch = Column(Boolean, default=False)
    stage_mismatch_levels = Column(Integer, default=0)

    # Size uniformity score from M1 CV analysis (0-20 pts)
    size_uniformity_score = Column(Float, nullable=True)
    cv_pct = Column(Float, nullable=True)

    # Disease score from M2 (0-25 pts)
    disease_score = Column(Float, nullable=True)

    # F20: Size histogram data
    size_histogram_data = Column(JSON, nullable=True)  # {lengths: [], frequencies: []}
    size_histogram_image_path = Column(Text, nullable=True)

    # Activity/Behaviour score (0-10 pts)
    activity_score = Column(Float, nullable=True)

    # F21: Stocking density recommendation
    planned_density_per_sqm = Column(Float, nullable=True)
    recommended_density_pct = Column(Float, nullable=True)
    recommended_density_per_sqm = Column(Float, nullable=True)
    stocking_recommendation = Column(Text, nullable=True)

    # F22: Mismatch alert
    count_mismatch = Column(Boolean, default=False)
    count_discrepancy_pct = Column(Float, nullable=True)
    mismatch_evidence_path = Column(Text, nullable=True)

    sync_status = Column(String(20), default="pending")
    device_id = Column(String(100), nullable=True)
    synced_at = Column(DateTime(timezone=True), nullable=True)

    batch = relationship("Batch", back_populates="grading_sessions")
    vle = relationship("User", back_populates="grading_sessions")
    certificate = relationship("QCCertificate", back_populates="grading_session", uselist=False)
