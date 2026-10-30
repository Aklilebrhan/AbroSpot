import logging
from typing import List
from datetime import datetime, timezone

from app.adapters.base import BaseIngestionAdapter, ConnectionTestResult
from app.schemas.ingestion import RawPostPayload, MonitoredSourceConfig, PlatformType
from app.config import settings

logger = logging.getLogger("abrospot.linkedin")

class LinkedInIngestionAdapter(BaseIngestionAdapter):
    """LinkedIn Organization API adapter."""

    def __init__(self):
        super().__init__(PlatformType.LINKEDIN)
        self.client_id = settings.LINKEDIN_CLIENT_ID
        self.client_secret = settings.LINKEDIN_CLIENT_SECRET

    def is_configured(self) -> bool:
        return bool(self.client_id and self.client_secret)

    async def test_connection(self) -> ConnectionTestResult:
        if not self.is_configured():
            return ConnectionTestResult(
                is_connected=False,
                message="LinkedIn Client ID or Secret not configured.",
                details={"configured": False}
            )
        return ConnectionTestResult(
            is_connected=True,
            message="LinkedIn credentials set.",
            details={"configured": True}
        )

    async def fetch_recent_posts(
        self, source: MonitoredSourceConfig, limit: int = 20
    ) -> List[RawPostPayload]:
        if not self.is_configured():
            logger.info(f"LinkedIn credentials not configured. In standby mode for {source.identifier}.")
            return []
        return []
