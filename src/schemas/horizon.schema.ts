import { z } from 'zod';

export const HorizonBucketSchema = z.object({
  horizonMinHours: z.number(),
  horizonMaxHours: z.number(),
  n: z.number(),
  biasMw: z.number(),
  maeMw: z.number(),
  rmseMw: z.number(),
});

export const HorizonAnalysisResponseSchema = z.object({
  horizonBinHours: z.number(),
  buckets: z.array(HorizonBucketSchema),
});
