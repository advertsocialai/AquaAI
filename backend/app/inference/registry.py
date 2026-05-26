"""Model registry — versions, sizes, targets, OTA download links."""
from __future__ import annotations
from dataclasses import dataclass
from typing import Literal

ModelId = Literal[
    "seed-counter",
    "disease-detector",
    "quality-grader",
    "pl-stage-classifier",
    "stress-forecaster",
]


@dataclass
class ModelCard:
    id: ModelId
    name: str
    architecture: str
    task: Literal["detection", "classification", "regression", "tabular"]
    classes: list[str]
    target_metric: str
    target_value: str
    version: str
    size_mb: float
    int8: bool
    on_device: bool
    last_trained_on: str
    artifact_url: str


REGISTRY: list[ModelCard] = [
    ModelCard(
        id="seed-counter",
        name="Seed Counter",
        architecture="YOLOv8 Nano",
        task="detection",
        classes=["pl-alive", "pl-dead", "debris"],
        target_metric="Count MAPE",
        target_value="<5% vs manual",
        version="1.4.2",
        size_mb=6.2,
        int8=True,
        on_device=True,
        last_trained_on="2026-05-12",
        artifact_url="/api/v1/models/seed-counter/download",
    ),
    ModelCard(
        id="disease-detector",
        name="Disease Detector",
        architecture="EfficientNetB0 + YOLOv8n",
        task="classification",
        classes=["healthy", "suspected", "ehp_positive", "wssv_positive", "ahpnd_positive", "bgd_positive", "hpv_positive", "wfs_positive"],
        target_metric="Sensitivity / Specificity / AUC-ROC",
        target_value="92% / 88% / 0.95 vs PCR",
        version="2.1.0",
        size_mb=4.4,
        int8=True,
        on_device=True,
        last_trained_on="2026-05-18",
        artifact_url="/api/v1/models/disease-detector/download",
    ),
    ModelCard(
        id="quality-grader",
        name="Quality Grader",
        architecture="B0 + YOLOv8n + MobileNetV3 fusion",
        task="regression",
        classes=["composite-qs-0-100"],
        target_metric="Pass/Fail agreement vs expert panel",
        target_value=">92%",
        version="1.2.3",
        size_mb=8.7,
        int8=True,
        on_device=True,
        last_trained_on="2026-05-10",
        artifact_url="/api/v1/models/quality-grader/download",
    ),
    ModelCard(
        id="pl-stage-classifier",
        name="PL Stage Classifier",
        architecture="MobileNetV3 Small",
        task="classification",
        classes=["PL5", "PL8", "PL10", "PL12", "PL15"],
        target_metric="Accuracy",
        target_value=">90% per class",
        version="1.0.5",
        size_mb=2.1,
        int8=True,
        on_device=True,
        last_trained_on="2026-04-28",
        artifact_url="/api/v1/models/pl-stage-classifier/download",
    ),
    ModelCard(
        id="stress-forecaster",
        name="Stress Forecaster",
        architecture="RandomForest",
        task="tabular",
        classes=["outbreak-risk-72h"],
        target_metric="F1 on 72h horizon",
        target_value=">0.80",
        version="0.9.1",
        size_mb=0.6,
        int8=False,
        on_device=False,
        last_trained_on="2026-05-22",
        artifact_url="/api/v1/models/stress-forecaster/download",
    ),
]


def get_card(model_id: str) -> ModelCard | None:
    for c in REGISTRY:
        if c.id == model_id:
            return c
    return None
