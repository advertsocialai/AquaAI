"""Aadhaar e-KYC adapter (NSDL / Karza).

To switch from stubs to real:
  1. Pick a provider (NSDL or Karza) and license e-KYC
  2. Set KARZA_API_KEY (or NSDL credentials) in the environment
  3. The check below activates the real HTTP calls; stub mode is otherwise default.
"""
from __future__ import annotations
import os
import re
from dataclasses import dataclass
from typing import Optional
import httpx

API_KEY = os.getenv("KARZA_API_KEY", "")
KARZA_BASE = "https://api.karza.in/v3"


@dataclass
class AadhaarEkycResult:
    ok: bool
    name: str
    aadhaar_last4: str
    dob: Optional[str] = None
    address: Optional[str] = None
    raw: Optional[dict] = None


async def send_otp(aadhaar: str) -> dict:
    aadhaar = re.sub(r"\D", "", aadhaar)
    if len(aadhaar) != 12:
        return {"ok": False, "error": "Aadhaar must be 12 digits"}

    if not API_KEY:
        return {"ok": True, "aadhaar_last4": aadhaar[-4:], "otp_hint": "••••42", "mode": "stub"}

    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.post(
            f"{KARZA_BASE}/aadhaar/otp",
            headers={"x-karza-key": API_KEY},
            json={"aadhaar_no": aadhaar, "consent": "Y"},
        )
        return r.json()


async def verify_otp(aadhaar_last4: str, otp: str) -> AadhaarEkycResult:
    if not (otp.isdigit() and len(otp) == 6):
        return AadhaarEkycResult(ok=False, name="", aadhaar_last4=aadhaar_last4)

    if not API_KEY:
        return AadhaarEkycResult(
            ok=True,
            name="V. Ramana",
            aadhaar_last4=aadhaar_last4,
            dob="1985-07-12",
            address="Bhimavaram, West Godavari, AP",
            raw={"mode": "stub"},
        )

    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.post(
            f"{KARZA_BASE}/aadhaar/verify",
            headers={"x-karza-key": API_KEY},
            json={"otp": otp},
        )
        data = r.json()
        return AadhaarEkycResult(
            ok=data.get("statusCode") == 101,
            name=data.get("result", {}).get("name", ""),
            aadhaar_last4=aadhaar_last4,
            dob=data.get("result", {}).get("dob"),
            address=data.get("result", {}).get("address", {}).get("combined"),
            raw=data,
        )
