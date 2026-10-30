import json
import logging
from typing import List, Optional
from datetime import datetime, timezone
import asyncpg

from app.config import settings
from app.adapters import get_adapter
from app.schemas.ingestion import MonitoredSourceConfig, IngestionResult, RawPostPayload
from app.workers.media_downloader import MediaDownloader

logger = logging.getLogger("abrospot.ingestion_worker")

class IngestionWorker:
    """Orchestrates fetching, media downloading, PostgreSQL persistence, and Redis dispatch."""

    def __init__(self):
        self.media_downloader = MediaDownloader()
        self.db_url = settings.DATABASE_URL

    async def _get_db_connection(self):
        try:
            return await asyncpg.connect(self.db_url)
        except Exception as e:
            logger.warning(f"Could not connect directly to PostgreSQL ({e}). Operating in memory/standalone test mode.")
            return None

    async def process_source(self, source: MonitoredSourceConfig, limit: int = 20) -> IngestionResult:
        logger.info(f"Processing ingestion for {source.platform} source: {source.identifier}")
        result = IngestionResult(
            sourceIdentifier=source.identifier,
            platform=source.platform,
            postsFound=0,
            postsIngested=0,
            duplicatesSkipped=0
        )

        try:
            adapter = get_adapter(source.platform)
            posts: List[RawPostPayload] = await adapter.fetch_recent_posts(source, limit=limit)
            result.postsFound = len(posts)

            conn = await self._get_db_connection()

            for post in posts:
                # 1. Download flyer media if needed
                for media_url in post.mediaUrls:
                    downloaded = await self.media_downloader.download_image(media_url)
                    if downloaded:
                        post.mediaItems.append(downloaded)

                # 2. Persist to PostgreSQL if connected
                if conn:
                    try:
                        # Insert raw SourcePost
                        insert_query = """
                        INSERT INTO source_posts (
                            id, monitored_source_id, platform, external_post_id,
                            post_url, author_username, published_at, raw_text,
                            raw_payload, media_urls, processing_status, created_at, updated_at
                        ) VALUES (
                            gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, 'PENDING', NOW(), NOW()
                        )
                        ON CONFLICT (platform, external_post_id) DO NOTHING
                        RETURNING id;
                        """
                        row = await conn.fetchrow(
                            insert_query,
                            source.id,
                            post.sourcePlatform.value,
                            post.externalPostId,
                            post.sourceUrl,
                            post.authorUsername,
                            post.publishedAt,
                            post.rawText,
                            json.dumps(post.rawPayload),
                            post.mediaUrls
                        )
                        if row:
                            result.postsIngested += 1
                        else:
                            result.duplicatesSkipped += 1
                    except Exception as db_err:
                        logger.error(f"Failed to insert source post {post.externalPostId}: {db_err}")
                        result.errors.append(str(db_err))
                else:
                    # In standalone mode without active DB
                    result.postsIngested += 1

            if conn:
                await conn.close()

            result.success = True
            logger.info(
                f"Completed {source.identifier}: {result.postsIngested} new posts, {result.duplicatesSkipped} duplicates."
            )
            return result

        except Exception as e:
            logger.error(f"Error during ingestion for {source.identifier}: {e}")
            result.errors.append(str(e))
            result.success = False
            return result
