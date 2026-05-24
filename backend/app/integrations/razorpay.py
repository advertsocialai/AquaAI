"""Razorpay adapter — orders, signature verification, payouts (RazorpayX).

Activate by setting RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET + RAZORPAY_WEBHOOK_SECRET.
"""
from __future__ import annotations
import os
import hmac
import hashlib
import time
import httpx

KEY_ID = os.getenv("RAZORPAY_KEY_ID", "")
KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "")
WEBHOOK_SECRET = os.getenv("RAZORPAY_WEBHOOK_SECRET", "")


async def create_order(amount_paise: int, receipt: str, notes: dict | None = None) -> dict:
    if amount_paise < 100:
        return {"ok": False, "error": "Minimum order is ₹1.00"}

    if not (KEY_ID and KEY_SECRET):
        return {
            "ok": True,
            "id": f"order_stub_{int(time.time())}",
            "amount": amount_paise,
            "currency": "INR",
            "receipt": receipt,
            "status": "created",
            "mode": "stub",
        }

    async with httpx.AsyncClient(auth=(KEY_ID, KEY_SECRET), timeout=10) as client:
        r = await client.post(
            "https://api.razorpay.com/v1/orders",
            json={
                "amount": amount_paise,
                "currency": "INR",
                "receipt": receipt,
                "notes": notes or {},
            },
        )
        return r.json()


def verify_webhook_signature(body: bytes, signature: str) -> bool:
    if not WEBHOOK_SECRET:
        # In dev, accept everything. Never do this in production.
        return True
    expected = hmac.new(WEBHOOK_SECRET.encode(), body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)


async def payout(account_id: str, amount_paise: int, purpose: str = "payout", narration: str | None = None) -> dict:
    if amount_paise < 100:
        return {"ok": False, "error": "Minimum payout is ₹1.00"}
    if not (KEY_ID and KEY_SECRET):
        return {
            "ok": True,
            "payout_id": f"pout_stub_{int(time.time())}",
            "account_id": account_id,
            "amount_paise": amount_paise,
            "status": "queued",
            "mode": "stub",
        }
    # RazorpayX payouts require the account API.
    async with httpx.AsyncClient(auth=(KEY_ID, KEY_SECRET), timeout=10) as client:
        r = await client.post(
            "https://api.razorpay.com/v1/payouts",
            json={
                "account_number": account_id,
                "amount": amount_paise,
                "currency": "INR",
                "mode": "IMPS",
                "purpose": purpose,
                "narration": narration or "AquaI payout",
            },
        )
        return r.json()
