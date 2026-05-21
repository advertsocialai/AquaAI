from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from app.database import get_db
from app.models.user import User
from app.core.auth import hash_password, verify_password, create_access_token
from app.schemas.auth import RegisterRequest, TokenResponse, UserOut

router = APIRouter(prefix="/auth", tags=["Authentication"])


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


@router.post("/fcm-token")
async def update_fcm_token(
    fcm_token: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(__import__("app.core.deps", fromlist=["get_current_user"]).get_current_user),
):
    current_user.fcm_token = fcm_token
    await db.commit()
    return {"status": "updated"}
