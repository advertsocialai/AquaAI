"""NSPAAD disease surveillance adapter.

NSPAAD is the National Surveillance Programme for Aquatic Animal
Diseases, run by ICAR-NBFGR. Real integration requires:
  - MoU with ICAR-NBFGR
  - VPN access to the NSPAAD portal
  - Quarterly data-sync agreement

This stub mirrors the JSON shape we'll receive once live.
"""
from __future__ import annotations
import os
from typing import Literal

NSPAAD_API_KEY = os.getenv("NSPAAD_API_KEY", "")

Severity = Literal["high", "medium", "low"]


async def file_report(payload: dict) -> dict:
    if not NSPAAD_API_KEY:
        return {
            "ok": True,
            "report_id": f"NSPAAD-stub-{payload.get('district', 'UNK')}",
            "filed_at": "2026-05-24T08:30:00+05:30",
            "mode": "stub",
        }
    # Live integration TBD.
    return {"ok": True, "report_id": "NSPAAD-LIVE-not-implemented"}


async def list_outbreaks(state: str | None = None, days: int = 14) -> list[dict]:
    rows = [
        {"district": "West Godavari", "state": "AP", "species": "L. vannamei", "disease": "EHP",   "farms": 14, "severity": "high"},
        {"district": "Krishna",       "state": "AP", "species": "L. vannamei", "disease": "WSSV",  "farms": 8,  "severity": "high"},
        {"district": "Nellore",       "state": "AP", "species": "L. vannamei", "disease": "AHPND", "farms": 3,  "severity": "medium"},
        {"district": "Surat",         "state": "GJ", "species": "L. vannamei", "disease": "EHP",   "farms": 5,  "severity": "medium"},
        {"district": "Bhubaneswar",   "state": "OD", "species": "P. monodon",  "disease": "WSSV",  "farms": 2,  "severity": "low"},
        {"district": "Kakdwip",       "state": "WB", "species": "P. monodon",  "disease": "BGD",   "farms": 1,  "severity": "low"},
    ]
    if state:
        rows = [r for r in rows if r["state"] == state.upper()]
    return rows
