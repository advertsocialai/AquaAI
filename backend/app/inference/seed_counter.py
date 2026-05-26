"""Seed Counter — YOLOv8 Nano stub inference.

Real version: load .onnx via onnxruntime, decode bboxes per-class.
Stub version: deterministic count seeded from image SHA-256 so the
same image returns the same result during dev.
"""
from __future__ import annotations
import hashlib
import os
import time
from dataclasses import dataclass

INFERENCE_BACKEND = os.getenv("INFERENCE_BACKEND", "stub")


@dataclass
class SeedCountResult:
    count_total: int
    count_alive: int
    count_dead: int
    count_debris: int
    mortality_pct: float
    size_cv_pct: float
    confidence: float
    inference_ms: int
    model_version: str
    boxes: list[dict]   # [{ x1, y1, x2, y2, cls, score }, ...]


def predict(image_bytes: bytes, *, tray_area_cm2: float = 400.0) -> SeedCountResult:
    t0 = time.perf_counter()

    if INFERENCE_BACKEND == "onnx":
        # Real implementation:
        #   sess = ort.InferenceSession("models/seed-counter/model.onnx")
        #   ...
        # For now, fall through to stub.
        pass

    # Deterministic-ish stub
    h = hashlib.sha256(image_bytes).digest()
    seed = int.from_bytes(h[:4], "big")
    rng = (seed % 1000) / 1000.0   # 0..1

    base = 2_000 + int(rng * 1_200)          # 2000-3200 PLs on a 20x20 tray
    alive = int(base * (0.93 + rng * 0.05))  # 93-98% alive
    dead = int(base * (0.01 + rng * 0.03))   # 1-4% dead
    debris = max(0, base - alive - dead)
    mortality = round((dead / max(alive + dead, 1)) * 100, 2)
    size_cv = round(4.0 + rng * 4.0, 1)
    confidence = round(0.90 + rng * 0.09, 3)

    boxes = []
    for i in range(min(50, alive)):
        x = (i * 17) % 800
        y = (i * 23) % 800
        boxes.append({"x1": x, "y1": y, "x2": x + 12, "y2": y + 12, "cls": "pl-alive", "score": round(0.85 + (i % 10) / 100, 2)})

    return SeedCountResult(
        count_total=alive + dead + debris,
        count_alive=alive,
        count_dead=dead,
        count_debris=debris,
        mortality_pct=mortality,
        size_cv_pct=size_cv,
        confidence=confidence,
        inference_ms=int((time.perf_counter() - t0) * 1000) or 28,
        model_version="seed-counter@1.4.2",
        boxes=boxes,
    )
