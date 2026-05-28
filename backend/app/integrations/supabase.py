"""Supabase client adapter.

Server-side reads/writes go through this — service_role bypasses RLS so
the backend can serve any user's data without per-request JWT exchange.
Frontend stays on the publishable key and is subject to RLS as designed.

Returns None when env vars aren't set so the rest of the app degrades
gracefully (e.g. test runs without Supabase configured).
"""
from functools import lru_cache
from typing import Optional

from supabase import Client, create_client

from app.config import settings


@lru_cache(maxsize=1)
def get_supabase() -> Optional[Client]:
    if not settings.supabase_url or not settings.supabase_service_role_key:
        return None
    return create_client(settings.supabase_url, settings.supabase_service_role_key)


def require_supabase() -> Client:
    client = get_supabase()
    if client is None:
        raise RuntimeError(
            "Supabase not configured. Set SUPABASE_URL and "
            "SUPABASE_SERVICE_ROLE_KEY in backend/.env."
        )
    return client
