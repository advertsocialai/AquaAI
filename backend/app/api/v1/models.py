"""Unified Aqua AI models API.

  GET  /models                              list registry
  GET  /models/{id}                         single card
  POST /models/seed-counter/infer           multipart image → SeedCountResult
  POST /models/disease-detector/infer       multipart image → DiseaseResult
  POST /models/quality-grader/infer         multipart image + counted/invoice → QualityResult
  POST /models/pl-stage-classifier/infer    multipart image → PlStageResult
  POST /models/stress-forecaster/infer      json body → StressResult
  GET  /models/{id}/download                OTA download stub
"""
from __future__ import annotations
import io
from dataclasses import asdict
from typing import Optional

from fastapi import APIRouter, File, Form, HTTPException, Response, UploadFile
from pydantic import BaseModel

from app.inference import (
    seed_counter as seed_inf,
    disease as disease_inf,
    quality_grader as quality_inf,
    pl_stage as plstage_inf,
    stress as stress_inf,
)
from app.inference.registry import REGISTRY, get_card

router = APIRouter(prefix="/models", tags=["models"])


# ── Registry endpoints ────────────────────────────────────────────────────────

@router.get("")
def list_models():
    return [
        {
            "id": c.id, "name": c.name, "architecture": c.architecture,
            "task": c.task, "version": c.version, "size_mb": c.size_mb,
            "int8": c.int8, "on_device": c.on_device, "classes": c.classes,
            "target_metric": c.target_metric, "target_value": c.target_value,
            "last_trained_on": c.last_trained_on,
            "artifact_url": c.artifact_url,
        }
        for c in REGISTRY
    ]


@router.get("/{model_id}")
def get_model(model_id: str):
    c = get_card(model_id)
    if not c:
        raise HTTPException(404, "Model not found")
    return asdict(c)


# ── Inference: vision models ──────────────────────────────────────────────────

@router.post("/seed-counter/infer")
async def infer_seed_counter(
    image: UploadFile = File(...),
    tray_area_cm2: float = Form(400.0),
):
    blob = await image.read()
    if not blob:
        raise HTTPException(400, "Empty image")
    res = seed_inf.predict(blob, tray_area_cm2=tray_area_cm2)
    return asdict(res)


@router.post("/disease-detector/infer")
async def infer_disease(image: UploadFile = File(...)):
    blob = await image.read()
    if not blob:
        raise HTTPException(400, "Empty image")
    res = disease_inf.predict(blob)
    return asdict(res)


@router.post("/quality-grader/infer")
async def infer_quality(
    image: UploadFile = File(...),
    invoice_count: Optional[int] = Form(None),
    counted: Optional[int] = Form(None),
):
    blob = await image.read()
    if not blob:
        raise HTTPException(400, "Empty image")
    res = quality_inf.predict(blob, invoice_count=invoice_count, counted=counted)
    return asdict(res)


@router.post("/pl-stage-classifier/infer")
async def infer_pl_stage(image: UploadFile = File(...)):
    blob = await image.read()
    if not blob:
        raise HTTPException(400, "Empty image")
    res = plstage_inf.predict(blob)
    return asdict(res)


# ── Inference: tabular ────────────────────────────────────────────────────────

class StressBody(BaseModel):
    do_mg_l: float
    ph: float
    salinity_ppt: float
    temp_c: float
    nh3_mg_l: float
    rain_24h_mm: float
    density_pl_m2: float


@router.post("/stress-forecaster/infer")
def infer_stress(body: StressBody):
    res = stress_inf.predict(stress_inf.StressInputs(**body.model_dump()))
    return asdict(res)


# ── OTA download (stub: returns a small placeholder binary) ───────────────────

@router.get("/{model_id}/download")
def download_model(model_id: str):
    c = get_card(model_id)
    if not c:
        raise HTTPException(404, "Model not found")
    # In production: stream the real .onnx / .tflite file from S3 + ETag.
    placeholder = (
        f"AQUA-AI-MODEL-PLACEHOLDER\nmodel_id={c.id}\nversion={c.version}\n"
        f"size_mb={c.size_mb}\nint8={c.int8}\n"
    ).encode()
    return Response(
        placeholder,
        media_type="application/octet-stream",
        headers={
            "Content-Disposition": f'attachment; filename="{c.id}-{c.version}.tflite"',
            "X-Model-Version": c.version,
            "X-Model-Size-MB": str(c.size_mb),
        },
    )
