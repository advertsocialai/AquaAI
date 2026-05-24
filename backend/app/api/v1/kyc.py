"""KYC verification stubs — Aadhaar / PAN / GST / bank penny-drop.

Wire to NSDL/Karza/eKYC providers in production. All fields are
validated at the schema level so the front-end gets typed errors
without us hitting a paid provider during dev.
"""
from __future__ import annotations
import re
from typing import Literal
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, field_validator

router = APIRouter(prefix="/kyc", tags=["kyc"])

KycStatus = Literal["pending", "verified", "rejected"]


class AadhaarRequest(BaseModel):
    aadhaar: str

    @field_validator("aadhaar")
    @classmethod
    def must_be_12_digits(cls, v: str) -> str:
        v = re.sub(r"\D", "", v)
        if len(v) != 12:
            raise ValueError("Aadhaar must be 12 digits")
        return v


class OtpRequest(BaseModel):
    aadhaar_last4: str
    otp: str


class PanRequest(BaseModel):
    pan: str

    @field_validator("pan")
    @classmethod
    def pan_format(cls, v: str) -> str:
        v = v.upper()
        if not re.match(r"^[A-Z]{5}[0-9]{4}[A-Z]$", v):
            raise ValueError("Invalid PAN format")
        return v


class GstRequest(BaseModel):
    gstin: str

    @field_validator("gstin")
    @classmethod
    def gstin_format(cls, v: str) -> str:
        v = v.upper()
        if len(v) != 15:
            raise ValueError("GSTIN must be 15 characters")
        return v


class PennyDropRequest(BaseModel):
    account: str
    ifsc: str

    @field_validator("ifsc")
    @classmethod
    def ifsc_format(cls, v: str) -> str:
        v = v.upper()
        if not re.match(r"^[A-Z]{4}0[A-Z0-9]{6}$", v):
            raise ValueError("Invalid IFSC")
        return v


@router.post("/aadhaar/send-otp")
def send_aadhaar_otp(req: AadhaarRequest):
    last4 = req.aadhaar[-4:]
    return {"ok": True, "aadhaar_last4": last4, "otp_hint": "••••42"}


@router.post("/aadhaar/verify-otp")
def verify_aadhaar_otp(req: OtpRequest):
    if len(req.otp) != 6 or not req.otp.isdigit():
        raise HTTPException(400, "OTP must be 6 digits")
    return {
        "ok": True,
        "name": "V. Ramana",
        "dob": "1985-07-12",
        "aadhaar_last4": req.aadhaar_last4,
        "address": "Bhimavaram, West Godavari, AP",
        "status": "verified",
    }


@router.post("/pan/verify")
def verify_pan(req: PanRequest):
    return {"ok": True, "pan": req.pan, "name_match": True, "status": "verified"}


@router.post("/gst/verify")
def verify_gst(req: GstRequest):
    return {
        "ok": True,
        "gstin": req.gstin,
        "legal_name": "Aquaprime Hatcheries Pvt Ltd",
        "trade_name": "Aquaprime",
        "status": "active",
        "state": "Andhra Pradesh",
    }


@router.post("/bank/penny-drop")
def penny_drop(req: PennyDropRequest):
    if len(req.account) < 8:
        raise HTTPException(400, "Account number too short")
    return {
        "ok": True,
        "account_last4": req.account[-4:],
        "ifsc": req.ifsc,
        "bank": "State Bank of India",
        "branch": "Bhimavaram",
        "name_on_account": "V. RAMANA",
        "name_match_score": 0.97,
        "status": "verified",
    }


@router.get("/status/{user_id}")
def kyc_status(user_id: str):
    return {
        "user_id": user_id,
        "aadhaar": "verified",
        "pan": "verified",
        "gst": "pending",
        "bank": "verified",
        "mpeda_license": "missing",
        "overall": "partial",
    }
