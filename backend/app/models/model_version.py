from sqlalchemy import Column, String, Integer, Float, DateTime, Boolean, JSON, Text
from sqlalchemy.sql import func
from app.database import Base


class AIModelVersion(Base):
    __tablename__ = "ai_model_versions"

    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String(50), nullable=False, index=True)
    # seed_counter | ehp_classifier | spore_detector | stage_classifier | visual_health
    version = Column(String(20), nullable=False)
    file_name = Column(String(255), nullable=True)
    file_size_mb = Column(Float, nullable=True)
    download_url = Column(Text, nullable=True)
    release_notes = Column(Text, nullable=True)
    accuracy_metrics = Column(JSON, nullable=True)
    is_current = Column(Boolean, default=False)
    released_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
