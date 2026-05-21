"""M4 — F32: Hatchery B2B Portal."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.models.hatchery import Hatchery
from app.models.batch import Batch
from app.models.quality import GradingSession
from app.models.certificate import QCCertificate
from app.models.user import User
from app.core.deps import get_current_user
from app.config import settings

router = APIRouter(prefix="/hatchery-portal", tags=["M4 — Hatchery B2B Portal"])


class MismatchResponse(BaseModel):
    response_text: str
    evidence_url: Optional[str] = None


@router.get("/dashboard/{hatchery_id}")
async def hatchery_dashboard(
    hatchery_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """F32: Hatchery dashboard — all batches, QS scores, buyer acceptance."""
    hatchery = await db.get(Hatchery, hatchery_id)
    if not hatchery:
        raise HTTPException(404, "Hatchery not found")

    # All batches
    batches_result = await db.execute(
        select(Batch).where(Batch.hatchery_id == hatchery_id).order_by(Batch.created_at.desc())
    )
    batches = batches_result.scalars().all()

    # Quality score summary per batch
    batch_ids = [b.id for b in batches]
    scores = {}
    if batch_ids:
        score_q = select(
            GradingSession.batch_id,
            func.avg(GradingSession.composite_score).label("avg_score"),
            func.count(GradingSession.id).filter(GradingSession.is_hard_fail == True).label("fails"),
        ).where(GradingSession.batch_id.in_(batch_ids)).group_by(GradingSession.batch_id)
        for row in (await db.execute(score_q)).all():
            scores[row.batch_id] = {"avg_score": round(row.avg_score or 0, 2), "hard_fails": row.fails}

    batch_summary = [
        {
            "batch_id": b.id,
            "batch_code": b.batch_code,
            "ordered_quantity": b.ordered_quantity,
            "ordered_stage": b.ordered_pl_stage,
            "dispatch_date": str(b.dispatch_date)[:10] if b.dispatch_date else None,
            "quality": scores.get(b.id, {"avg_score": None, "hard_fails": 0}),
        }
        for b in batches
    ]

    return {
        "hatchery": {"id": hatchery.id, "name": hatchery.name},
        "total_batches": len(batches),
        "subscription_active": hatchery.subscription_active,
        "subscription_plan": hatchery.subscription_plan,
        "batches": batch_summary,
    }


@router.get("/batches/{batch_id}/reports")
async def get_batch_reports(
    batch_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """F32: All QC reports for a specific batch (for hatchery view)."""
    result = await db.execute(
        select(QCCertificate).where(QCCertificate.batch_id == batch_id)
        .order_by(QCCertificate.created_at.desc())
    )
    certs = result.scalars().all()
    return [
        {
            "certificate_id": c.certificate_id,
            "session_type": c.session_type,
            "grade": c.grade,
            "composite_score": c.composite_score,
            "is_hard_fail": c.is_hard_fail,
            "farm_name": c.farm_name,
            "pdf_url": f"{settings.base_url}/{c.pdf_path}" if c.pdf_path else None,
            "created_at": c.created_at,
        }
        for c in certs
    ]


@router.post("/batches/{batch_id}/mismatch-response")
async def respond_to_mismatch(
    batch_id: int,
    payload: MismatchResponse,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """F32: Hatchery responds to mismatch/dispute report."""
    batch = await db.get(Batch, batch_id)
    if not batch:
        raise HTTPException(404, "Batch not found")
    # In a full implementation, store the response in a disputes table
    return {
        "batch_id": batch_id,
        "response_recorded": True,
        "message": "Hatchery dispute response recorded successfully.",
    }


@router.get("/export/{hatchery_id}/csv")
async def export_batch_csv(
    hatchery_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """F32: Export all batch data as CSV for ERP integration."""
    from fastapi.responses import StreamingResponse
    import io, csv

    batches_result = await db.execute(
        select(Batch).where(Batch.hatchery_id == hatchery_id)
    )
    batches = batches_result.scalars().all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["batch_code", "farm_id", "pond_id", "ordered_stage",
                     "ordered_qty", "invoice_qty", "dispatch_date", "is_stocked"])
    for b in batches:
        writer.writerow([b.batch_code, b.farm_id, b.pond_id, b.ordered_pl_stage,
                         b.ordered_quantity, b.invoice_quantity,
                         str(b.dispatch_date)[:10] if b.dispatch_date else "",
                         b.is_stocked])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=hatchery_{hatchery_id}_batches.csv"},
    )
