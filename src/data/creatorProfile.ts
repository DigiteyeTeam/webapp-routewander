import {
  MARKETPLACE_ROUTES,
  formatPrice,
  type MarketplaceRoute,
} from './marketplaceRoutes';
import { PROFILE_AVATAR } from './profileAvatar';

export interface CreatorProfile {
  id: string;
  name: string;
  tagline: string;
  email: string;
  avatar: string;
  verified: boolean;
  district: string;
  memberSince: string;
}

export interface CreatorRoutePerformance {
  routeId: string;
  rank: number;
  title: string;
  image: string;
  aiMatch: number;
  licensesSold: number;
  revenue: number;
  revenueFormatted: string;
  tags: string[];
  demand: 'สูงมาก' | 'สูง' | 'ปานกลาง';
}

export interface CreatorDashboardStats {
  routeCount: number;
  licensesSold: number;
  monthlyRevenue: number;
  monthlyRevenueFormatted: string;
  communitiesLinked: number;
  avgRating: number;
  localShopsImpact: number;
}

export interface CreatorAiMatchItem {
  routeId: string;
  route: string;
  match: number;
  tags: string[];
  demand: 'สูงมาก' | 'สูง' | 'ปานกลาง';
}

export interface CreatorEcosystemLink {
  type: string;
  name: string;
  status: string;
}

/** ครีเอเตอร์ mockup หลักของพอร์ทัล — สมชาย ใจดี */
export const MOCK_CREATOR_PROFILE: CreatorProfile = {
  id: 'creator-somchai',
  name: 'สมชาย ใจดี',
  tagline: 'ไกด์ท้องถิ่นภูเก็ต เน้นมรดกเปรานกัน',
  email: 'somchai@routewander.com',
  avatar: PROFILE_AVATAR,
  verified: true,
  district: 'เมืองภูเก็ต',
  memberSince: 'ม.ค. 2025',
};

const ROUTE_SALES: Record<string, { licensesSold: number; demand: CreatorRoutePerformance['demand'] }> = {
  '1': { licensesSold: 524, demand: 'สูงมาก' },
  '20': { licensesSold: 328, demand: 'สูง' },
};

export function getCreatorMarketplaceRoutes(): MarketplaceRoute[] {
  return MARKETPLACE_ROUTES.filter((r) => r.creator.name === MOCK_CREATOR_PROFILE.name);
}

export function getCreatorRoutePerformance(): CreatorRoutePerformance[] {
  return getCreatorMarketplaceRoutes()
    .map((route) => {
      const sales = ROUTE_SALES[route.id] ?? { licensesSold: 120, demand: 'ปานกลาง' as const };
      const revenue = Math.round((route.price / 12) * sales.licensesSold * 0.15);
      return {
        routeId: route.id,
        rank: 0,
        title: route.title,
        image: route.image,
        aiMatch: route.aiMatch,
        licensesSold: sales.licensesSold,
        revenue,
        revenueFormatted: formatPrice(revenue),
        tags: route.tags.slice(0, 3),
        demand: sales.demand,
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

export function getCreatorDashboardStats(): CreatorDashboardStats {
  const performances = getCreatorRoutePerformance();
  const routes = getCreatorMarketplaceRoutes();
  const licensesSold = performances.reduce((sum, p) => sum + p.licensesSold, 0);
  const monthlyRevenue = performances.reduce((sum, p) => sum + p.revenue, 0);
  const avgRating =
    routes.length > 0 ? routes.reduce((sum, r) => sum + r.rating, 0) / routes.length : 0;

  const communityStops = new Set(
    routes.flatMap((r) => r.waypoints.filter((w) => w.name.includes('ชุมชน')).map((w) => w.name)),
  );

  return {
    routeCount: routes.length,
    licensesSold,
    monthlyRevenue,
    monthlyRevenueFormatted: formatPrice(monthlyRevenue),
    communitiesLinked: Math.max(communityStops.size, 5),
    avgRating: Math.round(avgRating * 10) / 10,
    localShopsImpact: 15,
  };
}

export function getCreatorAiMatches(): CreatorAiMatchItem[] {
  return getCreatorRoutePerformance().map((p) => ({
    routeId: p.routeId,
    route: p.title,
    match: p.aiMatch,
    tags: p.tags,
    demand: p.demand,
  }));
}

export const CREATOR_ECOSYSTEM_LINKS: CreatorEcosystemLink[] = [
  { type: 'โรงแรม', name: 'The Memory at On On Hotel', status: 'ใช้งานไลเซนส์' },
  { type: 'ร้านค้า', name: 'หมี่ฮกเกี้ยนตลาดใหญ่', status: 'อยู่ในเส้นทาง' },
  { type: 'ชุมชน', name: 'ชุมชนบ้านบ่อแร่', status: 'ได้รับการสนับสนุน' },
  { type: 'ชุมชน', name: 'ชุมชนย่านเมืองเก่า', status: 'อยู่ในเส้นทาง' },
];

export const CREATOR_REVENUE_BARS = [38, 52, 48, 61, 78, 95];

export const CREATOR_IMPACT_METRICS = [
  {
    key: 'creator-income',
    label: 'รายได้ครีเอเตอร์',
    labelEn: 'Creator Income',
    desc: 'รายได้จากไลเซนส์เส้นทางของสมชายในเดือนนี้',
    value: formatPrice(getCreatorDashboardStats().monthlyRevenue),
    trend: '+18%',
    trendUp: true,
  },
  {
    key: 'local-business',
    label: 'รายได้ธุรกิจท้องถิ่น',
    labelEn: 'Local Business Revenue',
    desc: 'กระจายรายได้สู่ร้านค้าและชุมชนในเส้นทาง',
    value: '฿128k',
    trend: '+24%',
    trendUp: true,
  },
  {
    key: 'hotel-experience',
    label: 'ประสบการณ์โรงแรม',
    labelEn: 'Hotel Experience',
    desc: 'โรงแรมที่ใช้เส้นทางมรดกเมืองเก่าของคุณ',
    value: '8 โรงแรม',
    trend: '+2',
    trendUp: true,
  },
  {
    key: 'traveler-experience',
    label: 'ประสบการณ์นักท่องเที่ยว',
    labelEn: 'Better Traveler Experience',
    desc: 'คะแนนเฉลี่ยจากเส้นทางของคุณ',
    value: `${getCreatorDashboardStats().avgRating} ★`,
    trend: '+0.2',
    trendUp: true,
  },
] as const;
