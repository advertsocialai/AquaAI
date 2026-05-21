from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Boolean, Enum, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base


class SyncStatus(str, enum.Enum):
    pending = "pending"
    synced = "synced"
    failed = "failed"


class MortalityAlert(str, enum.Enum):
    green = "green"   # < 3%
    yellow = "yellow"  # 3-5%
    red = "red"        # > 5%


class CountingSession(Base):
    __tablename__ = "counting_sessions"

    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(Integer, ForeignKey("batches.id"), nullable=False)
    vle_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # F01 + F02: Live preview & burst capture
    session_date = Column(DateTime(timezone=True), server_default=func.now())
    gps_lat = Column(Float, nullable=True)
    gps_lng = Column(Float, nullable=True)
    led_brightness = Column(Integer, default=3)
    frame_count = Column(Integer, default=3)
    image_paths = Column(JSON, default=list)

    # F03: Live vs Dead
    live_count = Column(Integer, nullable=True)
    dead_count = Column(Integer, nullable=True)
    total_count = Column(Integer, nullable=True)
    mortality_pct = Column(Float, nullable=True)
    mortality_alert = Column(Enum(MortalityAlert), nullable=True)

    # F04: Size uniformity CV analysis
    cv_pct = Column(Float, nullable=True)
    mean_length_mm = Column(Float, nullable=True)
    std_length_mm = Column(Float, nullable=True)
    cv_flag = Column(String(20), nullable=True)  # green/yellow/red

    # F06: Full batch extrapolation
    sample_volume_ml = Column(Float, nullable=True)
    total_volume_ml = Column(Float, nullable=True)
    extrapolated_count = Column(Integer, nullable=True)
    extrapolated_margin = Column(Integer, nullable=True)
    invoice_quantity = Column(Integer, nullable=True)
    invoice_discrepancy_pct = Column(Float, nullable=True)
    invoice_flag = Column(Boolean, default=False)

    # F07: Split counting
    is_split_count = Column(Boolean, default=False)
    split_sub_counts = Column(JSON, nullable=True)  # list of sub-counts
    split_mean = Column(Float, nullable=True)
    split_sd = Column(Float, nullable=True)
    split_cv = Column(Float, nullable=True)

    confidence_interval = Column(Integer, nullable=True)  # ± value

    # F08: Offline sync
    sync_status = Column(Enum(SyncStatus), default=SyncStatus.pending)
    device_id = Column(String(100), nullable=True)
    synced_at = Column(DateTime(timezone=True), nullable=True)

    batch = relationship("Batch", back_populates="counting_sessions")
    vle = relationship("User", back_populates="counting_sessions")
    certificate = relationship("QCCertificate", back_populates="counting_session", uselist=False)
