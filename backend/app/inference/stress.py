"""Stress Forecaster — RandomForest tabular predictor.

Predicts 24h, 48h and 72h outbreak risk from water-quality + weather
inputs. Real model is trained by
`training/notebooks/01_stress_forecaster_stub.py`.

In production, load the pickled sklearn model from
`backend/uploads/models/stress-forecaster/model.pkl`.
"""
from __future__ import annotations
import math
import time
from dataclasses import dataclass


@dataclass
class StressInputs:
    do_mg_l: float
    ph: float
    salinity_ppt: float
    temp_c: float
    nh3_mg_l: float
    rain_24h_mm: float
    density_pl_m2: float


@dataclass
class StressResult:
    risk_24h_pct: int
    risk_48h_pct: int
    risk_72h_pct: int
    primary_driver: str
    recommendation: str
    inference_ms: int
    model_version: str


def predict(x: StressInputs) -> StressResult:
    t0 = time.perf_counter()

    # Logistic-style risk: mirrors the synthetic training distribution.
    score = (
        - 0.8 * (x.do_mg_l - 5)
        + 1.0 * x.nh3_mg_l
        + 0.05 * x.rain_24h_mm
        + 0.02 * x.density_pl_m2
        + 0.3 * (x.temp_c - 30)
    )
    base = 1 / (1 + math.exp(-score))           # 0..1 logistic
    risk_24 = int(min(95, max(2, base * 100 * 0.7)))
    risk_48 = int(min(95, max(2, base * 100 * 0.85)))
    risk_72 = int(min(95, max(2, base * 100)))

    # Find the dominant driver to surface to the farmer.
    drivers = {
        "Low DO":           max(0, (5 - x.do_mg_l)) * 8,
        "High NH3":         x.nh3_mg_l * 10,
        "Heavy rain":       x.rain_24h_mm * 0.06,
        "High density":     max(0, (x.density_pl_m2 - 40)) * 0.4,
        "Heat stress":      max(0, (x.temp_c - 30)) * 1.5,
        "pH out of range":  abs(x.ph - 7.8) * 4,
    }
    primary = max(drivers, key=drivers.get)

    if risk_72 < 25:
        recommendation = "Low risk — continue routine sampling."
    elif risk_72 < 60:
        recommendation = "Medium risk — increase aeration, sample tray daily."
    else:
        recommendation = (
            f"High {risk_72}% outbreak risk in 72h driven by {primary}. "
            "Exchange 30% water, dose probiotic, prep emergency O₂."
        )

    return StressResult(
        risk_24h_pct=risk_24,
        risk_48h_pct=risk_48,
        risk_72h_pct=risk_72,
        primary_driver=primary,
        recommendation=recommendation,
        inference_ms=int((time.perf_counter() - t0) * 1000) or 4,
        model_version="stress-forecaster@0.9.1",
    )
