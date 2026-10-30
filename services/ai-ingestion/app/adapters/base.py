from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from app.schemas.ingestion import RawPostPayload, MonitoredSourceConfig, PlatformType

class ConnectionTestResult:
    def __init__(self, is_connected: bool, message: str, details: Optional[Dict[str, Any]] = None):
        self.is_connected = is_connected
        self.message = message
        self.details = details or {}

    def to_dict(self) -> Dict[str, Any]:
        return {
            "isConnected": self.is_connected,
            "message": self.message,
            "details": self.details,
        }

class BaseIngestionAdapter(ABC):
    """Abstract base class for all social media platform ingestion adapters."""
    
    def __init__(self, platform: PlatformType):
        self.platform = platform

    @abstractmethod
    async def test_connection(self) -> ConnectionTestResult:
        """Test API/client connection and authentication validity."""
        pass

    @abstractmethod
    async def fetch_recent_posts(
        self, source: MonitoredSourceConfig, limit: int = 20
    ) -> List[RawPostPayload]:
        """Fetch latest posts from the specified channel/account."""
        pass

    @abstractmethod
    def is_configured(self) -> bool:
        """Return True if necessary credentials/tokens are provided."""
        pass
