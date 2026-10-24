import { useQuery } from '@tanstack/react-query';
import { getDecisionView } from '../api';
import { DecisionViewParams } from '../types';

export function useDecisionView(params: DecisionViewParams) {
  return useQuery({
    queryKey: ['decisionView', params.deliveryDate, params.cutoffTime],
    queryFn: () => getDecisionView(params),
    enabled: Boolean(params.deliveryDate && params.cutoffTime),
    staleTime: 60 * 1000,
  });
}
