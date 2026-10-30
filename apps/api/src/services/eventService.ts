import { prisma, EventStatus } from '@abrospot/database';
import { cache } from './cacheService.js';

export interface EventFilterOptions {
  page?: number;
  limit?: number;
  category?: string;
  subCity?: string;
  isFeatured?: boolean;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export class EventService {
  async getEvents(options: EventFilterOptions) {
    const page = Math.max(options.page || 1, 1);
    const limit = Math.min(Math.max(options.limit || 12, 1), 50);
    const skip = (page - 1) * limit;

    const cacheKey = `events:list:${JSON.stringify(options)}`;
    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    const where: any = {
      status: EventStatus.PUBLISHED,
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
      prisma.event.count({ where }),
      prisma.event.findMany({
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

    await cache.set(cacheKey, result, 120); // 2 minutes TTL
    return result;
  }

  async getUpcomingEvents(limit: number = 6) {
    const cacheKey = `events:upcoming:${limit}`;
    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = await prisma.event.findMany({
      where: {
        status: EventStatus.PUBLISHED,
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

    await cache.set(cacheKey, events, 180);
    return events;
  }

  async getEventByIdOrSlug(idOrSlug: string) {
    const cacheKey = `events:detail:${idOrSlug}`;
    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    const event = await prisma.event.findFirst({
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
      await cache.set(cacheKey, event, 300);
    }
    return event;
  }

  async getEventSources(eventId: string) {
    return prisma.sourcePost.findMany({
      where: { canonicalEventId: eventId },
      include: {
        extractionResult: true,
        monitoredSource: true,
      },
    });
  }
}

export const eventService = new EventService();
