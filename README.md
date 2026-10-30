# AbroSpot (አብሮስፖት)
### AI-Powered Ethiopian Social Event Discovery & Intelligence Platform

AbroSpot is a production-grade, AI-driven event discovery platform engineered specifically for Ethiopia, primarily focused on Addis Ababa. It solves the fragmentation of informal event announcements scattered across **Telegram**, **Instagram**, **X (Twitter)**, **TikTok**, and **LinkedIn** by ingesting bilingual flyers, normalizing Ge'ez (Ethiopian) and Gregorian calendars, resolving local landmark venues, and deduplicating cross-channel posts into a unified canonical event database.

---

## 🏛️ System Architecture

```
                                      +--------------------------+
                                      |   Next.js 14 Frontend    |
                                      | (Faceted Search & Admin) |
                                      +------------+-------------+
                                                   | HTTP (REST)
                                                   v
+--------------------------+          +--------------------------+
|  Python FastAPI Engine   |<-------->|   Express.js API Backend |
| (OCR, NLP & Date Normal) |  Internal| (Auth, Caching & Events) |
+------------+-------------+          +------------+-------------+
             |                                     |
             v                                     v
+--------------------------+          +--------------------------+
|    Redis 7 Queue/Cache   |          | PostgreSQL 16 + Prisma   |
| (Stream & In-memory Fall)|          | (Canonical Event Schema) |
+--------------------------+          +--------------------------+
```

---

## 🇪🇹 Key Ethiopian Domain Capabilities

1. **Dual Calendar Engine (Ge'ez & Gregorian)**:
   - Converts dates between the 13-month Ethiopian calendar (Meskerem - Pagume) and Gregorian dates deterministically.
   - Preserves original expressions (e.g. `ጥቅምት 27 ቀን 2018 ዓ.ም`).
2. **Solar 12-Hour Time Normalizer**:
   - Parses local time cycles starting from dawn 12:00 (ጠዋት, ከሰዓት, ከምሽቱ) into standard 24-hr UTC+3 (`Africa/Addis_Ababa`).
3. **Hierarchical Addis Ababa Geography**:
   - Matches 11 sub-cities (Bole, Kirkos, Yeka, Arada, Lideta, etc.) and 50+ local landmarks (Edna Mall, Meskel Square, Kazanchis, Piassa, etc.).
4. **Bilingual Multimodal OCR & NLP**:
   - Extracts structured details from mixed Amharic (አማርኛ) and English flyers.
5. **Cross-Platform Deduplication**:
   - Fuzzy token set ratio matching on title + date match + venue clustering to link cross-shares to single canonical events.

---

## 🚀 Quick Start (Development)

### 1. Install Node Dependencies
```bash
npm install
npm --workspace=@abrospot/database run generate
npm --workspace=@abrospot/database run build
npm --workspace=@abrospot/api run build
npm --workspace=@abrospot/web run build
```

### 2. Python AI & Ingestion Engine Setup
```bash
cd services/ai-ingestion
python -m venv .venv
.\.venv\Scripts\activate     # Windows: .\.venv\Scripts\activate / Linux: source .venv/bin/activate
pip install -r requirements.txt ethiocalendar
```

### 3. Run Test Suites
```bash
# Python AI & Ingestion Tests (22 tests covering date conversion & extraction)
cd services/ai-ingestion
$env:PYTHONPATH="."
.\.venv\Scripts\python.exe -m pytest -v

# Express Backend Tests
cd apps/api
npm test
```

### 4. Run Services Locally
```bash
# Terminal 1: Python AI Service
cd services/ai-ingestion
python -m uvicorn app.main:app --port 8000 --reload

# Terminal 2: Express Backend
cd apps/api
npm run dev

# Terminal 3: Next.js Frontend
cd apps/web
npm run dev
```

Visit:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Curator & Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Express REST API**: [http://localhost:4000/api/health](http://localhost:4000/api/health)
- **FastAPI AI Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🐳 Production Deployment with Docker Compose

```bash
docker compose up -d --build
```
All 5 containers (PostgreSQL, Redis, Python AI Ingestion, Express API, Next.js Web) will build and start with persistent volumes and automated health checks.
