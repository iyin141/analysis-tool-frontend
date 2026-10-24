import { z } from 'zod';

export const DeliveryDayItemSchema = z.object({
  deliveryDate: z.string(),
  decisionCutoff: z.string(),
  hasForecast: z.boolean(),
  hasActuals: z.boolean(),
});

export const DeliveryDaysResponseSchema = z.object({
  timezone: z.string(),
  defaultCutoffLocalTime: z.string(),
  days: z.array(DeliveryDayItemSchema),
});
