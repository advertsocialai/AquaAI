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

    outbreak_alert_radius_km: float = 5.0
    certificate_expiry_days: int = 90
    hmac_secret: str = "dev-hmac-secret-change-in-production"

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
