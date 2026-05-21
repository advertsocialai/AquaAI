"""Subscription & billing management — from PL_Seed_Quality_Detection_Platform.docx."""
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timedelta
from app.database import get_db
from app.models.subscription import Subscription, TestCredit, InsuranceAPIRequest, PlanType, SubscriptionStatus
from app.models.user import User
from app.core.deps import get_current_user

router = APIRouter(prefix="/subscriptions", tags=["Subscriptions & Billing"])

PLAN_PRICES = {
    PlanType.farmer_monthly: 299.0,
    PlanType.farmer_annual: 2988.0,   # 12 months
    PlanType.per_test: 35.0,          # per credit
    PlanType.hatchery_basic: 1500.0,
    PlanType.hatchery_standard: 2000.0,
    PlanType.hatchery_premium: 3000.0,
    PlanType.vle_franchise: 12000.0,  # one-time
    PlanType.insurance_api: 0.0,      # per-call billing
    PlanType.govt_surveillance: 0.0,  # custom contract
}


class SubscribeRequest(BaseModel):
    plan_type: PlanType
    duration_months: int = Field(default=1, ge=1, le=60)
    hatchery_id: Optional[int] = None
    payment_reference: Optional[str] = None


class BuyCreditsRequest(BaseModel):
    credit_count: int = Field(gt=0, le=10000)
    payment_reference: Optional[str] = None


@router.post("/subscribe", status_code=201)
async def subscribe(
    payload: SubscribeRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    price = PLAN_PRICES.get(payload.plan_type, 0.0)
    duration = timedelta(days=30 * payload.duration_months)

    sub = Subscription(
        user_id=current_user.id if not payload.hatchery_id else None,
        hatchery_id=payload.hatchery_id,
        plan_type=payload.plan_type,
        status=SubscriptionStatus.active,
        monthly_price_inr=price,
        started_at=datetime.utcnow(),
        expires_at=datetime.utcnow() + duration,
        billing_details={"payment_ref": payload.payment_reference,
                         "duration_months": payload.duration_months},
    )
    db.add(sub)
    await db.commit()
    await db.refresh(sub)
    return {
        "subscription_id": sub.id,
        "plan": sub.plan_type,
        "status": sub.status,
        "price_inr": price * payload.duration_months,
        "expires_at": sub.expires_at,
    }


@router.post("/buy-credits")
async def buy_test_credits(
    payload: BuyCreditsRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """F25 (pay-per-use): Buy QC test credits at ₹35/credit."""
    price = PLAN_PRICES[PlanType.per_test] * payload.credit_count
    credit = TestCredit(
        user_id=current_user.id,
        credits_purchased=payload.credit_count,
        price_paid_inr=price,
    )
    db.add(credit)
    await db.commit()
    return {
        "credits_purchased": payload.credit_count,
        "price_paid_inr": price,
        "message": f"{payload.credit_count} QC test credits added to your account",
    }


@router.get("/my-plan")
async def get_my_subscription(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Subscription)
        .where(Subscription.user_id == current_user.id,
               Subscription.status == SubscriptionStatus.active)
        .order_by(Subscription.created_at.desc())
        .limit(1)
    )
    sub = result.scalar_one_or_none()
    if not sub:
        return {"status": "no_active_plan", "plan": None}

    credits_result = await db.execute(
        select(TestCredit).where(TestCredit.user_id == current_user.id)
    )
    credits = credits_result.scalars().all()
    total_credits = sum(c.credits_purchased - c.credits_used for c in credits)

    return {
        "plan": sub.plan_type,
        "status": sub.status,
        "expires_at": sub.expires_at,
        "tests_used_this_month": sub.tests_used_this_month,
        "available_credits": total_credits,
    }


@router.get("/revenue-summary")
async def revenue_summary(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Admin: Summary of all active subscriptions by plan type."""
    from sqlalchemy import func
    result = await db.execute(
        select(
            Subscription.plan_type,
            func.count(Subscription.id).label("count"),
            func.sum(Subscription.monthly_price_inr).label("monthly_revenue"),
        ).where(Subscription.status == SubscriptionStatus.active)
        .group_by(Subscription.plan_type)
    )
    return [{"plan": r.plan_type, "active_count": r.count,
             "monthly_revenue_inr": r.monthly_revenue or 0}
            for r in result.all()]


# F30: Insurance API Integration — data licensing revenue stream
insurance_router = APIRouter(prefix="/insurance", tags=["F30 — Insurance API Integration"])


@insurance_router.get("/verify/{certificate_id}")
async def insurance_verify_certificate(
    certificate_id: str,
    x_api_key: str = Header(...),
    db: AsyncSession = Depends(get_db),
):
    """
    F30: Insurance company API endpoint — ₹5-15 per call (data licensing revenue).
    Returns structured QC data with underwriting recommendation for automated crop insurance.
    """
    from app.models.certificate import QCCertificate
    result = await db.execute(
        select(QCCertificate).where(QCCertificate.certificate_id == certificate_id)
    )
    cert = result.scalar_one_or_none()

    # Log the API call for billing
    api_request = InsuranceAPIRequest(
        api_key=x_api_key,
        certificate_id=certificate_id,
        endpoint="/insurance/verify",
        response_status=200 if cert else 404,
        billed_inr=10.0,
    )
    db.add(api_request)
    await db.commit()

    if not cert:
        raise HTTPException(404, "Certificate not found")

    return {
        "certificate_id": certificate_id,
        "valid": cert.is_valid and not cert.is_revoked,
        "grade": cert.grade,
        "composite_score": cert.composite_score,
        "is_hard_fail": cert.is_hard_fail,
        "farm_name": cert.farm_name,
        "hatchery_name": cert.hatchery_name,
        "session_type": cert.session_type,
        "issued_at": cert.created_at,
        "expires_at": cert.expires_at,
        "underwriting_recommendation": _underwriting_recommendation(cert),
    }


def _underwriting_recommendation(cert) -> dict:
    if cert.is_hard_fail:
        return {"risk": "HIGH", "recommended_premium_multiplier": 2.5,
                "notes": "Hard-fail disease detected. High risk crop."}
    score = cert.composite_score or 0
    if score >= 85:
        return {"risk": "LOW", "recommended_premium_multiplier": 0.8, "notes": "Premium quality batch."}
    elif score >= 70:
        return {"risk": "MODERATE", "recommended_premium_multiplier": 1.0, "notes": "Standard risk."}
    elif score >= 55:
        return {"risk": "ELEVATED", "recommended_premium_multiplier": 1.4, "notes": "Conditional batch."}
    else:
        return {"risk": "HIGH", "recommended_premium_multiplier": 2.0, "notes": "Poor quality batch."}
