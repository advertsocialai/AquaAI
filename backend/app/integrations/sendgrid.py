"""SendGrid email adapter — transactional sends only.

Returns `{"ok": true, "mode": "stub", ...}` when SENDGRID_API_KEY is unset, so
the rest of the app can call send_email() unconditionally during local dev.

Reads config via `app.config.settings` (not os.getenv) — Pydantic Settings loads
.env into the settings object, not into the process environment.
"""
from __future__ import annotations
import httpx
from typing import Optional

from app.config import settings

SENDGRID_URL = "https://api.sendgrid.com/v3/mail/send"


async def send_email(
    to_email: str,
    subject: str,
    html: str,
    text: Optional[str] = None,
) -> dict:
    api_key = settings.sendgrid_api_key or ""
    from_email = settings.sendgrid_from_email or ""
    from_name = settings.sendgrid_from_name

    if not api_key or not from_email:
        return {
            "ok": True,
            "mode": "stub",
            "to": to_email,
            "subject": subject,
            "reason": "SENDGRID_API_KEY or SENDGRID_FROM_EMAIL not set",
        }

    payload = {
        "personalizations": [{"to": [{"email": to_email}]}],
        "from": {"email": from_email, "name": from_name},
        "subject": subject,
        "content": [
            {"type": "text/plain", "value": text or _strip_html(html)},
            {"type": "text/html", "value": html},
        ],
    }

    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.post(
            SENDGRID_URL,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json=payload,
        )
        # SendGrid returns 202 Accepted on success with empty body.
        ok = r.status_code == 202
        return {
            "ok": ok,
            "mode": "live",
            "status_code": r.status_code,
            "response": r.text[:500] if r.text else None,
        }


def _strip_html(html: str) -> str:
    """Crude fallback when caller doesn't supply a plain-text version."""
    import re
    return re.sub(r"<[^>]+>", "", html).strip()


# ── Pre-built templates ───────────────────────────────────────────────────

async def send_newsletter_welcome(to_email: str) -> dict:
    return await send_email(
        to_email=to_email,
        subject="Welcome to Aqua AI",
        html=(
            "<div style='font-family:Inter,sans-serif;max-width:560px;margin:0 auto;"
            "padding:32px;color:#0f172a;background:#ffffff;'>"
            "<h1 style='font-size:24px;margin:0 0 16px;color:#0891b2;'>You're in.</h1>"
            "<p style='font-size:15px;line-height:1.6;margin:0 0 16px;'>"
            "Thanks for subscribing to Aqua AI — India's AI-powered aquaculture "
            "intelligence platform.</p>"
            "<p style='font-size:15px;line-height:1.6;margin:0 0 16px;'>"
            "You'll get periodic updates on disease outbreak alerts, mandi price "
            "trends, new diagnostic models, and product releases.</p>"
            "<p style='font-size:13px;color:#64748b;margin:24px 0 0;'>"
            "Not what you signed up for? Reply with UNSUBSCRIBE and we'll remove "
            "you from the list.</p>"
            "</div>"
        ),
        text=(
            "You're in.\n\n"
            "Thanks for subscribing to Aqua AI — India's AI-powered aquaculture "
            "intelligence platform.\n\n"
            "You'll get periodic updates on disease outbreak alerts, mandi price "
            "trends, new diagnostic models, and product releases.\n\n"
            "Reply UNSUBSCRIBE to opt out."
        ),
    )
