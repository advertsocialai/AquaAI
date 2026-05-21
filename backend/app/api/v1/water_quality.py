"""IoT water quality sensor data — from EHP Detection Blueprint."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
from app.database import get_db
from app.models.water_quality import WaterQualityReading
from app.models.user import User
from app.core.deps import get_current_user

router = APIRouter(prefix="/water-quality", tags=["Water Quality (IoT)"])

# Threshold limits for water quality alerts
THRESHOLDS = {
    "temperature_c": (25, 32),    # optimal range
    "salinity_ppt": (10, 30),
    "ph": (7.5, 8.5),
    "dissolved_oxygen_mgl": (5, None),  # min only
    "ammonia_mgl": (None, 0.5),   # max only
    "nitrite_mgl": (None, 0.1),
}


class WaterQualityCreate(BaseModel):
    farm_id: int
    pond_id: Optional[int] = None
    temperature_c: Optional[float] = None
    salinity_ppt: Optional[float] = None
    ph: Optional[float] = None
    dissolved_oxygen_mgl: Optional[float] = None
    ammonia_mgl: Optional[float] = None
    nitrite_mgl: Optional[float] = None
    alkalinity_mgl: Optional[float] = None
    turbidity_ntu: Optional[float] = None
    source: str = "manual"
    sensor_id: Optional[str] = None


def _check_alerts(payload: WaterQualityCreate) -> tuple[bool, str]:
    alerts = []
    data = payload.model_dump()
    for param, (low, high) in THRESHOLDS.items():
        val = data.get(param)
        if val is None:
            continue
        if low and val < low:
            alerts.append(f"{param} too low: {val} (min {low})")
        if high and val > high:
            alerts.append(f"{param} too high: {val} (max {high})")
    return bool(alerts), "; ".join(alerts)


@router.post("/", status_code=201)
async def log_water_quality(
    payload: WaterQualityCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    any_alert, alert_details = _check_alerts(payload)
    reading = WaterQualityReading(
        **payload.model_dump(),
        recorded_by=current_user.id,
        any_alert=any_alert,
        alert_details=alert_details if any_alert else None,
    )
    db.add(reading)
    await db.commit()
    await db.refresh(reading)
    return {"id": reading.id, "any_alert": any_alert,
            "alert_details": alert_details, "recorded_at": reading.recorded_at}


@router.get("/farm/{farm_id}")
async def get_farm_water_quality(
    farm_id: int,
    days: int = 7,
    pond_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    cutoff = datetime.utcnow() - timedelta(days=days)
    q = select(WaterQualityReading).where(
        WaterQualityReading.farm_id == farm_id,
        WaterQualityReading.recorded_at >= cutoff,
    ).order_by(WaterQualityReading.recorded_at.desc())
    if pond_id:
        q = q.where(WaterQualityReading.pond_id == pond_id)
    result = await db.execute(q)
    return result.scalars().all()


@router.get("/farm/{farm_id}/latest")
async def latest_water_quality(
    farm_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(WaterQualityReading)
        .where(WaterQualityReading.farm_id == farm_id)
        .order_by(WaterQualityReading.recorded_at.desc())
        .limit(1)
    )
    reading = result.scalar_one_or_none()
    if not reading:
        raise HTTPException(404, "No water quality data for this farm")
    return reading


@router.get("/alerts")
async def get_water_quality_alerts(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all readings with active alerts in the last 48 hours."""
    cutoff = datetime.utcnow() - timedelta(hours=48)
    result = await db.execute(
        select(WaterQualityReading)
        .where(WaterQualityReading.any_alert == True,
               WaterQualityReading.recorded_at >= cutoff)
        .order_by(WaterQualityReading.recorded_at.desc())
    )
    return result.scalars().all()


@router.get("/farm/{farm_id}/trends")
async def water_quality_trends(
    farm_id: int,
    days: int = 30,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Aggregate daily averages for trend charts on analytics dashboard."""
    from sqlalchemy import cast, Date
    cutoff = datetime.utcnow() - timedelta(days=days)
    result = await db.execute(
        select(
            cast(WaterQualityReading.recorded_at, Date).label("day"),
            func.avg(WaterQualityReading.temperature_c).label("avg_temp"),
            func.avg(WaterQualityReading.ph).label("avg_ph"),
            func.avg(WaterQualityReading.dissolved_oxygen_mgl).label("avg_do"),
            func.avg(WaterQualityReading.salinity_ppt).label("avg_salinity"),
        ).where(WaterQualityReading.farm_id == farm_id,
                WaterQualityReading.recorded_at >= cutoff)
        .group_by(cast(WaterQualityReading.recorded_at, Date))
        .order_by(cast(WaterQualityReading.recorded_at, Date))
    )
    return [{"date": str(r.day), "avg_temp": r.avg_temp, "avg_ph": r.avg_ph,
             "avg_do": r.avg_do, "avg_salinity": r.avg_salinity}
            for r in result.all()]
