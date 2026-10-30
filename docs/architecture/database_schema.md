# AbroSpot Database Architecture & Prisma Schema Documentation

## Overview
AbroSpot utilizes PostgreSQL 16 as its relational persistent datastore. The schema is defined through Prisma ORM with strict type safety, relational foreign key constraints, composite uniqueness rules, and specialized indexes optimized for Ethiopian event query patterns.

---

## 1. Key Entity Relational Model

### Core Entities
1. **`Event` (Canonical Event)**:
   - Central entity representing a unique real-world gathering.
   - Contains normalized title (English and Amharic), summary, description, status (`EventStatus`), pricing, organizer attribution, quality confidence score, and verification flags.
   - Decoupled from specific calendar dates to cleanly support recurring and multi-day occurrences.

2. **`EventOccurrence`**:
   - Represents discrete scheduled instances of an event.
   - Attributes: Normalized Gregorian `startDate` (ISO `YYYY-MM-DD`), optional `endDate`, `startTime` and `endTime` (24-hour string format), and `timezone` (`Africa/Addis_Ababa`).
   - Retains original context in `originalDateExpression` (e.g. `ጥቅምት 27, 2018 ዓ.ም ከምሽቱ 1:00`) and `calendarSystem` (`ETHIOPIAN`, `GREGORIAN`, `MIXED`).
   - Supports iCal standard RRULE expressions for recurring events (e.g., `FREQ=WEEKLY;BYDAY=WE,FR`).

3. **`EventCategory`**:
   - Normalized taxonomy with both English and Amharic titles and Lucide icon mappings.
   - Seeded with 12 Ethiopian event classifications: Technology, Music & Concerts, Art & Culture, Business & Networking, Education & Workshops, Nightlife & Entertainment, Sports & Fitness, Community & Bazaars, Conferences & Summits, Exhibitions & Expos, Career & Job Fairs, and Other.

4. **`EventLocation`**:
   - Dedicated location entity structured hierarchically for Addis Ababa.
   - Fields: `venueName`, `city` ("Addis Ababa"), `subCity` (Bole, Kirkos, Yeka, Arada, etc.), `landmark` (e.g., "Behind Edna Mall", "Next to Meskel Square"), `streetAddress`, `googleMapsUrl`, and `latitude`/`longitude` coordinates.

5. **`EventMedia`**:
   - Preserves ingested flyer images, thumbnails, blurhashes, and dimensions.
   - Flags `isPrimaryFlyer` for fast discovery card rendering.

6. **`MonitoredSource`**:
   - Configurable registry of monitored social media channels and pages across Telegram, Instagram, X/Twitter, TikTok, and LinkedIn.
   - Manages polling frequencies, health status (`ACTIVE`, `PAUSED`, `RATE_LIMITED`, `ERROR`), and platform-specific credentials.

7. **`SourcePost`**:
   - Raw ingested announcement record preserving untouched source JSON payload, original raw text, publication timestamps, and external post IDs.
   - Multiple `SourcePost` records can reference a single canonical `Event` (resolving cross-platform duplicate announcements).
   - Self-referencing duplicate relationship (`duplicateOfPostId`) for identical cross-shares.

8. **`ExtractionResult`**:
   - Detailed audit trail of AI OCR text (Amharic and English), language detection, confidence score, raw extracted JSON, validation errors, and missing fields.

9. **`ReviewQueueItem`**:
   - Human-in-the-loop review mechanism for low-confidence AI extractions, date ambiguities, or suspected duplicates.

10. **`User` & `SavedEvent`**:
    - Role-based access control (`ADMIN`, `CURATOR`, `USER`) and user event bookmarking.

---

## 2. Indexes and Performance Strategy
- `@@index([status])`, `@@index([isFeatured, status])`: Fast filtering for public discovery feeds.
- `@@index([startDate])`, `@@index([eventId, startDate])`: High-speed chronological date range filtering.
- `@@index([city, subCity])`: Faceted geographic filtering across Addis Ababa.
- `@@unique([platform, externalPostId])`: Prevents duplicate ingestion at the database boundary.
- `@@unique([platform, identifier])`: Enforces unique registration of monitored channels.
