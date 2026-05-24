"""Stress forecaster (24-72h Vibrio / WSSV outbreak risk).

Stub that demonstrates the end-to-end shape — replace synthetic_dataset()
with the real PCR + sensor pull once MoUs are in place. The pipeline:
  features -> RandomForest -> calibrate -> evaluate -> export.

Run with `python training/notebooks/01_stress_forecaster_stub.py`.
"""
from __future__ import annotations
import csv
import os
import random
from datetime import datetime
from pathlib import Path

import numpy as np

try:
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.metrics import f1_score, roc_auc_score
    from sklearn.model_selection import train_test_split
    HAS_SKLEARN = True
except ImportError:
    HAS_SKLEARN = False

RUN_DIR = Path("training/runs/stress")
RUN_DIR.mkdir(parents=True, exist_ok=True)
RNG = np.random.default_rng(7)


def synthetic_dataset(n: int = 5_000) -> tuple[np.ndarray, np.ndarray]:
    """Generate a synthetic pond dataset. Real version pulls 1-min sensor
    rolls + IMD weather from TimescaleDB."""
    do = RNG.normal(5.5, 1.0, n).clip(2.0, 9.0)
    ph = RNG.normal(7.8, 0.3, n).clip(6.5, 9.5)
    salinity = RNG.normal(18, 3, n).clip(8, 30)
    temp = RNG.normal(29, 2, n).clip(22, 34)
    nh3 = RNG.gamma(2, 0.25, n).clip(0, 5)
    rain_24h = RNG.gamma(2, 8, n).clip(0, 200)
    density = RNG.normal(40, 12, n).clip(10, 90)

    # Outbreak risk grows with low DO, high NH3, high density, heavy rain.
    score = (
        - 0.8 * (do - 5)
        + 1.0 * nh3
        + 0.05 * rain_24h
        + 0.02 * density
        + 0.3 * (temp - 30)
    )
    prob = 1 / (1 + np.exp(-score))
    y = (RNG.random(n) < prob).astype(int)

    X = np.column_stack([do, ph, salinity, temp, nh3, rain_24h, density])
    return X, y


def train_and_eval() -> dict:
    X, y = synthetic_dataset()
    if not HAS_SKLEARN:
        return {
            "ok": False,
            "error": "scikit-learn not installed — install training/requirements.txt",
        }

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = RandomForestClassifier(
        n_estimators=120, max_depth=8, n_jobs=-1, random_state=42, class_weight="balanced",
    )
    model.fit(X_train, y_train)

    proba = model.predict_proba(X_test)[:, 1]
    preds = (proba >= 0.5).astype(int)

    metrics = {
        "f1":       float(f1_score(y_test, preds)),
        "auc_roc":  float(roc_auc_score(y_test, proba)),
        "n_train":  int(len(X_train)),
        "n_test":   int(len(X_test)),
        "positives_test": int(y_test.sum()),
        "trained_at": datetime.utcnow().isoformat(),
    }
    return {"ok": True, "metrics": metrics}


def main() -> None:
    result = train_and_eval()
    csv_path = RUN_DIR / "stress_forecaster_metrics.csv"
    first = not csv_path.exists()
    with csv_path.open("a", newline="") as f:
        w = csv.writer(f)
        if first:
            w.writerow(["timestamp", "ok", "f1", "auc_roc", "n_train", "n_test", "positives_test"])
        if result["ok"]:
            m = result["metrics"]
            w.writerow([m["trained_at"], True, m["f1"], m["auc_roc"], m["n_train"], m["n_test"], m["positives_test"]])
            print(f"[stress] f1={m['f1']:.3f} auc={m['auc_roc']:.3f}")
        else:
            w.writerow([datetime.utcnow().isoformat(), False, "", "", "", "", ""])
            print(f"[stress] {result['error']}")


if __name__ == "__main__":
    main()
