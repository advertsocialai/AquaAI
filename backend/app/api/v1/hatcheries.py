from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional
from app.database import get_db
from app.models.hatchery import Hatchery
from app.models.user import User
from app.core.deps import get_current_user

router = APIRouter(prefix="/hatcheries", tags=["Hatcheries"])


class HatcheryCreate(BaseModel):
    name: str
    contact_name: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    district: Optional[str] = None
    state: Optional[str] = None
    license_number: Optional[str] = None


@router.post("/", status_code=201)
async def create_hatchery(payload: HatcheryCreate, db: AsyncSession = Depends(get_db),
                          current_user: User = Depends(get_current_user)):
    hatchery = Hatchery(**payload.model_dump())
    db.add(hatchery)
    await db.commit()
    await db.refresh(hatchery)
    return hatchery


@router.get("/")
async def list_hatcheries(db: AsyncSession = Depends(get_db),
                          current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Hatchery).where(Hatchery.is_active == True))
    return result.scalars().all()


@router.get("/{hatchery_id}")
async def get_hatchery(hatchery_id: int, db: AsyncSession = Depends(get_db),
                       current_user: User = Depends(get_current_user)):
    h = await db.get(Hatchery, hatchery_id)
    if not h:
        raise HTTPException(404, "Hatchery not found")
    return h


@router.get("/{hatchery_id}/performance")
async def hatchery_performance(hatchery_id: int, db: AsyncSession = Depends(get_db),
                               current_user: User = Depends(get_current_user)):
    """Aggregate QC scores for a hatchery across all its batches."""
    from app.models.batch import Batch
    from app.models.quality import GradingSession
    from sqlalchemy import func, and_

    result = await db.execute(
        select(
            func.count(GradingSession.id).label("total_sessions"),
            func.avg(GradingSession.composite_score).label("avg_score"),
            func.min(GradingSession.composite_score).label("min_score"),
            func.max(GradingSession.composite_score).label("max_score"),
            func.count(GradingSession.id).filter(GradingSession.is_hard_fail == True).label("hard_fails"),
        ).join(Batch, Batch.id == GradingSession.batch_id)
        .where(Batch.hatchery_id == hatchery_id)
    )
    row = result.one()
    return {
        "hatchery_id": hatchery_id,
        "total_sessions": row.total_sessions or 0,
        "avg_quality_score": round(row.avg_score or 0, 2),
        "min_score": row.min_score,
        "max_score": row.max_score,
        "hard_fail_count": row.hard_fails or 0,
    }
