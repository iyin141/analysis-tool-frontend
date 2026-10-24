import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import { env } from '../config/env';
import { HttpError, NetworkError, ValidationError } from './errors';
import { ErrorResponseSchema } from '../schemas/error.schema';

export const http = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (!error.response) {
      throw new NetworkError(error.message || 'Network connectivity error.');
    }

    const status = error.response.status;
    const data = error.response.data;

    // Check if response matches standard error schema
    const parsedErr = ErrorResponseSchema.safeParse(data);
    if (parsedErr.success) {
      throw new HttpError(
        status,
        parsedErr.data.error.code,
        parsedErr.data.error.message,
        parsedErr.data.error.details ?? undefined
      );
    }

    throw new HttpError(
      status,
      'HTTP_ERROR',
      `Request failed with status ${status}: ${error.message}`
    );
  }
);

export function parseOrThrow<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error('Schema validation failed:', result.error.format());
    throw new ValidationError(result.error);
  }
  return result.data;
}
