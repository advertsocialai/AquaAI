"""
Web Push sender (VAPID / Web Push Protocol).

This is distinct from FCM in notification_service.py: it pushes to browsers
that subscribed via the PWA service worker (src/lib/push.ts on the web app).
Subscriptions live in the `push_subscriptions` table keyed by the Supabase
auth user UUID; we read them with the service-role client (bypasses RLS).

Sending requires VAPID_PUBLIC_KEY + VAPID_PRIVATE_KEY in backend/.env. Without
them the service logs a stub and returns gracefully, so callers never break.
"""
import json
import logging
from typing import Iterable, Optional

from app.config import settings
from app.integrations.supabase import get_supabase

logger = logging.getLogger(__name__)

_TABLE = "push_subscriptions"


def _vapid_configured() -> bool:
    return bool(settings.vapid_public_key and settings.vapid_private_key)


def _send_one(subscription: dict, payload: dict) -> tuple[bool, Optional[str]]:
    """Send to a single subscription. Returns (ok, dead_endpoint_or_None).

    A 404/410 from the push service means the subscription is gone for good —
    we report the endpoint so the caller can prune it.
    """
    try:
        from pywebpush import webpush, WebPushException
    except ImportError:
        logger.warning("[WebPush STUB] pywebpush not installed; would send: %s", payload.get("title"))
        return True, None

    sub_info = {
        "endpoint": subscription["endpoint"],
        "keys": {"p256dh": subscription["p256dh"], "auth": subscription["auth"]},
    }
    try:
        webpush(
            subscription_info=sub_info,
            data=json.dumps(payload),
            vapid_private_key=settings.vapid_private_key,
            vapid_claims={"sub": settings.vapid_subject},
        )
        return True, None
    except WebPushException as e:
        status = getattr(e.response, "status_code", None)
        if status in (404, 410):
            # Endpoint permanently gone — signal for pruning.
            return False, subscription["endpoint"]
        logger.warning("[WebPush] send failed (%s): %s", status, e)
        return False, None
    except Exception as e:  # noqa: BLE001 — never let a bad push break a request flow
        logger.warning("[WebPush] unexpected error: %s", e)
        return False, None


def _prune_dead(endpoints: list[str]) -> None:
    if not endpoints:
        return
    client = get_supabase()
    if client is None:
        return
    try:
        client.table(_TABLE).delete().in_("endpoint", endpoints).execute()
        logger.info("[WebPush] pruned %d dead subscription(s)", len(endpoints))
    except Exception as e:  # noqa: BLE001
        logger.warning("[WebPush] prune failed: %s", e)


def _fetch_subscriptions(user_ids: Optional[Iterable[str]]) -> list[dict]:
    client = get_supabase()
    if client is None:
        logger.warning("[WebPush] Supabase not configured; no subscriptions to load")
        return []
    try:
        query = client.table(_TABLE).select("endpoint,p256dh,auth,user_id")
        if user_ids is not None:
            ids = list(user_ids)
            if not ids:
                return []
            query = query.in_("user_id", ids)
        return query.execute().data or []
    except Exception as e:  # noqa: BLE001
        logger.warning("[WebPush] failed to load subscriptions: %s", e)
        return []


def send_web_push(
    title: str,
    body: str,
    *,
    user_ids: Optional[Iterable[str]] = None,
    url: str = "/",
    tag: Optional[str] = None,
    require_interaction: bool = False,
) -> dict:
    """Push a notification to users' browsers.

    user_ids=None targets every subscription (broadcast). Pass a list of
    Supabase auth UUIDs to target specific users. Returns a small summary.
    """
    payload = {
        "title": title,
        "body": body,
        "url": url,
        "icon": "/favicon.svg",
        "badge": "/favicon.svg",
        "tag": tag,
        "requireInteraction": require_interaction,
    }

    if not _vapid_configured():
        logger.info("[WebPush STUB] VAPID keys unset — would send '%s' to %s",
                    title, "all" if user_ids is None else list(user_ids))
        return {"sent": 0, "failed": 0, "pruned": 0, "stub": True}

    subs = _fetch_subscriptions(user_ids)
    sent = failed = 0
    dead: list[str] = []
    for sub in subs:
        ok, dead_endpoint = _send_one(sub, payload)
        if ok:
            sent += 1
        else:
            failed += 1
            if dead_endpoint:
                dead.append(dead_endpoint)

    _prune_dead(dead)
    return {"sent": sent, "failed": failed, "pruned": len(dead), "stub": False}


# ── Typed helpers for common events ──────────────────────────────────────────
# Thin wrappers with consistent copy so call sites stay readable. Each is
# best-effort and safe to call even when push is unconfigured.

def notify_order_update(
    *, user_ids: Optional[Iterable[str]], order_id, status: str, detail: str = ""
) -> dict:
    """Order placed / accepted / dispatched / delivered."""
    titles = {
        "new": "Order received",
        "accepted": "Order accepted",
        "dispatched": "Order dispatched",
        "delivered": "Order delivered",
    }
    title = titles.get(status, "Order update")
    body = detail or f"Order #{order_id} is now {status}."
    return send_web_push(
        title, body, user_ids=user_ids, url="/trader", tag=f"order-{order_id}"
    )


def notify_price_alert(
    *, user_ids: Optional[Iterable[str]], species: str, price_inr: float, detail: str = ""
) -> dict:
    """Price moved past a watched threshold (or an alert was just set)."""
    body = detail or f"{species} is now ₹{price_inr:,.0f}/kg."
    return send_web_push(
        title="Price alert", body=body, user_ids=user_ids,
        url="/aquaai#pricing", tag=f"price-{species.lower()}",
    )


def notify_dispatch_update(
    *, user_ids: Optional[Iterable[str]], shipment_id: str, status: str, detail: str = ""
) -> dict:
    """Logistics: shipment posted / on-route / cold-chain / delivered."""
    body = detail or f"Shipment {shipment_id}: {status}."
    return send_web_push(
        title="Logistics update", body=body, user_ids=user_ids,
        url="/transporter", tag=f"ship-{shipment_id}",
    )
