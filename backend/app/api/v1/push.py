"""Web push endpoints.

- GET  /push/config     → public VAPID key + whether push is enabled (for the
                          web app to know if it can subscribe).
- POST /push/test       → send a test notification to one or more users
                          (admin/govt only; broadcasts when no user_ids given).

Actual event-driven pushes (outbreak alerts, price moves, order updates) call
app.services.webpush_service.send_web_push directly from their flows.
"""
from __future__ import annotations
from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.config import settings
from app.core.deps import require_roles
from app.models.user import UserRole
from app.services.webpush_service import send_web_push

router = APIRouter(prefix="/push", tags=["Push Notifications"])


class PushConfig(BaseModel):
    enabled: bool
    vapid_public_key: Optional[str] = None


class TestPushRequest(BaseModel):
    title: str = "Aqua Rudra"
    body: str = "This is a test notification."
    url: str = "/"
    user_ids: Optional[list[str]] = None  # Supabase auth UUIDs; None = broadcast


class PushResult(BaseModel):
    sent: int
    failed: int
    pruned: int
    stub: bool


@router.get("/config", response_model=PushConfig)
async def push_config():
    return PushConfig(
        enabled=bool(settings.vapid_public_key and settings.vapid_private_key),
        vapid_public_key=settings.vapid_public_key,
    )


@router.post("/test", response_model=PushResult)
async def send_test(
    payload: TestPushRequest,
    _user=Depends(require_roles(UserRole.admin, UserRole.govt_officer)),
):
    result = send_web_push(
        title=payload.title,
        body=payload.body,
        url=payload.url,
        user_ids=payload.user_ids,
        tag="test",
    )
    return PushResult(**result)
