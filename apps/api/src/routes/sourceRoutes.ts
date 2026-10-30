import { Router } from 'express';
import { sourceController, createSourceSchema } from '../controllers/sourceController.js';
import { validate } from '../middlewares/validate.js';
import { authenticate, requireRole } from '../middlewares/auth.js';

export const sourceRouter = Router();

sourceRouter.get('/', (req, res, next) => sourceController.getSources(req, res, next));
sourceRouter.post(
  '/',
  authenticate,
  requireRole('ADMIN', 'CURATOR'),
  validate(createSourceSchema),
  (req, res, next) => sourceController.createSource(req, res, next)
);
sourceRouter.patch(
  '/:id',
  authenticate,
  requireRole('ADMIN', 'CURATOR'),
  (req, res, next) => sourceController.updateSource(req, res, next)
);
sourceRouter.delete(
  '/:id',
  authenticate,
  requireRole('ADMIN'),
  (req, res, next) => sourceController.deleteSource(req, res, next)
);
sourceRouter.post(
  '/:id/trigger',
  authenticate,
  requireRole('ADMIN', 'CURATOR'),
  (req, res, next) => sourceController.triggerIngestion(req, res, next)
);
