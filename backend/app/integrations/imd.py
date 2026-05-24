"""IMD (India Meteorological Department) weather adapter.

IMD exposes a public AWS-hosted API for forecasts at city.imd.gov.in/
api/. Real integration requires:
  - IMD data-sharing agreement for commercial use
  - Cache layer to avoid hammering the upstream
"""
from __future__ import annotations
import os
import httpx

IMD_API_KEY = os.getenv("IMD_API_KEY", "")
IMD_BASE = "https://city.imd.gov.in/api"


# Static mapping for the districts we serve. Real impl resolves via lat/lng.
_STATIONS = {
    "Bhimavaram":  "WMO-IN-43185",
    "Nellore":     "WMO-IN-43192",
    "Krishna":     "WMO-IN-43150",
    "Surat":       "WMO-IN-42840",
    "Bhubaneswar": "WMO-IN-42971",
    "Kolkata":     "WMO-IN-42809",
}


async def current_weather(district: str) -> dict:
    if not IMD_API_KEY:
        return {
            "district": district,
            "temp_c": 29.0,
            "condition": "partly cloudy",
            "rain_mm": 65,
            "cyclone_alert": False,
            "humidity_pct": 72,
            "wind_kmh": 14,
            "mode": "stub",
        }
    station = _STATIONS.get(district)
    if not station:
        return {"district": district, "error": "Station not mapped"}

    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(f"{IMD_BASE}/current_wx_api.php", params={"id": station, "key": IMD_API_KEY})
        data = r.json()
        return {"district": district, **data}


async def cyclone_alerts() -> list[dict]:
    if not IMD_API_KEY:
        return [
            {
                "name": "stub-cyclone",
                "status": "watch",
                "category": "deep depression",
                "expected_landfall": "2026-05-27",
                "affected_states": ["AP", "OD"],
            }
        ]
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(f"{IMD_BASE}/cyclone_advisories.php", params={"key": IMD_API_KEY})
        return r.json().get("advisories", [])
