import { useQuery } from '@tanstack/react-query';
import { getHorizonAnalysis } from '../api';
import { HorizonFilterParams } from '../types';

export function useHorizonAnalysis(params: HorizonFilterParams) {
  return useQuery({
    queryKey: ['horizonAnalysis', params.from, params.to, params.horizonBinHours],
    queryFn: () => getHorizonAnalysis(params),
    enabled: Boolean(params.from && params.to),
    staleTime: 60 * 1000,
  });
}
