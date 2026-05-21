"""AI model training data pipeline — from AI_Model_Implementation_Guide.docx."""
import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
from datetime import datetime
from app.database import get_db
from app.models.training_data import TrainingDataSubmission
from app.models.user import User
from app.core.deps import get_current_user
from app.config import settings

router = APIRouter(prefix="/training-data", tags=["AI Training Data Pipeline"])

MODEL_TARGETS = ["seed_counter", "ehp_classifier", "spore_detector", "stage_classifier", "visual_health"]


@router.post("/submit", status_code=201)
async def submit_training_image(
    model_target: str = Form(...),
    ground_truth_label: Optional[str] = Form(None),
    ground_truth_source: str = Form("manual"),  # manual / pcr / expert
    pcr_ct_value: Optional[float] = Form(None),
    farm_id: Optional[int] = Form(None),
    gps_lat: Optional[float] = Form(None),
    gps_lng: Optional[float] = Form(None),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Submit a field image for model training (continuous learning pipeline).
    From AI_Model_Implementation_Guide: PCR-confirmed images are highest priority.
    """
    if model_target not in MODEL_TARGETS:
        raise HTTPException(400, f"model_target must be one of: {MODEL_TARGETS}")

    upload_path = os.path.join(settings.upload_dir, "training", model_target)
    os.makedirs(upload_path, exist_ok=True)
    filename = f"{datetime.utcnow().timestamp()}_{file.filename}"
    file_path = os.path.join(upload_path, filename)
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    submission = TrainingDataSubmission(
        submitted_by=current_user.id,
        model_target=model_target,
        image_path=file_path,
        ground_truth_label=ground_truth_label,
        ground_truth_source=ground_truth_source,
        pcr_ct_value=pcr_ct_value,
        farm_id=farm_id,
        gps_lat=gps_lat,
        gps_lng=gps_lng,
    )
    db.add(submission)
    await db.commit()
    await db.refresh(submission)
    return {
        "id": submission.id,
        "model_target": model_target,
        "status": "submitted",
        "message": "Image submitted for training review. Thank you for contributing to model improvement!",
        "pcr_priority": ground_truth_source == "pcr",
    }


@router.get("/stats")
async def training_data_stats(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Stats on training data pipeline — how many images per model, approved vs pending."""
    result = await db.execute(
        select(
            TrainingDataSubmission.model_target,
            func.count(TrainingDataSubmission.id).label("total"),
            func.count(TrainingDataSubmission.id).filter(TrainingDataSubmission.is_approved == True).label("approved"),
            func.count(TrainingDataSubmission.id).filter(TrainingDataSubmission.is_used_in_training == True).label("trained"),
            func.count(TrainingDataSubmission.id).filter(TrainingDataSubmission.ground_truth_source == "pcr").label("pcr_confirmed"),
        ).group_by(TrainingDataSubmission.model_target)
    )
    return [
        {"model": r.model_target, "total": r.total, "approved": r.approved,
         "used_in_training": r.trained, "pcr_confirmed": r.pcr_confirmed}
        for r in result.all()
    ]


@router.get("/pending")
async def list_pending_submissions(
    model_target: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Admin: list submissions awaiting approval for training."""
    q = select(TrainingDataSubmission).where(TrainingDataSubmission.is_approved == False)
    if model_target:
        q = q.where(TrainingDataSubmission.model_target == model_target)
    result = await db.execute(q.order_by(TrainingDataSubmission.submitted_at.desc()).limit(50))
    return result.scalars().all()


@router.patch("/{submission_id}/approve")
async def approve_submission(
    submission_id: int,
    annotation_data: dict = {},
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Admin: approve a training image submission."""
    sub = await db.get(TrainingDataSubmission, submission_id)
    if not sub:
        raise HTTPException(404)
    sub.is_approved = True
    sub.approved_at = datetime.utcnow()
    if annotation_data:
        sub.annotation_data = annotation_data
    await db.commit()
    return {"id": sub.id, "approved": True}
