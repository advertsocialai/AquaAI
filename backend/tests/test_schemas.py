"""Validation edge cases for the auth request/response schemas."""
import pytest
from pydantic import ValidationError

from app.schemas.auth import RegisterRequest, TokenResponse, UserOut
from app.models.user import UserRole, Language


def test_register_minimal_valid_uses_defaults():
    r = RegisterRequest(name="Raju", email="raju@example.com", password="secret123")
    assert r.role == UserRole.farmer
    assert r.language == Language.english
    assert r.phone is None


def test_register_rejects_missing_required_fields():
    with pytest.raises(ValidationError):
        RegisterRequest(email="x@y.com", password="p")  # no name


def test_register_rejects_invalid_email():
    with pytest.raises(ValidationError):
        RegisterRequest(name="A", email="not-an-email", password="p")


def test_register_rejects_unknown_role():
    with pytest.raises(ValidationError):
        RegisterRequest(name="A", email="a@b.com", password="p", role="emperor")


def test_register_accepts_explicit_role_and_language():
    r = RegisterRequest(name="V", email="v@b.com", password="p", role=UserRole.vle, language=Language.telugu)
    assert r.role == UserRole.vle
    assert r.language == Language.telugu


def test_token_response_defaults_to_bearer():
    t = TokenResponse(access_token="abc", user_id=1, role="farmer", name="Raju")
    assert t.token_type == "bearer"


def test_user_out_allows_from_attributes():
    # from_attributes lets it build from an ORM-like object
    class Row:
        id, name, email, phone = 1, "Raju", "r@b.com", None
        role, language = UserRole.farmer, Language.english
        district, mandal, is_active = "WG", None, True

    out = UserOut.model_validate(Row())
    assert out.id == 1 and out.is_active is True
