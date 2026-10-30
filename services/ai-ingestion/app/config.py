from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
from pathlib import Path

class Settings(BaseSettings):
    # App Settings
    APP_NAME: str = "AbroSpot AI & Ingestion Engine"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    
    # Storage
    STORAGE_DIR: str = str(Path(__file__).parent.parent / "storage" / "flyers")
    
    # PostgreSQL Database URL
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/abrospot"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Telegram MTProto Credentials
    TELEGRAM_API_ID: Optional[int] = None
    TELEGRAM_API_HASH: Optional[str] = None
    TELEGRAM_BOT_TOKEN: Optional[str] = None
    TELEGRAM_PHONE_NUMBER: Optional[str] = None
    TELEGRAM_SESSION_NAME: str = "abrospot_tg_session"
    
    # X (Twitter) API v2
    X_BEARER_TOKEN: Optional[str] = None
    
    # Instagram Graph API
    INSTAGRAM_ACCESS_TOKEN: Optional[str] = None
    INSTAGRAM_ACCOUNT_ID: Optional[str] = None
    
    # TikTok API
    TIKTOK_CLIENT_KEY: Optional[str] = None
    TIKTOK_CLIENT_SECRET: Optional[str] = None
    
    # LinkedIn API
    LINKEDIN_CLIENT_ID: Optional[str] = None
    LINKEDIN_CLIENT_SECRET: Optional[str] = None
    
    # LLM / Vision Extraction Keys (Optional fallback to Gemini or OpenAI)
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    
    # Internal Security Token for Express-to-FastAPI communication
    INTERNAL_API_SECRET: str = "abrospot-internal-secret-token"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
