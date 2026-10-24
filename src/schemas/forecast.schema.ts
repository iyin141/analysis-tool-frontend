import { z } from 'zod';

export const ForecastPointSchema = z.object({
  startTime: z.string(),
  settlementPeriod: z.number(),
  forecastMw: z.number().nullable(),
  forecastPublishTime: z.string().nullable(),
  horizonHours: z.number().nullable(),
  actualMw: z.number().nullable(),
  errorMw: z.number().nullable(),
  bandLowMw: z.number().nullable(),
  bandHighMw: z.number().nullable(),
});

export const ForecastSummarySchema = z.object({
  avgForecastMw: z.number().nullable(),
  peakForecastMw: z.number().nullable(),
  minForecastMw: z.number().nullable(),
  forecastTotalMwh: z.number().nullable(),
  actualTotalMwh: z.number().nullable(),
  missingForecastPeriods: z.number(),
  missingActualPeriods: z.number(),
  latestPublishTimeUsed: z.string().nullable(),
});

export const UncertaintyBandMetaSchema = z.object({
  lowerPercentile: z.number(),
  upperPercentile: z.number(),
  basedOnDays: z.number(),
  bandIsInSample: z.boolean(),
});

export const DecisionViewResponseSchema = z.object({
  deliveryDate: z.string(),
  decisionCutoff: z.string(),
  points: z.array(ForecastPointSchema),
  summary: ForecastSummarySchema,
  band: UncertaintyBandMetaSchema,
});
