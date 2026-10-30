from typing import Dict
from app.schemas.ingestion import PlatformType
from app.adapters.base import BaseIngestionAdapter
from app.adapters.telegram_adapter import TelegramIngestionAdapter
from app.adapters.x_adapter import XIngestionAdapter
from app.adapters.instagram_adapter import InstagramIngestionAdapter
from app.adapters.tiktok_adapter import TikTokIngestionAdapter
from app.adapters.linkedin_adapter import LinkedInIngestionAdapter
from app.adapters.manual_adapter import ManualDropzoneAdapter

_adapters: Dict[PlatformType, BaseIngestionAdapter] = {}

def get_adapter(platform: PlatformType) -> BaseIngestionAdapter:
    if platform not in _adapters:
        if platform == PlatformType.TELEGRAM:
            _adapters[platform] = TelegramIngestionAdapter()
        elif platform == PlatformType.X_TWITTER:
            _adapters[platform] = XIngestionAdapter()
        elif platform == PlatformType.INSTAGRAM:
            _adapters[platform] = InstagramIngestionAdapter()
        elif platform == PlatformType.TIKTOK:
            _adapters[platform] = TikTokIngestionAdapter()
        elif platform == PlatformType.LINKEDIN:
            _adapters[platform] = LinkedInIngestionAdapter()
        elif platform == PlatformType.MANUAL:
            _adapters[platform] = ManualDropzoneAdapter()
        else:
            raise ValueError(f"Unsupported platform adapter: {platform}")
    return _adapters[platform]
