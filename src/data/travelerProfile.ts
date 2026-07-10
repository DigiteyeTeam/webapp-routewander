import { formatPrice, MARKETPLACE_ROUTES } from './marketplaceRoutes';
import { TRAVELER_AVATAR } from './profileAvatar';
import type { CheckoutOrderItem } from '../types/cart';

const PURCHASES_STORAGE_KEY = 'routewander-purchases';
const TRIPS_STORAGE_KEY = 'routewander-trips';

export interface TravelerProfile {
  id: string;
  name: string;
  tagline: string;
  memberSince: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  badgesEarned: number;
}

export interface TravelerTrip {
  id: string;
  routeId: string;
  title: string;
  image: string;
  district: string;
  status: 'active' | 'upcoming' | 'completed';
  dateLabel: string;
  progress: number;
  hotelName?: string;
  missionsDone: number;
  missionsTotal: number;
}

export interface TravelerMission {
  id: string;
  title: string;
  xp: number;
  done: boolean;
  tripTitle?: string;
}

export interface TravelerBadge {
  id: string;
  title: string;
  description: string;
  icon: 'compass' | 'utensils' | 'map-pin' | 'star' | 'mountain' | 'award';
  theme: 'sky' | 'amber' | 'violet' | 'gold' | 'emerald' | 'rose';
  earned: boolean;
  earnedAt?: string;
}

export interface TravelerPurchase {
  id: string;
  date: string;
  routeTitle: string;
  routeId: string;
  amount: number;
  amountFormatted: string;
  guestCount: number;
  hotelName?: string;
  hotelSlug?: string;
  paymentMethod: string;
  status: 'paid' | 'refunded';
}

export interface TravelerPaymentSummary {
  totalSpent: number;
  totalSpentFormatted: string;
  routesPurchased: number;
  savedViaHotel: number;
  savedViaHotelFormatted: string;
}

export const MOCK_TRAVELER_PROFILE: TravelerProfile = {
  id: 'traveler-mint',
  name: 'คุณมิ้นท์',
  tagline: 'นักท่องเที่ยว RouteWander · ชอบเส้นทางชุมชนและอาหารท้องถิ่น',
  memberSince: 'ม.ค. 2026',
  avatar: TRAVELER_AVATAR,
  level: 3,
  xp: 420,
  xpToNextLevel: 600,
  badgesEarned: 4,
};

function getRoute(id: string) {
  return MARKETPLACE_ROUTES.find((r) => r.id === id);
}

const TRIP_DATA: Omit<TravelerTrip, 'title' | 'image' | 'district'>[] = [
  {
    id: 'trip-1',
    routeId: '1',
    status: 'active',
    dateLabel: 'กำลังเดินทาง · 8 ก.ค. 2026',
    progress: 45,
    hotelName: 'โรงแรมภูเก็ตวิว',
    missionsDone: 1,
    missionsTotal: 3,
  },
  {
    id: 'trip-2',
    routeId: '3',
    status: 'upcoming',
    dateLabel: 'นัดหมาย 12 ก.ค. 2026',
    progress: 0,
    hotelName: 'โรงแรมภูเก็ตวิว',
    missionsDone: 0,
    missionsTotal: 3,
  },
  {
    id: 'trip-3',
    routeId: '8',
    status: 'completed',
    dateLabel: 'จบแล้ว · 28 มิ.ย. 2026',
    progress: 100,
    missionsDone: 3,
    missionsTotal: 3,
  },
];

export function getTravelerTrips(): TravelerTrip[] {
  const baseTrips = TRIP_DATA.map((t) => {
    const route = getRoute(t.routeId)!;
    return {
      ...t,
      title: route.title,
      image: route.image,
      district: route.district,
    };
  });

  return [...readStoredTrips(), ...baseTrips];
}

export const TRAVELER_MISSIONS: TravelerMission[] = [
  { id: 'm1', title: 'เช็กอินวัดฉลอง', xp: 50, done: true, tripTitle: 'มรดกเมืองเก่าภูเก็ต' },
  { id: 'm2', title: 'ลองอาหารพื้นถิ่น 3 ร้าน', xp: 80, done: false, tripTitle: 'มรดกเมืองเก่าภูเก็ต' },
  { id: 'm3', title: 'รีวิวเส้นทางหลังจบทริป', xp: 100, done: false, tripTitle: 'มรดกเมืองเก่าภูเก็ต' },
  { id: 'm4', title: 'ถ่ายรูปจุดชมวิว', xp: 40, done: false, tripTitle: 'สตรีทฟู้ดถนนคนเดิน' },
];

export const TRAVELER_BADGES: TravelerBadge[] = [
  {
    id: 'b1',
    title: 'นักสำรวจใหม่',
    description: 'เริ่มทริปแรกบน RouteWander',
    icon: 'compass',
    theme: 'sky',
    earned: true,
    earnedAt: 'ม.ค. 2026',
  },
  {
    id: 'b2',
    title: 'นักกินตัวยง',
    description: 'ลองอาหารท้องถิ่น 3 ร้าน',
    icon: 'utensils',
    theme: 'amber',
    earned: true,
    earnedAt: 'มี.ค. 2026',
  },
  {
    id: 'b3',
    title: 'เช็กอินมาสเตอร์',
    description: 'เช็กอินครบทุกจุดในเส้นทาง',
    icon: 'map-pin',
    theme: 'violet',
    earned: true,
    earnedAt: 'มิ.ย. 2026',
  },
  {
    id: 'b4',
    title: 'รีวิวเวอร์',
    description: 'รีวิวเส้นทางหลังจบทริป',
    icon: 'star',
    theme: 'gold',
    earned: true,
    earnedAt: 'มิ.ย. 2026',
  },
  {
    id: 'b5',
    title: 'นักผจญภัย',
    description: 'จบเส้นทางธรรมชาติระดับยาก',
    icon: 'mountain',
    theme: 'emerald',
    earned: false,
  },
  {
    id: 'b6',
    title: 'ครบ 5 เส้นทาง',
    description: 'ซื้อและจบเส้นทางครบ 5 เส้น',
    icon: 'award',
    theme: 'rose',
    earned: false,
  },
];

const PURCHASE_SAMPLES = [
  { routeId: '1', gross: 1320, guestCount: 2, date: '8 ก.ค. 2026', hotelName: 'โรงแรมภูเก็ตวิว' },
  { routeId: '3', gross: 1056, guestCount: 2, date: '5 ก.ค. 2026', hotelName: 'โรงแรมภูเก็ตวิว' },
  { routeId: '8', gross: 1500, guestCount: 2, date: '28 มิ.ย. 2026' },
];

function readStoredPurchases(): TravelerPurchase[] {
  try {
    const raw = localStorage.getItem(PURCHASES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as TravelerPurchase[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readStoredTrips(): TravelerTrip[] {
  try {
    const raw = localStorage.getItem(TRIPS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as TravelerTrip[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatThaiDate(date: Date): string {
  return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function completeCheckout(items: CheckoutOrderItem[], paymentMethod: string) {
  const now = new Date();
  const dateLabel = formatThaiDate(now);

  const newPurchases: TravelerPurchase[] = items.map((item, i) => ({
    id: `pur-${now.getTime()}-${i}`,
    date: dateLabel,
    routeTitle: item.routeTitle,
    routeId: item.routeId,
    amount: item.amount,
    amountFormatted: formatPrice(item.amount),
    guestCount: item.guestCount,
    hotelName: item.hotelName,
    hotelSlug: item.hotelSlug,
    paymentMethod,
    status: 'paid',
  }));

  const newTrips: TravelerTrip[] = items.map((item, i) => {
    const route = getRoute(item.routeId)!;
    return {
      id: `trip-${now.getTime()}-${i}`,
      routeId: item.routeId,
      title: route.title,
      image: route.image,
      district: route.district,
      status: 'upcoming',
      dateLabel: `นัดหมาย ${dateLabel}`,
      progress: 0,
      hotelName: item.hotelName,
      missionsDone: 0,
      missionsTotal: 3,
    };
  });

  try {
    localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify([...newPurchases, ...readStoredPurchases()]));
    localStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify([...newTrips, ...readStoredTrips()]));
  } catch {
    /* ignore */
  }
}

export function getTravelerPurchases(): TravelerPurchase[] {
  const samplePurchases = PURCHASE_SAMPLES.map((s, i) => {
    const route = getRoute(s.routeId)!;
    return {
      id: `pur-sample-${i + 1}`,
      date: s.date,
      routeTitle: route.title,
      routeId: s.routeId,
      amount: s.gross,
      amountFormatted: formatPrice(s.gross),
      guestCount: s.guestCount,
      hotelName: s.hotelName,
      paymentMethod: i === 0 ? 'บัตรเครดิต ·••• 4242' : 'PromptPay',
      status: 'paid' as const,
    };
  });

  return [...readStoredPurchases(), ...samplePurchases];
}

export function getTravelerPaymentSummary(): TravelerPaymentSummary {
  const purchases = getTravelerPurchases();
  const totalSpent = purchases.reduce((s, p) => s + p.amount, 0);
  const withHotel = purchases.filter((p) => p.hotelName);
  const listTotal = withHotel.reduce((s, p) => s + Math.round(p.amount / 0.88), 0);
  const savedViaHotel = withHotel.length > 0 ? listTotal - withHotel.reduce((s, p) => s + p.amount, 0) : 0;

  return {
    totalSpent,
    totalSpentFormatted: formatPrice(totalSpent),
    routesPurchased: purchases.length,
    savedViaHotel,
    savedViaHotelFormatted: formatPrice(savedViaHotel),
  };
}

export function getTravelerDashboardStats() {
  const trips = getTravelerTrips();
  return {
    activeTrips: trips.filter((t) => t.status === 'active').length,
    upcomingTrips: trips.filter((t) => t.status === 'upcoming').length,
    completedTrips: trips.filter((t) => t.status === 'completed').length,
    openMissions: TRAVELER_MISSIONS.filter((m) => !m.done).length,
  };
}
