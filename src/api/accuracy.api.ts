import { http, parseOrThrow } from './client';
import {
  AccuracySummaryResponseSchema,
  AccuracyByHourResponseSchema,
  DistributionResponseSchema,
  AccuracyByWindLevelResponseSchema,
} from '../schemas/accuracy.schema';
import {
  AccuracyFilterParams,
  AccuracySummaryResponse,
  AccuracyByHourResponse,
  DistributionResponse,
  AccuracyByWindLevelResponse,
} from '../types';

export async function getAccuracySummary(params: AccuracyFilterParams): Promise<AccuracySummaryResponse> {
  const res = await http.get('/accuracy/summary', {
    params: {
      from: params.from,
      to: params.to,
      cutoffTime: params.cutoffTime,
      overshootThresholdMw: params.overshootThresholdMw ?? 1000,
    },
  });
  return parseOrThrow(AccuracySummaryResponseSchema, res.data);
}

export async function getAccuracyByHour(params: AccuracyFilterParams): Promise<AccuracyByHourResponse> {
  const res = await http.get('/accuracy/by-hour', {
    params: {
      from: params.from,
      to: params.to,
      cutoffTime: params.cutoffTime,
    },
  });
  return parseOrThrow(AccuracyByHourResponseSchema, res.data);
}

export async function getAccuracyDistribution(
  params: AccuracyFilterParams & { binWidthMw?: number }
): Promise<DistributionResponse> {
  const res = await http.get('/accuracy/distribution', {
    params: {
      from: params.from,
      to: params.to,
      cutoffTime: params.cutoffTime,
      binWidthMw: params.binWidthMw ?? 250,
    },
  });
  return parseOrThrow(DistributionResponseSchema, res.data);
}

export async function getAccuracyByWindLevel(params: AccuracyFilterParams): Promise<AccuracyByWindLevelResponse> {
  const res = await http.get('/accuracy/by-wind-level', {
    params: {
      from: params.from,
      to: params.to,
      cutoffTime: params.cutoffTime,
    },
  });
  return parseOrThrow(AccuracyByWindLevelResponseSchema, res.data);
}
