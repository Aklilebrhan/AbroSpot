import { Request, Response, NextFunction } from 'express';
import { prisma } from '@abrospot/database';
import { cache } from '../services/cacheService.js';

export class CategoryController {
  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const cacheKey = 'categories:all';
      const cached = await cache.get(cacheKey);
      if (cached) return res.json(cached);

      const categories = await prisma.eventCategory.findMany({
        orderBy: { displayOrder: 'asc' },
        include: {
          _count: {
            select: { events: true },
          },
        },
      });

      await cache.set(cacheKey, categories, 600); // 10 mins
      res.json(categories);
    } catch (e) {
      next(e);
    }
  }

  async getCategoryBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
      const category = await prisma.eventCategory.findUnique({
        where: { slug },
        include: {
          events: {
            where: { status: 'PUBLISHED' },
            take: 12,
            include: {
              location: true,
              occurrences: true,
              media: { where: { isPrimaryFlyer: true } },
            },
          },
        },
      });
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json(category);
    } catch (e) {
      next(e);
    }
  }
}

export const categoryController = new CategoryController();
