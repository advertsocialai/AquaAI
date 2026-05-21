"""M4 — Reports & Analytics: F25 (PDF), F26 (QR Verify), F28 (Sync), F29 (OTA)."""
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from app.database import get_db
from app.models.certificate import QCCertificate
from app.models.model_version import AIModelVersion
from app.models.sync import SyncQueue
from app.models.user import User
from app.core.deps import get_current_user
from app.schemas.reports import CertificateOut, VerifyResponse, ModelVersionOut, SyncPayload
from app.core.security import verify_certificate_signature
from app.config import settings

router = APIRouter(tags=["M4 — Reports & Analytics"])


# F25: Get all certificates for user
@router.get("/certificates", response_model=list[CertificateOut])
async def list_certificates(db: AsyncSession = Depends(get_db),
                             current_user: User = Depends(get_current_user)):
    result = await db.execute(
        select(QCCertificate).order_by(QCCertificate.created_at.desc()).limit(100)
    )
    certs = result.scalars().all()
    return [_enrich_cert(c) for c in certs]


@router.get("/certificates/{certificate_id}/download")
async def download_certificate_pdf(certificate_id: str, db: AsyncSession = Depends(get_db),
                                    current_user: User = Depends(get_current_user)):
    """F25: Download the certificate PDF."""
    result = await db.execute(
        select(QCCertificate).where(QCCertificate.certificate_id == certificate_id)
    )
    cert = result.scalar_one_or_none()
    if not cert or not cert.pdf_path:
        raise HTTPException(404, "Certificate not found")
    return FileResponse(cert.pdf_path, media_type="application/pdf",
                        filename=f"QC_{certificate_id}.pdf")


# F26: QR Verification Portal
@router.get("/verify/{certificate_id}", response_model=VerifyResponse)
async def verify_certificate(certificate_id: str, db: AsyncSession = Depends(get_db)):
    """F26: Public verification endpoint — no auth required."""
    result = await db.execute(
        select(QCCertificate).where(QCCertificate.certificate_id == certificate_id)
    )
    cert = result.scalar_one_or_none()
    if not cert:
        return VerifyResponse(
            certificate_id=certificate_id, status="NotFound",
            farm_name=None, hatchery_name=None, grade=None,
            composite_score=None, session_type="unknown",
            issued_at=None, expires_at=None, is_hard_fail=False,
        )

    if cert.is_revoked:
        status = "Revoked"
    elif cert.expires_at and cert.expires_at.replace(tzinfo=None) < datetime.utcnow():
        status = "Expired"
    else:
        # Verify HMAC signature
        if cert.certificate_data and cert.hmac_hash:
            valid = verify_certificate_signature(cert.certificate_data, cert.hmac_hash)
            status = "Valid" if valid else "Tampered"
        else:
            status = "Valid"

    return VerifyResponse(
        certificate_id=certificate_id,
        status=status,
        farm_name=cert.farm_name,
        hatchery_name=cert.hatchery_name,
        grade=cert.grade,
        composite_score=cert.composite_score,
        session_type=cert.session_type,
        issued_at=cert.created_at,
        expires_at=cert.expires_at,
        is_hard_fail=cert.is_hard_fail,
    )


# F29: OTA Model Updates
@router.get("/model-updates/latest", response_model=list[ModelVersionOut])
async def get_latest_models(db: AsyncSession = Depends(get_db)):
    """F29: Returns current model versions. App checks on launch."""
    result = await db.execute(
        select(AIModelVersion).where(AIModelVersion.is_current == True)
    )
    return result.scalars().all()


@router.get("/model-updates/{model_name}")
async def get_model_version(model_name: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(AIModelVersion)
        .where(AIModelVersion.model_name == model_name, AIModelVersion.is_current == True)
    )
    mv = result.scalar_one_or_none()
    if not mv:
        raise HTTPException(404, f"No current version found for model: {model_name}")
    return mv


@router.post("/model-updates", status_code=201)
async def register_model_version(
    model_name: str, version: str, file_size_mb: float,
    download_url: str, release_notes: str = "",
    accuracy_metrics: dict = {},
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Admin: Register a new model version and mark it as current."""
    # Unmark previous current
    prev = (await db.execute(
        select(AIModelVersion).where(AIModelVersion.model_name == model_name, AIModelVersion.is_current == True)
    )).scalar_one_or_none()
    if prev:
        prev.is_current = False

    mv = AIModelVersion(
        model_name=model_name, version=version, file_size_mb=file_size_mb,
        download_url=download_url, release_notes=release_notes,
        accuracy_metrics=accuracy_metrics, is_current=True,
        released_at=datetime.utcnow(),
    )
    db.add(mv)
    await db.commit()
    await db.refresh(mv)
    return mv


# F28: Offline Sync
@router.post("/sync/batch")
async def batch_sync(
    payload: SyncPayload,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """F28: Accept a batch of offline session data from device and queue for processing."""
    queued = 0
    for session_data in payload.sessions:
        item = SyncQueue(
            device_id=payload.device_id,
            user_id=current_user.id,
            session_type=session_data.get("type", "unknown"),
            session_data=session_data,
            status="pending",
        )
        db.add(item)
        queued += 1
    await db.commit()
    return {"queued": queued, "device_id": payload.device_id,
            "message": f"{queued} sessions queued for processing"}


@router.get("/sync/status")
async def sync_status(device_id: str, db: AsyncSession = Depends(get_db),
                      current_user: User = Depends(get_current_user)):
    """F28: Get pending sync items for a device."""
    result = await db.execute(
        select(SyncQueue).where(SyncQueue.device_id == device_id).order_by(SyncQueue.created_at.desc())
    )
    items = result.scalars().all()
    pending = sum(1 for i in items if i.status == "pending")
    return {"device_id": device_id, "total": len(items), "pending": pending,
            "items": [{"id": i.id, "type": i.session_type, "status": i.status} for i in items[:20]]}


def _enrich_cert(cert: QCCertificate) -> dict:
    d = {c.name: getattr(cert, c.name) for c in cert.__table__.columns}
    d["pdf_url"] = f"{settings.base_url}/{cert.pdf_path}" if cert.pdf_path else None
    d["qr_code_url"] = f"{settings.base_url}/{cert.qr_code_path}" if cert.qr_code_path else None
    return d
