import { useQuery } from '@tanstack/react-query';
import {
  getAccuracySummary,
  getAccuracyByHour,
  getAccuracyDistribution,
  getAccuracyByWindLevel,
} from '../api';
import { AccuracyFilterParams } from '../types';

export function useAccuracySummary(params: AccuracyFilterParams) {
  return useQuery({
    queryKey: ['accuracySummary', params.from, params.to, params.cutoffTime, params.overshootThresholdMw],
    queryFn: () => getAccuracySummary(params),
    enabled: Boolean(params.from && params.to),
    staleTime: 60 * 1000,
  });
}

export function useAccuracyByHour(params: AccuracyFilterParams) {
  return useQuery({
    queryKey: ['accuracyByHour', params.from, params.to, params.cutoffTime],
    queryFn: () => getAccuracyByHour(params),
    enabled: Boolean(params.from && params.to),
    staleTime: 60 * 1000,
  });
}

export function useAccuracyDistribution(params: AccuracyFilterParams & { binWidthMw?: number }) {
  return useQuery({
    queryKey: ['accuracyDistribution', params.from, params.to, params.cutoffTime, params.binWidthMw],
    queryFn: () => getAccuracyDistribution(params),
    enabled: Boolean(params.from && params.to),
    staleTime: 60 * 1000,
  });
}

export function useAccuracyByWindLevel(params: AccuracyFilterParams) {
  return useQuery({
    queryKey: ['accuracyByWindLevel', params.from, params.to, params.cutoffTime],
    queryFn: () => getAccuracyByWindLevel(params),
    enabled: Boolean(params.from && params.to),
    staleTime: 60 * 1000,
  });
}
