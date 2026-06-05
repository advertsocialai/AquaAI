"""Unit tests for app.core.auth — password hashing + JWT. No DB required."""
from datetime import timedelta

from app.core.auth import (
    hash_password, verify_password, create_access_token, decode_token,
)


# ── Password hashing (bcrypt) ────────────────────────────────────────────────
def test_hash_is_not_plaintext_and_verifies():
    h = hash_password("Sup3r$ecret")
    assert h != "Sup3r$ecret"
    assert verify_password("Sup3r$ecret", h) is True


def test_wrong_password_fails():
    h = hash_password("correct-horse")
    assert verify_password("wrong-horse", h) is False


def test_same_password_hashes_differ_due_to_salt():
    assert hash_password("repeat") != hash_password("repeat")


def test_unicode_password_roundtrips():
    pw = "పాస్‌వర్డ్-🔐"
    assert verify_password(pw, hash_password(pw)) is True


# ── JWT create / decode ──────────────────────────────────────────────────────
def test_token_roundtrip_carries_claims():
    token = create_access_token({"sub": "42", "role": "farmer"})
    payload = decode_token(token)
    assert payload is not None
    assert payload["sub"] == "42"
    assert payload["role"] == "farmer"
    assert "exp" in payload


def test_tampered_token_is_rejected():
    token = create_access_token({"sub": "1"})
    assert decode_token(token + "x") is None


def test_garbage_token_is_rejected():
    assert decode_token("not-a-jwt") is None


def test_expired_token_is_rejected():
    token = create_access_token({"sub": "1"}, expires_delta=timedelta(seconds=-5))
    assert decode_token(token) is None


def test_custom_expiry_is_accepted_while_valid():
    token = create_access_token({"sub": "9"}, expires_delta=timedelta(minutes=5))
    assert decode_token(token)["sub"] == "9"
