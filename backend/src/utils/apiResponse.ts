import { Response } from 'express';

export interface ApiResponseMeta {
  requestId?: string;
  timestamp: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta: ApiResponseMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta: ApiResponseMeta;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode = 200,
  pagination?: ApiResponseMeta['pagination']
): Response => {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
    meta: {
      requestId: res.getHeader('x-request-id') as string | undefined,
      timestamp: new Date().toISOString(),
      ...(pagination && { pagination }),
    },
  };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: unknown
): Response => {
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined && { details }),
    },
    meta: {
      requestId: res.getHeader('x-request-id') as string | undefined,
      timestamp: new Date().toISOString(),
    },
  };
  return res.status(statusCode).json(response);
};
