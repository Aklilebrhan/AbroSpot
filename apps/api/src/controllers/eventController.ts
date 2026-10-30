import { Request, Response, NextFunction } from 'express';
import { eventService } from '../services/eventService.js';

export class EventController {
  async getEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, category, subCity, isFeatured, startDate, endDate, search } = req.query;
      const data = await eventService.getEvents({
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        category: category as string,
        subCity: subCity as string,
        isFeatured: isFeatured !== undefined ? isFeatured === 'true' : undefined,
        startDate: startDate as string,
        endDate: endDate as string,
        search: search as string,
      });
      res.json(data);
    } catch (e) {
      next(e);
    }
  }

  async getUpcoming(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 6;
      const data = await eventService.getUpcomingEvents(limit);
      res.json(data);
    } catch (e) {
      next(e);
    }
  }

  async getEventById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const event = await eventService.getEventByIdOrSlug(id);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      res.json(event);
    } catch (e) {
      next(e);
    }
  }

  async getEventSources(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const sources = await eventService.getEventSources(id);
      res.json(sources);
    } catch (e) {
      next(e);
    }
  }
}

export const eventController = new EventController();
