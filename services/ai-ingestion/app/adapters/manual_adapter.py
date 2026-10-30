import uuid
from typing import List, Optional
from datetime import datetime, timezone

from app.adapters.base import BaseIngestionAdapter, ConnectionTestResult
from app.schemas.ingestion import RawPostPayload, MonitoredSourceConfig, PlatformType, MediaMetadata, MediaType

class ManualDropzoneAdapter(BaseIngestionAdapter):
    """Admin manual flyer and text dropzone adapter."""

    def __init__(self):
        super().__init__(PlatformType.MANUAL)

    def is_configured(self) -> bool:
        return True

    async def test_connection(self) -> ConnectionTestResult:
        return ConnectionTestResult(is_connected=True, message="Manual dropzone active.")

    async def fetch_recent_posts(
        self, source: MonitoredSourceConfig, limit: int = 20
    ) -> List[RawPostPayload]:
        return []

    def create_manual_post(
        self,
        raw_text: str,
        media_paths: Optional[List[str]] = None,
        author: str = "Admin Dropzone",
        source_url: Optional[str] = None
    ) -> RawPostPayload:
        unique_id = f"manual_{uuid.uuid4().hex[:12]}"
        media_items = []
        for path in (media_paths or []):
            media_items.append(MediaMetadata(
                mediaType=MediaType.IMAGE,
                localFilePath=path,
                mimeType="image/jpeg"
            ))

        return RawPostPayload(
            sourcePlatform=PlatformType.MANUAL,
            externalPostId=unique_id,
            sourceUrl=source_url,
            channelOrAccountName=author,
            authorUsername=author,
            publishedAt=datetime.now(timezone.utc),
            rawText=raw_text,
            mediaUrls=[],
            mediaItems=media_items,
            rawPayload={"source": "admin_dropzone", "author": author}
        )
