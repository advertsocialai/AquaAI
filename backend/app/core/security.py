import hmac
import hashlib
import json
from app.config import settings


def sign_certificate(data: dict) -> str:
    payload = json.dumps(data, sort_keys=True, default=str)
    return hmac.new(
        settings.hmac_secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()


def verify_certificate_signature(data: dict, signature: str) -> bool:
    expected = sign_certificate(data)
    return hmac.compare_digest(expected, signature)
