"""Integration tests for the auth router against an in-memory SQLite DB.

Mounts only the auth router (avoids the AI-router import chain) and overrides
get_db with a shared in-memory async SQLite session.
"""
import pytest_asyncio
from fastapi import FastAPI
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.pool import StaticPool

import app.models  # noqa: F401  register models on Base
from app.database import Base, get_db
from app.api.v1 import auth


@pytest_asyncio.fixture
async def client():
    engine = create_async_engine(
        "sqlite+aiosqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    Session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async def override_get_db():
        async with Session() as s:
            yield s

    test_app = FastAPI()
    test_app.include_router(auth.router, prefix="/api/v1")
    test_app.dependency_overrides[get_db] = override_get_db

    async with AsyncClient(transport=ASGITransport(app=test_app), base_url="http://test") as c:
        yield c
    await engine.dispose()


REG = {"name": "Raju", "email": "raju@example.com", "password": "secret123", "role": "farmer", "language": "telugu"}


async def test_register_creates_user(client):
    r = await client.post("/api/v1/auth/register", json=REG)
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["email"] == "raju@example.com"
    assert body["role"] == "farmer"
    assert "hashed_password" not in body  # never leak the hash


async def test_register_duplicate_email_rejected(client):
    await client.post("/api/v1/auth/register", json=REG)
    r = await client.post("/api/v1/auth/register", json=REG)
    assert r.status_code == 400


async def test_login_returns_token(client):
    await client.post("/api/v1/auth/register", json=REG)
    r = await client.post(
        "/api/v1/auth/login",
        data={"username": "raju@example.com", "password": "secret123"},
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["token_type"] == "bearer"
    assert body["access_token"]
    assert body["role"] == "farmer"


async def test_login_wrong_password_rejected(client):
    await client.post("/api/v1/auth/register", json=REG)
    r = await client.post(
        "/api/v1/auth/login",
        data={"username": "raju@example.com", "password": "WRONG"},
    )
    assert r.status_code == 401


async def test_login_unknown_user_rejected(client):
    r = await client.post(
        "/api/v1/auth/login",
        data={"username": "ghost@example.com", "password": "x"},
    )
    assert r.status_code == 401
