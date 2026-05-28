"""Crop advisory + weather (Open-Meteo free API, no key required)."""
from __future__ import annotations
from datetime import datetime
import httpx
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/advisory", tags=["advisory"])


class CalendarStage(BaseModel):
    day: str
    stage: str
    action: str


class WeatherDay(BaseModel):
    date: str                  # YYYY-MM-DD
    temp_min_c: float
    temp_max_c: float
    rain_mm: float
    condition: str             # short label e.g. "rain", "sunny", "thunderstorm"


class Weather(BaseModel):
    district: str
    lat: float
    lng: float
    today: WeatherDay
    forecast: list[WeatherDay]   # next 6 days (so 7 total with today)
    rain_alert: bool             # True if any of next 3 days has >25mm forecast
    cyclone_alert: bool


# Aquaculture-grade location map for AP shrimp belt. Lat/lng accurate to ~1km;
# Open-Meteo bins to its nearest grid cell anyway. Real impl will resolve a
# user's pond polygon centroid via PostGIS once farm geometries are captured.
#
# Grouped by district so the dashboard can render a hierarchical picker.
_LOCATION_GEO: dict[str, tuple[float, float]] = {
    # ── West Godavari + Eluru (AP) ───────────────────────────────────────
    "Bhimavaram":     (16.5449, 81.5212),
    "Tadepalligudem": (16.8147, 81.5247),
    "Tanuku":         (16.7546, 81.6800),
    "Narsapur":       (16.4356, 81.6964),
    "Palakollu":      (16.5170, 81.7340),
    "Akiveedu":       (16.5926, 81.4119),
    "Undi":           (16.5783, 81.4283),
    "Bhimadole":      (16.7950, 81.2967),
    "Eluru":          (16.7100, 81.0950),
    "Nidamarru":      (16.6500, 81.4000),
    "Kovvur":         (17.0167, 81.7333),
    "Achanta":        (16.5594, 81.7367),
    "Mogalturu":      (16.3950, 81.7333),
    "Veeravasaram":   (16.5500, 81.6000),
    "Penugonda":      (16.6500, 81.7333),
    "Iragavaram":     (16.5594, 81.5594),
    "Kalla":          (16.4933, 81.6750),

    # ── East Godavari + Kakinada + Konaseema (AP) ────────────────────────
    "Kakinada":          (16.9891, 82.2475),
    "Rajahmundry":       (17.0005, 81.8040),
    "Amalapuram":        (16.5781, 82.0028),
    "Ramachandrapuram":  (16.8350, 82.0167),
    "Pithapuram":        (17.1167, 82.2500),
    "Tuni":              (17.3475, 82.5475),
    "Mandapeta":         (16.8666, 81.9333),
    "Razole":            (16.4750, 81.8334),
    "Mummidivaram":      (16.6500, 82.0500),
    "Ravulapalem":       (16.7600, 81.8350),
    "Kothapeta":         (16.7100, 81.9300),
    "Yanam":             (16.7333, 82.2167),
    "Allavaram":         (16.4900, 82.0800),
    "Sakhinetipalle":    (16.3300, 82.0700),
    "P. Gannavaram":     (16.6200, 81.9500),
    "I. Polavaram":      (16.5800, 82.0500),
    "Katrenikona":       (16.5400, 82.1900),
    "Uppalaguptam":      (16.3500, 82.1300),
    "Malikipuram":       (16.4400, 81.8500),

    # ── Coastal Andhra outside Godavari belt (kept for compatibility) ────
    "Nellore":     (14.4426, 79.9865),
    "Krishna":     (16.5062, 80.6480),
    "Vijayawada":  (16.5062, 80.6480),
    "Ongole":      (15.5057, 80.0499),
    "Tirupati":    (13.6288, 79.4192),

    # ── Other Indian aquaculture clusters ────────────────────────────────
    "Surat":       (21.1702, 72.8311),
    "Bhubaneswar": (20.2961, 85.8245),
    "Kolkata":     (22.5726, 88.3639),
    "Chennai":     (13.0827, 80.2707),
}

# District groupings for the frontend picker.
LOCATION_DISTRICTS: dict[str, list[str]] = {
    "West Godavari": [
        "Bhimavaram", "Tadepalligudem", "Tanuku", "Narsapur", "Palakollu",
        "Akiveedu", "Undi", "Bhimadole", "Eluru", "Nidamarru", "Kovvur",
        "Achanta", "Mogalturu", "Veeravasaram", "Penugonda", "Iragavaram", "Kalla",
    ],
    "East Godavari (incl. Kakinada / Konaseema)": [
        "Kakinada", "Rajahmundry", "Amalapuram", "Ramachandrapuram", "Pithapuram",
        "Tuni", "Mandapeta", "Razole", "Mummidivaram", "Ravulapalem", "Kothapeta",
        "Yanam", "Allavaram", "Sakhinetipalle", "P. Gannavaram", "I. Polavaram",
        "Katrenikona", "Uppalaguptam", "Malikipuram",
    ],
    "Other AP Coastal": ["Nellore", "Krishna", "Vijayawada", "Ongole", "Tirupati"],
    "Other India":     ["Surat", "Bhubaneswar", "Kolkata", "Chennai"],
}


def _weather_code_label(code: int) -> str:
    # WMO codes — https://open-meteo.com/en/docs#weathervariables
    if code == 0: return "sunny"
    if code in (1, 2, 3): return "partly cloudy"
    if code in (45, 48): return "fog"
    if code in (51, 53, 55, 56, 57): return "drizzle"
    if code in (61, 63, 65, 66, 67, 80, 81, 82): return "rain"
    if code in (71, 73, 75, 77, 85, 86): return "snow"
    if code in (95, 96, 99): return "thunderstorm"
    return "unknown"


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


@router.get("/locations")
def list_locations():
    """Hierarchical list of supported locations for the dashboard picker."""
    return {
        "districts": [
            {"name": name, "locations": locs}
            for name, locs in LOCATION_DISTRICTS.items()
        ],
        "default": "Bhimavaram",
    }


@router.get("/weather", response_model=Weather)
async def get_weather(location: str = "Bhimavaram"):
    """7-day forecast via Open-Meteo (free, no key). Falls back to a stub
    on upstream failure so the dashboard never goes blank."""
    coords = _LOCATION_GEO.get(location) or _LOCATION_GEO["Bhimavaram"]
    lat, lng = coords

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            r = await client.get(
                "https://api.open-meteo.com/v1/forecast",
                params={
                    "latitude": lat,
                    "longitude": lng,
                    "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode",
                    "timezone": "Asia/Kolkata",
                    "forecast_days": 7,
                },
            )
            r.raise_for_status()
            data = r.json()["daily"]
    except Exception:
        # Stub fallback so the dashboard never breaks. Marked as offline by
        # condition="unknown" so the frontend can show a soft warning if needed.
        today_stub = WeatherDay(
            date=datetime.now().strftime("%Y-%m-%d"),
            temp_min_c=26, temp_max_c=32, rain_mm=0, condition="unknown",
        )
        return Weather(
            district=location, lat=lat, lng=lng,
            today=today_stub,
            forecast=[today_stub] * 6,
            rain_alert=False, cyclone_alert=False,
        )

    days = [
        WeatherDay(
            date=data["time"][i],
            temp_min_c=data["temperature_2m_min"][i],
            temp_max_c=data["temperature_2m_max"][i],
            rain_mm=data["precipitation_sum"][i] or 0,
            condition=_weather_code_label(data["weathercode"][i]),
        )
        for i in range(len(data["time"]))
    ]

    # Rain alarm: trigger if any of next 3 days has >25mm precip, or any
    # day has a thunderstorm code. 25mm is the IMD "heavy rain" threshold.
    upcoming = days[:3]
    rain_alert = any(d.rain_mm > 25 for d in upcoming) or any(
        d.condition == "thunderstorm" for d in upcoming
    )

    return Weather(
        district=location,
        lat=lat,
        lng=lng,
        today=days[0],
        forecast=days[1:],
        rain_alert=rain_alert,
        cyclone_alert=False,   # placeholder — separate IMD cyclone API later
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
