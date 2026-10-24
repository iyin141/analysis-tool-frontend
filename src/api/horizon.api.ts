import { http, parseOrThrow } from './client';
import { HorizonAnalysisResponseSchema } from '../schemas/horizon.schema';
import { HorizonFilterParams, HorizonAnalysisResponse } from '../types';

export async function getHorizonAnalysis(params: HorizonFilterParams): Promise<HorizonAnalysisResponse> {
  const res = await http.get('/horizon/analysis', {
    params: {
      from: params.from,
      to: params.to,
      horizonBinHours: params.horizonBinHours ?? 3.0,
    },
  });
  return parseOrThrow(HorizonAnalysisResponseSchema, res.data);
}
