import type { LucideIcon } from 'lucide-react';
import { Building2, Compass, CreditCard, LayoutDashboard, Library, Map } from 'lucide-react';
import type { UserRole } from '../types/auth';

export const HOTEL_LIBRARY_PATH = '/hotel/library';
export const HOTEL_QR_PATH = '/hotel/qr';
export const TRAVELER_TRIPS_PATH = '/traveler/trips';
export const TRAVELER_PURCHASES_PATH = '/traveler/purchases';

export type NavItem = {
  to: string;
  label: string;
  icon?: LucideIcon;
  end?: boolean;
};

/** เมนูหลักบน header — ทุกบทบาทเห็น "ตลาดเส้นทาง" เหมือนกัน */
export function getMarketplaceNav(role: UserRole): NavItem[] {
  const marketplace: NavItem = { to: '/', label: 'ตลาดเส้นทาง', icon: Map, end: true };

  switch (role) {
    case 'traveler':
      return [
        marketplace,
        { to: TRAVELER_TRIPS_PATH, label: 'เที่ยวของฉัน', icon: Compass },
        { to: '/traveler/purchases', label: 'ซื้อ & ชำระเงิน', icon: CreditCard },
      ];
    case 'hotel':
      return [
        marketplace,
        { to: HOTEL_LIBRARY_PATH, label: 'คลังเส้นทาง', icon: Library },
        { to: '/hotel/dashboard', label: 'แดชบอร์ดโรงแรม', icon: Building2 },
      ];
    case 'creator':
      return [
        marketplace,
        { to: '/creator/dashboard', label: 'ศูนย์ครีเอเตอร์', icon: LayoutDashboard },
      ];
    case 'guest':
    default:
      return [marketplace];
  }
}

export function getLoginRedirect(role: Exclude<UserRole, 'guest'>): string {
  switch (role) {
    case 'traveler':
      return '/';
    case 'hotel':
      return '/hotel/dashboard';
    case 'creator':
      return '/creator/dashboard';
  }
}
