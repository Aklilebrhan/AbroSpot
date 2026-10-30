import pytest
from app.adapters import get_adapter
from app.schemas.ingestion import PlatformType, MonitoredSourceConfig
from app.workers.ingestion_worker import IngestionWorker
from app.adapters.manual_adapter import ManualDropzoneAdapter

@pytest.mark.asyncio
async def test_adapters_instantiation():
    for platform in PlatformType:
        adapter = get_adapter(platform)
        assert adapter is not None
        assert adapter.platform == platform

@pytest.mark.asyncio
async def test_telegram_adapter_simulated_stream():
    adapter = get_adapter(PlatformType.TELEGRAM)
    source = MonitoredSourceConfig(
        platform=PlatformType.TELEGRAM,
        identifier="@linkupaddis",
        displayName="LinkUp Addis"
    )
    posts = await adapter.fetch_recent_posts(source, limit=2)
    assert len(posts) > 0
    assert posts[0].sourcePlatform == PlatformType.TELEGRAM
    assert posts[0].authorUsername == "linkupaddis"
    assert "Addis" in posts[0].rawText

@pytest.mark.asyncio
async def test_manual_dropzone_adapter():
    manual = ManualDropzoneAdapter()
    post = manual.create_manual_post(
        raw_text="Acoustic live concert at Atmosphere Addis on Friday!",
        author="Curator Test"
    )
    assert post.sourcePlatform == PlatformType.MANUAL
    assert "Atmosphere" in post.rawText
    assert post.authorUsername == "Curator Test"

@pytest.mark.asyncio
async def test_ingestion_worker_process():
    worker = IngestionWorker()
    source = MonitoredSourceConfig(
        platform=PlatformType.TELEGRAM,
        identifier="@eventsethiopia",
        displayName="Events Ethiopia"
    )
    result = await worker.process_source(source, limit=2)
    assert result.success is True
    assert result.postsFound > 0
    assert result.postsIngested > 0
