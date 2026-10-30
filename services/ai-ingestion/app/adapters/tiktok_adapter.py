import logging
from typing import List
from datetime import datetime, timezone

from app.adapters.base import BaseIngestionAdapter, ConnectionTestResult
from app.schemas.ingestion import RawPostPayload, MonitoredSourceConfig, PlatformType
from app.config import settings

logger = logging.getLogger("abrospot.tiktok")

class TikTokIngestionAdapter(BaseIngestionAdapter):
    """TikTok Commercial & Display API adapter."""

    def __init__(self):
        super().__init__(PlatformType.TIKTOK)
        self.client_key = settings.TIKTOK_CLIENT_KEY
        self.client_secret = settings.TIKTOK_CLIENT_SECRET

    def is_configured(self) -> bool:
        return bool(self.client_key and self.client_secret)

    async def test_connection(self) -> ConnectionTestResult:
        if not self.is_configured():
            return ConnectionTestResult(
                is_connected=False,
                message="TikTok Client Key or Secret not configured.",
                details={"configured": False}
            )
        return ConnectionTestResult(
            is_connected=True,
            message="TikTok credentials set.",
            details={"configured": True}
        )

    async def fetch_recent_posts(
        self, source: MonitoredSourceConfig, limit: int = 20
    ) -> List[RawPostPayload]:
        if not self.is_configured():
            logger.info(f"TikTok API not configured. In standby mode for {source.identifier}.")
            return []
        return []
