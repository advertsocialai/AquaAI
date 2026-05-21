from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class GradingSessionCreate(BaseModel):
    batch_id: int
    gps_lat: Optional[float] = None
    gps_lng: Optional[float] = None
    device_id: Optional[str] = None
    image_paths: List[str] = []
    planned_density_per_sqm: Optional[float] = None


class GradingResult(BaseModel):
    id: int
    batch_id: int
    composite_score: Optional[float]
    composite_grade: Optional[str]
    is_hard_fail: bool
    hard_fail_reason: Optional[str]

    visual_health_score: Optional[float]
    body_colour_score: Optional[float]
    gut_visibility_score: Optional[float]
    tail_muscle_score: Optional[float]
    appendage_score: Optional[float]
    posture_score: Optional[float]
    activity_score_visual: Optional[float]

    detected_pl_stage: Optional[str]
    stage_confidence: Optional[float]
    stage_score: Optional[float]
    stage_mismatch: bool

    size_uniformity_score: Optional[float]
    cv_pct: Optional[float]

    disease_score: Optional[float]
    activity_score: Optional[float]

    recommended_density_pct: Optional[float]
    recommended_density_per_sqm: Optional[float]
    stocking_recommendation: Optional[str]

    count_mismatch: bool
    count_discrepancy_pct: Optional[float]

    size_histogram_data: Optional[dict]
    session_date: datetime

    class Config:
        from_attributes = True


class StockingRecommendation(BaseModel):
    composite_score: float
    grade: str
    recommended_density_pct: float
    recommended_density_per_sqm: Optional[float]
    action: str
    reasoning: str
