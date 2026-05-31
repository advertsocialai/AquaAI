from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.config import settings
from app.database import create_tables

from app.api.v1 import auth, farms, hatcheries, batches
from app.api.v1 import seed_counter, disease, quality_grader
from app.api.v1 import reports, analytics, hatchery_portal
from app.api.v1 import water_quality, training_data
from app.api.v1 import ml_management
from app.api.v1 import ai_agent
from app.api.v1.subscriptions import router as subscriptions_router, insurance_router
from app.api.v1 import pricing, marketplace, logistics
from app.api.v1 import advisory, knowledge, community, surveillance
from app.api.v1 import pricing_ws
from app.api.v1 import kyc, payments, metrics as metrics_router
from app.api.v1 import models as models_router
from app.api.v1 import risk
from app.api.v1 import newsletter
from app.api.v1 import contact
from app.api.v1 import push

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="AI-powered Shrimp Seed Diagnostics Platform — 32 Features across 4 Modules",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded files (PDFs, images, certificates)
os.makedirs(settings.upload_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")

# All routers
PREFIX = "/api/v1"
app.include_router(auth.router, prefix=PREFIX)
app.include_router(farms.router, prefix=PREFIX)
app.include_router(hatcheries.router, prefix=PREFIX)
app.include_router(batches.router, prefix=PREFIX)
app.include_router(seed_counter.router, prefix=PREFIX)   # M1
app.include_router(disease.router, prefix=PREFIX)         # M2
app.include_router(quality_grader.router, prefix=PREFIX)  # M3
app.include_router(reports.router, prefix=PREFIX)         # M4 reports/verify/sync/OTA
app.include_router(analytics.router, prefix=PREFIX)       # M4 analytics
app.include_router(hatchery_portal.router, prefix=PREFIX) # M4 B2B portal
app.include_router(water_quality.router, prefix=PREFIX)   # IoT water quality
app.include_router(training_data.router, prefix=PREFIX)   # AI training data pipeline
app.include_router(subscriptions_router, prefix=PREFIX)   # Subscription & billing
app.include_router(insurance_router, prefix=PREFIX)        # Insurance API integration
app.include_router(ml_management.router, prefix=PREFIX)   # ML training & model management
app.include_router(ai_agent.router, prefix=PREFIX)        # AquaAI Diagnostic Agent
app.include_router(pricing.router, prefix=PREFIX)          # M3 Pricing intelligence
app.include_router(marketplace.router, prefix=PREFIX)      # M4 Marketplace catalogues
app.include_router(logistics.router, prefix=PREFIX)        # M5 Logistics & transport
app.include_router(advisory.router, prefix=PREFIX)         # M6 Advisory + weather + assistant
app.include_router(knowledge.router, prefix=PREFIX)        # M7 Knowledge hub
app.include_router(community.router, prefix=PREFIX)        # M8 Community & forums
app.include_router(surveillance.router, prefix=PREFIX)     # M9 Govt surveillance + NSPAAD
app.include_router(pricing_ws.router, prefix=PREFIX)       # WebSocket price ticker
app.include_router(kyc.router, prefix=PREFIX)               # NSDL e-KYC + PAN + GST + bank
app.include_router(payments.router, prefix=PREFIX)          # Razorpay orders + webhook + payouts
app.include_router(models_router.router, prefix=PREFIX)     # Unified AI models — list, infer, OTA
app.include_router(risk.router, prefix=PREFIX)              # Bank/insurer risk scoring
app.include_router(newsletter.router, prefix=PREFIX)        # Footer newsletter subscribe
app.include_router(contact.router, prefix=PREFIX)           # Contact form (web + mobile)
app.include_router(push.router, prefix=PREFIX)              # Web push (VAPID) config + send
app.include_router(metrics_router.router)                   # /metrics for Prometheus


@app.on_event("startup")
async def startup():
    # Propagate the Anthropic key from settings/.env into the process environment
    # so the Claude SDK and Opus vision engine can read it.
    if settings.anthropic_api_key:
        os.environ["ANTHROPIC_API_KEY"] = settings.anthropic_api_key

    await create_tables()
    await _seed_model_versions()
    # Train sklearn ML classifiers if not yet present (runs in thread to avoid blocking)
    import asyncio
    await asyncio.get_event_loop().run_in_executor(None, _ensure_ml_models)


def _ensure_ml_models():
    """Train sklearn classifiers on startup if not present."""
    try:
        from app.services.ai.feature_extractor import extract_features
        from app.services.ai.sklearn_models import ensure_models_trained
        # Determine actual feature dim by running on a dummy image
        from PIL import Image
        import io, numpy as np
        buf = io.BytesIO()
        Image.fromarray(np.random.randint(80, 180, (224, 224, 3), dtype=np.uint8)).save(buf, "JPEG")
        dummy_feat = extract_features(buf.getvalue())
        ensure_models_trained(n_features=len(dummy_feat))
    except Exception as e:
        import logging
        logging.getLogger(__name__).warning(f"ML model init skipped: {e}")


async def _seed_model_versions():
    from app.database import AsyncSessionLocal
    from app.models.model_version import AIModelVersion
    from sqlalchemy import select
    async with AsyncSessionLocal() as db:
        for model_name in ["seed_counter", "ehp_classifier", "spore_detector",
                           "stage_classifier", "visual_health"]:
            existing = (await db.execute(
                select(AIModelVersion).where(AIModelVersion.model_name == model_name,
                                             AIModelVersion.is_current == True)
            )).scalar_one_or_none()
            if not existing:
                mv = AIModelVersion(
                    model_name=model_name, version="1.0.0",
                    file_size_mb={"seed_counter": 3.0, "ehp_classifier": 5.0,
                                  "spore_detector": 3.0, "stage_classifier": 2.0,
                                  "visual_health": 2.0}.get(model_name, 2.0),
                    download_url=f"{settings.base_url}/uploads/models/{model_name}_v1.0.0.tflite",
                    release_notes="Initial release — stub models for development",
                    accuracy_metrics={"accuracy": 0.95, "precision": 0.93, "recall": 0.94},
                    is_current=True,
                )
                db.add(mv)
        await db.commit()


@app.get("/")
async def root():
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "docs": "/docs",
        "modules": {
            "M1_seed_counter": "/api/v1/seed-counter",
            "M2_disease_detector": "/api/v1/disease",
            "M3_quality_grader": "/api/v1/quality",
            "M4_reports": "/api/v1/certificates",
            "M4_analytics": "/api/v1/analytics",
            "M4_verification": "/api/v1/verify/{certificate_id}",
            "M4_model_updates": "/api/v1/model-updates/latest",
            "M4_hatchery_portal": "/api/v1/hatchery-portal",
        },
    }


@app.get("/health")
async def health():
    return {"status": "ok", "version": settings.app_version}
