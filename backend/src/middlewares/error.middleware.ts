import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';
import { sendError } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): Response => {
  const requestId = res.getHeader('x-request-id') as string | undefined;

  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error(`AppError ${err.statusCode}: ${err.message}`, { requestId, errCode: err.code });
    } else {
      logger.warn(`AppError ${err.statusCode}: ${err.message}`, { requestId, errCode: err.code });
    }
    return sendError(res, err.statusCode, err.code, err.message, err.details);
  }

  // Log unhandled server errors with stack trace
  logger.error(`Unhandled Error: ${err.message}`, { requestId, stack: err.stack });

  const clientMessage =
    env.NODE_ENV === 'production'
      ? 'An unexpected internal server error occurred.'
      : err.message;

  return sendError(res, 500, 'INTERNAL_SERVER_ERROR', clientMessage);
};
