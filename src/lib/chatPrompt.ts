import { loadClientKnowledge } from './clientKnowledge';
import type { ChatRole, ChatSessionContext } from '../types/chat';

function buildRoleSection(role: ChatRole, ctx?: ChatSessionContext): string {
  const name = ctx?.userName ?? 'ผู้ใช้';

  if (role === 'creator') {
    const top = ctx?.topRouteIds?.map((id) => `[[route:${id}]]`).join(' ') ?? '';
    return `
=== บทบาทปัจจุบัน: ผู้สร้างเส้นทางชุมชน (Creator) ===
ผู้ใช้: ${name}${ctx?.subtitle ? ` — ${ctx.subtitle}` : ''}${ctx?.district ? ` (${ctx.district})` : ''}
เส้นทางในระบบ: ${ctx?.routeCount ?? '?'} เส้นทาง | รายได้เดือนนี้: ${ctx?.monthlyRevenue ?? '-'}
เส้นทางยอดนิยมของครีเอเตอร์: ${top}`;
  }

  if (role === 'hotel') {
    const top = ctx?.topRouteIds?.map((id) => `[[route:${id}]]`).join(' ') ?? '';
    return `
=== บทบาทปัจจุบัน: โรงแรมพันธมิตร (Hotel) ===
โรงแรม: ${name}${ctx?.subtitle ? ` — ${ctx.subtitle}` : ''}${ctx?.district ? ` · ${ctx.district}` : ''}
เส้นทางในคลัง: ${ctx?.routesFollowed ?? '?'} | จองผ่านโรงแรมเดือนนี้: ${ctx?.bookingsThisMonth ?? '?'} รายการ
คอมมิชชันเดือนนี้: ${ctx?.monthlyCommission ?? '-'} | สแกน QR: ${ctx?.qrScans ?? '?'} ครั้ง
เส้นทางทำรายได้สูง: ${top}`;
  }

  if (role === 'traveler') {
    return `
=== บทบาทปัจจุบัน: นักท่องเที่ยว (Traveler) ===
ผู้ใช้: ${name}`;
  }

  return `
=== บทบาทปัจจุบัน: ผู้เยี่ยมชมตลาดเส้นทาง (Marketplace) ===`;
}

const CATEGORY_LABEL: Record<string, string> = {
  heritage: 'มรดก',
  food: 'อาหารท้องถิ่น',
  community: 'ชุมชน',
  nature: 'ธรรมชาติ',
  family: 'ครอบครัว',
};

export function buildRouteWanderSystemPrompt(
  role: ChatRole = 'marketplace',
  ctx?: ChatSessionContext,
): string {
  const { routes, communities, landmarks } = loadClientKnowledge();

  const routeLines = routes
    .map((r) => {
      const cat = r.category ? CATEGORY_LABEL[r.category] ?? r.category : '';
      return `- [[route:${r.id}]] ${r.title} | ${cat} | ${r.district} | ${r.duration} | ${r.stops} จุด | AI Match ${r.aiMatch}% | ${r.description.slice(0, 80)}`;
    })
    .join('\n');

  const communityLines = communities
    .map((c) => {
      const acts = c.activities.slice(0, 3).join(', ');
      const foods = c.food.slice(0, 3).join(', ');
      return `- [[community:${c.no}]] ${c.name} (${c.district})
  จุดเด่น: ${c.hook}
  ไฮไลท์: ${c.highlight}
  กิจกรรม: ${acts || '-'}
  อาหาร: ${foods || '-'}`;
    })
    .join('\n\n');

  const landmarkLines = landmarks
    .map((l) => `- [[landmark:${l.id}]] ${l.name} (${l.district}) — ${l.hook}`)
    .join('\n');

  return `คุณคือ RouteWander AI — ผู้เชี่ยวชาญเส้นทางท่องเที่ยวชุมชนภูเก็ต
ตอบภาษาไทย กระชับ อบอุ่น เมื่อแนะนำเส้นทาง/ชุมชน/แลนด์มาร์ก ให้แนบ marker:
• เส้นทาง [[route:ID]] • ชุมชน [[community:เลข]] • แลนด์มาร์ก [[landmark:slug]]
ใส่ marker ไม่เกิน 4 อันต่อคำตอบ

=== เส้นทาง (${routes.length} เส้นทาง) ===
${routeLines}

=== 15 ชุมชน ททท. ===
${communityLines}

=== แลนด์มาร์ก ===
${landmarkLines}

${buildRoleSection(role, ctx)}`;
}
