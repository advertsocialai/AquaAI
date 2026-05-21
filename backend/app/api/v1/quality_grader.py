"""M3 — Seed Quality Grader (F17-F24): All 8 features."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
from app.database import get_db
from app.models.quality import GradingSession
from app.models.disease import DiagnosisSession
from app.models.seed_counter import CountingSession
from app.models.batch import Batch
from app.models.user import User
from app.core.deps import get_current_user
from app.schemas.quality import GradingSessionCreate, GradingResult, StockingRecommendation
from app.services.ai.quality_grader import (
    run_visual_health_assessment, run_stage_identification,
    compute_size_uniformity_score, compute_disease_score,
    run_activity_assessment, compute_composite_score,
    get_stocking_recommendation, generate_size_histogram
)
from app.services.certificate_service import create_certificate
from app.config import settings

router = APIRouter(prefix="/quality", tags=["M3 — Quality Grader"])


@router.post("/sessions", response_model=GradingResult, status_code=201)
async def create_grading_session(
    payload: GradingSessionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    F17-F24: Full 4-step quality grading session.
    Orchestrates all AI models and computes Composite Quality Score (0-100).
    """
    batch = await db.get(Batch, payload.batch_id)
    if payload.batch_id is not None and batch is None:
        raise HTTPException(404, f"Batch {payload.batch_id} not found")

    # F18: Visual Health Assessment (EfficientNetB0 regression)
    visual = run_visual_health_assessment(payload.image_paths)

    # F19: PL Stage Identification (MobileNetV3)
    ordered_stage = batch.ordered_pl_stage if batch else None
    stage = run_stage_identification(payload.image_paths, ordered_stage)

    # Pull latest disease session for this batch to get disease score
    disease_result = await db.execute(
        select(DiagnosisSession)
        .where(DiagnosisSession.batch_id == payload.batch_id)
        .order_by(DiagnosisSession.session_date.desc())
        .limit(1)
    )
    latest_disease = disease_result.scalar_one_or_none()

    # Pull latest counting session for CV data
    count_result = await db.execute(
        select(CountingSession)
        .where(CountingSession.batch_id == payload.batch_id)
        .order_by(CountingSession.session_date.desc())
        .limit(1)
    )
    latest_count = count_result.scalar_one_or_none()

    # Compute sub-scores
    size_score = compute_size_uniformity_score(latest_count.cv_pct if latest_count else None)
    cv_pct = latest_count.cv_pct if latest_count else None
    mean_length = latest_count.mean_length_mm if latest_count else 10.0
    std_length = latest_count.std_length_mm if latest_count else 1.5

    ehp_prob = latest_disease.ehp_positive_prob if latest_disease else None
    wssv_positive = latest_disease.wssv_positive if latest_disease else False
    ahpnd_prob = latest_disease.ahpnd_prob if latest_disease else None
    disease_score = compute_disease_score(ehp_prob, wssv_positive, ahpnd_prob)

    # Hard fail propagation from disease module
    is_hard_fail = latest_disease.is_hard_fail if latest_disease else False
    hard_fail_reason = latest_disease.hard_fail_disease if latest_disease else None

    # F-activity: Video frame motion analysis
    activity = run_activity_assessment(payload.image_paths)

    # F17: Composite score
    if is_hard_fail:
        composite = {"composite_score": 0.0, "composite_grade": "REJECT"}
    else:
        composite = compute_composite_score(
            visual["visual_health_score"], disease_score,
            size_score, stage["stage_score"], activity
        )

    # F21: Stocking density recommendation
    stocking = get_stocking_recommendation(
        composite["composite_score"],
        composite["composite_grade"],
        payload.planned_density_per_sqm,
    )

    # F20: Size histogram
    histogram = generate_size_histogram(cv_pct or 12.0, mean_length, std_length)

    # F22: Mismatch check
    count_mismatch = False
    count_discrepancy_pct = None
    if latest_count and latest_count.extrapolated_count and batch and batch.invoice_quantity:
        discrepancy = abs(batch.invoice_quantity - latest_count.extrapolated_count)
        count_discrepancy_pct = round(discrepancy / batch.invoice_quantity * 100, 2)
        count_mismatch = count_discrepancy_pct > 10

    session = GradingSession(
        batch_id=payload.batch_id,
        vle_id=current_user.id,
        gps_lat=payload.gps_lat,
        gps_lng=payload.gps_lng,
        image_paths=payload.image_paths,
        device_id=payload.device_id,
        planned_density_per_sqm=payload.planned_density_per_sqm,
        # Visual health
        visual_health_score=visual["visual_health_score"],
        body_colour_score=visual["body_colour_score"],
        gut_visibility_score=visual["gut_visibility_score"],
        tail_muscle_score=visual["tail_muscle_score"],
        appendage_score=visual["appendage_score"],
        posture_score=visual["posture_score"],
        activity_score_visual=visual["activity_score_visual"],
        # Stage
        detected_pl_stage=stage["detected_pl_stage"],
        stage_confidence=stage["stage_confidence"],
        stage_score=stage["stage_score"],
        stage_mismatch=stage["stage_mismatch"],
        stage_mismatch_levels=stage["stage_mismatch_levels"],
        # Size
        size_uniformity_score=size_score,
        cv_pct=cv_pct,
        # Disease
        disease_score=disease_score,
        activity_score=activity,
        # Composite
        composite_score=composite["composite_score"],
        composite_grade=composite["composite_grade"],
        is_hard_fail=is_hard_fail,
        hard_fail_reason=hard_fail_reason,
        # Stocking
        recommended_density_pct=stocking["recommended_density_pct"],
        recommended_density_per_sqm=stocking["recommended_density_per_sqm"],
        stocking_recommendation=stocking["stocking_recommendation"],
        # Histogram
        size_histogram_data=histogram,
        # Mismatch
        count_mismatch=count_mismatch,
        count_discrepancy_pct=count_discrepancy_pct,
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session


@router.get("/sessions/{session_id}", response_model=GradingResult)
async def get_grading_session(session_id: int, db: AsyncSession = Depends(get_db),
                               current_user: User = Depends(get_current_user)):
    session = await db.get(GradingSession, session_id)
    if not session:
        raise HTTPException(404, "Grading session not found")
    return session


@router.get("/sessions")
async def list_grading_sessions(
    batch_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = select(GradingSession).where(GradingSession.vle_id == current_user.id)
    if batch_id:
        q = q.where(GradingSession.batch_id == batch_id)
    result = await db.execute(q.order_by(GradingSession.session_date.desc()))
    return result.scalars().all()


@router.get("/sessions/{session_id}/stocking-recommendation", response_model=StockingRecommendation)
async def stocking_recommendation(
    session_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """F21: Stocking density recommendation with calculated PLs/m²."""
    session = await db.get(GradingSession, session_id)
    if not session:
        raise HTTPException(404)
    return StockingRecommendation(
        composite_score=session.composite_score or 0,
        grade=session.composite_grade or "REJECT",
        recommended_density_pct=session.recommended_density_pct or 0,
        recommended_density_per_sqm=session.recommended_density_per_sqm,
        action=session.stocking_recommendation or "",
        reasoning=f"Based on composite quality score of {session.composite_score:.1f}/100",
    )


@router.post("/sessions/{session_id}/certificate")
async def generate_grading_certificate(
    session_id: int, language: str = "english",
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """F23: QC Certificate Generation — HMAC-signed, QR-verified PDF."""
    session = await db.get(GradingSession, session_id)
    if not session:
        raise HTTPException(404)

    cert = await create_certificate(
        db=db, session_type="grading", batch_id=session.batch_id,
        vle_id=current_user.id, grading_session_id=session_id,
        composite_score=session.composite_score,
        grade=session.composite_grade,
        is_hard_fail=session.is_hard_fail,
        session_data={
            "composite_score": session.composite_score,
            "grade": session.composite_grade,
            "visual_health_score": session.visual_health_score,
            "disease_score": session.disease_score,
            "size_uniformity_score": session.size_uniformity_score,
            "stage_score": session.stage_score,
            "detected_pl_stage": session.detected_pl_stage,
            "stage_mismatch": session.stage_mismatch,
            "stocking_recommendation": session.stocking_recommendation,
        },
        language=language,
    )
    return {
        "certificate_id": cert.certificate_id,
        "pdf_url": f"{settings.base_url}/{cert.pdf_path}",
        "qr_url": f"{settings.base_url}/{cert.qr_code_path}",
        "expires_at": cert.expires_at.isoformat() if cert.expires_at else None,
    }
