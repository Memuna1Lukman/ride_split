from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


def sqlalchemy_url(url: str) -> str:
    """Use SQLAlchemy's psycopg 3 dialect for Neon PostgreSQL URLs."""
    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+psycopg://", 1)
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+psycopg://", 1)
    return url


class Settings(BaseSettings):
    database_url: str
    database_url_direct: str
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int

    model_config = SettingsConfigDict(
        env_file=Path(__file__).resolve().parents[1] / ".env"
    )






settings = Settings()
