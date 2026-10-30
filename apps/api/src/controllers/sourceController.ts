import { Request, Response, NextFunction } from 'express';
import { sourceService } from '../services/sourceService.js';
import { z } from 'zod';

export const createSourceSchema = z.object({
  body: z.object({
    platform: z.enum(['TELEGRAM', 'INSTAGRAM', 'X_TWITTER', 'TIKTOK', 'LINKEDIN', 'MANUAL']),
    identifier: z.string().min(2),
    displayName: z.string().min(2),
    description: z.string().optional(),
    sourceUrl: z.string().url().optional(),
    fetchFrequencyMinutes: z.number().int().min(5).max(1440).optional(),
  }),
});

export class SourceController {
  async getSources(req: Request, res: Response, next: NextFunction) {
    try {
      const sources = await sourceService.getSources();
      res.json(sources);
    } catch (e) {
      next(e);
    }
  }

  async createSource(req: Request, res: Response, next: NextFunction) {
    try {
      const source = await sourceService.createSource(req.body);
      res.status(201).json(source);
    } catch (e) {
      next(e);
    }
  }

  async updateSource(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const updated = await sourceService.updateSource(id, req.body);
      res.json(updated);
    } catch (e) {
      next(e);
    }
  }

  async deleteSource(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await sourceService.deleteSource(id);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }

  async triggerIngestion(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await sourceService.triggerIngestion(id);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
}

export const sourceController = new SourceController();
