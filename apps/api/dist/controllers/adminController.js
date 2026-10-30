"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = exports.AdminController = void 0;
const reviewService_js_1 = require("../services/reviewService.js");
const aiClientService_js_1 = require("../services/aiClientService.js");
const database_1 = require("@abrospot/database");
class AdminController {
    async getIngestionStatus(req, res, next) {
        try {
            const [aiHealth, adaptersStatus, totalSources, totalPosts, recentJobs] = await Promise.all([
                aiClientService_js_1.aiClient.checkHealth(),
                aiClientService_js_1.aiClient.checkAdaptersStatus(),
                database_1.prisma.monitoredSource.count(),
                database_1.prisma.sourcePost.count(),
                database_1.prisma.ingestionJob.findMany({
                    take: 10,
                    orderBy: { startedAt: 'desc' },
                    include: { monitoredSource: true },
                }),
            ]);
            res.json({
                aiEngine: aiHealth,
                adapters: adaptersStatus,
                stats: {
                    totalSources,
                    totalPosts,
                },
                recentJobs,
            });
        }
        catch (e) {
            next(e);
        }
    }
    async getReviewQueue(req, res, next) {
        try {
            const status = req.query.status || 'PENDING';
            const queue = await reviewService_js_1.reviewService.getQueue(status);
            res.json(queue);
        }
        catch (e) {
            next(e);
        }
    }
    async approveReview(req, res, next) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const { notes } = req.body;
            const approved = await reviewService_js_1.reviewService.approveItem(id, req.user?.id, notes);
            res.json(approved);
        }
        catch (e) {
            next(e);
        }
    }
    async rejectReview(req, res, next) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const { notes } = req.body;
            const rejected = await reviewService_js_1.reviewService.rejectItem(id, req.user?.id, notes);
            res.json(rejected);
        }
        catch (e) {
            next(e);
        }
    }
    async mergeDuplicate(req, res, next) {
        try {
            const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const { targetEventId } = req.body;
            if (!targetEventId) {
                return res.status(400).json({ error: 'targetEventId is required for merging' });
            }
            const merged = await reviewService_js_1.reviewService.mergeDuplicate(id, targetEventId, req.user?.id);
            res.json(merged);
        }
        catch (e) {
            next(e);
        }
    }
}
exports.AdminController = AdminController;
exports.adminController = new AdminController();
