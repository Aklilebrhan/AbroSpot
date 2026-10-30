import { prisma, ReviewStatus, EventStatus } from '@abrospot/database';
import { cache } from './cacheService.js';

export class ReviewService {
  async getQueue(status: ReviewStatus = ReviewStatus.PENDING) {
    return prisma.reviewQueueItem.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
      include: {
        sourcePost: {
          include: {
            extractionResult: true,
            monitoredSource: true,
          },
        },
        event: {
          include: {
            occurrences: true,
            location: true,
            category: true,
          },
        },
      },
    });
  }

  async approveItem(id: string, userId?: string, notes?: string) {
    const item = await prisma.reviewQueueItem.findUnique({
      where: { id },
      include: { event: true },
    });
    if (!item) throw new Error('Review item not found');

    const updated = await prisma.reviewQueueItem.update({
      where: { id },
      data: {
        status: ReviewStatus.APPROVED,
        assignedToUserId: userId,
        reviewedAt: new Date(),
        notes,
      },
    });

    if (item.eventId) {
      await prisma.event.update({
        where: { id: item.eventId },
        data: {
          status: EventStatus.PUBLISHED,
          requiresReview: false,
          isVerified: true,
        },
      });
      await cache.del('events:*');
    }

    return updated;
  }

  async rejectItem(id: string, userId?: string, notes?: string) {
    const item = await prisma.reviewQueueItem.findUnique({
      where: { id },
      include: { event: true },
    });
    if (!item) throw new Error('Review item not found');

    const updated = await prisma.reviewQueueItem.update({
      where: { id },
      data: {
        status: ReviewStatus.REJECTED,
        assignedToUserId: userId,
        reviewedAt: new Date(),
        notes,
      },
    });

    if (item.eventId) {
      await prisma.event.update({
        where: { id: item.eventId },
        data: {
          status: EventStatus.REJECTED,
        },
      });
      await cache.del('events:*');
    }

    return updated;
  }

  async mergeDuplicate(id: string, targetEventId: string, userId?: string) {
    const item = await prisma.reviewQueueItem.findUnique({
      where: { id },
      include: { sourcePost: true },
    });
    if (!item) throw new Error('Review item not found');

    // Link source post to target canonical event
    await prisma.sourcePost.update({
      where: { id: item.sourcePostId },
      data: {
        canonicalEventId: targetEventId,
      },
    });

    // Delete redundant draft event if it was created
    if (item.eventId && item.eventId !== targetEventId) {
      await prisma.event.delete({ where: { id: item.eventId } }).catch(() => {});
    }

    const updated = await prisma.reviewQueueItem.update({
      where: { id },
      data: {
        status: ReviewStatus.RESOLVED_MERGED,
        eventId: targetEventId,
        assignedToUserId: userId,
        reviewedAt: new Date(),
        notes: `Merged into canonical event ${targetEventId}`,
      },
    });

    await cache.del('events:*');
    return updated;
  }
}

export const reviewService = new ReviewService();
