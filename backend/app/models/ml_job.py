from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, JSON, Enum as SAEnum
from sqlalchemy.sql import func
from app.database import Base
import enum


class JobStatus(str, enum.Enum):
    queued = "queued"
    running = "running"
    completed = "completed"
    failed = "failed"
    cancelled = "cancelled"


class MLTrainingJob(Base):
    __tablename__ = "ml_training_jobs"

    id = Column(Integer, primary_key=True)
    model_name = Column(String, nullable=False)   # seed_counter | ehp_classifier | etc.
    trigger = Column(String, default="manual")     # manual | scheduled | threshold
    triggered_by = Column(Integer, nullable=True)  # user_id

    status = Column(SAEnum(JobStatus), default=JobStatus.queued)
    progress_pct = Column(Float, default=0.0)
    current_epoch = Column(Integer, default=0)
    total_epochs = Column(Integer, default=100)

    training_samples = Column(Integer, nullable=True)
    validation_samples = Column(Integer, nullable=True)
    test_samples = Column(Integer, nullable=True)

    # Metrics populated after training
    train_loss = Column(Float, nullable=True)
    val_loss = Column(Float, nullable=True)
    accuracy = Column(Float, nullable=True)
    precision = Column(Float, nullable=True)
    recall = Column(Float, nullable=True)
    f1_score = Column(Float, nullable=True)
    map50 = Column(Float, nullable=True)       # YOLO mAP@50
    count_mape = Column(Float, nullable=True)  # seed counter MAPE

    new_model_version = Column(String, nullable=True)
    promoted_to_production = Column(Boolean, default=False)

    error_message = Column(String, nullable=True)
    logs = Column(JSON, default=list)

    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ModelEvaluation(Base):
    __tablename__ = "model_evaluations"

    id = Column(Integer, primary_key=True)
    model_name = Column(String, nullable=False)
    model_version = Column(String, nullable=False)
    evaluated_by = Column(Integer, nullable=True)

    test_set_size = Column(Integer, nullable=True)
    accuracy = Column(Float, nullable=True)
    precision = Column(Float, nullable=True)
    recall = Column(Float, nullable=True)
    f1_score = Column(Float, nullable=True)
    map50 = Column(Float, nullable=True)
    count_mape = Column(Float, nullable=True)
    confusion_matrix = Column(JSON, nullable=True)
    class_report = Column(JSON, nullable=True)

    notes = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
