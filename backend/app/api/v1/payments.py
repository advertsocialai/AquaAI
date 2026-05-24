"""Payments — Razorpay order creation + webhook + payouts.

This is a stub. In production:
  - Use razorpay-python SDK with RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET
  - Verify webhook signature with HMAC-SHA256 against RAZORPAY_WEBHOOK_SECRET
  - Persist Order + Payment rows to Postgres
  - Use Razorpay Route for split payouts (farmer first, platform fee after)
"""
from __future__ import annotations
import hmac
import hashlib
import time
from typing import Literal
from fastapi import APIRouter, Header, HTTPException, Request
from pydantic import BaseModel

router = APIRouter(prefix="/payments", tags=["payments"])

WEBHOOK_SECRET_PLACEHOLDER = "set-RAZORPAY_WEBHOOK_SECRET-in-env"


class CreateOrderRequest(BaseModel):
    amount_paise: int
    currency: Literal["INR"] = "INR"
    receipt: str
    notes: dict | None = None


class CreateOrderResponse(BaseModel):
    id: str
    amount: int
    currency: str
    receipt: str
    status: str
    created_at: int


class PayoutRequest(BaseModel):
    account_id: str
    amount_paise: int
    purpose: Literal["payout", "refund", "salary", "supplier_payment"] = "payout"
    narration: str | None = None


@router.post("/orders", response_model=CreateOrderResponse)
def create_order(req: CreateOrderRequest):
    if req.amount_paise < 100:
        raise HTTPException(400, "Minimum order is ₹1.00")
    return CreateOrderResponse(
        id=f"order_stub_{int(time.time())}",
        amount=req.amount_paise,
        currency=req.currency,
        receipt=req.receipt,
        status="created",
        created_at=int(time.time()),
    )


@router.post("/webhook")
async def razorpay_webhook(
    request: Request,
    x_razorpay_signature: str = Header(default=""),
):
    """Razorpay webhook receiver. Validates HMAC signature before acting."""
    body = await request.body()

    # Stub: in dev, accept all events. In prod, verify signature.
    if x_razorpay_signature and x_razorpay_signature != "stub":
        expected = hmac.new(
            WEBHOOK_SECRET_PLACEHOLDER.encode(), body, hashlib.sha256
        ).hexdigest()
        if not hmac.compare_digest(expected, x_razorpay_signature):
            raise HTTPException(400, "Invalid signature")

    try:
        payload = await request.json()
    except Exception:
        payload = {}

    event = payload.get("event", "unknown")
    # In production: dispatch to a Celery task that updates Order / Payment rows
    # and fires the right side effects (QC cert release, dispatch trigger, etc.)
    return {"ok": True, "event": event, "received_at": int(time.time())}


@router.post("/payouts")
def payout(req: PayoutRequest):
    """Trigger a payout to a verified bank account (RazorpayX stub)."""
    if req.amount_paise < 100:
        raise HTTPException(400, "Minimum payout is ₹1.00")
    return {
        "ok": True,
        "payout_id": f"pout_stub_{int(time.time())}",
        "account_id": req.account_id,
        "amount_paise": req.amount_paise,
        "purpose": req.purpose,
        "narration": req.narration,
        "status": "queued",
        "expected_settlement": "T+1 (working day)",
    }
