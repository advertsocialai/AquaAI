"""M1 — Seed Counter (F01-F08): All 8 features."""
import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from datetime import datetime
from app.database import get_db
from app.models.seed_counter import CountingSession
from app.models.batch import Batch
from app.models.user import User
from app.core.deps import get_current_user
from app.schemas.seed_counter import CountingSessionCreate, ExtrapolationRequest, SplitCountRequest, CountingResult
from app.services.ai.seed_counter import (
    run_seed_counter_inference, compute_extrapolation, compute_split_count
)
from app.services.certificate_service import create_certificate
from app.config import settings

router = APIRouter(prefix="/seed-counter", tags=["M1 — Seed Counter"])


@router.post("/upload-image")
async def upload_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    """Upload a capture image for a counting session (F01/F02)."""
    upload_path = os.path.join(settings.upload_dir, "images")
    os.makedirs(upload_path, exist_ok=True)
    filename = f"{datetime.utcnow().timestamp()}_{file.filename}"
    file_path = os.path.join(upload_path, filename)
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)
    return {"path": file_path, "url": f"{settings.base_url}/uploads/images/{filename}"}


@router.post("/scan")
async def scan_seeds(
    file: UploadFile = File(...),
    save: bool = Form(False),
):
    """
    F01: Camera scanner — single-frame seed count with per-seed bounding boxes.
    Returns normalised box coordinates (0-1) so the client can overlay the count
    visualisation on the captured image. Uses OpenCV blob detection.
    Public stateless endpoint — no auth required (no DB write unless save=true).
    """
    content = await file.read()
    if not content:
        raise HTTPException(400, "Empty image file")

    from app.services.ai.blob_detector import count_seeds_from_image
    result = count_seeds_from_image(content)
    if result is None:
        raise HTTPException(422, "Could not process image — capture a clearer, well-lit photo")

    saved_url = None
    if save:
        scan_dir = os.path.join(settings.upload_dir, "scans")
        os.makedirs(scan_dir, exist_ok=True)
        filename = f"{datetime.utcnow().timestamp()}_{file.filename or 'scan.jpg'}"
        fp = os.path.join(scan_dir, filename)
        with open(fp, "wb") as f:
            f.write(content)
        saved_url = f"{settings.base_url}/uploads/scans/{filename}"

    boxes = result.get("bounding_boxes", [])
    live, dead, debris = result["live"], result["dead"], result["debris"]
    total = live + dead

    return {
        "live_count":        live,
        "dead_count":        dead,
        "debris_count":      debris,
        "total_count":       total,
        "survival_rate_pct": round(live / total * 100, 2) if total else 0.0,
        "mean_length_mm":    result.get("mean_length_mm"),
        "cv_pct":            result.get("cv_pct"),
        "model_used":        result.get("detection_method", "opencv_blob"),
        "image_url":         saved_url,
        "boxes": [
            {
                "cx": b["cx"], "cy": b["cy"], "w": b["w"], "h": b["h"],
                "class_name": b["class_name"],
                "confidence": b["confidence"],
                "length_mm": b.get("length_mm"),
            }
            for b in boxes
        ],
    }


@router.post("/sessions", response_model=CountingResult, status_code=201)
async def create_counting_session(
    payload: CountingSessionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    F01 + F02 + F03 + F04 + F05: Submit a counting session.
    Runs YOLOv8 inference on uploaded images, returns live/dead counts, CV analysis.
    """
    if payload.batch_id is not None:
        if await db.get(Batch, payload.batch_id) is None:
            raise HTTPException(404, f"Batch {payload.batch_id} not found")

    ai_result = run_seed_counter_inference(payload.image_paths, payload.led_brightness)

    session = CountingSession(
        batch_id=payload.batch_id,
        vle_id=current_user.id,
        gps_lat=payload.gps_lat,
        gps_lng=payload.gps_lng,
        led_brightness=payload.led_brightness,
        image_paths=payload.image_paths,
        device_id=payload.device_id,
        live_count=ai_result["live_count"],
        dead_count=ai_result["dead_count"],
        total_count=ai_result["total_count"],
        mortality_pct=ai_result["mortality_pct"],
        mortality_alert=ai_result["mortality_alert"],
        cv_pct=ai_result["cv_pct"],
        mean_length_mm=ai_result["mean_length_mm"],
        std_length_mm=ai_result["std_length_mm"],
        cv_flag=ai_result["cv_flag"],
        confidence_interval=ai_result["confidence_interval"],
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session


@router.post("/sessions/{session_id}/extrapolate")
async def extrapolate_batch(
    session_id: int,
    payload: ExtrapolationRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """F06: Full Batch Extrapolation from sample count."""
    session = await db.get(CountingSession, session_id)
    if not session:
        raise HTTPException(404, "Session not found")

    result = compute_extrapolation(
        sample_count=session.total_count or 0,
        confidence_interval=session.confidence_interval or 0,
        sample_volume_ml=payload.sample_volume_ml,
        total_volume_ml=payload.total_volume_ml,
        invoice_quantity=payload.invoice_quantity,
    )
    session.sample_volume_ml = payload.sample_volume_ml
    session.total_volume_ml = payload.total_volume_ml
    session.extrapolated_count = result["extrapolated_count"]
    session.extrapolated_margin = result["extrapolated_margin"]
    session.invoice_quantity = payload.invoice_quantity
    session.invoice_discrepancy_pct = result["invoice_discrepancy_pct"]
    session.invoice_flag = result["invoice_flag"]
    await db.commit()
    await db.refresh(session)

    return {
        "extrapolated_count": result["extrapolated_count"],
        "extrapolated_margin": result["extrapolated_margin"],
        "display": f"{result['extrapolated_count']:,} PLs (±{result['extrapolated_margin']:,})",
        "invoice_flag": result["invoice_flag"],
        "invoice_discrepancy_pct": result["invoice_discrepancy_pct"],
    }


@router.post("/sessions/{session_id}/split-count")
async def split_count(
    session_id: int,
    payload: SplitCountRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """F07: Split Counting protocol for batches > 1 lakh PLs."""
    session = await db.get(CountingSession, session_id)
    if not session:
        raise HTTPException(404, "Session not found")

    result = compute_split_count(payload.sub_counts)
    session.is_split_count = True
    session.split_sub_counts = result["split_sub_counts"]
    session.split_mean = result["split_mean"]
    session.split_sd = result["split_sd"]
    session.split_cv = result["split_cv"]
    session.total_count = result["final_estimated_total"]
    await db.commit()
    return result


@router.get("/sessions/{session_id}", response_model=CountingResult)
async def get_session(session_id: int, db: AsyncSession = Depends(get_db),
                      current_user: User = Depends(get_current_user)):
    session = await db.get(CountingSession, session_id)
    if not session:
        raise HTTPException(404, "Session not found")
    return session


@router.get("/sessions")
async def list_sessions(
    batch_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """F08: List sessions — used for sync status display."""
    q = select(CountingSession).where(CountingSession.vle_id == current_user.id)
    if batch_id:
        q = q.where(CountingSession.batch_id == batch_id)
    result = await db.execute(q.order_by(CountingSession.session_date.desc()))
    return result.scalars().all()


@router.patch("/sessions/{session_id}/sync")
async def mark_synced(session_id: int, db: AsyncSession = Depends(get_db),
                      current_user: User = Depends(get_current_user)):
    """F08: Mark session as synced after offline upload."""
    session = await db.get(CountingSession, session_id)
    if not session:
        raise HTTPException(404)
    session.sync_status = "synced"
    session.synced_at = datetime.utcnow()
    await db.commit()
    return {"status": "synced"}


@router.post("/sessions/{session_id}/certificate")
async def generate_counting_certificate(
    session_id: int,
    language: str = "english",
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Generate PDF QC certificate for a counting session."""
    session = await db.get(CountingSession, session_id)
    if not session:
        raise HTTPException(404)

    cert = await create_certificate(
        db=db, session_type="counting", batch_id=session.batch_id,
        vle_id=current_user.id, counting_session_id=session_id,
        composite_score=None,
        grade=None,
        is_hard_fail=False,
        session_data={
            "live_count": session.live_count,
            "dead_count": session.dead_count,
            "mortality_pct": session.mortality_pct,
            "mortality_alert": session.mortality_alert,
            "cv_pct": session.cv_pct,
            "cv_flag": session.cv_flag,
            "extrapolated_count": session.extrapolated_count,
        },
        language=language,
    )
    return {
        "certificate_id": cert.certificate_id,
        "pdf_url": f"{settings.base_url}/{cert.pdf_path}",
        "qr_url": f"{settings.base_url}/{cert.qr_code_path}",
    }


@router.post("/image-quality-check")
async def check_image_quality(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    """
    Image quality gate (from EHP_Detection_App_Blueprint + AI_Model_Implementation_Guide).
    Checks: blur (Laplacian variance), brightness (mean pixel), confidence gate.
    Returns pass/fail with recommended action before running AI inference.
    """
    content = await file.read()

    try:
        import numpy as np
        from PIL import Image as PILImage
        import io

        img = PILImage.open(io.BytesIO(content)).convert("L")  # grayscale
        arr = np.array(img, dtype=np.float32)

        # Blur detection: Laplacian variance
        from PIL import ImageFilter
        lap = np.array(img.filter(ImageFilter.FIND_EDGES), dtype=np.float32)
        laplacian_variance = float(np.var(lap))
        blur_threshold = 100.0
        is_blurry = laplacian_variance < blur_threshold

        # Brightness check: mean pixel 0-255
        mean_brightness = float(np.mean(arr))
        is_underexposed = mean_brightness < 40.0
        is_overexposed = mean_brightness > 220.0

        # Confidence gate proxy: std deviation (low std = low contrast = inconclusive)
        std_dev = float(np.std(arr))
        is_low_contrast = std_dev < 20.0

        passed = not is_blurry and not is_underexposed and not is_overexposed and not is_low_contrast

        issues = []
        if is_blurry:
            issues.append(f"Image is blurry (Laplacian variance {laplacian_variance:.1f} < {blur_threshold}). Refocus before capturing.")
        if is_underexposed:
            issues.append(f"Image too dark (brightness {mean_brightness:.1f}). Increase LED brightness.")
        if is_overexposed:
            issues.append(f"Image overexposed (brightness {mean_brightness:.1f}). Reduce LED brightness.")
        if is_low_contrast:
            issues.append(f"Low image contrast (std {std_dev:.1f}). Check microscope focus and sample preparation.")

        return {
            "passed": passed,
            "action": "Proceed with AI inference." if passed else "Retake image. " + " ".join(issues),
            "metrics": {
                "laplacian_variance": round(laplacian_variance, 2),
                "blur_threshold": blur_threshold,
                "is_blurry": is_blurry,
                "mean_brightness": round(mean_brightness, 2),
                "is_underexposed": is_underexposed,
                "is_overexposed": is_overexposed,
                "std_dev": round(std_dev, 2),
                "is_low_contrast": is_low_contrast,
            },
            "issues": issues,
        }

    except Exception as e:
        raise HTTPException(400, f"Could not process image: {str(e)}")
