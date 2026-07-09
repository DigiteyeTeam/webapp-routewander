import { formatPrice } from './marketplaceRoutes';

const MIN_GUESTS = 1;
const MAX_GUESTS = 20;

/** ราคาต่อคนต่อการจอง (บาท) — รองรับข้อมูลเดิมที่เก็บราคาไลเซนส์รายปี */
export function getRoutePricePerPerson(routePrice: number): number {
  if (routePrice > 2000) {
    return Math.max(450, Math.round(routePrice / 8 / 50) * 50);
  }
  return routePrice;
}

export function clampGuestCount(count: number): number {
  return Math.min(MAX_GUESTS, Math.max(MIN_GUESTS, count));
}

export function calculateBookingTotal(routePrice: number, guestCount: number): number {
  return getRoutePricePerPerson(routePrice) * clampGuestCount(guestCount);
}

export function formatPerPersonPrice(routePrice: number): string {
  return `${formatPrice(getRoutePricePerPerson(routePrice))}/คน`;
}

export function formatBookingTotal(routePrice: number, guestCount: number): string {
  return formatPrice(calculateBookingTotal(routePrice, guestCount));
}

export { MIN_GUESTS, MAX_GUESTS };
