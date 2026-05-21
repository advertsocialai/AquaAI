from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel
from typing import Optional, List
from app.database import get_db
from app.models.farm import Farm, Pond
from app.models.disease import DiagnosisSession
from app.models.user import User
from app.core.deps import get_current_user

router = APIRouter(prefix="/farms", tags=["Farms"])


class FarmCreate(BaseModel):
    name: str
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None
    district: Optional[str] = None
    mandal: Optional[str] = None
    village: Optional[str] = None
    total_area_hectares: Optional[float] = None
    vle_id: Optional[int] = None


class PondCreate(BaseModel):
    name: str
    area_sqm: Optional[float] = None
    depth_m: Optional[float] = None


@router.post("/", status_code=201)
async def create_farm(payload: FarmCreate, db: AsyncSession = Depends(get_db),
                      current_user: User = Depends(get_current_user)):
    farm = Farm(owner_id=current_user.id, **payload.model_dump())
    db.add(farm)
    await db.commit()
    await db.refresh(farm)
    return farm


@router.get("/")
async def list_farms(db: AsyncSession = Depends(get_db),
                     current_user: User = Depends(get_current_user)):
    if current_user.role in ("admin", "govt_officer"):
        result = await db.execute(select(Farm).where(Farm.is_active == True))
    elif current_user.role == "vle":
        result = await db.execute(select(Farm).where(Farm.vle_id == current_user.id))
    else:
        result = await db.execute(select(Farm).where(Farm.owner_id == current_user.id))
    return result.scalars().all()


@router.get("/{farm_id}")
async def get_farm(farm_id: int, db: AsyncSession = Depends(get_db),
                   current_user: User = Depends(get_current_user)):
    farm = await db.get(Farm, farm_id)
    if not farm:
        raise HTTPException(404, "Farm not found")
    return farm


@router.post("/{farm_id}/ponds", status_code=201)
async def add_pond(farm_id: int, payload: PondCreate, db: AsyncSession = Depends(get_db),
                   current_user: User = Depends(get_current_user)):
    pond = Pond(farm_id=farm_id, **payload.model_dump())
    db.add(pond)
    await db.commit()
    await db.refresh(pond)
    return pond


@router.get("/{farm_id}/ponds")
async def list_ponds(farm_id: int, db: AsyncSession = Depends(get_db),
                     current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Pond).where(Pond.farm_id == farm_id, Pond.is_active == True))
    return result.scalars().all()


@router.get("/{farm_id}/risk-score")
async def get_farm_risk_score(
    farm_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Pond-level EHP risk score (0.0–1.0) for a farm.
    From EHP_Detection_App_Blueprint + Prawn_AI_Platform docs.
    Aggregates last 30 days of disease sessions: avg EHP prob weighted by hard-fail events.
    """
    farm = await db.get(Farm, farm_id)
    if not farm:
        raise HTTPException(404, "Farm not found")

    # Get all diagnosis sessions linked to batches on this farm
    from app.models.batch import Batch
    batch_result = await db.execute(select(Batch.id).where(Batch.farm_id == farm_id))
    batch_ids = [r[0] for r in batch_result.all()]

    if not batch_ids:
        return {
            "farm_id": farm_id,
            "farm_name": farm.name,
            "risk_score": 0.0,
            "risk_level": "green",
            "action": "No sessions recorded. No current disease risk.",
            "sessions_analysed": 0,
            "hard_fails": 0,
        }

    from sqlalchemy import and_
    from datetime import datetime, timedelta
    cutoff = datetime.utcnow() - timedelta(days=30)

    q = select(DiagnosisSession).where(
        and_(
            DiagnosisSession.batch_id.in_(batch_ids),
            DiagnosisSession.session_date >= cutoff,
        )
    )
    result = await db.execute(q)
    sessions = result.scalars().all()

    if not sessions:
        return {
            "farm_id": farm_id,
            "farm_name": farm.name,
            "risk_score": 0.0,
            "risk_level": "green",
            "action": "No recent sessions. No current disease risk.",
            "sessions_analysed": 0,
            "hard_fails": 0,
        }

    hard_fails = sum(1 for s in sessions if s.is_hard_fail)
    avg_ehp = sum((s.ehp_positive_prob or 0.0) for s in sessions) / len(sessions)
    # Multi-signal fusion: HP tissue 50%, spore detection 35%, hard-fail penalty 15%
    hard_fail_penalty = min(hard_fails / len(sessions), 1.0)
    risk_score = round(
        avg_ehp * 0.50 +
        avg_ehp * 0.35 +  # spore proxy via ehp_prob
        hard_fail_penalty * 0.15,
        4,
    )

    if risk_score > 0.85 or hard_fails > 0:
        risk_level, action = "red", "High disease risk. Isolate pond. Contact aquaculture officer."
    elif risk_score > 0.55:
        risk_level, action = "yellow", "Elevated risk. Increase monitoring. Prepare PCR samples."
    elif risk_score > 0.30:
        risk_level, action = "green", "Moderate risk. Normal monitoring recommended."
    else:
        risk_level, action = "green", "Low risk. Continue normal operations."

    return {
        "farm_id": farm_id,
        "farm_name": farm.name,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "action": action,
        "sessions_analysed": len(sessions),
        "hard_fails": hard_fails,
        "avg_ehp_prob": round(avg_ehp, 4),
        "fusion_weights": {"hp_tissue": 0.50, "spore_detection": 0.35, "hard_fail_penalty": 0.15},
    }
