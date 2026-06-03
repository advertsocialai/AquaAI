"""Service-provider requests — public POST endpoint (stub).

Accepts a request from the web "Service Providers" section (transporters,
lab & equipment, oxygen supply, resources/inputs). Currently a stub that
validates and acknowledges; wire to a `service_requests` table + provider
routing / notifications when that workflow is built.
"""
from __future__ import annotations

from datetime import datetime, timezone
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/service-requests", tags=["Service Requests"])


class ServiceRequest(BaseModel):
    providerId: str
    values: dict[str, str]
    timestamp: str | None = None


class ServiceRequestResponse(BaseModel):
    ok: bool
    id: str | None = None


@router.post("", response_model=ServiceRequestResponse)
async def submit(payload: ServiceRequest) -> ServiceRequestResponse:
    # Stub: acknowledge receipt. Replace with a DB insert + provider routing.
    rid = f"sr_{payload.providerId}_{int(datetime.now(timezone.utc).timestamp())}"
    return ServiceRequestResponse(ok=True, id=rid)
