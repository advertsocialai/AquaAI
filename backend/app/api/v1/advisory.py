"""Crop advisory + IMD weather stubs."""
from __future__ import annotations
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/advisory", tags=["advisory"])


class CalendarStage(BaseModel):
    day: str
    stage: str
    action: str


class Weather(BaseModel):
    district: str
    temp_c: float
    condition: str
    rain_mm: int
    cyclone_alert: bool


CALENDAR_VANNAMEI = [
    CalendarStage(day="D-0",   stage="Pond Prep",   action="Lime, dry, fill, fertilise"),
    CalendarStage(day="D+5",   stage="Stocking",    action="PL acclimatisation 2-3 hrs"),
    CalendarStage(day="D+15",  stage="Nursery",     action="Starter feed 4×/day"),
    CalendarStage(day="D+30",  stage="Early Grow",  action="Aerators on, exchange 10%"),
    CalendarStage(day="D+60",  stage="Mid Grow",    action="Probiotics, monitor DO"),
    CalendarStage(day="D+90",  stage="Late Grow",   action="Lower protein, prep harvest"),
    CalendarStage(day="D+110", stage="Pre-Harvest", action="Final QC + buyer match"),
    CalendarStage(day="D+120", stage="Harvest",     action="Net out, ice, ship"),
]


@router.get("/calendar/{species}", response_model=list[CalendarStage])
def crop_calendar(species: str):
    return CALENDAR_VANNAMEI


@router.get("/weather", response_model=Weather)
def get_weather(district: str = "Bhimavaram"):
    return Weather(
        district=district,
        temp_c=29.0,
        condition="partly cloudy",
        rain_mm=65,
        cyclone_alert=False,
    )


@router.get("/alerts/nearby")
def nearby_alerts(lat: float | None = None, lng: float | None = None, radius_km: int = 5):
    return {
        "lat": lat,
        "lng": lng,
        "radius_km": radius_km,
        "alerts": [
            {"kind": "outbreak", "label": "EHP cluster 3.2 km E",  "severity": "high"},
            {"kind": "weather",  "label": "Heavy rain alert",      "severity": "medium"},
            {"kind": "water",    "label": "DO low — Pond 3",       "severity": "medium"},
            {"kind": "price",    "label": "Vannamei 40-ct ↑ 6%",   "severity": "low"},
        ],
    }


@router.get("/schemes")
def govt_schemes(user_id: str | None = None):
    return [
        {"name": "PMMSY",    "desc": "Pradhan Mantri Matsya Sampada Yojana",  "eligibility_match": 0.92},
        {"name": "NFDB",     "desc": "Working capital — pond input loans",     "eligibility_match": 0.78},
        {"name": "State AP", "desc": "Aerator subsidy 40%",                    "eligibility_match": 0.85},
    ]


@router.post("/assistant")
def ask_assistant(payload: dict):
    question = (payload.get("question") or "").lower()
    if "price" in question:    reply = "Vannamei 40-count is ₹420/kg today."
    elif "ehp" in question:    reply = "2 EHP-confirmed farms within 5 km in 48h."
    elif "feed" in question:   reply = "For 500 kg biomass at 4% body weight: 20 kg/day starter feed."
    elif "weather" in question:reply = "IMD forecast: 65mm rain tonight."
    else:                       reply = "I can help with pricing, disease alerts, feeding and weather."
    return {"reply": reply, "lang": payload.get("lang", "en")}
