-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'CURATOR', 'USER');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'CANCELLED', 'POSTPONED', 'REJECTED');

-- CreateEnum
CREATE TYPE "OccurrenceStatus" AS ENUM ('SCHEDULED', 'CANCELLED', 'RESCHEDULED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "SourcePlatform" AS ENUM ('TELEGRAM', 'INSTAGRAM', 'X_TWITTER', 'TIKTOK', 'LINKEDIN', 'MANUAL');

-- CreateEnum
CREATE TYPE "SourceStatus" AS ENUM ('ACTIVE', 'PAUSED', 'ERROR', 'RATE_LIMITED', 'PENDING_AUTH');

-- CreateEnum
CREATE TYPE "PostProcessingStatus" AS ENUM ('PENDING', 'EXTRACTING', 'EXTRACTED', 'DUPLICATE', 'REJECTED_NOT_EVENT', 'FAILED');

-- CreateEnum
CREATE TYPE "CalendarSystem" AS ENUM ('GREGORIAN', 'ETHIOPIAN', 'MIXED');

-- CreateEnum
CREATE TYPE "LanguageCode" AS ENUM ('AMHARIC', 'ENGLISH', 'MIXED', 'OTHER');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'RESOLVED_MERGED');

-- CreateEnum
CREATE TYPE "ReviewReason" AS ENUM ('LOW_CONFIDENCE', 'DATE_AMBIGUITY', 'POSSIBLE_DUPLICATE', 'MISSING_VENUE', 'AMHARIC_UNCERTAINTY', 'COMMUNITY_REPORT');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameAmharic" TEXT,
    "description" TEXT,
    "iconName" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_locations" (
    "id" TEXT NOT NULL,
    "venueName" TEXT NOT NULL,
    "city" TEXT NOT NULL DEFAULT 'Addis Ababa',
    "subCity" TEXT,
    "landmark" TEXT,
    "streetAddress" TEXT,
    "googleMapsUrl" TEXT,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "isVirtual" BOOLEAN NOT NULL DEFAULT false,
    "virtualUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleAmharic" TEXT,
    "summary" TEXT,
    "description" TEXT,
    "status" "EventStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "categoryId" TEXT NOT NULL,
    "locationId" TEXT,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "priceAmount" DECIMAL(10,2),
    "priceCurrency" TEXT NOT NULL DEFAULT 'ETB',
    "ticketUrl" TEXT,
    "organizerName" TEXT,
    "organizerContact" TEXT,
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "requiresReview" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_occurrences" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "startTime" TEXT,
    "endTime" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'Africa/Addis_Ababa',
    "originalDateExpression" TEXT,
    "calendarSystem" "CalendarSystem" NOT NULL DEFAULT 'GREGORIAN',
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurrenceRule" TEXT,
    "status" "OccurrenceStatus" NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_occurrences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_media" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "mediaType" "MediaType" NOT NULL DEFAULT 'IMAGE',
    "url" TEXT NOT NULL,
    "localPath" TEXT,
    "thumbnailUrl" TEXT,
    "isPrimaryFlyer" BOOLEAN NOT NULL DEFAULT false,
    "mimeType" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "fileSizeBytes" INTEGER,
    "blurHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monitored_sources" (
    "id" TEXT NOT NULL,
    "platform" "SourcePlatform" NOT NULL,
    "identifier" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "avatarUrl" TEXT,
    "sourceUrl" TEXT,
    "status" "SourceStatus" NOT NULL DEFAULT 'ACTIVE',
    "fetchFrequencyMinutes" INTEGER NOT NULL DEFAULT 30,
    "lastFetchedAt" TIMESTAMP(3),
    "lastPostIdentifier" TEXT,
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "lastErrorMessage" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monitored_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "source_posts" (
    "id" TEXT NOT NULL,
    "monitoredSourceId" TEXT,
    "platform" "SourcePlatform" NOT NULL,
    "externalPostId" TEXT NOT NULL,
    "postUrl" TEXT,
    "authorUsername" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "rawText" TEXT,
    "rawPayload" JSONB NOT NULL,
    "mediaUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "processingStatus" "PostProcessingStatus" NOT NULL DEFAULT 'PENDING',
    "canonicalEventId" TEXT,
    "duplicateOfPostId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "source_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "extraction_results" (
    "id" TEXT NOT NULL,
    "sourcePostId" TEXT NOT NULL,
    "isEvent" BOOLEAN NOT NULL DEFAULT false,
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "ocrAmharicText" TEXT,
    "ocrEnglishText" TEXT,
    "fullExtractedText" TEXT,
    "detectedLanguage" "LanguageCode" NOT NULL DEFAULT 'ENGLISH',
    "extractedJson" JSONB NOT NULL,
    "validationErrors" JSONB,
    "missingFields" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "requiresReview" BOOLEAN NOT NULL DEFAULT false,
    "reviewReason" "ReviewReason",
    "modelEngine" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "extraction_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_queue_items" (
    "id" TEXT NOT NULL,
    "sourcePostId" TEXT NOT NULL,
    "eventId" TEXT,
    "reason" "ReviewReason" NOT NULL DEFAULT 'LOW_CONFIDENCE',
    "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "assignedToUserId" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "review_queue_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingestion_jobs" (
    "id" TEXT NOT NULL,
    "monitoredSourceId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'RUNNING',
    "postsFound" INTEGER NOT NULL DEFAULT 0,
    "postsIngested" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,

    CONSTRAINT "ingestion_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_events" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "event_categories_slug_key" ON "event_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "event_categories_name_key" ON "event_categories"("name");

-- CreateIndex
CREATE INDEX "event_categories_slug_idx" ON "event_categories"("slug");

-- CreateIndex
CREATE INDEX "event_locations_city_subCity_idx" ON "event_locations"("city", "subCity");

-- CreateIndex
CREATE INDEX "event_locations_venueName_idx" ON "event_locations"("venueName");

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");

-- CreateIndex
CREATE INDEX "events_status_idx" ON "events"("status");

-- CreateIndex
CREATE INDEX "events_categoryId_idx" ON "events"("categoryId");

-- CreateIndex
CREATE INDEX "events_createdAt_idx" ON "events"("createdAt");

-- CreateIndex
CREATE INDEX "events_isFeatured_status_idx" ON "events"("isFeatured", "status");

-- CreateIndex
CREATE INDEX "event_occurrences_startDate_idx" ON "event_occurrences"("startDate");

-- CreateIndex
CREATE INDEX "event_occurrences_eventId_startDate_idx" ON "event_occurrences"("eventId", "startDate");

-- CreateIndex
CREATE INDEX "event_media_eventId_isPrimaryFlyer_idx" ON "event_media"("eventId", "isPrimaryFlyer");

-- CreateIndex
CREATE INDEX "monitored_sources_platform_status_idx" ON "monitored_sources"("platform", "status");

-- CreateIndex
CREATE UNIQUE INDEX "monitored_sources_platform_identifier_key" ON "monitored_sources"("platform", "identifier");

-- CreateIndex
CREATE INDEX "source_posts_processingStatus_idx" ON "source_posts"("processingStatus");

-- CreateIndex
CREATE INDEX "source_posts_publishedAt_idx" ON "source_posts"("publishedAt");

-- CreateIndex
CREATE INDEX "source_posts_canonicalEventId_idx" ON "source_posts"("canonicalEventId");

-- CreateIndex
CREATE UNIQUE INDEX "source_posts_platform_externalPostId_key" ON "source_posts"("platform", "externalPostId");

-- CreateIndex
CREATE UNIQUE INDEX "extraction_results_sourcePostId_key" ON "extraction_results"("sourcePostId");

-- CreateIndex
CREATE INDEX "extraction_results_isEvent_confidenceScore_idx" ON "extraction_results"("isEvent", "confidenceScore");

-- CreateIndex
CREATE INDEX "extraction_results_requiresReview_idx" ON "extraction_results"("requiresReview");

-- CreateIndex
CREATE UNIQUE INDEX "review_queue_items_sourcePostId_key" ON "review_queue_items"("sourcePostId");

-- CreateIndex
CREATE INDEX "review_queue_items_status_idx" ON "review_queue_items"("status");

-- CreateIndex
CREATE INDEX "review_queue_items_reason_idx" ON "review_queue_items"("reason");

-- CreateIndex
CREATE INDEX "ingestion_jobs_monitoredSourceId_startedAt_idx" ON "ingestion_jobs"("monitoredSourceId", "startedAt");

-- CreateIndex
CREATE INDEX "saved_events_userId_idx" ON "saved_events"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "saved_events_userId_eventId_key" ON "saved_events"("userId", "eventId");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "event_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "event_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_occurrences" ADD CONSTRAINT "event_occurrences_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_media" ADD CONSTRAINT "event_media_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "source_posts" ADD CONSTRAINT "source_posts_monitoredSourceId_fkey" FOREIGN KEY ("monitoredSourceId") REFERENCES "monitored_sources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "source_posts" ADD CONSTRAINT "source_posts_canonicalEventId_fkey" FOREIGN KEY ("canonicalEventId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "source_posts" ADD CONSTRAINT "source_posts_duplicateOfPostId_fkey" FOREIGN KEY ("duplicateOfPostId") REFERENCES "source_posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extraction_results" ADD CONSTRAINT "extraction_results_sourcePostId_fkey" FOREIGN KEY ("sourcePostId") REFERENCES "source_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_queue_items" ADD CONSTRAINT "review_queue_items_sourcePostId_fkey" FOREIGN KEY ("sourcePostId") REFERENCES "source_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_queue_items" ADD CONSTRAINT "review_queue_items_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_queue_items" ADD CONSTRAINT "review_queue_items_assignedToUserId_fkey" FOREIGN KEY ("assignedToUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingestion_jobs" ADD CONSTRAINT "ingestion_jobs_monitoredSourceId_fkey" FOREIGN KEY ("monitoredSourceId") REFERENCES "monitored_sources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_events" ADD CONSTRAINT "saved_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_events" ADD CONSTRAINT "saved_events_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
