import { z } from 'zod';
import { DateRangeSchema } from './common.schema';

export const OvershootMetricSchema = z.object({
  thresholdMw: z.number(),
  probability: z.number(),
});

export const AccuracyMetricsSchema = z.object({
  biasMw: z.number(),
  maeMw: z.number(),
  rmseMw: z.number(),
  nmaePct: z.number(),
  mapePct: z.number(),
  errorP10Mw: z.number(),
  errorP50Mw: z.number(),
  errorP90Mw: z.number(),
  overshoot: OvershootMetricSchema,
});

export const DayAccuracyItemSchema = z.object({
  date: z.string(),
  n: z.number(),
  biasMw: z.number(),
  maeMw: z.number(),
  rmseMw: z.number(),
});

export const AccuracySummaryResponseSchema = z.object({
  dateRange: DateRangeSchema,
  cutoffTime: z.string(),
  sampleSize: z.number(),
  meanActualMw: z.number(),
  metrics: AccuracyMetricsSchema,
  byDay: z.array(DayAccuracyItemSchema),
});

export const HourAccuracyBucketSchema = z.object({
  hourOfDay: z.number(),
  n: z.number(),
  biasMw: z.number(),
  maeMw: z.number(),
  rmseMw: z.number(),
});

export const AccuracyByHourResponseSchema = z.object({
  buckets: z.array(HourAccuracyBucketSchema),
});

export const HistogramBinSchema = z.object({
  binStartMw: z.number(),
  binEndMw: z.number(),
  count: z.number(),
});

export const DistributionStatsSchema = z.object({
  meanMw: z.number(),
  stdMw: z.number(),
  skew: z.number(),
});

export const DistributionResponseSchema = z.object({
  binWidthMw: z.number(),
  bins: z.array(HistogramBinSchema),
  stats: DistributionStatsSchema,
});

export const WindLevelBucketSchema = z.object({
  label: z.string(),
  lowerMw: z.number(),
  upperMw: z.number(),
  n: z.number(),
  biasMw: z.number(),
  maeMw: z.number(),
  rmseMw: z.number(),
});

export const AccuracyByWindLevelResponseSchema = z.object({
  buckets: z.array(WindLevelBucketSchema),
});
