import { Request, Response, NextFunction } from 'express';
import { reviewService } from '../services/reviewService.js';
import { aiClient } from '../services/aiClientService.js';
import { prisma } from '@abrospot/database';

export class AdminController {
  async getIngestionStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const [aiHealth, adaptersStatus, totalSources, totalPosts, recentJobs] = await Promise.all([
        aiClient.checkHealth(),
        aiClient.checkAdaptersStatus(),
        prisma.monitoredSource.count(),
        prisma.sourcePost.count(),
        prisma.ingestionJob.findMany({
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
    } catch (e) {
      next(e);
    }
  }

  async getReviewQueue(req: Request, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as any || 'PENDING';
      const queue = await reviewService.getQueue(status);
      res.json(queue);
    } catch (e) {
      next(e);
    }
  }

  async approveReview(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { notes } = req.body;
      const approved = await reviewService.approveItem(id, req.user?.id, notes);
      res.json(approved);
    } catch (e) {
      next(e);
    }
  }

  async rejectReview(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { notes } = req.body;
      const rejected = await reviewService.rejectItem(id, req.user?.id, notes);
      res.json(rejected);
    } catch (e) {
      next(e);
    }
  }

  async mergeDuplicate(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { targetEventId } = req.body;
      if (!targetEventId) {
        return res.status(400).json({ error: 'targetEventId is required for merging' });
      }
      const merged = await reviewService.mergeDuplicate(id, targetEventId, req.user?.id);
      res.json(merged);
    } catch (e) {
      next(e);
    }
  }
}

export const adminController = new AdminController();
