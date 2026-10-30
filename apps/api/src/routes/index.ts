import { Router } from 'express';
import { eventRouter } from './eventRoutes.js';
import { categoryRouter } from './categoryRoutes.js';
import { sourceRouter } from './sourceRoutes.js';
import { adminRouter } from './adminRoutes.js';

export const apiRouter = Router();

apiRouter.use('/events', eventRouter);
apiRouter.use('/categories', categoryRouter);
apiRouter.use('/sources', sourceRouter);
apiRouter.use('/admin', adminRouter);

apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'AbroSpot Core Express API',
    timestamp: new Date().toISOString(),
  });
});
