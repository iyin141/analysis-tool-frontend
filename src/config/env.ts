import { z } from 'zod';

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().default('/api/v1'),
  VITE_DEFAULT_FROM_DATE: z.string().default('2026-01-01'),
  VITE_DEFAULT_TO_DATE: z.string().default('2026-01-31'),
  VITE_DEFAULT_CUTOFF_TIME: z.string().default('09:00'),
  VITE_DEFAULT_DELIVERY_DATE: z.string().default('2026-01-15'),
  VITE_TIMEZONE: z.string().default('Europe/London'),
  VITE_APP_NAME: z.string().default('GB Wind Forecast Decision Support'),
});

const parsedEnv = envSchema.safeParse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  VITE_DEFAULT_FROM_DATE: import.meta.env.VITE_DEFAULT_FROM_DATE || '2026-01-01',
  VITE_DEFAULT_TO_DATE: import.meta.env.VITE_DEFAULT_TO_DATE || '2026-01-31',
  VITE_DEFAULT_CUTOFF_TIME: import.meta.env.VITE_DEFAULT_CUTOFF_TIME || '09:00',
  VITE_DEFAULT_DELIVERY_DATE: import.meta.env.VITE_DEFAULT_DELIVERY_DATE || '2026-01-15',
  VITE_TIMEZONE: import.meta.env.VITE_TIMEZONE || 'Europe/London',
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME || 'GB Wind Forecast Decision Support',
});

if (!parsedEnv.success) {
  console.error('Invalid environment variables:', parsedEnv.error.format());
  throw new Error('Invalid environment configuration');
}

export const env = parsedEnv.data;

