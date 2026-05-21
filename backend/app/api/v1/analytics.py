"""M4 — F27: Farm Analytics Dashboard."""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from typing import Optional
from app.database import get_db
from app.models.user import User, UserRole
from app.models.disease import DiagnosisSession
from app.models.quality import GradingSession
from app.models.seed_counter import CountingSession
from app.models.batch import Batch
from app.models.farm import Farm
from app.models.outbreak import OutbreakAlert
from app.core.deps import get_current_user

router = APIRouter(prefix="/analytics", tags=["M4 — Analytics"])


@router.get("/dashboard")
async def farm_dashboard(
    farm_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """F27: Farm analytics dashboard — aggregated quality, disease, and seed data."""
    # Counting summary
    count_q = select(
        func.count(CountingSession.id).label("total_sessions"),
        func.avg(CountingSession.mortality_pct).label("avg_mortality"),
        func.avg(CountingSession.cv_pct).label("avg_cv"),
    ).where(CountingSession.vle_id == current_user.id)
    count_row = (await db.execute(count_q)).one()

    # Quality summary
    grade_q = select(
        func.count(GradingSession.id).label("total_graded"),
        func.avg(GradingSession.composite_score).label("avg_score"),
        func.count(GradingSession.id).filter(GradingSession.is_hard_fail == True).label("hard_fails"),
    ).where(GradingSession.vle_id == current_user.id)
    grade_row = (await db.execute(grade_q)).one()

    # Disease detection summary
    disease_q = select(
        func.count(DiagnosisSession.id).label("total_diagnoses"),
        func.count(DiagnosisSession.id).filter(DiagnosisSession.is_hard_fail == True).label("critical_detections"),
    ).where(DiagnosisSession.vle_id == current_user.id)
    disease_row = (await db.execute(disease_q)).one()

    # Grade distribution
    grade_dist_q = select(GradingSession.composite_grade, func.count().label("count")) \
        .where(GradingSession.vle_id == current_user.id) \
        .group_by(GradingSession.composite_grade)
    grade_dist = {row.composite_grade: row.count
                  for row in (await db.execute(grade_dist_q)).all()}

    return {
        "seed_counter": {
            "total_sessions": count_row.total_sessions or 0,
            "avg_mortality_pct": round(count_row.avg_mortality or 0, 2),
            "avg_cv_pct": round(count_row.avg_cv or 0, 2),
        },
        "quality_grader": {
            "total_graded": grade_row.total_graded or 0,
            "avg_quality_score": round(grade_row.avg_score or 0, 2),
            "hard_fails": grade_row.hard_fails or 0,
            "grade_distribution": grade_dist,
        },
        "disease_detector": {
            "total_diagnoses": disease_row.total_diagnoses or 0,
            "critical_detections": disease_row.critical_detections or 0,
        },
    }


@router.get("/public-summary")
async def public_summary(db: AsyncSession = Depends(get_db)):
    """
    Public platform-wide analytics summary — no auth required.
    Powers the marketing dashboard on the AquaAI web page.
    Aggregates across all VLEs (not per-user).
    """
    count_row = (await db.execute(select(
        func.count(CountingSession.id).label("total_sessions"),
        func.avg(CountingSession.mortality_pct).label("avg_mortality"),
        func.avg(CountingSession.cv_pct).label("avg_cv"),
    ))).one()

    grade_row = (await db.execute(select(
        func.count(GradingSession.id).label("total_graded"),
        func.avg(GradingSession.composite_score).label("avg_score"),
        func.count(GradingSession.id).filter(GradingSession.is_hard_fail == True).label("hard_fails"),
    ))).one()

    disease_row = (await db.execute(select(
        func.count(DiagnosisSession.id).label("total_diagnoses"),
        func.count(DiagnosisSession.id).filter(DiagnosisSession.is_hard_fail == True).label("critical"),
    ))).one()

    return {
        "status": "online",
        "seed_counter": {
            "total_sessions":   count_row.total_sessions or 0,
            "avg_mortality_pct": round(count_row.avg_mortality or 0, 2),
            "avg_cv_pct":       round(count_row.avg_cv or 0, 2),
        },
        "quality_grader": {
            "total_graded":      grade_row.total_graded or 0,
            "avg_quality_score": round(grade_row.avg_score or 0, 2),
            "hard_fails":        grade_row.hard_fails or 0,
        },
        "disease_detector": {
            "total_diagnoses":     disease_row.total_diagnoses or 0,
            "critical_detections": disease_row.critical or 0,
        },
    }


@router.get("/disease-trends")
async def disease_trends(
    days: int = 30,
    district: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """F27: Disease trend over time — detection frequency by disease type."""
    from datetime import datetime, timedelta
    cutoff = datetime.utcnow() - timedelta(days=days)

    from sqlalchemy import text, cast, Date
    q = select(
        cast(DiagnosisSession.session_date, Date).label("day"),
        func.count(DiagnosisSession.id).filter(DiagnosisSession.ehp_positive_prob > 0.55).label("ehp"),
        func.count(DiagnosisSession.id).filter(DiagnosisSession.wssv_positive == True).label("wssv"),
        func.count(DiagnosisSession.id).label("total"),
    ).where(DiagnosisSession.session_date >= cutoff) \
     .group_by(cast(DiagnosisSession.session_date, Date)) \
     .order_by(cast(DiagnosisSession.session_date, Date))

    result = await db.execute(q)
    return [
        {"date": str(row.day)[:10], "ehp": row.ehp, "wssv": row.wssv, "total": row.total}
        for row in result.all()
    ]


@router.get("/hatchery-performance")
async def hatchery_performance_summary(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """F27: Hatchery quality score history — identify consistent poor suppliers."""
    from app.models.hatchery import Hatchery
    q = select(
        Hatchery.id, Hatchery.name,
        func.avg(GradingSession.composite_score).label("avg_score"),
        func.count(GradingSession.id).label("batch_count"),
        func.count(GradingSession.id).filter(GradingSession.is_hard_fail == True).label("hard_fails"),
    ).join(Batch, Batch.hatchery_id == Hatchery.id) \
     .join(GradingSession, GradingSession.batch_id == Batch.id) \
     .group_by(Hatchery.id, Hatchery.name) \
     .order_by(func.avg(GradingSession.composite_score).desc())

    result = await db.execute(q)
    return [
        {"hatchery_id": r.id, "name": r.name,
         "avg_score": round(r.avg_score or 0, 2),
         "batch_count": r.batch_count, "hard_fails": r.hard_fails}
        for r in result.all()
    ]


@router.get("/regional-heatmap")
async def regional_disease_heatmap(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """F27: Anonymised disease detection density by district/mandal."""
    q = select(
        OutbreakAlert.district, OutbreakAlert.mandal,
        func.count(OutbreakAlert.id).label("outbreak_count"),
        func.max(OutbreakAlert.created_at).label("last_detected"),
    ).group_by(OutbreakAlert.district, OutbreakAlert.mandal) \
     .order_by(func.count(OutbreakAlert.id).desc())

    result = await db.execute(q)
    return [
        {"district": r.district, "mandal": r.mandal,
         "outbreak_count": r.outbreak_count,
         "last_detected": str(r.last_detected)[:10] if r.last_detected else None}
        for r in result.all()
    ]
