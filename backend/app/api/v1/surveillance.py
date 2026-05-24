"""Government surveillance + NSPAAD stubs for MPEDA / Govt officers."""
from __future__ import annotations
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/surveillance", tags=["surveillance"])


class Outbreak(BaseModel):
    district: str
    state: str
    species: str
    disease: str
    farms: int
    severity: str


class ComplianceMetric(BaseModel):
    metric: str
    value: str
    delta: str


OUTBREAKS = [
    Outbreak(district="West Godavari", state="AP", species="L. vannamei", disease="EHP",   farms=14, severity="high"),
    Outbreak(district="Krishna",       state="AP", species="L. vannamei", disease="WSSV",  farms=8,  severity="high"),
    Outbreak(district="Nellore",       state="AP", species="L. vannamei", disease="AHPND", farms=3,  severity="medium"),
    Outbreak(district="Surat",         state="GJ", species="L. vannamei", disease="EHP",   farms=5,  severity="medium"),
    Outbreak(district="Bhubaneswar",   state="OD", species="P. monodon",  disease="WSSV",  farms=2,  severity="low"),
    Outbreak(district="Kakdwip",       state="WB", species="P. monodon",  disease="BGD",   farms=1,  severity="low"),
]


COMPLIANCE = [
    ComplianceMetric(metric="MPEDA-licensed hatcheries", value="1,247", delta="+18 this quarter"),
    ComplianceMetric(metric="Active surveillance farms", value="8,432", delta="+612 vs Q1"),
    ComplianceMetric(metric="NSPAAD reports filed",      value="342",   delta="+24 this week"),
    ComplianceMetric(metric="Critical alerts (30d)",     value="47",    delta="+12 vs prev 30d"),
]


@router.get("/outbreaks", response_model=list[Outbreak])
def list_outbreaks():
    return OUTBREAKS


@router.get("/compliance", response_model=list[ComplianceMetric])
def compliance_metrics():
    return COMPLIANCE


@router.post("/nspaad/report")
def nspaad_report(payload: dict):
    """NSPAAD disease report auto-sync stub. Wire to ICAR-NBFGR portal."""
    return {"ok": True, "report_id": "NSPAAD-2026-W21-001", "synced_at": "2026-05-24T08:30:00+05:30"}


@router.get("/pmmsy")
def pmmsy_reach():
    return {
        "beneficiaries": 42108,
        "subsidies_inr_cr": 187.3,
        "aerator_subsidy_claims": 3891,
        "pond_construction_grants": 612,
    }
