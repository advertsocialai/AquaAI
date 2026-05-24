"""Prometheus-compatible /metrics endpoint.

Minimal text-format scrape target so Grafana/Prometheus can pick up
basic counters in dev. For production, swap to prometheus-fastapi-
instrumentator (auto-instruments every route).
"""
from __future__ import annotations
import time
from fastapi import APIRouter, Response

router = APIRouter(tags=["ops"])

_started = time.time()
_counters = {
    "http_requests_total":  {"counter": 0,  "help": "Total HTTP requests served (stub)."},
    "diagnostics_runs_total": {"counter": 0, "help": "Diagnostic inferences completed (stub)."},
    "qc_certificates_signed_total": {"counter": 0, "help": "QC certs HMAC-signed (stub)."},
}


def inc(metric: str, by: int = 1) -> None:
    if metric in _counters:
        _counters[metric]["counter"] += by


@router.get("/metrics", response_class=Response)
def metrics() -> Response:
    lines: list[str] = []
    lines.append(f"# HELP aquai_uptime_seconds Seconds since process start.")
    lines.append(f"# TYPE aquai_uptime_seconds counter")
    lines.append(f"aquai_uptime_seconds {int(time.time() - _started)}")

    for name, meta in _counters.items():
        lines.append(f"# HELP aquai_{name} {meta['help']}")
        lines.append(f"# TYPE aquai_{name} counter")
        lines.append(f"aquai_{name} {meta['counter']}")

    return Response("\n".join(lines) + "\n", media_type="text/plain; version=0.0.4")
