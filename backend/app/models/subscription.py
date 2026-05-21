"""Subscription + billing model — from PL_Seed_Quality_Detection_Platform.docx."""
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Boolean, Enum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.database import Base


class PlanType(str, enum.Enum):
    farmer_monthly = "farmer_monthly"      # ₹199-499/month
    farmer_annual = "farmer_annual"        # Farmer SaaS
    per_test = "per_test"                  # ₹25-50 per QC report
    hatchery_basic = "hatchery_basic"      # ₹1,500/month
    hatchery_standard = "hatchery_standard"  # ₹2,000/month
    hatchery_premium = "hatchery_premium"   # ₹3,000/month
    vle_franchise = "vle_franchise"         # ₹8,000-15,000 one-time
    insurance_api = "insurance_api"         # ₹5-15 per report
    govt_surveillance = "govt_surveillance"  # B2G contract


class SubscriptionStatus(str, enum.Enum):
    active = "active"
    expired = "expired"
    cancelled = "cancelled"
    trial = "trial"


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    hatchery_id = Column(Integer, ForeignKey("hatcheries.id"), nullable=True)

    plan_type = Column(Enum(PlanType), nullable=False)
    status = Column(Enum(SubscriptionStatus), default=SubscriptionStatus.trial)

    monthly_price_inr = Column(Float, nullable=True)
    credits_remaining = Column(Integer, nullable=True)  # for per-test plan
    tests_used_this_month = Column(Integer, default=0)

    started_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=True)
    cancelled_at = Column(DateTime(timezone=True), nullable=True)

    billing_details = Column(JSON, nullable=True)  # Razorpay / payment details
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class TestCredit(Base):
    __tablename__ = "test_credits"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    credits_purchased = Column(Integer, nullable=False)
    credits_used = Column(Integer, default=0)
    price_paid_inr = Column(Float, nullable=True)
    purchased_at = Column(DateTime(timezone=True), server_default=func.now())


class InsuranceAPIRequest(Base):
    """Track insurance company API calls for data licensing revenue."""
    __tablename__ = "insurance_api_requests"

    id = Column(Integer, primary_key=True, index=True)
    api_key = Column(String(100), nullable=False, index=True)
    company_name = Column(String(255), nullable=True)
    certificate_id = Column(String(36), nullable=True)
    endpoint = Column(String(100), nullable=True)
    response_status = Column(Integer, nullable=True)
    billed_inr = Column(Float, default=10.0)
    requested_at = Column(DateTime(timezone=True), server_default=func.now())
