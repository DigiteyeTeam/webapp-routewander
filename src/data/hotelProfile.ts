import { formatPrice, MARKETPLACE_ROUTES, type MarketplaceRoute } from './marketplaceRoutes';
import { PROFILE_AVATAR } from './profileAvatar';

/** ค่าบริการแพลตฟอร์มต่อการจอง (บาท) */
export const HOTEL_PLATFORM_FEE = 200;

/** คอมมิชชันโรงแรมเมื่อแขกจองผ่าน QR/ลิงก์โรงแรม (100% attribution) */
export const HOTEL_REFERRAL_RATE = 0.15;

export interface HotelProfile {
  id: string;
  name: string;
  tagline: string;
  district: string;
  memberSince: string;
  avatar: string;
  verified: boolean;
  qrPlacements: number;
}

export interface BookingSplit {
  gross: number;
  listPrice: number;
  guestSavings: number;
  platform: number;
  hotel: number;
  creator: number;
  viaHotel: boolean;
  attribution: number;
}

export interface HotelDashboardStats {
  routesFollowed: number;
  bookingsThisMonth: number;
  qrScansThisMonth: number;
  monthlyCommission: number;
  monthlyCommissionFormatted: string;
  conversionRate: number;
}

export interface HotelFollowedRoute {
  routeId: string;
  title: string;
  image: string;
  aiMatch: number;
  hotelsFollowing: number;
  bookingsViaHotel: number;
  commissionMonth: number;
  commissionFormatted: string;
}

export interface HotelAiRecommendation {
  routeId: string;
  route: string;
  match: number;
  reason: string;
  guestProfile: string;
  demand: 'สูงมาก' | 'สูง' | 'ปานกลาง';
}

export interface HotelBookingRecord {
  id: string;
  date: string;
  routeTitle: string;
  routeId: string;
  hotelCommission: number;
  hotelCommissionFormatted: string;
}

export interface HotelRouteMetrics {
  routeId: string;
  views: number;
  purchases: number;
  commission: number;
  commissionFormatted: string;
}

export const MOCK_HOTEL_PROFILE: HotelProfile = {
  id: 'hotel-phuket-view',
  name: 'โรงแรมภูเก็ตวิว',
  tagline: 'โรงแรมพันธมิตร RouteWander · แนะนำเส้นทางชุมชนให้แขก',
  district: 'ป่าตอง · ภูเก็ต',
  memberSince: 'มี.ค. 2025',
  avatar: PROFILE_AVATAR,
  verified: true,
  qrPlacements: 42,
};

export function calculateBookingSplit(grossAmount: number, viaHotel: boolean, attribution = 1): BookingSplit {
  const platform = HOTEL_PLATFORM_FEE;
  const hotel = viaHotel ? Math.round(grossAmount * HOTEL_REFERRAL_RATE * attribution) : 0;
  const creator = grossAmount - platform - hotel;
  const listPrice = viaHotel ? Math.round(grossAmount / 0.88) : grossAmount;

  return {
    gross: grossAmount,
    listPrice,
    guestSavings: viaHotel ? listPrice - grossAmount : 0,
    platform,
    hotel,
    creator,
    viaHotel,
    attribution: viaHotel ? Math.round(attribution * 100) : 0,
  };
}

const FOLLOWED_ROUTE_IDS = ['1', '3', '8'] as const;

const ROUTE_HOTEL_META: Record<string, { hotelsFollowing: number; bookingsViaHotel: number }> = {
  '1': { hotelsFollowing: 3, bookingsViaHotel: 14 },
  '3': { hotelsFollowing: 2, bookingsViaHotel: 6 },
  '8': { hotelsFollowing: 4, bookingsViaHotel: 4 },
};

const ROUTE_HOTEL_PERFORMANCE: Record<string, { views: number; purchases: number }> = {
  '1': { views: 286, purchases: 14 },
  '2': { views: 144, purchases: 8 },
  '3': { views: 132, purchases: 6 },
  '8': { views: 96, purchases: 4 },
};

function getRoute(id: string): MarketplaceRoute | undefined {
  return MARKETPLACE_ROUTES.find((r) => r.id === id);
}

export function getHotelFollowedRoutes(): HotelFollowedRoute[] {
  return FOLLOWED_ROUTE_IDS.map((id) => {
    const route = getRoute(id)!;
    const meta = ROUTE_HOTEL_META[id] ?? { hotelsFollowing: 1, bookingsViaHotel: 0 };
    const commissionPerBooking = Math.round(1500 * HOTEL_REFERRAL_RATE);
    const commissionMonth = meta.bookingsViaHotel * commissionPerBooking;

    return {
      routeId: id,
      title: route.title,
      image: route.image,
      aiMatch: route.aiMatch,
      hotelsFollowing: meta.hotelsFollowing,
      bookingsViaHotel: meta.bookingsViaHotel,
      commissionMonth,
      commissionFormatted: formatPrice(commissionMonth),
    };
  });
}

export function getHotelRouteMetrics(routeId: string): HotelRouteMetrics {
  const perf = ROUTE_HOTEL_PERFORMANCE[routeId] ?? { views: 60, purchases: 2 };
  const commissionPerBooking = Math.round(1500 * HOTEL_REFERRAL_RATE);
  const commission = perf.purchases * commissionPerBooking;
  return {
    routeId,
    views: perf.views,
    purchases: perf.purchases,
    commission,
    commissionFormatted: formatPrice(commission),
  };
}

export function getHotelDashboardStats(): HotelDashboardStats {
  const routes = getHotelFollowedRoutes();
  const bookingsThisMonth = routes.reduce((s, r) => s + r.bookingsViaHotel, 0);
  const monthlyCommission = routes.reduce((s, r) => s + r.commissionMonth, 0);

  return {
    routesFollowed: routes.length,
    bookingsThisMonth,
    qrScansThisMonth: 128,
    monthlyCommission,
    monthlyCommissionFormatted: formatPrice(monthlyCommission),
    conversionRate: 18.7,
  };
}

export function getHotelAiRecommendations(): HotelAiRecommendation[] {
  const routes = getHotelFollowedRoutes();
  const reasons = [
    'แขกชาวยุโรปสนใจมรดกเมืองเก่า · จองเย็นและวันหยุดสูง',
    'ครอบครัวที่พักห้องสวีท · ชอบเส้นทางสั้นมีอาหารท้องถิ่น',
    'คู่รักวัยทำงาน · AI จับคู่จากประวัติสแกน QR ล็อบบี้',
  ];
  const profiles = ['นักท่องเที่ยวต่างชาติ', 'ครอบครัวไทย', 'คู่รัก / ฮันนีมูน'];

  return routes.map((r, i) => ({
    routeId: r.routeId,
    route: r.title,
    match: r.aiMatch,
    reason: reasons[i] ?? 'ความต้องการเส้นทางชุมชนในพื้นที่ใกล้โรงแรมเพิ่มขึ้น',
    guestProfile: profiles[i] ?? 'แขกทั่วไป',
    demand: i === 0 ? 'สูงมาก' : i === 1 ? 'สูง' : 'ปานกลาง',
  }));
}

export function getHotelRecentBookings(): HotelBookingRecord[] {
  const samples: { routeId: string; gross: number; date: string }[] = [
    { routeId: '1', gross: 1500, date: '8 ก.ค. 2026' },
    { routeId: '1', gross: 1500, date: '6 ก.ค. 2026' },
    { routeId: '3', gross: 1200, date: '4 ก.ค. 2026' },
    { routeId: '8', gross: 1500, date: '2 ก.ค. 2026' },
  ];

  return samples.map((s, i) => {
    const route = getRoute(s.routeId)!;
    const split = calculateBookingSplit(s.gross, true, 1);
    return {
      id: `bk-${i + 1}`,
      date: s.date,
      routeTitle: route.title,
      routeId: s.routeId,
      hotelCommission: split.hotel,
      hotelCommissionFormatted: formatPrice(split.hotel),
    };
  });
}

export const HOTEL_COMMISSION_BARS = [22, 35, 28, 48, 52, 68];

export const HOTEL_IMPACT_METRICS = [
  {
    key: 'hotel-commission',
    label: 'คอมมิชชันของคุณ',
    labelEn: 'Your Commission',
    desc: 'รายได้จากแขกที่จองผ่าน QR/ลิงก์โรงแรมเดือนนี้',
    get value() {
      return getHotelDashboardStats().monthlyCommissionFormatted;
    },
    trend: '+22%',
    trendUp: true,
  },
  {
    key: 'guest-bookings',
    label: 'การจองผ่านโรงแรม',
    labelEn: 'Your Referrals',
    desc: 'จำนวนการจองที่อ้างอิงมาจากโรงแรมของคุณ',
    get value() {
      return `${getHotelDashboardStats().bookingsThisMonth} รายการ`;
    },
    trend: '+6',
    trendUp: true,
  },
  {
    key: 'qr-scans',
    label: 'สแกน QR',
    labelEn: 'QR Scans',
    desc: 'แขกสแกน QR โรงแรมเพื่อดูเส้นทางในเดือนนี้',
    get value() {
      return `${getHotelDashboardStats().qrScansThisMonth} ครั้ง`;
    },
    trend: '+14%',
    trendUp: true,
  },
  {
    key: 'conversion',
    label: 'อัตราแปลงเป็นจอง',
    labelEn: 'Conversion',
    desc: 'สัดส่วนการสแกน QR ที่กลายเป็นการจอง',
    get value() {
      return `${getHotelDashboardStats().conversionRate}%`;
    },
    trend: '+1.2%',
    trendUp: true,
  },
] as const;
