import logging
from typing import List, Optional
from datetime import datetime, timezone
import httpx

from app.adapters.base import BaseIngestionAdapter, ConnectionTestResult
from app.schemas.ingestion import RawPostPayload, MonitoredSourceConfig, PlatformType, MediaMetadata, MediaType
from app.config import settings

logger = logging.getLogger("abrospot.instagram")

class InstagramIngestionAdapter(BaseIngestionAdapter):
    """Instagram Graph API adapter for public business/creator pages."""

    def __init__(self):
        super().__init__(PlatformType.INSTAGRAM)
        self.access_token = settings.INSTAGRAM_ACCESS_TOKEN
        self.account_id = settings.INSTAGRAM_ACCOUNT_ID
        self.base_url = "https://graph.facebook.com/v19.0"

    def is_configured(self) -> bool:
        return bool(self.access_token and self.account_id)

    async def test_connection(self) -> ConnectionTestResult:
        if not self.is_configured():
            return ConnectionTestResult(
                is_connected=False,
                message="Instagram Access Token or Account ID not configured.",
                details={"configured": False}
            )
        try:
            async with httpx.AsyncClient() as client:
                res = await client.get(
                    f"{self.base_url}/{self.account_id}",
                    params={"access_token": self.access_token, "fields": "id,username,name"},
                    timeout=10.0
                )
                if res.status_code == 200:
                    return ConnectionTestResult(
                        is_connected=True,
                        message="Connected to Instagram Graph API.",
                        details=res.json()
                    )
                else:
                    return ConnectionTestResult(
                        is_connected=False,
                        message=f"Instagram API error {res.status_code}: {res.text}"
                    )
        except Exception as e:
            return ConnectionTestResult(is_connected=False, message=f"Instagram connection exception: {str(e)}")

    async def fetch_recent_posts(
        self, source: MonitoredSourceConfig, limit: int = 20
    ) -> List[RawPostPayload]:
        if not self.is_configured():
            logger.info(f"Instagram Graph credentials not configured. Adapter in standby for {source.identifier}.")
            return []

        try:
            async with httpx.AsyncClient() as client:
                res = await client.get(
                    f"{self.base_url}/{self.account_id}/media",
                    params={
                        "access_token": self.access_token,
                        "fields": "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp",
                        "limit": min(limit, 50)
                    },
                    timeout=15.0
                )
                if res.status_code != 200:
                    logger.warning(f"Failed to fetch Instagram posts: {res.text}")
                    return []

                data = res.json().get("data", [])
                results: List[RawPostPayload] = []
                for item in data:
                    media_url = item.get("media_url") or item.get("thumbnail_url")
                    media_items = []
                    media_urls = []
                    if media_url:
                        media_urls.append(media_url)
                        media_items.append(MediaMetadata(
                            mediaType=MediaType.IMAGE if item.get("media_type") != "VIDEO" else MediaType.VIDEO,
                            originalUrl=media_url
                        ))

                    ts = datetime.fromisoformat(item["timestamp"].replace("Z", "+00:00"))
                    results.append(RawPostPayload(
                        sourcePlatform=PlatformType.INSTAGRAM,
                        externalPostId=f"ig_{item['id']}",
                        sourceUrl=item.get("permalink"),
                        channelOrAccountName=source.displayName,
                        authorUsername=source.identifier,
                        publishedAt=ts,
                        rawText=item.get("caption", ""),
                        mediaUrls=media_urls,
                        mediaItems=media_items,
                        rawPayload=item
                    ))
                return results

        except Exception as e:
            logger.error(f"Error fetching Instagram posts: {e}")
            raise
