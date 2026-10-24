import { env } from './env';

export const APP_CONFIG = {
  appName: env.VITE_APP_NAME,
  defaultCutoffTime: env.VITE_DEFAULT_CUTOFF_TIME,
  defaultDeliveryDate: env.VITE_DEFAULT_DELIVERY_DATE,
  defaultFromDate: env.VITE_DEFAULT_FROM_DATE,
  defaultToDate: env.VITE_DEFAULT_TO_DATE,
  gateClosureNotice:
    'GB Day-Ahead Auction gate closure is 09:20 / 11:00 UK local time depending on exchange (EPEX SPOT / Nord Pool). 09:00 UK is the standard decision cutoff.',
  timezone: env.VITE_TIMEZONE,
  overshootDefaultThresholdMw: 1000,
} as const;

