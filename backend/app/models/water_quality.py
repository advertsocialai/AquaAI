"""Water quality IoT sensor data — from EHP Blueprint doc."""
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class WaterQualityReading(Base):
    __tablename__ = "water_quality_readings"

    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=False)
    pond_id = Column(Integer, ForeignKey("ponds.id"), nullable=True)
    recorded_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    # Key water quality parameters correlated with EHP/disease
    temperature_c = Column(Float, nullable=True)
    salinity_ppt = Column(Float, nullable=True)
    ph = Column(Float, nullable=True)
    dissolved_oxygen_mgl = Column(Float, nullable=True)
    ammonia_mgl = Column(Float, nullable=True)
    nitrite_mgl = Column(Float, nullable=True)
    alkalinity_mgl = Column(Float, nullable=True)
    turbidity_ntu = Column(Float, nullable=True)

    # Source: manual / iot_sensor / lab
    source = Column(String(20), default="manual")
    sensor_id = Column(String(100), nullable=True)

    # Alert flags
    any_alert = Column(Boolean, default=False)
    alert_details = Column(String(500), nullable=True)

    recorded_at = Column(DateTime(timezone=True), server_default=func.now())
