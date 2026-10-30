# AbroSpot Production Deployment & Operations Guide

## 1. Prerequisites
- Docker Engine 24+ & Docker Compose v2.
- Node.js 20+ (for local development/seeding).
- Python 3.12+ (for local AI engine testing).

---

## 2. Fast Startup with Docker Compose

1. **Clone and Configure Environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your PostgreSQL passwords and Telegram API credentials
   ```

2. **Launch All Services**:
   ```bash
   docker compose up -d --build
   ```

3. **Verify Service Health**:
   ```bash
   docker compose ps
   ```
   All five services (`abrospot_postgres`, `abrospot_redis`, `abrospot_ai_ingestion`, `abrospot_api`, `abrospot_web`) will start with automated health checks.

4. **Run Database Migrations & Initial Seed**:
   ```bash
   docker compose exec api npx prisma migrate deploy --schema=packages/database/prisma/schema.prisma
   docker compose exec api npm --workspace=@abrospot/database run seed
   ```

---

## 3. Telegram MTProto Setup (my.telegram.org)

To enable live MTProto reading of public Ethiopian Telegram channels:
1. Obtain `API_ID` and `API_HASH` from [my.telegram.org](https://my.telegram.org) under API Development Tools.
2. Add them to `.env`:
   ```env
   TELEGRAM_API_ID=12345678
   TELEGRAM_API_HASH=abcdef0123456789abcdef0123456789
   ```
3. When running for the first time with user session authorization:
   ```bash
   docker compose exec ai-ingestion python -c "from telethon import TelegramClient; client = TelegramClient('/app/storage/telethon_session', 12345678, 'abcdef0123456789'); client.start()"
   ```
4. Enter your phone number and the Telegram verification code received in your app. The `.session` file is automatically persisted in the `telethon_session` Docker volume.

> [!NOTE]
> If credentials are not provided, the Python service gracefully operates in simulated authentic stream mode without halting the pipeline.

---

## 4. Database Seeding & Reset Commands

To reset and seed the database with Addis Ababa categories, venues, and channels:
```bash
npm --workspace=@abrospot/database run generate
npm --workspace=@abrospot/database run seed
```

---

## 5. Automated Health Checks & Diagnostics

- **Frontend Discovery**: [http://localhost:3000](http://localhost:3000)
- **Express Backend Health**: [http://localhost:4000/api/health](http://localhost:4000/api/health)
- **AI Ingestion Health & Adapters**: [http://localhost:8000/health/adapters](http://localhost:8000/health/adapters)
- **Curator & Admin Hub**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 6. Backup & Recovery

- **PostgreSQL Database Backup**:
  ```bash
  docker compose exec postgres pg_dump -U postgres abrospot > backup_abrospot_$(date +%Y%m%d).sql
  ```
- **PostgreSQL Restore**:
  ```bash
  cat backup_abrospot_20261030.sql | docker compose exec -T postgres psql -U postgres -d abrospot
  ```
- **Flyer Media Volume Backup**:
  The `flyer_storage` Docker volume stores all downloaded flyer images. Back up this directory periodically to S3 or persistent network-attached storage.
