import { Request, Response, NextFunction } from 'express';
import { healthService } from '../services/health.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getHealth = (_req: Request, res: Response, next: NextFunction): void => {
  try {
    const status = healthService.getHealth();
    sendSuccess(res, status);
  } catch (error) {
    next(error);
  }
};
