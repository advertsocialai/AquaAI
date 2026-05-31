from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    app_name: str = "AquaAI Backend"
    app_version: str = "1.0.0"
    secret_key: str = "dev-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 10080  # 7 days

    database_url: str = "postgresql+asyncpg://postgres:password@localhost:5432/aquaai"
    database_url_sync: str = "postgresql://postgres:password@localhost:5432/aquaai"

    upload_dir: str = "uploads"
    base_url: str = "http://localhost:8000"

    anthropic_api_key: Optional[str] = None

    # AWS — S3 file storage (optional; falls back to local uploads/ when unset)
    aws_region: str = "ap-south-1"
    s3_bucket: Optional[str] = None

    firebase_credentials_path: Optional[str] = None
    whatsapp_api_url: Optional[str] = None
    whatsapp_token: Optional[str] = None

    # Web Push (VAPID). Public key is also shipped to the browser; the private
    # key is backend-only and signs the push requests. Leave unset to disable
    # web push (service degrades to a logged stub).
    vapid_public_key: Optional[str] = None
    vapid_private_key: Optional[str] = None
    vapid_subject: str = "mailto:advertsocialai@gmail.com"

    outbreak_alert_radius_km: float = 5.0
    certificate_expiry_days: int = 90
    hmac_secret: str = "dev-hmac-secret-change-in-production"

    # Supabase — REST / Storage / Auth admin calls go through these.
    # The DATABASE_URL above handles direct SQL; these are for the supabase-py client.
    supabase_url: Optional[str] = None
    supabase_publishable_key: Optional[str] = None
    supabase_service_role_key: Optional[str] = None

    # SendGrid — transactional email (newsletter welcome, password reset, etc.)
    # Adapter falls back to stub mode if api_key or from_email is unset.
    sendgrid_api_key: Optional[str] = None
    sendgrid_from_email: Optional[str] = None
    sendgrid_from_name: str = "Aqua AI"

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
