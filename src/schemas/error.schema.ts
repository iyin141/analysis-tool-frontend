import { z } from 'zod';

export const ErrorDetailSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.any()).nullable().optional(),
});

export const ErrorResponseSchema = z.object({
  error: ErrorDetailSchema,
});
