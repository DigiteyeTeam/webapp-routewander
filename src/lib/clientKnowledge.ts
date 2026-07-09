import { MARKETPLACE_ROUTES } from '../data/marketplaceRoutes';
import { COMMUNITY_POIS, LANDMARK_POIS } from '../data/phuketPois';

export function loadClientKnowledge() {
  const routes = MARKETPLACE_ROUTES.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    category: r.category,
    district: r.district,
    duration: r.duration,
    stops: r.stops,
    aiMatch: r.aiMatch,
    rating: r.rating,
    price: r.price,
  }));

  const communities = COMMUNITY_POIS.filter((p) => p.communityNo).map((c) => ({
    no: c.communityNo!,
    name: c.name,
    district: c.district,
    hook: c.hook,
    highlight: c.highlight,
    activities: c.activities ?? [],
    food: c.food ?? [],
    localLife: c.localLife,
  }));

  const landmarks = LANDMARK_POIS.map((l) => ({
    id: l.id.replace(/^landmark-/, ''),
    name: l.name,
    district: l.district,
    hook: l.hook,
    highlight: l.highlight,
  }));

  return { routes, communities, landmarks };
}
