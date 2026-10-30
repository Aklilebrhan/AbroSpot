import os
import hashlib
import logging
from pathlib import Path
from typing import Optional, Tuple
import httpx
from PIL import Image

from app.config import settings
from app.schemas.ingestion import MediaMetadata, MediaType

logger = logging.getLogger("abrospot.media")

class MediaDownloader:
    """Asynchronous media downloader with image verification and deduplication hashing."""

    def __init__(self):
        self.storage_dir = Path(settings.STORAGE_DIR)
        self.storage_dir.mkdir(parents=True, exist_ok=True)

    async def download_image(self, url: str) -> Optional[MediaMetadata]:
        try:
            url_hash = hashlib.sha256(url.encode()).hexdigest()[:16]
            local_filename = f"flyer_{url_hash}.jpg"
            local_path = self.storage_dir / local_filename

            if local_path.exists():
                logger.debug(f"Flyer already cached: {local_path}")
                width, height = self._get_image_dimensions(local_path)
                return MediaMetadata(
                    mediaType=MediaType.IMAGE,
                    mimeType="image/jpeg",
                    originalUrl=url,
                    localFilePath=str(local_path),
                    width=width,
                    height=height,
                    fileSizeBytes=local_path.stat().st_size
                )

            async with httpx.AsyncClient() as client:
                resp = await client.get(url, timeout=20.0, follow_redirects=True)
                if resp.status_code != 200:
                    logger.warning(f"Failed to download image from {url}, status: {resp.status_code}")
                    return None

                content = resp.content
                with open(local_path, "wb") as f:
                    f.write(content)

                width, height = self._get_image_dimensions(local_path)
                return MediaMetadata(
                    mediaType=MediaType.IMAGE,
                    mimeType=resp.headers.get("content-type", "image/jpeg"),
                    originalUrl=url,
                    localFilePath=str(local_path),
                    width=width,
                    height=height,
                    fileSizeBytes=len(content)
                )

        except Exception as e:
            logger.error(f"Error downloading flyer from {url}: {e}")
            return None

    def _get_image_dimensions(self, filepath: Path) -> Tuple[Optional[int], Optional[int]]:
        try:
            with Image.open(filepath) as img:
                return img.width, img.height
        except Exception:
            return None, None
