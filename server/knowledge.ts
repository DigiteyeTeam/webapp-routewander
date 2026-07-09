import { existsSync, readFileSync } from 'fs';
import path from 'path';

function resolveDataPath(filename: string) {
  const candidates = [
    path.join(process.cwd(), 'src/data', filename),
    path.join(process.cwd(), 'data', filename),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  throw new Error(`Data file not found: ${filename}`);
}

export type RouteKnowledge = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  district?: string;
  duration?: string;
  stops?: number;
  aiMatch?: number;
  rating?: number;
  price?: number;
};

export type CommunityKnowledge = {
  no: number;
  name: string;
  district: string;
  hook: string;
  highlight: string;
  activities: string[];
  food: string[];
  localLife?: string;
};

export type LandmarkKnowledge = {
  id: string;
  name: string;
  district: string;
  hook: string;
  highlight: string;
};

function parseStringArray(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return [...raw.matchAll(/'([^']+)'/g)].map((m) => m[1]);
}

function loadBaseRoutes() {
  const raw = readFileSync(resolveDataPath('aiKnowledge.json'), 'utf-8');
  return (JSON.parse(raw) as { routes: { id: string; title: string }[] }).routes;
}

export function loadRouteWanderKnowledge() {
  const baseRoutes = loadBaseRoutes();
  const mr = readFileSync(resolveDataPath('marketplaceRoutes.ts'), 'utf-8');

  const routeBlocks = [
    ...mr.matchAll(
      /id: '(\d+)',\s*title: '([^']+)',[\s\S]*?description:\s*'([^']+)',[\s\S]*?price: (\d+),[\s\S]*?rating: ([\d.]+),[\s\S]*?aiMatch: (\d+),[\s\S]*?category: '(\w+)',[\s\S]*?district: '([^']+)',[\s\S]*?duration: '([^']+)',[\s\S]*?stops: (\d+)/g,
    ),
  ];
  const routeById = new Map(routeBlocks.map((b) => [b[1], b]));

  const routes: RouteKnowledge[] = baseRoutes.map((r) => {
    const b = routeById.get(r.id);
    if (!b) return { id: r.id, title: r.title };
    return {
      id: r.id,
      title: b[2],
      description: b[3],
      price: Number(b[4]),
      rating: Number(b[5]),
      aiMatch: Number(b[6]),
      category: b[7],
      district: b[8],
      duration: b[9],
      stops: Number(b[10]),
    };
  });

  const pr = readFileSync(resolveDataPath('phuketPois.ts'), 'utf-8');

  const communityBlocks = [
    ...pr.matchAll(
      /communityNo: (\d+),[\s\S]*?name: '([^']+)',[\s\S]*?district: '([^']+)',[\s\S]*?hook: '([^']+)',[\s\S]*?highlight: '([^']+)'(?:[\s\S]*?activities: \[([^\]]*)\])?(?:[\s\S]*?food: \[([^\]]*)\])?(?:[\s\S]*?localLife: '([^']*)')?/g,
    ),
  ];

  const communities: CommunityKnowledge[] = communityBlocks.map((b) => ({
    no: Number(b[1]),
    name: b[2],
    district: b[3],
    hook: b[4],
    highlight: b[5],
    activities: parseStringArray(b[6]),
    food: parseStringArray(b[7]),
    localLife: b[8] || undefined,
  }));

  const landmarkBlocks = [
    ...pr.matchAll(
      /id: 'landmark-([^']+)',[\s\S]*?name: '([^']+)',[\s\S]*?district: '([^']+)',[\s\S]*?hook: '([^']+)',[\s\S]*?highlight: '([^']+)'/g,
    ),
  ];

  const landmarks: LandmarkKnowledge[] = landmarkBlocks.map((b) => ({
    id: b[1],
    name: b[2],
    district: b[3],
    hook: b[4],
    highlight: b[5],
  }));

  return { routes, communities, landmarks };
}
