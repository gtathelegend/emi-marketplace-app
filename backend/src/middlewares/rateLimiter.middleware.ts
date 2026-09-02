import rateLimit from 'express-rate-limit';
import { sendError } from '../utils/apiResponse.js';

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    sendError(res, 429, 'RATE_LIMIT_EXCEEDED', 'Too many requests from this IP, please try again after 15 minutes.');
  },
});
