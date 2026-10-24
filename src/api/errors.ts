import { ZodError } from 'zod';

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends ApiError {
  constructor(message: string = 'Network connectivity error. Please check your connection.') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class HttpError extends ApiError {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: Record<string, unknown>;

  constructor(status: number, code: string, message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class ValidationError extends ApiError {
  public readonly zodError: ZodError;

  constructor(zodError: ZodError, message: string = 'Response failed schema validation.') {
    super(message);
    this.name = 'ValidationError';
    this.zodError = zodError;
  }
}
