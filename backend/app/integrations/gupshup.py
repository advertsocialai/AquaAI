"""Gupshup WhatsApp Business API adapter."""
from __future__ import annotations
import os
import httpx

API_KEY = os.getenv("GUPSHUP_API_KEY", "")
APP_NAME = os.getenv("GUPSHUP_APP_NAME", "aquai")
SOURCE = os.getenv("GUPSHUP_SOURCE", "919999999999")


async def send_message(mobile: str, template_name: str, params: list[str]) -> dict:
    if not API_KEY:
        return {
            "ok": True,
            "mode": "stub",
            "to": mobile,
            "template": template_name,
            "params_preview": params,
        }
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.post(
            "https://api.gupshup.io/sm/api/v1/template/msg",
            headers={"apikey": API_KEY, "Content-Type": "application/x-www-form-urlencoded"},
            data={
                "channel": "whatsapp",
                "source": SOURCE,
                "destination": mobile,
                "src.name": APP_NAME,
                "template": template_name,
                "params": ",".join(params),
            },
        )
        return r.json()


async def send_outbreak_alert(mobile: str, disease: str, distance_km: float) -> dict:
    return await send_message(
        mobile,
        template_name="aquai_outbreak",
        params=[disease, f"{distance_km:.1f}"],
    )
