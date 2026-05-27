"""Newsletter subscription — public POST endpoint for the footer form.

Inserts the email into `newsletter_subscribers` and sends a welcome via SendGrid
(falls back to stub when SENDGRID_API_KEY/FROM_EMAIL aren't configured).
"""
from __future__ import annotations
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, EmailStr
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.integrations import sendgrid as sg

router = APIRouter(prefix="/newsletter", tags=["Newsletter"])


class SubscribeRequest(BaseModel):
    email: EmailStr
    source: str = "footer"


class SubscribeResponse(BaseModel):
    ok: bool
    already_subscribed: bool = False
    email_sent: bool = False
    email_mode: str | None = None


@router.post("/subscribe", response_model=SubscribeResponse)
async def subscribe(
    payload: SubscribeRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    email = payload.email.lower().strip()
    ip = request.client.host if request.client else None
    ua = request.headers.get("user-agent", "")[:500]

    # ON CONFLICT … DO NOTHING — idempotent: re-subscribing the same email
    # returns ok=true without duplicating the row or re-sending the welcome.
    result = await db.execute(
        text(
            "INSERT INTO newsletter_subscribers (email, source, ip_address, user_agent) "
            "VALUES (:email, :source, :ip, :ua) "
            "ON CONFLICT (email) DO NOTHING "
            "RETURNING id"
        ),
        {"email": email, "source": payload.source, "ip": ip, "ua": ua},
    )
    inserted = result.scalar_one_or_none()
    await db.commit()

    if inserted is None:
        return SubscribeResponse(ok=True, already_subscribed=True)

    send_result = await sg.send_newsletter_welcome(email)
    return SubscribeResponse(
        ok=True,
        email_sent=send_result.get("ok", False),
        email_mode=send_result.get("mode"),
    )
