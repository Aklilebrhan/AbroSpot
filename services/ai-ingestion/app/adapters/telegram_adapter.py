import os
import logging
from typing import List, Optional
from datetime import datetime, timezone
from pathlib import Path
from telethon import TelegramClient
from telethon.tl.types import MessageMediaPhoto, MessageMediaDocument

from app.adapters.base import BaseIngestionAdapter, ConnectionTestResult
from app.schemas.ingestion import RawPostPayload, MonitoredSourceConfig, PlatformType, MediaMetadata, MediaType
from app.config import settings

logger = logging.getLogger("abrospot.telegram")

class TelegramIngestionAdapter(BaseIngestionAdapter):
    """Telethon MTProto client adapter for public Telegram channels."""

    def __init__(self):
        super().__init__(PlatformType.TELEGRAM)
        self.api_id = settings.TELEGRAM_API_ID
        self.api_hash = settings.TELEGRAM_API_HASH
        self.session_name = settings.TELEGRAM_SESSION_NAME
        self.client: Optional[TelegramClient] = None
        self.storage_dir = Path(settings.STORAGE_DIR)
        self.storage_dir.mkdir(parents=True, exist_ok=True)

    def is_configured(self) -> bool:
        return bool(self.api_id and self.api_hash)

    async def _get_client(self) -> TelegramClient:
        if self.client is None:
            if not self.is_configured():
                raise ValueError("Telegram credentials (TELEGRAM_API_ID, TELEGRAM_API_HASH) are not configured.")
            self.client = TelegramClient(self.session_name, self.api_id, self.api_hash)
            await self.client.connect()
        return self.client

    async def test_connection(self) -> ConnectionTestResult:
        if not self.is_configured():
            return ConnectionTestResult(
                is_connected=False,
                message="Telegram API ID or Hash is missing in configuration.",
                details={"configured": False}
            )
        try:
            client = await self._get_client()
            is_authorized = await client.is_user_authorized()
            return ConnectionTestResult(
                is_connected=True,
                message="Successfully connected to Telegram MTProto gateway.",
                details={"isAuthorized": is_authorized}
            )
        except Exception as e:
            logger.error(f"Telegram connection test failed: {e}")
            return ConnectionTestResult(
                is_connected=False,
                message=f"Telegram connection failed: {str(e)}",
                details={"error": str(e)}
            )

    async def fetch_recent_posts(
        self, source: MonitoredSourceConfig, limit: int = 20
    ) -> List[RawPostPayload]:
        channel_handle = source.identifier.strip().lstrip("@")
        
        # If Telegram credentials are not yet configured, provide mock/demo stream
        if not self.is_configured():
            logger.warning(
                f"Telegram credentials not set. Returning authentic simulated Addis Ababa data for {source.identifier}."
            )
            return self._generate_simulated_channel_posts(source, limit)

        try:
            client = await self._get_client()
            entity = await client.get_entity(channel_handle)
            messages = await client.get_messages(entity, limit=limit)
            
            payloads: List[RawPostPayload] = []
            for msg in messages:
                if not msg or not (msg.text or msg.media):
                    continue

                media_items: List[MediaMetadata] = []
                media_urls: List[str] = []

                # Download flyer if media is photo
                if msg.photo or (msg.media and isinstance(msg.media, (MessageMediaPhoto, MessageMediaDocument))):
                    file_ext = ".jpg"
                    local_filename = f"tg_{channel_handle}_{msg.id}{file_ext}"
                    local_filepath = self.storage_dir / local_filename
                    
                    if not local_filepath.exists():
                        try:
                            await client.download_media(msg, file=str(local_filepath))
                        except Exception as dl_err:
                            logger.warning(f"Failed to download media for {channel_handle}/{msg.id}: {dl_err}")

                    if local_filepath.exists():
                        media_items.append(MediaMetadata(
                            mediaType=MediaType.IMAGE,
                            mimeType="image/jpeg",
                            localFilePath=str(local_filepath),
                            fileSizeBytes=local_filepath.stat().st_size
                        ))

                post_url = f"https://t.me/{channel_handle}/{msg.id}"
                raw_payload = {
                    "id": msg.id,
                    "date": msg.date.isoformat() if msg.date else None,
                    "views": getattr(msg, "views", None),
                    "forwards": getattr(msg, "forwards", None),
                    "grouped_id": getattr(msg, "grouped_id", None),
                }

                payloads.append(RawPostPayload(
                    sourcePlatform=PlatformType.TELEGRAM,
                    externalPostId=f"{channel_handle}_{msg.id}",
                    sourceUrl=post_url,
                    channelOrAccountName=source.displayName,
                    authorUsername=channel_handle,
                    publishedAt=msg.date if msg.date else datetime.now(timezone.utc),
                    rawText=msg.text or "",
                    mediaUrls=media_urls,
                    mediaItems=media_items,
                    rawPayload=raw_payload
                ))
            return payloads

        except Exception as e:
            logger.error(f"Error fetching posts from Telegram channel {source.identifier}: {e}")
            raise

    def _generate_simulated_channel_posts(
        self, source: MonitoredSourceConfig, limit: int
    ) -> List[RawPostPayload]:
        """Authentic synthetic posts for local testing without requiring active MTProto sessions."""
        now = datetime.now(timezone.utc)
        posts = [
            RawPostPayload(
                sourcePlatform=PlatformType.TELEGRAM,
                externalPostId=f"sim_{source.identifier}_101",
                sourceUrl=f"https://t.me/{source.identifier.lstrip('@')}/101",
                channelOrAccountName=source.displayName,
                authorUsername=source.identifier.lstrip("@"),
                publishedAt=now,
                rawText="""🎨 Addis Art Walk & Makers' Market 2026!
Join us this Saturday, November 7 (ጥቅምት 28) at Alliance Ethio-Française near Piassa.
Over 40 local artisans, live acoustic performances, coffee tasting, and fine art exhibits.
Time: 10:00 AM - 7:00 PM (ከሰዓት 4:00 - 1:00)
Free admission for all! Don't miss out on Addis vibe.""",
                mediaUrls=["https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800"],
                mediaItems=[MediaMetadata(
                    mediaType=MediaType.IMAGE,
                    mimeType="image/jpeg",
                    originalUrl="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800"
                )],
                rawPayload={"views": 5200, "forwards": 184, "simulated": True}
            ),
            RawPostPayload(
                sourcePlatform=PlatformType.TELEGRAM,
                externalPostId=f"sim_{source.identifier}_102",
                sourceUrl=f"https://t.me/{source.identifier.lstrip('@')}/102",
                channelOrAccountName=source.displayName,
                authorUsername=source.identifier.lstrip("@"),
                publishedAt=now,
                rawText="""🚀 GDG Addis Tech Meetup: Building with Generative AI on Cloud!
Location: ALX Capstone Hub, Lideta (Next to Commerce).
Date: Sunday November 15, 2026.
Time: 2:00 PM - 5:30 PM (ከሰዓት 8:00 ጀምሮ).
Speakers from Google Developer Experts and local fintech leads.
RSVP is mandatory at gdg.community.dev/addis""",
                mediaUrls=["https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800"],
                mediaItems=[MediaMetadata(
                    mediaType=MediaType.IMAGE,
                    mimeType="image/jpeg",
                    originalUrl="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800"
                )],
                rawPayload={"views": 7800, "forwards": 412, "simulated": True}
            )
        ]
        return posts[:limit]
