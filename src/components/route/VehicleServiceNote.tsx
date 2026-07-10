import { Car } from 'lucide-react';
import type { TripPricingRoute } from '../../data/vehicleService';
import { formatTripPricingNote } from '../../data/vehicleService';

type VehicleServiceNoteProps = {
  route: TripPricingRoute;
  variant?: 'compact' | 'detail';
  basePerPerson?: number;
  className?: string;
};

export default function VehicleServiceNote({
  route,
  variant = 'compact',
  basePerPerson,
  className = '',
}: VehicleServiceNoteProps) {
  const note = formatTripPricingNote(route, variant === 'compact', basePerPerson);
  if (!note) return null;

  return (
    <p
      className={`flex items-start gap-1.5 text-secondary leading-snug ${
        variant === 'detail' ? 'text-xs' : 'text-[10px]'
      } ${className}`}
    >
      <Car className={`shrink-0 text-primary/80 ${variant === 'detail' ? 'w-3.5 h-3.5 mt-0.5' : 'w-3 h-3 mt-0.5'}`} />
      <span>{note}</span>
    </p>
  );
}
