import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { authenticate, requireRole } from '../middlewares/auth.js';

export const adminRouter = Router();

adminRouter.get(
  '/ingestion/status',
  authenticate,
  requireRole('ADMIN', 'CURATOR'),
  (req, res, next) => adminController.getIngestionStatus(req, res, next)
);

adminRouter.get(
  '/review-queue',
  authenticate,
  requireRole('ADMIN', 'CURATOR'),
  (req, res, next) => adminController.getReviewQueue(req, res, next)
);

adminRouter.post(
  '/review/:id/approve',
  authenticate,
  requireRole('ADMIN', 'CURATOR'),
  (req, res, next) => adminController.approveReview(req, res, next)
);

adminRouter.post(
  '/review/:id/reject',
  authenticate,
  requireRole('ADMIN', 'CURATOR'),
  (req, res, next) => adminController.rejectReview(req, res, next)
);

adminRouter.post(
  '/review/:id/merge',
  authenticate,
  requireRole('ADMIN', 'CURATOR'),
  (req, res, next) => adminController.mergeDuplicate(req, res, next)
);
