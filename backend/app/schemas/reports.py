from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class CertificateOut(BaseModel):
    id: int
    certificate_id: str
    session_type: str
    composite_score: Optional[float]
    grade: Optional[str]
    is_hard_fail: bool
    is_valid: bool
    is_revoked: bool
    pdf_url: Optional[str]
    qr_code_url: Optional[str]
    expires_at: Optional[datetime]
    created_at: datetime
    farm_name: Optional[str]
    vle_name: Optional[str]
    hatchery_name: Optional[str]

    class Config:
        from_attributes = True


class VerifyResponse(BaseModel):
    certificate_id: str
    status: str  # Valid / Revoked / Expired / NotFound
    farm_name: Optional[str]
    hatchery_name: Optional[str]
    grade: Optional[str]
    composite_score: Optional[float]
    session_type: str
    issued_at: Optional[datetime]
    expires_at: Optional[datetime]
    is_hard_fail: bool


class ModelVersionOut(BaseModel):
    model_name: str
    version: str
    file_size_mb: Optional[float]
    download_url: Optional[str]
    release_notes: Optional[str]
    accuracy_metrics: Optional[dict]
    is_current: bool
    released_at: Optional[datetime]

    class Config:
        from_attributes = True


class SyncPayload(BaseModel):
    device_id: str
    sessions: List[dict]  # list of session data objects
