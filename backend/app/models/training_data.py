"""AI model training data submissions — from AI_Model_Implementation_Guide.docx."""
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Boolean, JSON, Text
from sqlalchemy.sql import func
from app.database import Base


class TrainingDataSubmission(Base):
    """Field images submitted for model improvement (continuous learning pipeline)."""
    __tablename__ = "training_data_submissions"

    id = Column(Integer, primary_key=True, index=True)
    submitted_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    model_target = Column(String(50), nullable=False)
    # seed_counter | ehp_classifier | spore_detector | stage_classifier | visual_health

    image_path = Column(Text, nullable=False)
    ground_truth_label = Column(String(100), nullable=True)  # manual / PCR confirmed label
    ground_truth_source = Column(String(50), nullable=True)  # manual / pcr / expert
    pcr_ct_value = Column(Float, nullable=True)
    annotation_data = Column(JSON, nullable=True)  # bounding boxes or class labels

    quality_score = Column(Float, nullable=True)  # image quality 0-1
    is_approved = Column(Boolean, default=False)  # reviewed by admin
    is_used_in_training = Column(Boolean, default=False)
    training_batch_id = Column(String(50), nullable=True)

    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=True)
    gps_lat = Column(Float, nullable=True)
    gps_lng = Column(Float, nullable=True)

    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    approved_at = Column(DateTime(timezone=True), nullable=True)
