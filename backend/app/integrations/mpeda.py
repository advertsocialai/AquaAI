"""MPEDA license verification adapter.

MPEDA does not currently expose a public REST API for license lookup; in
production we plan to combine:
  - Scheduled scraping of mpeda.gov.in license pages
  - Manual quarterly sync with MPEDA RGCA contact
  - Email-based renewal reminders

For now, returns stubbed verification + a small in-memory cache of
known licenses so the dashboard can demo without network.
"""
from __future__ import annotations
import os

_KNOWN = {
    "MPEDA/AP/HAT/0142": {
        "legal_name": "Aquaprime Hatcheries Pvt Ltd",
        "tier": "A++",
        "valid_until": "2027-03-31",
        "address": "Bhimavaram, West Godavari, AP",
    },
    "MPEDA/AP/HAT/0188": {
        "legal_name": "BlueFin SPF Labs",
        "tier": "A+",
        "valid_until": "2026-12-31",
        "address": "Nellore, AP",
    },
    "MPEDA/GJ/HAT/0091": {
        "legal_name": "Sagar Seed Co.",
        "tier": "A",
        "valid_until": "2027-01-15",
        "address": "Surat, GJ",
    },
}

MPEDA_API_KEY = os.getenv("MPEDA_API_KEY", "")


async def verify_license(license_no: str) -> dict:
    license_no = license_no.strip().upper()

    if license_no in _KNOWN:
        return {"ok": True, "license_no": license_no, **_KNOWN[license_no], "mode": "stub-cache"}

    if not MPEDA_API_KEY:
        return {
            "ok": False,
            "license_no": license_no,
            "error": "License not found in local cache · pending live MPEDA sync",
            "mode": "stub",
        }

    # Real implementation goes here once MPEDA API is available.
    return {"ok": False, "license_no": license_no, "error": "Not implemented"}


async def renewal_reminders(days_ahead: int = 60) -> list[dict]:
    return [
        {"license_no": k, "legal_name": v["legal_name"], "valid_until": v["valid_until"]}
        for k, v in _KNOWN.items()
    ]
