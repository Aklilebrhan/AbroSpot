import { Router } from 'express';
import { eventController } from '../controllers/eventController.js';

export const eventRouter = Router();

eventRouter.get('/', (req, res, next) => eventController.getEvents(req, res, next));
eventRouter.get('/upcoming', (req, res, next) => eventController.getUpcoming(req, res, next));
eventRouter.get('/:id', (req, res, next) => eventController.getEventById(req, res, next));
eventRouter.get('/:id/sources', (req, res, next) => eventController.getEventSources(req, res, next));
