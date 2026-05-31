"""Pricing intelligence stubs. Returns mock data with the right shape.
Wire to real mandi/MPEDA feeds, WebSocket pub/sub, and TimescaleDB later.
"""
from __future__ import annotations
from typing import Literal
from datetime import date, timedelta
from fastapi import APIRouter, Query
from pydantic import BaseModel

router = APIRouter(prefix="/pricing", tags=["pricing"])


class PriceRow(BaseModel):
    species: str
    size: str
    low: int
    high: int
    trend: Literal["up", "down", "flat"]


class PricePoint(BaseModel):
    date: str
    price: int


PRAWN: list[PriceRow] = [
    PriceRow(species="L. vannamei",          size="30 count",    low=480, high=550, trend="up"),
    PriceRow(species="L. vannamei",          size="40 count",    low=380, high=450, trend="up"),
    PriceRow(species="L. vannamei",          size="50 count",    low=320, high=380, trend="flat"),
    PriceRow(species="L. vannamei",          size="60 count",    low=280, high=330, trend="flat"),
    PriceRow(species="L. vannamei",          size="70 count",    low=240, high=290, trend="down"),
    PriceRow(species="L. vannamei",          size="80 count",    low=210, high=260, trend="down"),
    PriceRow(species="L. vannamei",          size="100 count",   low=180, high=220, trend="down"),
    PriceRow(species="P. monodon (Tiger)",   size="20 count",    low=750, high=900, trend="up"),
    PriceRow(species="P. monodon (Tiger)",   size="30 count",    low=600, high=720, trend="up"),
    PriceRow(species="Scampi",               size="6-10 count",  low=550, high=700, trend="up"),
]

FRESHWATER: list[PriceRow] = [
    PriceRow(species="Rohu",              size="1-2 kg",     low=140, high=180, trend="flat"),
    PriceRow(species="Catla",             size="1.5-3 kg",   low=130, high=170, trend="flat"),
    PriceRow(species="Mrigal",            size="1-2 kg",     low=110, high=150, trend="down"),
    PriceRow(species="Pangasius",         size="1-2 kg",     low=110, high=140, trend="flat"),
    PriceRow(species="Tilapia (GIFT)",    size="500g-1 kg",  low=120, high=160, trend="up"),
    PriceRow(species="Murrel",            size="500g-1 kg",  low=350, high=500, trend="up"),
    PriceRow(species="Pearl Spot",        size="200-400 g",  low=280, high=400, trend="up"),
]

MARINE: list[PriceRow] = [
    PriceRow(species="Asian Seabass",     size="1-2 kg",     low=350, high=450, trend="up"),
    PriceRow(species="Milkfish",          size="500g-1 kg",  low=180, high=240, trend="flat"),
    PriceRow(species="Pompano",           size="400-600 g",  low=300, high=400, trend="up"),
    PriceRow(species="Cobia",             size="2-5 kg",     low=350, high=500, trend="up"),
    PriceRow(species="Grouper",           size="1-3 kg",     low=550, high=800, trend="up"),
    PriceRow(species="Mud Crab",          size="300g-1.5 kg",low=450, high=1200,trend="up"),
]

CATEGORIES = {"prawn": PRAWN, "freshwater": FRESHWATER, "marine": MARINE}


@router.get("/history", response_model=list[PricePoint])
def price_history(
    species: str = Query(...),
    range: Literal["7d", "30d", "90d", "1y"] = Query("30d"),
):
    n = {"7d": 7, "30d": 30, "90d": 90, "1y": 52}[range]
    base = 420
    today = date.today()
    points: list[PricePoint] = []
    for i in range_iter(n):
        d = today - timedelta(days=(n - 1 - i) * (7 if range == "1y" else 1))
        offset = ((i * 11 + ord(species[0])) % 30) - 15
        points.append(PricePoint(date=d.isoformat(), price=base + offset))
    return points


def range_iter(n: int):
    return list(range(n))


@router.get("/{category}", response_model=list[PriceRow])
def list_prices(category: Literal["prawn", "freshwater", "marine"]):
    return CATEGORIES[category]


@router.get("/alerts/configured")
def configured_alerts(user_id: str | None = None):
    return {
        "user_id": user_id or "stub_user",
        "alerts": [
            {"species": "L. vannamei", "size": "40 count", "above": 420},
            {"species": "P. monodon",  "size": "30 count", "above": 700},
        ],
    }


@router.post("/alerts")
def create_alert(payload: dict):
    # Confirm the alert was set via web push. If a Supabase user_id is supplied
    # target just that user; otherwise broadcast. Best-effort.
    try:
        from app.services.webpush_service import notify_price_alert
        species = str(payload.get("species", "Your species"))
        above = payload.get("above") or payload.get("price") or 0
        uid = payload.get("user_id")
        notify_price_alert(
            user_ids=[uid] if uid else None,
            species=species, price_inr=float(above or 0),
            detail=f"Alert set: we'll notify you when {species} crosses ₹{float(above or 0):,.0f}/kg.",
        )
    except Exception as e:  # noqa: BLE001
        print(f"[WebPush ERROR] {e}")
    return {"ok": True, "alert_id": "alert_stub_001", "payload": payload}
