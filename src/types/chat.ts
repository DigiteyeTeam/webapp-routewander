export type ChatRole = 'traveler' | 'creator' | 'hotel' | 'marketplace';

export type ChatCardRef =
  | { type: 'route'; id: string }
  | { type: 'community'; no: number }
  | { type: 'landmark'; id: string };

export type ChatRouteCard = {
  type: 'route';
  id: string;
  title: string;
  image: string;
  district: string;
  duration: string;
  stops: number;
  aiMatch: number;
  categoryLabel: string;
  categoryColor: string;
  categoryBg: string;
  price: number;
};

export type ChatCommunityCard = {
  type: 'community';
  no: number;
  name: string;
  image: string;
  district: string;
  hook: string;
  highlight: string;
  activities: string[];
  food: string[];
};

export type ChatLandmarkCard = {
  type: 'landmark';
  id: string;
  name: string;
  district: string;
  hook: string;
  highlight: string;
};

export type ChatCard = ChatRouteCard | ChatCommunityCard | ChatLandmarkCard;

export type ChatSessionContext = {
  userName?: string;
  subtitle?: string;
  district?: string;
  routeCount?: number;
  monthlyRevenue?: string;
  topRouteIds?: string[];
  routesFollowed?: number;
  monthlyCommission?: string;
  bookingsThisMonth?: number;
  qrScans?: number;
};

export type ChatMessage = {
  role: 'user' | 'ai';
  text: string;
  cards?: ChatCard[];
  notice?: string;
};
