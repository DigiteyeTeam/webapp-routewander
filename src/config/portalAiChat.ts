import type { ChatCardRef, ChatRole } from '../types/chat';
import {
  getCreatorDashboardStats,
  getCreatorRoutePerformance,
  MOCK_CREATOR_PROFILE,
} from '../data/creatorProfile';
import {
  getHotelAiRecommendations,
  getHotelDashboardStats,
  MOCK_HOTEL_PROFILE,
} from '../data/hotelProfile';
import { MOCK_USERS } from '../types/auth';
import type { ChatSessionContext } from '../types/chat';

export type PortalAiConfig = {
  role: ChatRole;
  subtitle: string;
  headerGradient: string;
  fabShadow: string;
  placeholder: string;
  initialMessage: string;
  welcomeCards: ChatCardRef[];
};

export function buildPortalChatContext(role: ChatRole): ChatSessionContext {
  if (role === 'creator') {
    const stats = getCreatorDashboardStats();
    const routes = getCreatorRoutePerformance();
    return {
      userName: MOCK_CREATOR_PROFILE.name,
      subtitle: MOCK_CREATOR_PROFILE.tagline,
      district: MOCK_CREATOR_PROFILE.district,
      routeCount: stats.routeCount,
      monthlyRevenue: stats.monthlyRevenueFormatted,
      topRouteIds: routes.slice(0, 3).map((r) => r.routeId),
    };
  }

  if (role === 'hotel') {
    const stats = getHotelDashboardStats();
    const recs = getHotelAiRecommendations();
    return {
      userName: MOCK_HOTEL_PROFILE.name,
      subtitle: MOCK_HOTEL_PROFILE.tagline,
      district: MOCK_HOTEL_PROFILE.district,
      routesFollowed: stats.routesFollowed,
      monthlyCommission: stats.monthlyCommissionFormatted,
      bookingsThisMonth: stats.bookingsThisMonth,
      qrScans: stats.qrScansThisMonth,
      topRouteIds: recs.map((r) => r.routeId),
    };
  }

  const traveler = MOCK_USERS.traveler;
  return {
    userName: traveler.name,
    subtitle: traveler.subtitle,
  };
}

export const PORTAL_AI_CONFIG: Record<ChatRole, PortalAiConfig> = {
  marketplace: {
    role: 'marketplace',
    subtitle: 'ผู้เชี่ยวชาญ 15 ชุมชนภูเก็ต',
    headerGradient: 'from-primary to-emerald-600',
    fabShadow: 'shadow-[0_8px_28px_rgba(22,163,74,0.35)]',
    placeholder: 'ถาม AI เรื่องแนะนำเส้นทาง...',
    initialMessage: `สวัสดีครับ! ผม RouteWander AI 🌴
ผู้เชี่ยวชาญเส้นทางชุมชนภูเก็ต — รู้จัก 15 ชุมชน ททท. และเส้นทางในตลาดเป็นอย่างดี

ลองถามได้เลย เช่น "แนะนำเส้นทางครอบครัว" หรือ "ชุมชนเมืองเก่ามีอะไรบ้าง"`,
    welcomeCards: [
      { type: 'community', no: 4 },
      { type: 'route', id: '20' },
    ],
  },
  traveler: {
    role: 'traveler',
    subtitle: 'ผู้ช่วยทริปชุมชนภูเก็ต',
    headerGradient: 'from-blue-500 to-cyan-600',
    fabShadow: 'shadow-[0_8px_28px_rgba(59,130,246,0.35)]',
    placeholder: 'ถามเรื่องทริปหรือชุมชน...',
    initialMessage: `สวัสดีครับคุณมิ้นท์! 🌴
ผม RouteWander AI ช่วยวางแผนทริปชุมชนภูเก็ต แนะนำเส้นทางและ 15 ชุมชน ททท.

ลองถามได้ เช่น "ทริปครอบครัว 1 วัน" หรือ "อยากกินอาหารท้องถิ่น"`,
    welcomeCards: [
      { type: 'route', id: '20' },
      { type: 'community', no: 11 },
    ],
  },
  creator: {
    role: 'creator',
    subtitle: 'ที่ปรึกษาสร้างเส้นทางชุมชน',
    headerGradient: 'from-emerald-500 to-teal-600',
    fabShadow: 'shadow-[0_8px_28px_rgba(16,185,129,0.35)]',
    placeholder: 'ถามเรื่องสร้างเส้นทางหรือตั้งราคา...',
    initialMessage: `สวัสดีครับคุณสมชาย! ✨
ผม RouteWander AI ที่ปรึกษาครีเอเตอร์ — ช่วยออกแบบเส้นทางชุมชนที่ดึงดูดนักท่องเที่ยว ตั้งราคาเหมาะสม และเชื่อมกับ 15 ชุมชน ททท.

ลองถามได้ เช่น "เส้นทางแบบไหนขายดี" หรือ "ควรตั้งราคาเท่าไหร่"`,
    welcomeCards: [
      { type: 'route', id: '1' },
      { type: 'community', no: 4 },
    ],
  },
  hotel: {
    role: 'hotel',
    subtitle: 'ที่ปรึกษารายได้และแขกโรงแรม',
    headerGradient: 'from-orange-500 to-amber-600',
    fabShadow: 'shadow-[0_8px_28px_rgba(249,115,22,0.35)]',
    placeholder: 'ถามเรื่องเส้นทางทำรายได้หรือแนะนำแขก...',
    initialMessage: `สวัสดีครับโรงแรมภูเก็ตวิว! 🏨
ผม RouteWander AI ที่ปรึกษาโรงแรม — ช่วยเลือกเส้นทางที่มีโอกาสทำรายได้สูง แนะนำแขกให้จองผ่าน QR โรงแรม และจับคู่เส้นทางกับโปรไฟล์แขก

ลองถามได้ เช่น "เส้นทางไหนคอมมิชชันดี" หรือ "แนะนำแขกครอบครัว"`,
    welcomeCards: [
      { type: 'route', id: '1' },
      { type: 'route', id: '3' },
    ],
  },
};
