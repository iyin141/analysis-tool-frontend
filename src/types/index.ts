import { z } from 'zod';
import { DateRangeSchema, HealthResponseSchema } from '../schemas/common.schema';
import { ErrorDetailSchema, ErrorResponseSchema } from '../schemas/error.schema';
import { DeliveryDayItemSchema, DeliveryDaysResponseSchema } from '../schemas/deliveryDays.schema';
import {
  ForecastPointSchema,
  ForecastSummarySchema,
  UncertaintyBandMetaSchema,
  DecisionViewResponseSchema,
} from '../schemas/forecast.schema';
import {
  AccuracyMetricsSchema,
  DayAccuracyItemSchema,
  AccuracySummaryResponseSchema,
  HourAccuracyBucketSchema,
  AccuracyByHourResponseSchema,
  HistogramBinSchema,
  DistributionStatsSchema,
  DistributionResponseSchema,
  WindLevelBucketSchema,
  AccuracyByWindLevelResponseSchema,
} from '../schemas/accuracy.schema';
import { HorizonBucketSchema, HorizonAnalysisResponseSchema } from '../schemas/horizon.schema';

// Exported DTOs (inferred from Zod single source of truth)
export type DateRange = z.infer<typeof DateRangeSchema>;
export type HealthResponse = z.infer<typeof HealthResponseSchema>;
export type ErrorDetail = z.infer<typeof ErrorDetailSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

export type DeliveryDayItem = z.infer<typeof DeliveryDayItemSchema>;
export type DeliveryDaysResponse = z.infer<typeof DeliveryDaysResponseSchema>;

export type ForecastPoint = z.infer<typeof ForecastPointSchema>;
export type ForecastSummary = z.infer<typeof ForecastSummarySchema>;
export type UncertaintyBandMeta = z.infer<typeof UncertaintyBandMetaSchema>;
export type DecisionViewResponse = z.infer<typeof DecisionViewResponseSchema>;

export type AccuracyMetrics = z.infer<typeof AccuracyMetricsSchema>;
export type DayAccuracyItem = z.infer<typeof DayAccuracyItemSchema>;
export type AccuracySummaryResponse = z.infer<typeof AccuracySummaryResponseSchema>;
export type HourAccuracyBucket = z.infer<typeof HourAccuracyBucketSchema>;
export type AccuracyByHourResponse = z.infer<typeof AccuracyByHourResponseSchema>;
export type HistogramBin = z.infer<typeof HistogramBinSchema>;
export type DistributionStats = z.infer<typeof DistributionStatsSchema>;
export type DistributionResponse = z.infer<typeof DistributionResponseSchema>;
export type WindLevelBucket = z.infer<typeof WindLevelBucketSchema>;
export type AccuracyByWindLevelResponse = z.infer<typeof AccuracyByWindLevelResponseSchema>;

export type HorizonBucket = z.infer<typeof HorizonBucketSchema>;
export type HorizonAnalysisResponse = z.infer<typeof HorizonAnalysisResponseSchema>;

// UI-Only Types
export interface DecisionViewParams {
  deliveryDate: string;
  cutoffTime: string;
}

export interface AccuracyFilterParams {
  from: string;
  to: string;
  cutoffTime: string;
  overshootThresholdMw?: number;
}

export interface HorizonFilterParams {
  from: string;
  to: string;
  horizonBinHours?: number;
}
