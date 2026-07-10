import { formatPrice } from './marketplaceRoutes';
import { getVehicleServicePerPerson, type TripPricingRoute } from './vehicleService';

const MIN_GUESTS = 1;
const MAX_GUESTS = 20;

/** ราคาทริปต่อคน (ไม่รวมค่ารถบริการ) */
export function getRoutePricePerPerson(routePrice: number): number {
  if (routePrice > 2000) {
    return Math.max(450, Math.round(routePrice / 8 / 50) * 50);
  }
  return routePrice;
}

/** ราคาต่อคนรวมค่ารถบริการ (ถ้ามี) */
export function getRoutePricePerPersonWithVehicle(
  routePrice: number,
  route?: TripPricingRoute | null,
): number {
  const base = getRoutePricePerPerson(routePrice);
  const vehicle = route ? getVehicleServicePerPerson(route) : 0;
  return base + vehicle;
}

export function clampGuestCount(count: number): number {
  return Math.min(MAX_GUESTS, Math.max(MIN_GUESTS, count));
}

export function calculateBookingTotal(
  routePrice: number,
  guestCount: number,
  route?: TripPricingRoute | null,
): number {
  return getRoutePricePerPersonWithVehicle(routePrice, route) * clampGuestCount(guestCount);
}

export function formatPerPersonPrice(
  routePrice: number,
  route?: TripPricingRoute | null,
): string {
  return `${formatPrice(getRoutePricePerPersonWithVehicle(routePrice, route))}/คน`;
}

export function formatBookingTotal(
  routePrice: number,
  guestCount: number,
  route?: TripPricingRoute | null,
): string {
  return formatPrice(calculateBookingTotal(routePrice, guestCount, route));
}

export { MIN_GUESTS, MAX_GUESTS };
