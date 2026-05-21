"""
Push notification service: FCM + WhatsApp Business API.
FCM requires firebase_credentials_path set in .env.
WhatsApp requires whatsapp_api_url + whatsapp_token set in .env.
"""
import httpx
from typing import List
from app.config import settings


async def send_fcm_push(tokens: List[str], title: str, body: str, data: dict | None = None) -> bool:
    if not settings.firebase_credentials_path or not tokens:
        print(f"[FCM STUB] Would push to {len(tokens)} devices: {title} — {body}")
        return True

    try:
        import firebase_admin
        from firebase_admin import credentials, messaging

        if not firebase_admin._apps:
            cred = credentials.Certificate(settings.firebase_credentials_path)
            firebase_admin.initialize_app(cred)

        message = messaging.MulticastMessage(
            notification=messaging.Notification(title=title, body=body),
            data=data or {},
            tokens=tokens,
        )
        messaging.send_each_for_multicast(message)
        return True
    except Exception as e:
        print(f"[FCM ERROR] {e}")
        return False


async def send_whatsapp_message(phone: str, message: str) -> bool:
    if not settings.whatsapp_api_url or not settings.whatsapp_token:
        print(f"[WhatsApp STUB] Would message {phone}: {message}")
        return True

    async with httpx.AsyncClient() as client:
        try:
            resp = await client.post(
                settings.whatsapp_api_url,
                headers={"Authorization": f"Bearer {settings.whatsapp_token}"},
                json={"to": phone, "type": "text", "text": {"body": message}},
            )
            return resp.status_code == 200
        except Exception as e:
            print(f"[WhatsApp ERROR] {e}")
            return False


async def send_outbreak_alert_to_farms(
    farm_contacts: List[dict],  # [{fcm_token, phone, name}]
    disease: str,
    district: str,
) -> dict:
    title = "Disease Outbreak Alert"
    body = f"{disease} detected near your area. Check your stock. Contact your VLE."
    tokens = [f["fcm_token"] for f in farm_contacts if f.get("fcm_token")]
    phones = [f["phone"] for f in farm_contacts if f.get("phone")]

    fcm_ok = await send_fcm_push(tokens, title, body, {"disease": disease, "district": district})
    for phone in phones:
        await send_whatsapp_message(phone, f"[AquaAI Alert] {body}")

    return {"fcm_sent": fcm_ok, "sms_count": len(phones)}
