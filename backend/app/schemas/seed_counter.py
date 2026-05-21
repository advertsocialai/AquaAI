from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class CountingSessionCreate(BaseModel):
    batch_id: int
    gps_lat: Optional[float] = None
    gps_lng: Optional[float] = None
    led_brightness: int = 3
    device_id: Optional[str] = None
    # image paths submitted after upload
    image_paths: List[str] = []


class ExtrapolationRequest(BaseModel):
    sample_volume_ml: float
    total_volume_ml: float
    invoice_quantity: Optional[int] = None


class SplitCountRequest(BaseModel):
    sub_counts: List[int]  # count from each of 5 sub-samples


class CountingResult(BaseModel):
    id: int
    batch_id: int
    live_count: Optional[int]
    dead_count: Optional[int]
    total_count: Optional[int]
    mortality_pct: Optional[float]
    mortality_alert: Optional[str]
    cv_pct: Optional[float]
    cv_flag: Optional[str]
    confidence_interval: Optional[int]
    extrapolated_count: Optional[int]
    extrapolated_margin: Optional[int]
    invoice_flag: bool
    invoice_discrepancy_pct: Optional[float]
    is_split_count: bool
    split_mean: Optional[float]
    split_sd: Optional[float]
    session_date: datetime
    sync_status: str

    class Config:
        from_attributes = True
