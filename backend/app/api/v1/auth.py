import hashlib
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, text
from app.database import get_db
from app.models.user import User
from app.core.auth import hash_password, verify_password, create_access_token
from app.schemas.auth import RegisterRequest, TokenResponse, UserOut
from app.integrations import sendgrid as sg

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Password reset
OTP_TTL_MINUTES = 15
OTP_MAX_ATTEMPTS = 5


def _hash_otp(otp: str) -> str:
    return hashlib.sha256(otp.encode()).hexdigest()


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str = Field(min_length=6, max_length=6, pattern=r"^[0-9]{6}$")
    new_password: str = Field(min_length=8, max_length=128)


class GenericOkResponse(BaseModel):
    ok: bool
    message: str


@router.post("/register", response_model=UserOut, status_code=201)
async def register(payload: RegisterRequest, db: AsyncSession = Depends(get_db)):
    existing = await db.execute(
        select(User).where(or_(User.email == payload.email,
                               User.phone == payload.phone if payload.phone else False))
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email or phone already registered")

    user = User(
        name=payload.name,
        email=payload.email,
        phone=payload.phone,
        hashed_password=hash_password(payload.password),
        role=payload.role,
        language=payload.language,
        district=payload.district,
        mandal=payload.mandal,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@router.post("/login", response_model=TokenResponse)
async def login(form: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(User).where(or_(User.email == form.username, User.phone == form.username))
    )
    user = result.scalar_one_or_none()
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated")

    token = create_access_token({"sub": str(user.id), "role": user.role})
    return TokenResponse(access_token=token, user_id=user.id, role=user.role, name=user.name)


@router.post("/forgot-password", response_model=GenericOkResponse)
async def forgot_password(
    payload: ForgotPasswordRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Send a 6-digit OTP to the user's email. Always returns success even when
    the email isn't registered — prevents enumeration of valid accounts."""
    email = payload.email.lower().strip()
    ip = request.client.host if request.client else None

    # Look up the user; we still generate-and-send only when we have a real user,
    # but the response is always the same.
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if user is not None:
        otp = f"{secrets.randbelow(10**6):06d}"  # 6-digit zero-padded
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=OTP_TTL_MINUTES)
        await db.execute(
            text(
                "INSERT INTO password_reset_tokens (email, otp_hash, expires_at, ip_address) "
                "VALUES (:email, :hash, :exp, :ip)"
            ),
            {"email": email, "hash": _hash_otp(otp), "exp": expires_at, "ip": ip},
        )
        await db.commit()

        await sg.send_email(
            to_email=email,
            subject="Aqua AI — Password reset code",
            html=(
                "<div style='font-family:Inter,sans-serif;max-width:480px;margin:0 auto;"
                "padding:32px;color:#0f172a;background:#ffffff;'>"
                f"<h1 style='font-size:22px;margin:0 0 16px;color:#0891b2;'>"
                "Reset your password</h1>"
                f"<p style='font-size:14px;line-height:1.6;margin:0 0 16px;'>"
                "Enter this 6-digit code in the Aqua AI app to reset your password:</p>"
                f"<div style='font-family:monospace;font-size:32px;font-weight:bold;"
                "letter-spacing:8px;background:#f1f5f9;padding:16px;text-align:center;"
                f"border-radius:8px;margin:16px 0;'>{otp}</div>"
                f"<p style='font-size:12px;color:#64748b;margin:0;'>"
                f"Valid for {OTP_TTL_MINUTES} minutes. If you did not request this, "
                "ignore this email — your password stays unchanged.</p></div>"
            ),
            text=(
                f"Aqua AI password reset code: {otp}\n\n"
                f"Valid for {OTP_TTL_MINUTES} minutes. If you didn't request this, ignore this email."
            ),
        )

    return GenericOkResponse(
        ok=True,
        message=f"If an account exists for {email}, a reset code has been sent. "
                f"It expires in {OTP_TTL_MINUTES} minutes.",
    )


@router.post("/reset-password", response_model=GenericOkResponse)
async def reset_password(
    payload: ResetPasswordRequest,
    db: AsyncSession = Depends(get_db),
):
    email = payload.email.lower().strip()

    # Find the newest unused, unexpired token for this email.
    row = (await db.execute(
        text(
            "SELECT id, otp_hash, attempts FROM password_reset_tokens "
            "WHERE email = :email AND used_at IS NULL AND expires_at > NOW() "
            "ORDER BY created_at DESC LIMIT 1"
        ),
        {"email": email},
    )).first()

    if row is None:
        raise HTTPException(status_code=400, detail="No active reset request. Request a new code.")

    token_id, otp_hash, attempts = row
    if attempts >= OTP_MAX_ATTEMPTS:
        raise HTTPException(status_code=429, detail="Too many attempts. Request a new code.")

    if _hash_otp(payload.otp) != otp_hash:
        await db.execute(
            text("UPDATE password_reset_tokens SET attempts = attempts + 1 WHERE id = :id"),
            {"id": token_id},
        )
        await db.commit()
        raise HTTPException(status_code=400, detail="Invalid code")

    # Code matches — update the user's password and mark the token used.
    user_result = await db.execute(select(User).where(User.email == email))
    user = user_result.scalar_one_or_none()
    if user is None:
        # Shouldn't happen — we only insert tokens for real users — but stay safe.
        raise HTTPException(status_code=400, detail="No account for this email")

    user.hashed_password = hash_password(payload.new_password)
    await db.execute(
        text("UPDATE password_reset_tokens SET used_at = NOW() WHERE id = :id"),
        {"id": token_id},
    )
    await db.commit()
    return GenericOkResponse(ok=True, message="Password updated. You can log in with your new password.")


@router.post("/fcm-token")
async def update_fcm_token(
    fcm_token: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(__import__("app.core.deps", fromlist=["get_current_user"]).get_current_user),
):
    current_user.fcm_token = fcm_token
    await db.commit()
    return {"status": "updated"}
