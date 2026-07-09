export type WaypointType =
  | 'meeting'
  | 'attraction'
  | 'hotel'
  | 'restaurant'
  | 'shop'
  | 'event'
  | 'activity'
  | 'end'
  | 'custom';

export const WAYPOINT_TYPE_LABELS: Record<WaypointType, string> = {
  meeting: 'จุดนัดพบ',
  attraction: 'จุดท่องเที่ยว',
  hotel: 'โรงแรม',
  restaurant: 'ร้านอาหาร',
  shop: 'ร้านค้า',
  event: 'งานอีเว้นท์',
  activity: 'กิจกรรมชาวบ้าน',
  end: 'จุดสิ้นสุด',
  custom: 'อื่นๆ',
};

export interface RouteWaypoint {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  description?: string;
  type: WaypointType;
  imageUrl?: string;
}

export interface RouteStats {
  distance: number;
  duration: number;
}

export interface RouteDetail {
  id: string;
  title: string;
  description: string;
  image: string;
  categoryLabel: string;
  categoryColor: string;
  creator: { name: string; avatar: string; verified: boolean };
  price: number;
  rating: number;
  aiMatch: number;
  tags: string[];
  district: string;
  duration: string;
  stops: number;
  waypoints: RouteWaypoint[];
  routeStats?: RouteStats | null;
  source: 'marketplace' | 'creator';
}

export interface CreatorSavedRoute {
  id: string;
  name: string;
  description?: string;
  waypoints: RouteWaypoint[];
  routeStats?: RouteStats | null;
  createdAt?: string;
}
