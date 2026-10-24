import { http, parseOrThrow } from './client';
import { HealthResponseSchema } from '../schemas/common.schema';
import { HealthResponse } from '../types';

export async function getHealth(): Promise<HealthResponse> {
  const res = await http.get('/health');
  return parseOrThrow(HealthResponseSchema, res.data);
}
