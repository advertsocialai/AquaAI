"""
Risk-scoring API used by banks and insurers — wraps farm-level QC + outbreak
signals into a Band A-D rating that the frontend's FarmRiskBook screen consumes.
"""
from typing import Literal
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/risk", tags=["Risk Scoring"])


class FarmRisk(BaseModel):
    id: str
    farmer: str
    district: str
    acres: float
    qsAvg: int            # average composite Quality Score 0-100
    outbreakRisk: int     # 0-100 (higher = worse)
    band: Literal["A", "B", "C", "D"]
    loanReq: int          # requested loan ₹
    recommended: int      # recommended sanction ₹


# Sample book — real implementation joins farms, grading_sessions, disease_sessions,
# outbreak_alerts. Returning representative rows so banks see the integration shape.
FARMS = [
    FarmRisk(id="F-1142", farmer="V. Ramana",     district="Bhimavaram", acres=4.5, qsAvg=91, outbreakRisk=12, band="A", loanReq= 800_000, recommended= 800_000),
    FarmRisk(id="F-1187", farmer="K. Srinivasan", district="Nellore",    acres=2.0, qsAvg=84, outbreakRisk=28, band="B", loanReq= 400_000, recommended= 350_000),
    FarmRisk(id="F-1203", farmer="A. Mohanty",    district="Paradip",    acres=1.5, qsAvg=72, outbreakRisk=48, band="C", loanReq= 300_000, recommended= 180_000),
    FarmRisk(id="F-1221", farmer="S. Banerjee",   district="Haldia",     acres=1.0, qsAvg=61, outbreakRisk=64, band="D", loanReq= 250_000, recommended=       0),
    FarmRisk(id="F-1234", farmer="P. Patel",      district="Surat",      acres=6.0, qsAvg=88, outbreakRisk=18, band="A", loanReq=1_200_000, recommended=1_200_000),
]


@router.get("/farms", response_model=list[FarmRisk])
def farm_risk_book():
    """All farms with their risk band — entry point for the bank dashboard."""
    return FARMS


@router.get("/farms/{farm_id}", response_model=FarmRisk)
def farm_risk_detail(farm_id: str):
    for f in FARMS:
        if f.id == farm_id:
            return f
    # Default to a Band-D unknown when farm not yet in the book
    return FarmRisk(
        id=farm_id, farmer="Unknown", district="—", acres=0,
        qsAvg=0, outbreakRisk=99, band="D", loanReq=0, recommended=0,
    )
