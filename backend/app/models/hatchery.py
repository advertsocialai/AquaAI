from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base


class SubscriptionPlan(str, enum.Enum):
    basic = "basic"
    standard = "standard"
    premium = "premium"


class Hatchery(Base):
    __tablename__ = "hatcheries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    contact_name = Column(String(255), nullable=True)
    contact_phone = Column(String(20), nullable=True)
    contact_email = Column(String(255), nullable=True)
    location_lat = Column(Float, nullable=True)
    location_lng = Column(Float, nullable=True)
    district = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    license_number = Column(String(100), nullable=True)
    subscription_plan = Column(Enum(SubscriptionPlan), default=SubscriptionPlan.basic)
    subscription_active = Column(Boolean, default=False)
    subscription_expires_at = Column(DateTime(timezone=True), nullable=True)
    monthly_pl_volume = Column(Integer, nullable=True)
    logo_url = Column(Text, nullable=True)
    portal_password_hash = Column(String(255), nullable=True)
    overall_qc_score = Column(Float, nullable=True)  # rolling avg quality score
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    batches = relationship("Batch", back_populates="hatchery")
