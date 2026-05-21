from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime


class DiagnosisCreate(BaseModel):
    batch_id: int
    gps_lat: Optional[float] = None
    gps_lng: Optional[float] = None
    camera_mode: str = "software_mono"
    device_id: Optional[str] = None
    image_paths: List[str] = []


class PCRFeedbackCreate(BaseModel):
    pcr_result: str  # positive / negative
    ct_value: Optional[float] = None
    lab_name: Optional[str] = None


class DiagnosisResult(BaseModel):
    id: int
    batch_id: int
    ehp_prob: Optional[float]
    ehp_healthy_prob: Optional[float]
    ehp_suspected_prob: Optional[float]
    ehp_positive_prob: Optional[float]
    spore_detected: bool
    spore_count: Optional[int]
    spore_severity: Optional[str]
    wssv_positive: bool
    wssv_confidence: Optional[float]
    ahpnd_prob: Optional[float]
    bgd_prob: Optional[float]
    hpv_prob: Optional[float]
    gregarines_prob: Optional[float]
    wfs_prob: Optional[float]
    is_hard_fail: bool
    hard_fail_disease: Optional[str]
    risk_level: Optional[str]
    risk_action_text: Optional[str]
    gradcam_available: bool
    gradcam_image_url: Optional[str]
    multi_signal_fusion: Optional[Dict[str, Any]]
    session_date: datetime

    class Config:
        from_attributes = True


class OutbreakAlertOut(BaseModel):
    id: int
    disease: str
    severity: Optional[str]
    district: Optional[str]
    mandal: Optional[str]
    radius_km: float
    notified_farms_count: int
    created_at: datetime

    class Config:
        from_attributes = True
