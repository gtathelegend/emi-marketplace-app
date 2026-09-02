import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
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

  // 1. AppError Hierarchy (Explicit Domain Errors)
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error(`AppError ${err.statusCode}: ${err.message}`, { requestId, errCode: err.code });
    } else {
      logger.warn(`AppError ${err.statusCode}: ${err.message}`, { requestId, errCode: err.code });
    }
    return sendError(res, err.statusCode, err.code, err.message, err.details);
  }

  // 2. Prisma Known Request Errors Mapping
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    logger.warn(`Prisma Known Error ${err.code}: ${err.message}`, { requestId, target: err.meta?.target });

    if (err.code === 'P2002') {
      const field = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'unique constraint';
      return sendError(res, 409, 'CONFLICT_ERROR', `A record with the specified ${field} already exists.`);
    }

    if (err.code === 'P2025') {
      return sendError(res, 404, 'NOT_FOUND_ERROR', 'The requested database record was not found.');
    }

    if (err.code === 'P2003') {
      return sendError(res, 400, 'INVALID_REFERENCE', 'Referenced entity does not exist or has active dependencies.');
    }
  }

  // 3. Log unhandled server errors with stack trace silently
  logger.error(`Unhandled Error: ${err.message}`, { requestId, stack: err.stack });

  const clientMessage =
    env.NODE_ENV === 'production'
      ? 'An unexpected internal server error occurred.'
      : err.message;

  return sendError(res, 500, 'INTERNAL_SERVER_ERROR', clientMessage);
};
