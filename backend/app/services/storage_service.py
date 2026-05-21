"""
File storage abstraction — Amazon S3 with a local-filesystem fallback.

When S3_BUCKET is configured the platform uploads images, certificates and
model files to S3 (durable, shareable). When it is not, everything stays in
the local uploads/ directory exactly as before — so the app works either way.
"""
import os
import logging
from typing import Optional

from app.config import settings

logger = logging.getLogger(__name__)

_client = None
_checked = False


def _s3():
    """Return a cached boto3 S3 client, or None when S3 is not configured."""
    global _client, _checked
    if _checked:
        return _client
    _checked = True
    if not settings.s3_bucket:
        return None
    try:
        import boto3
        _client = boto3.client("s3", region_name=settings.aws_region)
        logger.info(f"S3 storage enabled → bucket {settings.s3_bucket}")
    except Exception as e:
        logger.warning(f"S3 unavailable, using local storage: {e}")
        _client = None
    return _client


def is_enabled() -> bool:
    return _s3() is not None


def _url(key: str) -> str:
    return f"https://{settings.s3_bucket}.s3.{settings.aws_region}.amazonaws.com/{key}"


def upload_file(local_path: str, key: str) -> Optional[str]:
    """Upload a local file to S3. Returns the public-style URL, or None on failure."""
    client = _s3()
    if client is None or not os.path.exists(local_path):
        return None
    try:
        client.upload_file(local_path, settings.s3_bucket, key)
        return _url(key)
    except Exception as e:
        logger.warning(f"S3 upload_file failed ({key}): {e}")
        return None


def upload_bytes(data: bytes, key: str,
                 content_type: str = "application/octet-stream") -> Optional[str]:
    """Upload raw bytes to S3. Returns the URL, or None on failure."""
    client = _s3()
    if client is None:
        return None
    try:
        client.put_object(Bucket=settings.s3_bucket, Key=key,
                          Body=data, ContentType=content_type)
        return _url(key)
    except Exception as e:
        logger.warning(f"S3 upload_bytes failed ({key}): {e}")
        return None


def store(local_path: str, key: str) -> str:
    """
    Store a file and return the best available URL.
    Prefers S3; falls back to the local static URL when S3 is off.
    """
    s3_url = upload_file(local_path, key)
    if s3_url:
        return s3_url
    # Local fallback — served by the FastAPI /uploads static mount
    rel = os.path.relpath(local_path, settings.upload_dir)
    return f"{settings.base_url}/uploads/{rel}"
