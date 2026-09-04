import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { requestLogger } from './middlewares/requestLogger.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { NotFoundError } from './errors/AppError.js';
import apiV1Router from './routes/index.js';

export const createApp = (): Express => {
  const app = express();

  // Security headers & CORS
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
    })
  );

  // Request body parsing, cookies & size limits
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cookieParser());

  // Correlation ID & Request logging
  app.use(requestLogger);

  // Health alias at root /api/health for convenience
  app.get('/api/health', (_req, res) => {
    res.redirect('/api/v1/health');
  });

  // API v1 namespace router
  app.use('/api/v1', apiV1Router);

  // Catch-all for undefined routes
  app.use('*', (req, _res, next) => {
    next(new NotFoundError(`Cannot ${req.method} ${req.originalUrl}`, 'ROUTE_NOT_FOUND'));
  });

  // Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
};
