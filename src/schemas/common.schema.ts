import { z } from 'zod';

export const DateRangeSchema = z.object({
  from: z.string(),
  to: z.string(),
});

export const HealthResponseSchema = z.object({
  status: z.string(),
  version: z.string(),
  dataLastUpdated: z.string().nullable().optional(),
});
