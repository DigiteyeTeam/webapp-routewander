import { formatPrice } from './marketplaceRoutes';

export type LicensePeriod = 'weekly' | 'monthly' | 'yearly';

export interface RouteLicensePricing {
  weekly: number;
  monthly: number;
  yearly: number;
}

export const LICENSE_PERIOD_LABEL: Record<LicensePeriod, string> = {
  weekly: 'สัปดาห์',
  monthly: 'เดือน',
  yearly: 'ปี',
};

/** ราคาไลเซนส์รายสัปดาห์ / รายเดือน / รายปี จากราคาฐานรายปี */
export function getRouteLicensePricing(yearlyPrice: number): RouteLicensePricing {
  const yearly = yearlyPrice;
  const monthly = Math.max(690, Math.round(yearly / 14));
  const weekly = Math.max(199, Math.round(monthly / 3.5));
  return { weekly, monthly, yearly };
}

export function formatPriceWithPeriod(price: number, period: LicensePeriod): string {
  return `${formatPrice(price)}/${LICENSE_PERIOD_LABEL[period]}`;
}

export function formatStartingWeeklyPrice(yearlyPrice: number): string {
  const { weekly } = getRouteLicensePricing(yearlyPrice);
  return `เริ่มต้น ${formatPrice(weekly)}/สัปดาห์`;
}
