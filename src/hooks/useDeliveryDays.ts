import { useQuery } from '@tanstack/react-query';
import { getDeliveryDays } from '../api';

export function useDeliveryDays() {
  return useQuery({
    queryKey: ['deliveryDays'],
    queryFn: getDeliveryDays,
    staleTime: 5 * 60 * 1000,
  });
}
