"""Contact form submissions — public POST endpoint shared by web + mobile.

Inserts into `contact_submissions` and fires a notification email to the
support inbox (stub mode until SENDGRID_FROM_EMAIL is set).
"""
from __future__ import annotations
from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel, EmailStr
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.integrations import sendgrid as sg
from app.config import settings

router = APIRouter(prefix="/contact", tags=["Contact"])


class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    message: str
    source: str = "web"  # 'web' | 'mobile'


class ContactResponse(BaseModel):
    ok: bool
    id: int | None = None
    email_sent: bool = False
    email_mode: str | None = None


@router.post("/submit", response_model=ContactResponse)
async def submit(
    payload: ContactRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    ip = request.client.host if request.client else None
    ua = request.headers.get("user-agent", "")[:500]

    result = await db.execute(
        text(
            "INSERT INTO contact_submissions (name, email, phone, message, source, ip_address, user_agent) "
            "VALUES (:name, :email, :phone, :message, :source, :ip, :ua) "
            "RETURNING id"
        ),
        {
            "name": payload.name.strip()[:255],
            "email": payload.email.lower().strip(),
            "phone": (payload.phone or "").strip()[:50] or None,
            "message": payload.message.strip(),
            "source": payload.source,
            "ip": ip,
            "ua": ua,
        },
    )
    sub_id = result.scalar_one()
    await db.commit()

    # Notify the support inbox (uses SENDGRID_FROM_EMAIL as both sender + recipient
    # for now; switch to a dedicated support@ address once you've verified one).
    notify_to = settings.sendgrid_from_email or ""
    send_result = {"ok": False, "mode": "skipped"}
    if notify_to:
        send_result = await sg.send_email(
            to_email=notify_to,
            subject=f"[Aqua AI] New contact form: {payload.name}",
            html=(
                f"<div style='font-family:Inter,sans-serif;max-width:560px;color:#0f172a;'>"
                f"<h2 style='color:#0891b2;'>New contact form submission</h2>"
                f"<p><b>Name:</b> {payload.name}</p>"
                f"<p><b>Email:</b> {payload.email}</p>"
                f"<p><b>Phone:</b> {payload.phone or '(not provided)'}</p>"
                f"<p><b>Source:</b> {payload.source}</p>"
                f"<p><b>Message:</b></p>"
                f"<p style='white-space:pre-wrap;background:#f8fafc;padding:12px;border-radius:8px;'>"
                f"{payload.message}</p>"
                f"<p style='color:#64748b;font-size:12px;'>Submission #{sub_id}</p>"
                f"</div>"
            ),
        )

    return ContactResponse(
        ok=True,
        id=sub_id,
        email_sent=send_result.get("ok", False),
        email_mode=send_result.get("mode"),
    )
