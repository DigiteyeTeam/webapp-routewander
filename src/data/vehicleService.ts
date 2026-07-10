import { formatPrice } from './marketplaceRoutes';

/** ค่ารถบริการต่อชั่วโมง ต่อท่าน (บาท) — เฉพาะเส้นทางที่มีรถรับส่ง */
export const VEHICLE_SERVICE_PER_HOUR_PER_PERSON = 50;

export type TripPricingRoute = {
  duration: string;
  /** คงไว้สำหรับ mockup — ทุกเส้นทางมีค่ารถบริการตาม duration */
  vehicleServicePerHour?: number;
};

/** @deprecated use TripPricingRoute */
export type VehicleServiceRoute = TripPricingRoute;

export function parseRouteDurationHours(duration: string): number {
  const match = duration.match(/([\d.]+)/);
  return match ? Number(match[1]) : 0;
}

export type SurchargeInfo = {
  perHourPerPerson: number;
  hours: number;
  perPersonTotal: number;
};

export function getVehicleServiceInfo(route: TripPricingRoute): SurchargeInfo | null {
  const hours = parseRouteDurationHours(route.duration);
  if (!hours) return null;
  const perPersonTotal = Math.round(VEHICLE_SERVICE_PER_HOUR_PER_PERSON * hours);
  return {
    perHourPerPerson: VEHICLE_SERVICE_PER_HOUR_PER_PERSON,
    hours,
    perPersonTotal,
  };
}

export function getVehicleServicePerPerson(route: TripPricingRoute): number {
  return getVehicleServiceInfo(route)?.perPersonTotal ?? 0;
}

export function formatTripPricingNote(
  route: TripPricingRoute,
  compact = false,
  basePerPerson?: number,
): string | null {
  const vehicle = getVehicleServiceInfo(route);
  if (!vehicle) return null;

  if (compact) {
    return `รวมค่ารถ ${formatPrice(vehicle.perHourPerPerson)}/ชม./คน`;
  }

  if (basePerPerson != null) {
    return `ทริป ${formatPrice(basePerPerson)} + ค่ารถ ${formatPrice(vehicle.perHourPerPerson)}/ชม. × ${vehicle.hours} ชม.`;
  }

  return `+ ค่ารถบริการ ${formatPrice(vehicle.perHourPerPerson)}/ชม./คน × ${vehicle.hours} ชม. (+${formatPrice(vehicle.perPersonTotal)}/คน)`;
}

/** @deprecated use formatTripPricingNote */
export function formatVehicleServiceNote(
  route: TripPricingRoute,
  compact = false,
  basePerPerson?: number,
): string | null {
  return formatTripPricingNote(route, compact, basePerPerson);
}
