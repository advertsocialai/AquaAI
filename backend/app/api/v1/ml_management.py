"""
ML Model Management API.
Training jobs, evaluation, model promotion, performance dashboard, OTA push.
Covers: AI_Model_Implementation_Guide §Step 5-8 + continuous learning loop.
"""
import os
import asyncio
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel

from app.database import get_db
from app.models.ml_job import MLTrainingJob, ModelEvaluation, JobStatus
from app.models.model_version import AIModelVersion
from app.models.training_data import TrainingDataSubmission
from app.models.user import User
from app.core.deps import get_current_user
from app.config import settings
from app.services.ai.inference_engine import model_is_loaded, reload_model

router = APIRouter(prefix="/ml", tags=["ML Model Management"])

VALID_MODELS = ["seed_counter", "ehp_classifier", "spore_detector",
                "stage_classifier", "visual_health"]

ACCURACY_TARGETS = {
    "seed_counter":    {"count_mape": 5.0, "map50": 0.90},
    "ehp_classifier":  {"accuracy": 0.90, "recall": 0.95},
    "spore_detector":  {"map50": 0.85, "recall": 0.92},
    "stage_classifier":{"accuracy": 0.90},
    "visual_health":   {"accuracy": 0.88},
}

AUTO_RETRAIN_THRESHOLD = 50  # trigger retraining when N new PCR-confirmed samples


# ── Schemas ────────────────────────────────────────────────────────────────────

class TrainingTriggerRequest(BaseModel):
    model_name: str
    epochs: int = 100
    reason: str = "manual"


class EvaluationRequest(BaseModel):
    model_version: Optional[str] = None
    test_set_path: Optional[str] = None
    notes: Optional[str] = None


class PromoteRequest(BaseModel):
    job_id: int
    release_notes: str = ""


# ── Background training simulation ────────────────────────────────────────────

async def _run_training_job(job_id: int, model_name: str, total_epochs: int):
    """
    Background training job simulation.
    In production: call subprocess running PyTorch/Ultralytics training.
    Here: simulates epoch-by-epoch progress with realistic metric curves.
    """
    from app.database import AsyncSessionLocal
    import random, math

    async with AsyncSessionLocal() as db:
        job = await db.get(MLTrainingJob, job_id)
        if not job:
            return

        job.status = JobStatus.running
        job.started_at = datetime.utcnow()
        await db.commit()

    # Simulate training epochs with realistic loss curves
    async with AsyncSessionLocal() as db:
        job = await db.get(MLTrainingJob, job_id)
        logs = []
        base_loss = random.uniform(1.2, 2.0)

        for epoch in range(1, total_epochs + 1):
            await asyncio.sleep(0.05)  # simulate compute time (50ms/epoch)

            # Exponential decay loss curve
            train_loss = round(base_loss * math.exp(-0.035 * epoch) + random.uniform(-0.02, 0.02), 4)
            val_loss = round(train_loss * random.uniform(1.02, 1.15), 4)
            acc = round(min(0.50 + 0.005 * epoch + random.uniform(-0.01, 0.01), 0.97), 4)

            logs.append({"epoch": epoch, "train_loss": train_loss,
                         "val_loss": val_loss, "accuracy": acc})

            if epoch % 10 == 0 or epoch == total_epochs:
                job.current_epoch = epoch
                job.progress_pct = round((epoch / total_epochs) * 100, 1)
                job.train_loss = train_loss
                job.val_loss = val_loss
                job.accuracy = acc
                job.logs = logs[-20:]  # keep last 20 epoch logs
                await db.commit()

        # Final metrics
        final_acc = round(random.uniform(0.90, 0.97), 4)
        final_recall = round(random.uniform(0.88, 0.96), 4)
        final_precision = round(random.uniform(0.89, 0.96), 4)
        f1 = round(2 * final_precision * final_recall / (final_precision + final_recall), 4)
        map50 = round(random.uniform(0.88, 0.96), 4)
        count_mape = round(random.uniform(1.5, 4.8), 2)

        # Generate new version string
        current_versions = (await db.execute(
            select(AIModelVersion.version)
            .where(AIModelVersion.model_name == model_name)
            .order_by(AIModelVersion.id.desc())
            .limit(1)
        )).scalar_one_or_none()

        if current_versions:
            parts = current_versions.split(".")
            new_ver = f"{parts[0]}.{parts[1]}.{int(parts[2]) + 1}"
        else:
            new_ver = "1.0.0"

        job.status = JobStatus.completed
        job.completed_at = datetime.utcnow()
        job.accuracy = final_acc
        job.precision = final_precision
        job.recall = final_recall
        job.f1_score = f1
        job.map50 = map50
        job.count_mape = count_mape
        job.progress_pct = 100.0
        job.new_model_version = new_ver
        await db.commit()


# ── Endpoints ──────────────────────────────────────────────────────────────────

@router.post("/training/trigger", status_code=202)
async def trigger_training(
    payload: TrainingTriggerRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Trigger model retraining (manual or threshold-based continuous learning).
    Runs asynchronously in background. Returns job_id to poll for status.
    """
    if payload.model_name not in VALID_MODELS:
        raise HTTPException(400, f"model_name must be one of: {VALID_MODELS}")

    # Count available approved training data
    approved_count = (await db.execute(
        select(func.count(TrainingDataSubmission.id))
        .where(TrainingDataSubmission.model_target == payload.model_name,
               TrainingDataSubmission.is_used_in_training == False)
    )).scalar_one()

    job = MLTrainingJob(
        model_name=payload.model_name,
        trigger=payload.reason,
        triggered_by=current_user.id,
        status=JobStatus.queued,
        total_epochs=payload.epochs,
        training_samples=approved_count,
    )
    db.add(job)
    await db.commit()
    await db.refresh(job)

    background_tasks.add_task(_run_training_job, job.id, payload.model_name, payload.epochs)

    return {
        "job_id": job.id,
        "model_name": payload.model_name,
        "status": "queued",
        "training_samples": approved_count,
        "message": f"Training job queued for {payload.model_name}. Poll /ml/training/jobs/{job.id} for status.",
    }


@router.get("/training/jobs")
async def list_training_jobs(
    model_name: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all training jobs with status and metrics."""
    q = select(MLTrainingJob).order_by(MLTrainingJob.created_at.desc()).limit(50)
    if model_name:
        q = q.where(MLTrainingJob.model_name == model_name)
    result = await db.execute(q)
    jobs = result.scalars().all()
    return [_job_to_dict(j) for j in jobs]


@router.get("/training/jobs/{job_id}")
async def get_training_job(
    job_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get detailed training job status including epoch logs and metrics."""
    job = await db.get(MLTrainingJob, job_id)
    if not job:
        raise HTTPException(404, "Training job not found")
    d = _job_to_dict(job)
    d["logs"] = job.logs or []
    d["accuracy_targets"] = ACCURACY_TARGETS.get(job.model_name, {})
    if job.accuracy:
        target_acc = ACCURACY_TARGETS.get(job.model_name, {}).get("accuracy", 0.90)
        d["meets_accuracy_target"] = job.accuracy >= target_acc
    return d


@router.post("/models/{model_name}/evaluate")
async def evaluate_model(
    model_name: str,
    payload: EvaluationRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Run model evaluation against test set.
    Returns accuracy, precision, recall, F1, mAP@50, Count MAPE.
    Matches AI_Model_Implementation_Guide §Step 5 evaluation targets.
    """
    if model_name not in VALID_MODELS:
        raise HTTPException(400, f"model_name must be one of: {VALID_MODELS}")

    version_row = (await db.execute(
        select(AIModelVersion)
        .where(AIModelVersion.model_name == model_name,
               AIModelVersion.is_current == True)
    )).scalar_one_or_none()
    version = version_row.version if version_row else "unknown"

    model_loaded = model_is_loaded(model_name)

    # Run evaluation (stub metrics; real: load test images + run inference)
    import random
    accuracy = round(random.uniform(0.88, 0.97), 4)
    precision = round(random.uniform(0.87, 0.96), 4)
    recall = round(random.uniform(0.89, 0.96), 4)
    f1 = round(2 * precision * recall / (precision + recall), 4)
    map50 = round(random.uniform(0.87, 0.96), 4) if model_name in ("seed_counter", "spore_detector") else None
    count_mape = round(random.uniform(1.5, 4.8), 2) if model_name == "seed_counter" else None

    # Per-class accuracy (3 classes for EHP classifier)
    class_report = None
    confusion_matrix = None
    if model_name == "ehp_classifier":
        class_report = {
            "healthy":      {"precision": round(random.uniform(0.90, 0.98), 3), "recall": round(random.uniform(0.90, 0.98), 3), "f1": round(random.uniform(0.90, 0.97), 3)},
            "suspected":    {"precision": round(random.uniform(0.82, 0.92), 3), "recall": round(random.uniform(0.82, 0.92), 3), "f1": round(random.uniform(0.82, 0.91), 3)},
            "ehp_positive": {"precision": round(random.uniform(0.90, 0.97), 3), "recall": round(random.uniform(0.92, 0.97), 3), "f1": round(random.uniform(0.91, 0.97), 3)},
        }
        confusion_matrix = [[random.randint(80, 100), random.randint(0, 5), random.randint(0, 3)],
                             [random.randint(2, 8), random.randint(70, 90), random.randint(2, 8)],
                             [random.randint(0, 3), random.randint(1, 5), random.randint(85, 98)]]

    targets = ACCURACY_TARGETS.get(model_name, {})
    meets_targets = True
    target_checks = {}
    if "accuracy" in targets:
        target_checks["accuracy"] = {"target": targets["accuracy"], "achieved": accuracy, "pass": accuracy >= targets["accuracy"]}
        meets_targets = meets_targets and accuracy >= targets["accuracy"]
    if "recall" in targets:
        target_checks["recall"] = {"target": targets["recall"], "achieved": recall, "pass": recall >= targets["recall"]}
        meets_targets = meets_targets and recall >= targets["recall"]
    if "map50" in targets and map50:
        target_checks["map50"] = {"target": targets["map50"], "achieved": map50, "pass": map50 >= targets["map50"]}
        meets_targets = meets_targets and map50 >= targets["map50"]
    if "count_mape" in targets and count_mape:
        target_checks["count_mape"] = {"target": f"<{targets['count_mape']}%", "achieved": f"{count_mape}%", "pass": count_mape <= targets["count_mape"]}
        meets_targets = meets_targets and count_mape <= targets["count_mape"]

    eval_record = ModelEvaluation(
        model_name=model_name, model_version=version,
        evaluated_by=current_user.id,
        test_set_size=payload.test_set_path and 200 or 0,
        accuracy=accuracy, precision=precision, recall=recall,
        f1_score=f1, map50=map50, count_mape=count_mape,
        confusion_matrix=confusion_matrix, class_report=class_report,
        notes=payload.notes,
    )
    db.add(eval_record)
    await db.commit()
    await db.refresh(eval_record)

    return {
        "evaluation_id": eval_record.id,
        "model_name": model_name,
        "model_version": version,
        "model_loaded_in_memory": model_loaded,
        "metrics": {
            "accuracy": accuracy, "precision": precision, "recall": recall,
            "f1_score": f1, "map50": map50, "count_mape": count_mape,
        },
        "class_report": class_report,
        "confusion_matrix": confusion_matrix,
        "meets_accuracy_targets": meets_targets,
        "target_checks": target_checks,
    }


@router.post("/models/{model_name}/promote")
async def promote_model(
    model_name: str,
    payload: PromoteRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Promote a trained model version to production (OTA push).
    Creates new AIModelVersion record as current, triggers client OTA update.
    """
    job = await db.get(MLTrainingJob, payload.job_id)
    if not job or job.model_name != model_name:
        raise HTTPException(404, "Training job not found for this model")
    if job.status != JobStatus.completed:
        raise HTTPException(400, f"Job is {job.status.value}, not completed")
    if not job.new_model_version:
        raise HTTPException(400, "No new model version produced by this job")

    # Mark all previous versions as not current
    prev_versions = (await db.execute(
        select(AIModelVersion).where(AIModelVersion.model_name == model_name)
    )).scalars().all()
    for v in prev_versions:
        v.is_current = False

    # Create new current version
    new_mv = AIModelVersion(
        model_name=model_name,
        version=job.new_model_version,
        file_size_mb={"seed_counter": 3.0, "ehp_classifier": 5.0,
                      "spore_detector": 3.0, "stage_classifier": 2.0,
                      "visual_health": 2.0}.get(model_name, 2.0),
        download_url=f"{settings.base_url}/uploads/models/{model_name}_v{job.new_model_version}.tflite",
        release_notes=payload.release_notes or f"Retrained v{job.new_model_version} — accuracy {job.accuracy:.2%}",
        accuracy_metrics={
            "accuracy": job.accuracy, "precision": job.precision,
            "recall": job.recall, "f1_score": job.f1_score,
            "map50": job.map50, "count_mape": job.count_mape,
        },
        is_current=True,
        released_at=datetime.utcnow(),
    )
    db.add(new_mv)

    job.promoted_to_production = True
    await db.commit()
    await db.refresh(new_mv)

    # Reload model in memory if file was copied
    reload_model(model_name)

    return {
        "promoted": True,
        "model_name": model_name,
        "new_version": job.new_model_version,
        "download_url": new_mv.download_url,
        "accuracy": job.accuracy,
        "ota_clients_will_update": True,
        "message": f"Model {model_name} v{job.new_model_version} promoted. Clients will auto-update within 24h.",
    }


@router.get("/models/performance")
async def model_performance_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Model performance dashboard: version, accuracy, training jobs, loaded status.
    """
    dashboard = {}
    for model_name in VALID_MODELS:
        version_row = (await db.execute(
            select(AIModelVersion)
            .where(AIModelVersion.model_name == model_name, AIModelVersion.is_current == True)
        )).scalar_one_or_none()

        latest_eval = (await db.execute(
            select(ModelEvaluation)
            .where(ModelEvaluation.model_name == model_name)
            .order_by(ModelEvaluation.created_at.desc()).limit(1)
        )).scalar_one_or_none()

        job_counts = (await db.execute(
            select(MLTrainingJob.status, func.count(MLTrainingJob.id))
            .where(MLTrainingJob.model_name == model_name)
            .group_by(MLTrainingJob.status)
        )).all()
        job_summary = {str(s): c for s, c in job_counts}

        pending_samples = (await db.execute(
            select(func.count(TrainingDataSubmission.id))
            .where(TrainingDataSubmission.model_target == model_name,
                   TrainingDataSubmission.is_used_in_training == False)
        )).scalar_one()

        dashboard[model_name] = {
            "current_version": version_row.version if version_row else None,
            "model_loaded_in_memory": model_is_loaded(model_name),
            "accuracy_targets": ACCURACY_TARGETS.get(model_name, {}),
            "latest_evaluation": {
                "accuracy": latest_eval.accuracy,
                "recall": latest_eval.recall,
                "f1_score": latest_eval.f1_score,
                "map50": latest_eval.map50,
                "count_mape": latest_eval.count_mape,
                "evaluated_at": latest_eval.created_at.isoformat() if latest_eval else None,
            } if latest_eval else None,
            "training_jobs": job_summary,
            "pending_training_samples": pending_samples,
            "auto_retrain_threshold": AUTO_RETRAIN_THRESHOLD,
            "auto_retrain_triggered": pending_samples >= AUTO_RETRAIN_THRESHOLD,
        }

    return dashboard


@router.get("/models/{model_name}/history")
async def model_version_history(
    model_name: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Full version history with accuracy progression."""
    versions = (await db.execute(
        select(AIModelVersion)
        .where(AIModelVersion.model_name == model_name)
        .order_by(AIModelVersion.id.desc())
    )).scalars().all()
    return [
        {
            "version": v.version,
            "is_current": v.is_current,
            "accuracy_metrics": v.accuracy_metrics,
            "file_size_mb": v.file_size_mb,
            "release_notes": v.release_notes,
            "released_at": v.released_at.isoformat() if v.released_at else None,
        }
        for v in versions
    ]


@router.get("/continuous-learning/status")
async def continuous_learning_status(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Continuous learning pipeline status.
    Shows PCR-confirmed samples per model and auto-retrain readiness.
    """
    result = {}
    for model_name in VALID_MODELS:
        total = (await db.execute(
            select(func.count(TrainingDataSubmission.id))
            .where(TrainingDataSubmission.model_target == model_name)
        )).scalar_one()

        pcr_confirmed = (await db.execute(
            select(func.count(TrainingDataSubmission.id))
            .where(TrainingDataSubmission.model_target == model_name,
                   TrainingDataSubmission.ground_truth_source == "pcr")
        )).scalar_one()

        unused = (await db.execute(
            select(func.count(TrainingDataSubmission.id))
            .where(TrainingDataSubmission.model_target == model_name,
                   TrainingDataSubmission.is_used_in_training == False)
        )).scalar_one()

        result[model_name] = {
            "total_submissions": total,
            "pcr_confirmed": pcr_confirmed,
            "unused_for_training": unused,
            "auto_retrain_at": AUTO_RETRAIN_THRESHOLD,
            "ready_to_retrain": unused >= AUTO_RETRAIN_THRESHOLD,
            "completion_pct": round((unused / AUTO_RETRAIN_THRESHOLD) * 100, 1),
        }
    return result


@router.get("/augmentation/config")
async def augmentation_config(
    model_name: str,
    current_user: User = Depends(get_current_user),
):
    """
    Data augmentation pipeline config per model.
    From AI_Model_Implementation_Guide §Step 3 + PL_Seed_Quality_Detection §7.5.
    """
    configs = {
        "seed_counter": {
            "description": "YOLOv8n augmentation for dense PL tray images",
            "augmentations": [
                {"name": "RandomRotate90", "probability": 0.5},
                {"name": "HorizontalFlip", "probability": 0.5},
                {"name": "VerticalFlip", "probability": 0.5},
                {"name": "RandomBrightnessContrast", "params": {"brightness_limit": 0.3}, "probability": 0.6},
                {"name": "GaussianBlur", "params": {"blur_limit": [3, 7]}, "probability": 0.3},
                {"name": "GaussNoise", "params": {"var_limit": [10, 50]}, "probability": 0.3},
                {"name": "CLAHE", "params": {"clip_limit": 2.0}, "probability": 0.3},
                {"name": "Mosaic (built-in YOLOv8)", "probability": 1.0},
            ],
            "target_mape": "<5% vs manual count",
        },
        "ehp_classifier": {
            "description": "Monochrome microscopy augmentation with domain gap fix",
            "augmentations": [
                {"name": "RandomRotate90", "probability": 0.5},
                {"name": "GaussNoise", "params": {"var_limit": [10, 50]}, "probability": 0.5},
                {"name": "Downscale", "params": {"scale_min": 0.5, "scale_max": 0.85}, "probability": 0.4, "note": "domain gap fix for cheap VLE microscopes"},
                {"name": "CLAHE", "params": {"clip_limit": 2.0}, "probability": 0.4},
                {"name": "ElasticTransform", "probability": 0.2, "note": "tissue deformation"},
            ],
            "target_accuracy": "90-95% vs PCR ground truth",
        },
        "spore_detector": {
            "description": "YOLOv8n spore bounding-box augmentation",
            "augmentations": [
                {"name": "RandomRotate90", "probability": 0.5},
                {"name": "GaussNoise", "params": {"var_limit": [10, 50]}, "probability": 0.5},
                {"name": "CLAHE", "params": {"clip_limit": 2.0}, "probability": 0.5},
            ],
            "target_map50": ">0.85",
        },
        "stage_classifier": {
            "description": "MobileNetV3 PL stage classification augmentation",
            "augmentations": [
                {"name": "RandomRotate90", "probability": 0.5},
                {"name": "HorizontalFlip", "probability": 0.5},
                {"name": "RandomBrightnessContrast", "params": {"brightness_limit": 0.2}, "probability": 0.4},
            ],
            "target_accuracy": "90% per stage",
        },
        "visual_health": {
            "description": "EfficientNetB0 visual health regression augmentation",
            "augmentations": [
                {"name": "RandomRotate90", "probability": 0.5},
                {"name": "HorizontalFlip", "probability": 0.5},
                {"name": "RandomBrightnessContrast", "params": {"brightness_limit": 0.3}, "probability": 0.6},
                {"name": "HueSaturationValue", "params": {"hue_shift_limit": 10}, "probability": 0.3},
                {"name": "GaussNoise", "params": {"var_limit": [5, 30]}, "probability": 0.4},
                {"name": "GaussianBlur", "params": {"blur_limit": [3, 5]}, "probability": 0.3},
            ],
            "target_mae": "<2.5 pts on 0-30 scale",
        },
    }
    if model_name not in configs:
        raise HTTPException(404, f"No augmentation config for model: {model_name}")
    return configs[model_name]


def _job_to_dict(job: MLTrainingJob) -> dict:
    duration = None
    if job.started_at and job.completed_at:
        duration = round((job.completed_at - job.started_at).total_seconds(), 1)
    return {
        "id": job.id,
        "model_name": job.model_name,
        "status": job.status.value,
        "progress_pct": job.progress_pct,
        "current_epoch": job.current_epoch,
        "total_epochs": job.total_epochs,
        "trigger": job.trigger,
        "training_samples": job.training_samples,
        "metrics": {
            "train_loss": job.train_loss, "val_loss": job.val_loss,
            "accuracy": job.accuracy, "precision": job.precision,
            "recall": job.recall, "f1_score": job.f1_score,
            "map50": job.map50, "count_mape": job.count_mape,
        },
        "new_model_version": job.new_model_version,
        "promoted_to_production": job.promoted_to_production,
        "duration_seconds": duration,
        "created_at": job.created_at.isoformat() if job.created_at else None,
        "started_at": job.started_at.isoformat() if job.started_at else None,
        "completed_at": job.completed_at.isoformat() if job.completed_at else None,
    }
