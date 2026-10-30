# AbroSpot Architecture Specification

Refer to the primary architecture document at:
- Artifact: [phase1_system_architecture.md](file:///C:/Users/hp/.gemini/antigravity/brain/66abf844-975e-4e15-998f-a775e3ca283b/phase1_system_architecture.md)

## Summary of Architecture Decisions:
1. **Frontend**: Next.js 15 (App Router, Tailwind CSS, shadcn/ui, Lucide React).
2. **Main Backend**: Express.js with TypeScript, Prisma ORM, Redis caching.
3. **AI/Ingestion Service**: Python FastAPI, Telethon (Telegram MTProto), EasyOCR/Vision LLM, Ethiopian date/time normalizer.
4. **Database**: PostgreSQL 16 with full-text/trigram indexes.
5. **Message/Job Queue**: Redis 7.
