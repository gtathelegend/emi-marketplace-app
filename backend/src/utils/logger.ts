import winston from 'winston';
import { env } from '../config/env.js';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  env.NODE_ENV === 'development'
    ? winston.format.colorize()
    : winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} ${level}: ${message}${metaStr}`;
  })
);

const winstonLogger = winston.createLogger({
  level: env.NODE_ENV === 'test' ? 'error' : 'info',
  format: logFormat,
  transports: [new winston.transports.Console()],
});

export const logger = {
  info: (message: string, meta?: Record<string, unknown>): void => {
    winstonLogger.info(message, meta);
  },
  warn: (message: string, meta?: Record<string, unknown>): void => {
    winstonLogger.warn(message, meta);
  },
  error: (message: string, meta?: Record<string, unknown>): void => {
    winstonLogger.error(message, meta);
  },
  debug: (message: string, meta?: Record<string, unknown>): void => {
    winstonLogger.debug(message, meta);
  },
};
