import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { apiRouter } from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const app = express();

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Main API Router
app.use('/api', apiRouter);

// Root
app.get('/', (req, res) => {
  res.json({
    app: 'AbroSpot REST API Backend',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

// Centralized error handling
app.use(errorHandler);
