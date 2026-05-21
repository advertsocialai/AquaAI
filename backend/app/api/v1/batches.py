from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.database import get_db
from app.models.batch import Batch, PLStage
from app.models.user import User
from app.core.deps import get_current_user
import uuid

router = APIRouter(prefix="/batches", tags=["Batches"])


class BatchCreate(BaseModel):
    hatchery_id: int
    farm_id: int
    pond_id: Optional[int] = None
    ordered_pl_stage: Optional[PLStage] = None
    ordered_quantity: Optional[int] = None
    invoice_number: Optional[str] = None
    invoice_quantity: Optional[int] = None
    dispatch_date: Optional[datetime] = None


@router.post("/", status_code=201)
async def create_batch(payload: BatchCreate, db: AsyncSession = Depends(get_db),
                       current_user: User = Depends(get_current_user)):
    batch_code = f"BAT-{uuid.uuid4().hex[:8].upper()}"
    batch = Batch(batch_code=batch_code, **payload.model_dump())
    db.add(batch)
    await db.commit()
    await db.refresh(batch)
    return batch


@router.get("/")
async def list_batches(farm_id: Optional[int] = None, db: AsyncSession = Depends(get_db),
                       current_user: User = Depends(get_current_user)):
    q = select(Batch)
    if farm_id:
        q = q.where(Batch.farm_id == farm_id)
    result = await db.execute(q.order_by(Batch.created_at.desc()))
    return result.scalars().all()


@router.get("/{batch_id}")
async def get_batch(batch_id: int, db: AsyncSession = Depends(get_db),
                    current_user: User = Depends(get_current_user)):
    batch = await db.get(Batch, batch_id)
    if not batch:
        raise HTTPException(404, "Batch not found")
    return batch


@router.patch("/{batch_id}/stock")
async def mark_stocked(batch_id: int, db: AsyncSession = Depends(get_db),
                       current_user: User = Depends(get_current_user)):
    batch = await db.get(Batch, batch_id)
    if not batch:
        raise HTTPException(404)
    batch.is_stocked = True
    batch.stocked_at = datetime.utcnow()
    await db.commit()
    return {"batch_id": batch_id, "stocked": True}
