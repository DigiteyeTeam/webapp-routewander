import { CATEGORY_META, MARKETPLACE_ROUTES } from '../data/marketplaceRoutes';
import { COMMUNITY_POIS, LANDMARK_POIS } from '../data/phuketPois';
import type { ChatCard, ChatCardRef } from '../types/chat';

export function resolveChatCards(refs: ChatCardRef[]): ChatCard[] {
  const cards: ChatCard[] = [];

  for (const ref of refs) {
    if (ref.type === 'route') {
      const route = MARKETPLACE_ROUTES.find((r) => r.id === ref.id);
      if (!route) continue;
      const meta = CATEGORY_META[route.category];
      cards.push({
        type: 'route',
        id: route.id,
        title: route.title,
        image: route.image,
        district: route.district,
        duration: route.duration,
        stops: route.stops,
        aiMatch: route.aiMatch,
        categoryLabel: meta.label,
        categoryColor: meta.color,
        categoryBg: meta.bg,
        price: route.price,
      });
    } else if (ref.type === 'community') {
      const c = COMMUNITY_POIS.find((p) => p.communityNo === ref.no);
      if (!c) continue;
      cards.push({
        type: 'community',
        no: ref.no,
        name: c.name,
        image: c.imageUrl ?? '',
        district: c.district,
        hook: c.hook,
        highlight: c.highlight,
        activities: c.activities ?? [],
        food: c.food ?? [],
      });
    } else if (ref.type === 'landmark') {
      const l = LANDMARK_POIS.find((p) => p.id === `landmark-${ref.id}` || p.id.endsWith(ref.id));
      if (!l) continue;
      cards.push({
        type: 'landmark',
        id: ref.id,
        name: l.name,
        district: l.district,
        hook: l.hook,
        highlight: l.highlight,
      });
    }
  }

  return cards;
}
