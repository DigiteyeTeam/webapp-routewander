import {
  MARKETPLACE_ROUTES,
  CATEGORY_META,
  type MarketplaceRoute,
  type MarketplaceWaypoint,
} from './marketplaceRoutes';
import type { CreatorSavedRoute, RouteDetail, RouteWaypoint, WaypointType } from '../types/route';

import { PROFILE_AVATAR } from './profileAvatar';

function inferWaypointType(name: string, index: number, total: number): WaypointType {
  if (index === 0) return 'meeting';
  if (index === total - 1 && total > 1) return 'end';
  const n = name.toLowerCase();
  if (n.includes('โรงแรม') || n.includes('hotel')) return 'hotel';
  if (n.includes('ร้าน') || n.includes('อาหาร') || n.includes('หมี่') || n.includes('ข้าว')) return 'restaurant';
  if (n.includes('ชุมชน') || n.includes('โนรา') || n.includes('เวิร์กช็อป')) return 'activity';
  return 'attraction';
}

function marketplaceWaypointToRoute(
  wp: MarketplaceWaypoint,
  routeId: string,
  index: number,
  total: number,
): RouteWaypoint {
  return {
    id: `${routeId}-wp-${index}`,
    name: wp.name,
    location: { lat: wp.lat, lng: wp.lng },
    description: wp.description,
    type: wp.type ?? inferWaypointType(wp.name, index, total),
    imageUrl: wp.imageUrl,
  };
}

function marketplaceToDetail(route: MarketplaceRoute): RouteDetail {
  const meta = CATEGORY_META[route.category];
  const waypoints = route.waypoints.map((wp, i) =>
    marketplaceWaypointToRoute(wp, route.id, i, route.waypoints.length),
  );

  return {
    id: route.id,
    title: route.title,
    description: route.description,
    image: route.image,
    categoryLabel: meta.label,
    categoryColor: meta.color,
    creator: route.creator,
    price: route.price,
    rating: route.rating,
    aiMatch: route.aiMatch,
    tags: route.tags,
    district: route.district,
    duration: route.duration,
    stops: route.stops,
    waypoints,
    routeStats: null,
    source: 'marketplace',
  };
}

function creatorToDetail(route: CreatorSavedRoute): RouteDetail {
  const waypoints = route.waypoints ?? [];
  const cover = waypoints.find((w) => w.imageUrl)?.imageUrl ?? '';

  return {
    id: route.id,
    title: route.name || 'เส้นทางไม่มีชื่อ',
    description: route.description || 'เส้นทางชุมชนที่สร้างโดยครีเอเตอร์ท้องถิ่น',
    image: cover,
    categoryLabel: 'ชุมชน',
    categoryColor: '#16a34a',
    creator: { name: 'ครีเอเตอร์ RouteWander', avatar: PROFILE_AVATAR, verified: true },
    price: 12000,
    rating: 4.8,
    aiMatch: 90,
    tags: ['ชุมชน', 'ครีเอเตอร์ท้องถิ่น'],
    district: 'ภูเก็ต',
    duration: route.routeStats ? formatDurationShort(route.routeStats.duration) : `${waypoints.length} จุด`,
    stops: waypoints.length,
    waypoints,
    routeStats: route.routeStats ?? null,
    source: 'creator',
  };
}

function loadCreatorRoutes(): CreatorSavedRoute[] {
  try {
    return JSON.parse(localStorage.getItem('myRoutes') || '[]');
  } catch {
    return [];
  }
}

export function getRouteById(id: string): RouteDetail | null {
  const marketplace = MARKETPLACE_ROUTES.find((r) => r.id === id);
  if (marketplace) return marketplaceToDetail(marketplace);

  const creator = loadCreatorRoutes().find((r) => r.id === id);
  if (creator) return creatorToDetail(creator);

  return null;
}

export function formatDistance(meters?: number | null) {
  if (!meters) return null;
  return `${(meters / 1000).toFixed(1)} กม.`;
}

export function formatDurationLong(seconds?: number | null) {
  if (!seconds) return null;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours} ชม. ${minutes} นาที`;
  return `${minutes} นาที`;
}

function formatDurationShort(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours} ชม.`;
  return `${minutes} นาที`;
}

export function getRouteCenter(waypoints: RouteWaypoint[]) {
  if (waypoints.length === 0) return { lat: 7.95, lng: 98.35 };
  const lat = waypoints.reduce((s, w) => s + w.location.lat, 0) / waypoints.length;
  const lng = waypoints.reduce((s, w) => s + w.location.lng, 0) / waypoints.length;
  return { lat, lng };
}
