"""MSG91 SMS adapter — OTPs and transactional alerts."""
from __future__ import annotations
import os
import httpx

API_KEY = os.getenv("MSG91_AUTH_KEY", "")
SENDER_ID = os.getenv("MSG91_SENDER_ID", "AQUAAI")
ROUTE = os.getenv("MSG91_ROUTE", "4")  # 4 = transactional


async def send_sms(mobile: str, message: str) -> dict:
    if not API_KEY:
        return {"ok": True, "mode": "stub", "to": mobile, "message_preview": message[:40]}
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(
            "https://api.msg91.com/api/sendhttp.php",
            params={
                "authkey": API_KEY,
                "mobiles": mobile,
                "message": message,
                "sender": SENDER_ID,
                "route": ROUTE,
                "country": "91",
            },
        )
        return {"ok": r.status_code == 200, "response": r.text}


async def send_otp(mobile: str, otp: str) -> dict:
    return await send_sms(mobile, f"Your AquaI verification code is {otp}. Valid for 5 minutes. Do not share.")
