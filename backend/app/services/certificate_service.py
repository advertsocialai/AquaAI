import uuid
import os
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.certificate import QCCertificate
from app.models.batch import Batch
from app.models.farm import Farm
from app.models.hatchery import Hatchery
from app.models.user import User
from app.core.security import sign_certificate
from app.services.pdf_generator import generate_qr_code, generate_certificate_pdf
from app.config import settings


async def create_certificate(
    db: AsyncSession,
    session_type: str,
    batch_id: int,
    vle_id: int,
    counting_session_id: int | None = None,
    diagnosis_session_id: int | None = None,
    grading_session_id: int | None = None,
    composite_score: float | None = None,
    grade: str | None = None,
    is_hard_fail: bool = False,
    session_data: dict | None = None,
    language: str = "english",
) -> QCCertificate:
    cert_id = str(uuid.uuid4())

    # Fetch related names
    batch = await db.get(Batch, batch_id)
    farm = await db.get(Farm, batch.farm_id) if batch else None
    hatchery = await db.get(Hatchery, batch.hatchery_id) if batch else None
    vle = await db.get(User, vle_id)

    farm_name = farm.name if farm else "Unknown Farm"
    hatchery_name = hatchery.name if hatchery else "Unknown Hatchery"
    vle_name = vle.name if vle else "Unknown VLE"

    # HMAC sign
    sign_data = {
        "certificate_id": cert_id,
        "session_type": session_type,
        "batch_id": batch_id,
        "composite_score": composite_score,
        "grade": grade,
        "is_hard_fail": is_hard_fail,
        "issued_at": datetime.utcnow().isoformat(),
    }
    hmac_hash = sign_certificate(sign_data)

    expires_at = datetime.utcnow() + timedelta(days=settings.certificate_expiry_days)

    # Generate QR and PDF paths
    qr_path = os.path.join(settings.upload_dir, "certificates", f"{cert_id}_qr.png")
    pdf_path = os.path.join(settings.upload_dir, "certificates", f"{cert_id}.pdf")

    generate_qr_code(cert_id, qr_path)
    generate_certificate_pdf(
        certificate_id=cert_id,
        session_type=session_type,
        farm_name=farm_name,
        vle_name=vle_name,
        hatchery_name=hatchery_name,
        grade=grade,
        composite_score=composite_score,
        is_hard_fail=is_hard_fail,
        session_data=session_data or {},
        qr_path=qr_path,
        output_path=pdf_path,
        language=language,
    )

    cert = QCCertificate(
        certificate_id=cert_id,
        session_type=session_type,
        batch_id=batch_id,
        counting_session_id=counting_session_id,
        diagnosis_session_id=diagnosis_session_id,
        grading_session_id=grading_session_id,
        farm_name=farm_name,
        vle_name=vle_name,
        hatchery_name=hatchery_name,
        composite_score=composite_score,
        grade=grade,
        is_hard_fail=is_hard_fail,
        pdf_path=pdf_path,
        qr_code_path=qr_path,
        hmac_hash=hmac_hash,
        certificate_data=sign_data,
        language=language,
        expires_at=expires_at,
    )
    db.add(cert)
    await db.commit()
    await db.refresh(cert)
    return cert
