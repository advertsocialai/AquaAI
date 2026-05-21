"""
Live database context builder for the AquaAI diagnostic agent.

The agent's tool functions are synchronous, but the platform's data lives
in an async PostgreSQL database. This module pre-fetches everything the agent
might need (farm history, water quality, outbreaks, batch details) into a
plain dict BEFORE the agentic loop runs. The agent's tools then read from
that dict — no async needed inside the loop.
"""
from datetime import datetime, timedelta, timezone
from typing import Optional, List

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.farm import Farm
from app.models.batch import Batch
from app.models.disease import DiagnosisSession
from app.models.water_quality import WaterQualityReading
from app.models.outbreak import OutbreakAlert


# Water quality safe ranges for shrimp PL (AI_Model_Implementation_Guide / EHP Blueprint)
WQ_SAFE_RANGES = {
    "temperature_c":        (28.0, 32.0),
    "salinity_ppt":         (10.0, 25.0),
    "ph":                   (7.5, 8.5),
    "dissolved_oxygen_mgl": (4.0, 99.0),
    "ammonia_mgl":          (0.0, 0.1),
    "nitrite_mgl":          (0.0, 1.0),
    "alkalinity_mgl":       (100.0, 150.0),
}


async def _farm_history(db: AsyncSession, farm_id: int) -> dict:
    """Aggregate the last 30 days of disease diagnoses for a farm."""
    cutoff = datetime.now(timezone.utc) - timedelta(days=30)

    farm = await db.get(Farm, farm_id)
    if farm is None:
        return {"farm_id": farm_id, "error": "Farm not found"}

    q = (
        select(DiagnosisSession)
        .join(Batch, DiagnosisSession.batch_id == Batch.id)
        .where(Batch.farm_id == farm_id)
        .order_by(DiagnosisSession.session_date.desc())
        .limit(50)
    )
    sessions = (await db.execute(q)).scalars().all()

    recent = [s for s in sessions
              if s.session_date and s.session_date.replace(tzinfo=timezone.utc) >= cutoff] \
        if sessions else []

    total       = len(recent)
    hard_fails  = sum(1 for s in recent if s.is_hard_fail)
    ehp_probs   = [s.ehp_positive_prob for s in recent if s.ehp_positive_prob is not None]
    avg_ehp     = round(sum(ehp_probs) / len(ehp_probs), 4) if ehp_probs else 0.0
    risk_counts = {}
    for s in recent:
        risk_counts[s.risk_level or "unknown"] = risk_counts.get(s.risk_level or "unknown", 0) + 1

    # Simple farm risk score: weighted by hard fails + avg EHP
    risk_score = round(min(1.0, avg_ehp * 0.6 + (hard_fails / max(total, 1)) * 0.4), 4)
    if risk_score >= 0.7:   risk_level = "high"
    elif risk_score >= 0.4: risk_level = "moderate"
    else:                   risk_level = "low"

    return {
        "farm_id":              farm_id,
        "farm_name":            farm.name,
        "district":             farm.district,
        "sessions_analysed":    total,
        "hard_fails":           hard_fails,
        "avg_ehp_probability":  avg_ehp,
        "risk_distribution":    risk_counts,
        "risk_score":           risk_score,
        "risk_level":           risk_level,
        "recent_sessions": [
            {
                "session_id":  s.id,
                "date":        s.session_date.isoformat() if s.session_date else None,
                "risk_level":  s.risk_level,
                "ehp_prob":    s.ehp_positive_prob,
                "is_hard_fail": s.is_hard_fail,
                "hard_fail_disease": s.hard_fail_disease,
            }
            for s in recent[:8]
        ],
    }


async def _water_quality(db: AsyncSession, farm_id: int) -> dict:
    """Latest water quality reading + parameter health for a farm."""
    q = (
        select(WaterQualityReading)
        .where(WaterQualityReading.farm_id == farm_id)
        .order_by(WaterQualityReading.recorded_at.desc())
        .limit(1)
    )
    reading = (await db.execute(q)).scalar_one_or_none()
    if reading is None:
        return {"farm_id": farm_id, "available": False,
                "note": "No water quality readings recorded for this farm."}

    params = {}
    out_of_range = []
    for field, (lo, hi) in WQ_SAFE_RANGES.items():
        val = getattr(reading, field, None)
        if val is None:
            continue
        in_range = lo <= val <= hi
        params[field] = {"value": val, "safe_range": [lo, hi], "in_range": in_range}
        if not in_range:
            out_of_range.append(field)

    return {
        "farm_id":       farm_id,
        "available":     True,
        "recorded_at":   reading.recorded_at.isoformat() if reading.recorded_at else None,
        "source":        reading.source,
        "parameters":    params,
        "out_of_range":  out_of_range,
        "any_alert":     reading.any_alert,
        "alert_details": reading.alert_details,
    }


async def _outbreaks(db: AsyncSession, farm_id: int) -> dict:
    """Recent disease outbreak alerts near a farm's district."""
    farm = await db.get(Farm, farm_id)
    district = farm.district if farm else None

    q = select(OutbreakAlert).order_by(OutbreakAlert.created_at.desc()).limit(20)
    if district:
        q = q.where(OutbreakAlert.district == district)
    alerts = (await db.execute(q)).scalars().all()

    return {
        "farm_id":       farm_id,
        "district":      district,
        "alert_count":   len(alerts),
        "alerts": [
            {
                "disease":     a.disease,
                "severity":    a.severity,
                "district":    a.district,
                "radius_km":   a.radius_km,
                "farms_notified": a.notified_farms_count,
                "date":        a.created_at.isoformat() if a.created_at else None,
            }
            for a in alerts[:8]
        ],
    }


async def _batch_info(db: AsyncSession, batch_id: int) -> dict:
    """Batch details + diagnosis session count."""
    batch = await db.get(Batch, batch_id)
    if batch is None:
        return {"batch_id": batch_id, "error": "Batch not found"}

    diag_count = (await db.execute(
        select(func.count(DiagnosisSession.id))
        .where(DiagnosisSession.batch_id == batch_id)
    )).scalar() or 0

    return {
        "batch_id":          batch.id,
        "batch_code":        batch.batch_code,
        "farm_id":           batch.farm_id,
        "hatchery_id":       batch.hatchery_id,
        "ordered_pl_stage":  batch.ordered_pl_stage.value if batch.ordered_pl_stage else None,
        "ordered_quantity":  batch.ordered_quantity,
        "invoice_quantity":  batch.invoice_quantity,
        "is_stocked":        batch.is_stocked,
        "diagnosis_sessions": diag_count,
        "received_date":     batch.received_date.isoformat() if batch.received_date else None,
    }


async def build_agent_context(
    db: AsyncSession,
    farm_id: Optional[int] = None,
    batch_id: Optional[int] = None,
    image_paths: Optional[List[str]] = None,
) -> dict:
    """
    Assemble the full live-data context dict passed to run_agent().
    Resolves farm_id from batch_id when only the batch is known.
    """
    ctx: dict = {
        "farm_id":     farm_id,
        "batch_id":    batch_id,
        "image_paths": image_paths or [],
    }

    # Resolve farm from batch when needed
    if batch_id and not farm_id:
        batch = await db.get(Batch, batch_id)
        if batch:
            ctx["farm_id"] = farm_id = batch.farm_id

    try:
        if farm_id:
            ctx["farm_history"]    = await _farm_history(db, farm_id)
            ctx["water_quality"]   = await _water_quality(db, farm_id)
            ctx["outbreak_alerts"] = await _outbreaks(db, farm_id)
        if batch_id:
            ctx["batch_info"] = await _batch_info(db, batch_id)
    except Exception as e:
        ctx["context_error"] = str(e)

    return ctx
