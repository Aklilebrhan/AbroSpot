from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class PlatformType(str, Enum):
    TELEGRAM = "TELEGRAM"
    INSTAGRAM = "INSTAGRAM"
    X_TWITTER = "X_TWITTER"
    TIKTOK = "TIKTOK"
    LINKEDIN = "LINKEDIN"
    MANUAL = "MANUAL"

class MediaType(str, Enum):
    IMAGE = "IMAGE"
    VIDEO = "VIDEO"
    DOCUMENT = "DOCUMENT"

class MediaMetadata(BaseModel):
    mediaType: MediaType = MediaType.IMAGE
    mimeType: Optional[str] = "image/jpeg"
    originalUrl: Optional[str] = None
    localFilePath: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    fileSizeBytes: Optional[int] = None

class RawPostPayload(BaseModel):
    sourcePlatform: PlatformType
    externalPostId: str
    sourceUrl: Optional[str] = None
    channelOrAccountName: Optional[str] = None
    authorUsername: Optional[str] = None
    publishedAt: datetime
    rawText: Optional[str] = None
    mediaUrls: List[str] = Field(default_factory=list)
    mediaItems: List[MediaMetadata] = Field(default_factory=list)
    rawPayload: Dict[str, Any] = Field(default_factory=dict)

class MonitoredSourceConfig(BaseModel):
    id: Optional[str] = None
    platform: PlatformType
    identifier: str  # e.g. "@linkupaddis"
    displayName: str
    description: Optional[str] = None
    sourceUrl: Optional[str] = None
    fetchFrequencyMinutes: int = 30
    lastPostIdentifier: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

class IngestionResult(BaseModel):
    sourceIdentifier: str
    platform: PlatformType
    postsFound: int
    postsIngested: int
    duplicatesSkipped: int
    errors: List[str] = Field(default_factory=list)
    success: bool = True
