"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewService = exports.ReviewService = void 0;
const database_1 = require("@abrospot/database");
const cacheService_js_1 = require("./cacheService.js");
class ReviewService {
    async getQueue(status = database_1.ReviewStatus.PENDING) {
        return database_1.prisma.reviewQueueItem.findMany({
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
    async approveItem(id, userId, notes) {
        const item = await database_1.prisma.reviewQueueItem.findUnique({
            where: { id },
            include: { event: true },
        });
        if (!item)
            throw new Error('Review item not found');
        const updated = await database_1.prisma.reviewQueueItem.update({
            where: { id },
            data: {
                status: database_1.ReviewStatus.APPROVED,
                assignedToUserId: userId,
                reviewedAt: new Date(),
                notes,
            },
        });
        if (item.eventId) {
            await database_1.prisma.event.update({
                where: { id: item.eventId },
                data: {
                    status: database_1.EventStatus.PUBLISHED,
                    requiresReview: false,
                    isVerified: true,
                },
            });
            await cacheService_js_1.cache.del('events:*');
        }
        return updated;
    }
    async rejectItem(id, userId, notes) {
        const item = await database_1.prisma.reviewQueueItem.findUnique({
            where: { id },
            include: { event: true },
        });
        if (!item)
            throw new Error('Review item not found');
        const updated = await database_1.prisma.reviewQueueItem.update({
            where: { id },
            data: {
                status: database_1.ReviewStatus.REJECTED,
                assignedToUserId: userId,
                reviewedAt: new Date(),
                notes,
            },
        });
        if (item.eventId) {
            await database_1.prisma.event.update({
                where: { id: item.eventId },
                data: {
                    status: database_1.EventStatus.REJECTED,
                },
            });
            await cacheService_js_1.cache.del('events:*');
        }
        return updated;
    }
    async mergeDuplicate(id, targetEventId, userId) {
        const item = await database_1.prisma.reviewQueueItem.findUnique({
            where: { id },
            include: { sourcePost: true },
        });
        if (!item)
            throw new Error('Review item not found');
        // Link source post to target canonical event
        await database_1.prisma.sourcePost.update({
            where: { id: item.sourcePostId },
            data: {
                canonicalEventId: targetEventId,
            },
        });
        // Delete redundant draft event if it was created
        if (item.eventId && item.eventId !== targetEventId) {
            await database_1.prisma.event.delete({ where: { id: item.eventId } }).catch(() => { });
        }
        const updated = await database_1.prisma.reviewQueueItem.update({
            where: { id },
            data: {
                status: database_1.ReviewStatus.RESOLVED_MERGED,
                eventId: targetEventId,
                assignedToUserId: userId,
                reviewedAt: new Date(),
                notes: `Merged into canonical event ${targetEventId}`,
            },
        });
        await cacheService_js_1.cache.del('events:*');
        return updated;
    }
}
exports.ReviewService = ReviewService;
exports.reviewService = new ReviewService();
