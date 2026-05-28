from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.config import settings

# Supabase's transaction pooler (port 6543) runs pgbouncer in transaction mode,
# which doesn't support prepared statements. Disabling asyncpg's statement cache
# (and SQLAlchemy's compiled-cache for execute_many) makes us compatible with
# both the pooler and a direct connection (port 5432).
_IS_POOLER = "pooler.supabase.com" in (settings.database_url or "")
_CONNECT_ARGS = (
    {"statement_cache_size": 0, "prepared_statement_cache_size": 0}
    if _IS_POOLER and settings.database_url.startswith("postgresql+asyncpg")
    else {}
)

engine = create_async_engine(
    settings.database_url,
    echo=False,
    pool_pre_ping=True,
    connect_args=_CONNECT_ARGS,
)
AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session


async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
