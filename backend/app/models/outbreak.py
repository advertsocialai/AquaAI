from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Boolean, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class OutbreakAlert(Base):
    __tablename__ = "outbreak_alerts"

    id = Column(Integer, primary_key=True, index=True)
    diagnosis_session_id = Column(Integer, ForeignKey("diagnosis_sessions.id"), nullable=False)
    disease = Column(String(50), nullable=False)  # EHP / WSSV / AHPND
    severity = Column(String(20), nullable=True)

    location_lat = Column(Float, nullable=False)
    location_lng = Column(Float, nullable=False)
    district = Column(String(100), nullable=True)
    mandal = Column(String(100), nullable=True)
    radius_km = Column(Float, default=5.0)

    notified_farm_ids = Column(JSON, default=list)
    notified_vle_ids = Column(JSON, default=list)
    notified_farms_count = Column(Integer, default=0)

    alert_sent_fcm = Column(Boolean, default=False)
    alert_sent_whatsapp = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    diagnosis_session = relationship("DiagnosisSession", back_populates="outbreak_alert")
