"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventService = exports.EventService = void 0;
const database_1 = require("@abrospot/database");
const cacheService_js_1 = require("./cacheService.js");
class EventService {
    async getEvents(options) {
        const page = Math.max(options.page || 1, 1);
        const limit = Math.min(Math.max(options.limit || 12, 1), 50);
        const skip = (page - 1) * limit;
        const cacheKey = `events:list:${JSON.stringify(options)}`;
        const cached = await cacheService_js_1.cache.get(cacheKey);
        if (cached)
            return cached;
        const where = {
            status: database_1.EventStatus.PUBLISHED,
        };
        if (options.category) {
            where.category = { slug: options.category };
        }
        if (options.subCity) {
            where.location = { subCity: { equals: options.subCity, mode: 'insensitive' } };
        }
        if (options.isFeatured !== undefined) {
            where.isFeatured = options.isFeatured;
        }
        if (options.startDate || options.endDate) {
            where.occurrences = {
                some: {
                    startDate: {
                        ...(options.startDate ? { gte: new Date(options.startDate) } : {}),
                        ...(options.endDate ? { lte: new Date(options.endDate) } : {}),
                    },
                },
            };
        }
        if (options.search) {
            where.OR = [
                { title: { contains: options.search, mode: 'insensitive' } },
                { titleAmharic: { contains: options.search, mode: 'insensitive' } },
                { summary: { contains: options.search, mode: 'insensitive' } },
                { location: { venueName: { contains: options.search, mode: 'insensitive' } } },
                { location: { landmark: { contains: options.search, mode: 'insensitive' } } },
            ];
        }
        const [total, events] = await Promise.all([
            database_1.prisma.event.count({ where }),
            database_1.prisma.event.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    category: true,
                    location: true,
                    occurrences: {
                        orderBy: { startDate: 'asc' },
                    },
                    media: {
                        where: { isPrimaryFlyer: true },
                        take: 1,
                    },
                },
            }),
        ]);
        const result = {
            events,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
        await cacheService_js_1.cache.set(cacheKey, result, 120); // 2 minutes TTL
        return result;
    }
    async getUpcomingEvents(limit = 6) {
        const cacheKey = `events:upcoming:${limit}`;
        const cached = await cacheService_js_1.cache.get(cacheKey);
        if (cached)
            return cached;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const events = await database_1.prisma.event.findMany({
            where: {
                status: database_1.EventStatus.PUBLISHED,
                occurrences: {
                    some: {
                        startDate: { gte: today },
                    },
                },
            },
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                category: true,
                location: true,
                occurrences: {
                    where: { startDate: { gte: today } },
                    orderBy: { startDate: 'asc' },
                },
                media: {
                    where: { isPrimaryFlyer: true },
                    take: 1,
                },
            },
        });
        await cacheService_js_1.cache.set(cacheKey, events, 180);
        return events;
    }
    async getEventByIdOrSlug(idOrSlug) {
        const cacheKey = `events:detail:${idOrSlug}`;
        const cached = await cacheService_js_1.cache.get(cacheKey);
        if (cached)
            return cached;
        const event = await database_1.prisma.event.findFirst({
            where: {
                OR: [{ id: idOrSlug }, { slug: idOrSlug }],
            },
            include: {
                category: true,
                location: true,
                occurrences: {
                    orderBy: { startDate: 'asc' },
                },
                media: true,
                sourcePosts: {
                    select: {
                        id: true,
                        platform: true,
                        authorUsername: true,
                        postUrl: true,
                        publishedAt: true,
                        rawText: true,
                    },
                },
            },
        });
        if (event) {
            await cacheService_js_1.cache.set(cacheKey, event, 300);
        }
        return event;
    }
    async getEventSources(eventId) {
        return database_1.prisma.sourcePost.findMany({
            where: { canonicalEventId: eventId },
            include: {
                extractionResult: true,
                monitoredSource: true,
            },
        });
    }
}
exports.EventService = EventService;
exports.eventService = new EventService();
