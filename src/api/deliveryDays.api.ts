import { http, parseOrThrow } from './client';
import { DeliveryDaysResponseSchema } from '../schemas/deliveryDays.schema';
import { DeliveryDaysResponse } from '../types';

export async function getDeliveryDays(): Promise<DeliveryDaysResponse> {
  const res = await http.get('/delivery-days');
  return parseOrThrow(DeliveryDaysResponseSchema, res.data);
}
