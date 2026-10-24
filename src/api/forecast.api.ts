import { http, parseOrThrow } from './client';
import { DecisionViewResponseSchema } from '../schemas/forecast.schema';
import { DecisionViewParams, DecisionViewResponse } from '../types';

export async function getDecisionView(params: DecisionViewParams): Promise<DecisionViewResponse> {
  const res = await http.get('/forecast/decision-view', {
    params: {
      deliveryDate: params.deliveryDate,
      cutoffTime: params.cutoffTime,
    },
  });
  return parseOrThrow(DecisionViewResponseSchema, res.data);
}
