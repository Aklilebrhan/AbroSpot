import logging
from typing import List, Optional
from datetime import datetime, timezone
import httpx

from app.adapters.base import BaseIngestionAdapter, ConnectionTestResult
from app.schemas.ingestion import RawPostPayload, MonitoredSourceConfig, PlatformType, MediaMetadata, MediaType
from app.config import settings

logger = logging.getLogger("abrospot.x")

class XIngestionAdapter(BaseIngestionAdapter):
    """X (Twitter) API v2 ingestion adapter."""

    def __init__(self):
        super().__init__(PlatformType.X_TWITTER)
        self.bearer_token = settings.X_BEARER_TOKEN
        self.base_url = "https://api.twitter.com/2"

    def is_configured(self) -> bool:
        return bool(self.bearer_token)

    async def test_connection(self) -> ConnectionTestResult:
        if not self.is_configured():
            return ConnectionTestResult(
                is_connected=False,
                message="X_BEARER_TOKEN is not configured.",
                details={"configured": False}
            )
        try:
            headers = {"Authorization": f"Bearer {self.bearer_token}"}
            async with httpx.AsyncClient() as client:
                res = await client.get(f"{self.base_url}/users/by/username/twitterdev", headers=headers, timeout=10.0)
                if res.status_code == 200:
                    return ConnectionTestResult(is_connected=True, message="X API v2 connected successfully.")
                else:
                    return ConnectionTestResult(
                        is_connected=False,
                        message=f"X API returned status {res.status_code}: {res.text}",
                        details={"status": res.status_code}
                    )
        except Exception as e:
            return ConnectionTestResult(is_connected=False, message=f"X connection error: {str(e)}")

    async def fetch_recent_posts(
        self, source: MonitoredSourceConfig, limit: int = 20
    ) -> List[RawPostPayload]:
        username = source.identifier.strip().lstrip("@")
        if not self.is_configured():
            logger.info(f"X API token not configured. Operating in standby mode for @{username}.")
            return []

        try:
            headers = {"Authorization": f"Bearer {self.bearer_token}"}
            async with httpx.AsyncClient() as client:
                # 1. Lookup user ID
                user_res = await client.get(
                    f"{self.base_url}/users/by/username/{username}", headers=headers, timeout=10.0
                )
                if user_res.status_code != 200:
                    logger.warning(f"Could not find X user @{username}: {user_res.text}")
                    return []
                user_data = user_res.json().get("data", {})
                user_id = user_data.get("id")

                # 2. Get recent tweets
                tweets_res = await client.get(
                    f"{self.base_url}/users/{user_id}/tweets",
                    headers=headers,
                    params={
                        "max_results": min(max(limit, 5), 100),
                        "tweet.fields": "created_at,attachments,entities",
                        "expansions": "attachments.media_keys",
                        "media.fields": "url,preview_image_url,type"
                    },
                    timeout=10.0
                )
                if tweets_res.status_code != 200:
                    logger.warning(f"Failed to fetch tweets for {username}: {tweets_res.text}")
                    return []

                data = tweets_res.json()
                tweets = data.get("data", [])
                media_map = {m["media_key"]: m for m in data.get("includes", {}).get("media", [])}

                results: List[RawPostPayload] = []
                for tweet in tweets:
                    media_items: List[MediaMetadata] = []
                    media_urls: List[str] = []
                    for media_key in tweet.get("attachments", {}).get("media_keys", []):
                        m = media_map.get(media_key)
                        if m and (m.get("url") or m.get("preview_image_url")):
                            url = m.get("url") or m.get("preview_image_url")
                            media_urls.append(url)
                            media_items.append(MediaMetadata(
                                mediaType=MediaType.IMAGE,
                                originalUrl=url
                            ))

                    created_at_dt = datetime.fromisoformat(tweet["created_at"].replace("Z", "+00:00"))
                    results.append(RawPostPayload(
                        sourcePlatform=PlatformType.X_TWITTER,
                        externalPostId=f"x_{tweet['id']}",
                        sourceUrl=f"https://x.com/{username}/status/{tweet['id']}",
                        channelOrAccountName=source.displayName,
                        authorUsername=username,
                        publishedAt=created_at_dt,
                        rawText=tweet.get("text", ""),
                        mediaUrls=media_urls,
                        mediaItems=media_items,
                        rawPayload=tweet
                    ))
                return results

        except Exception as e:
            logger.error(f"Error fetching posts from X @{username}: {e}")
            raise
