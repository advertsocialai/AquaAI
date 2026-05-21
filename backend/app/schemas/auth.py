from pydantic import BaseModel, EmailStr
from app.models.user import UserRole, Language


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    password: str
    role: UserRole = UserRole.farmer
    language: Language = Language.english
    district: str | None = None
    mandal: str | None = None


class LoginRequest(BaseModel):
    username: str  # email or phone
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    role: str
    name: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    phone: str | None
    role: UserRole
    language: Language
    district: str | None
    mandal: str | None
    is_active: bool

    class Config:
        from_attributes = True
