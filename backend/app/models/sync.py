from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from app.database import Base


class SyncQueue(Base):
    __tablename__ = "sync_queue"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String(100), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    session_type = Column(String(30), nullable=False)  # counting / diagnosis / grading
    session_data = Column(JSON, nullable=False)
    status = Column(String(20), default="pending")  # pending / processing / synced / failed
    retry_count = Column(Integer, default=0)
    error_message = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    synced_at = Column(DateTime(timezone=True), nullable=True)
