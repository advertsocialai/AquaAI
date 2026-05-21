from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Farm(Base):
    __tablename__ = "farms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    vle_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    location_lat = Column(Float, nullable=True)
    location_lng = Column(Float, nullable=True)
    district = Column(String(100), nullable=True)
    mandal = Column(String(100), nullable=True)
    village = Column(String(100), nullable=True)
    total_area_hectares = Column(Float, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="farms", foreign_keys=[owner_id])
    ponds = relationship("Pond", back_populates="farm")
    batches = relationship("Batch", back_populates="farm")


class Pond(Base):
    __tablename__ = "ponds"

    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=False)
    name = Column(String(100), nullable=False)
    area_sqm = Column(Float, nullable=True)
    depth_m = Column(Float, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    farm = relationship("Farm", back_populates="ponds")
    batches = relationship("Batch", back_populates="pond")
