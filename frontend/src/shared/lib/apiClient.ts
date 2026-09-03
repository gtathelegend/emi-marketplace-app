export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  meta: {
    requestId?: string;
    timestamp: string;
    pagination?: PaginationMeta;
  };
}

export interface ApiErrorEnvelope {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta: {
    requestId?: string;
    timestamp: string;
  };
}

export class ApiError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly details?: unknown;

  constructor(message: string, code: string, status: number, details?: unknown) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

const getBaseUrl = (): string => {
  const url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
  return url.replace(/\/+$/, '');
};

export const apiClient = {
  async get<T>(endpoint: string, headers: Record<string, string> = {}): Promise<T> {
    const url = `${getBaseUrl()}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });

    const body = await response.json();

    if (!response.ok || !body.success) {
      const errBody = body as ApiErrorEnvelope;
      throw new ApiError(
        errBody.error?.message || 'API request failed',
        errBody.error?.code || 'UNKNOWN_ERROR',
        response.status,
        errBody.error?.details
      );
    }

    return (body as ApiEnvelope<T>).data;
  },

  async getEnvelope<T>(endpoint: string, headers: Record<string, string> = {}): Promise<ApiEnvelope<T>> {
    const url = `${getBaseUrl()}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });

    const body = await response.json();

    if (!response.ok || !body.success) {
      const errBody = body as ApiErrorEnvelope;
      throw new ApiError(
        errBody.error?.message || 'API request failed',
        errBody.error?.code || 'UNKNOWN_ERROR',
        response.status,
        errBody.error?.details
      );
    }

    return body as ApiEnvelope<T>;
  },

  async post<T>(endpoint: string, payload?: unknown, headers: Record<string, string> = {}): Promise<T> {
    const url = `${getBaseUrl()}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: payload ? JSON.stringify(payload) : undefined,
    });

    const body = await response.json();

    if (!response.ok || !body.success) {
      const errBody = body as ApiErrorEnvelope;
      throw new ApiError(
        errBody.error?.message || 'API request failed',
        errBody.error?.code || 'UNKNOWN_ERROR',
        response.status,
        errBody.error?.details
      );
    }

    return (body as ApiEnvelope<T>).data;
  },

  async patch<T>(endpoint: string, payload?: unknown, headers: Record<string, string> = {}): Promise<T> {
    const url = `${getBaseUrl()}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: payload ? JSON.stringify(payload) : undefined,
    });

    const body = await response.json();

    if (!response.ok || !body.success) {
      const errBody = body as ApiErrorEnvelope;
      throw new ApiError(
        errBody.error?.message || 'API request failed',
        errBody.error?.code || 'UNKNOWN_ERROR',
        response.status,
        errBody.error?.details
      );
    }

    return (body as ApiEnvelope<T>).data;
  },
};
