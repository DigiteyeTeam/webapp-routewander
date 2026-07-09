import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

type AiKnowledge = {
  routes: { id: string; title: string; category?: string; district?: string; duration?: string; stops?: number; aiMatch?: number; creator?: string }[];
  communities: { no: number; name: string; district?: string; hook?: string }[];
};

function loadKnowledge(): AiKnowledge {
  const raw = readFileSync(path.join(__dirname, '../src/data/aiKnowledge.json'), 'utf-8');
  return JSON.parse(raw) as AiKnowledge;
}

/** รวมข้อมูลเพิ่มจาก marketplaceRoutes สำหรับ prompt (อ่านจาก JSON ไม่ import รูป) */
export function enrichKnowledgeFromSource(): AiKnowledge {
  const base = loadKnowledge();
  const mr = readFileSync(path.join(__dirname, '../src/data/marketplaceRoutes.ts'), 'utf-8');
  const blocks = [...mr.matchAll(/id: '(\d+)',[\s\S]*?creator: creator\(\d+\),[\s\S]*?price: \d+,[\s\S]*?rating: ([\d.]+),[\s\S]*?aiMatch: (\d+),[\s\S]*?category: '(\w+)',[\s\S]*?district: '([^']+)',[\s\S]*?duration: '([^']+)',[\s\S]*?stops: (\d+)/g)];
  const byId = new Map(blocks.map((b) => [b[1], b]));
  const routes = base.routes.map((r) => {
    const b = byId.get(r.id);
    if (!b) return r;
    return {
      ...r,
      category: b[4],
      district: b[5],
      duration: b[6],
      stops: Number(b[7]),
      aiMatch: Number(b[3]),
    };
  });
  const pr = readFileSync(path.join(__dirname, '../src/data/phuketPois.ts'), 'utf-8');
  const hooks = [...pr.matchAll(/communityNo: (\d+),[\s\S]*?district: '([^']+)',[\s\S]*?hook: '([^']+)'/g)];
  const hookByNo = new Map(hooks.map((h) => [Number(h[1]), { district: h[2], hook: h[3] }]));
  const communities = base.communities.map((c) => {
    const h = hookByNo.get(c.no);
    return h ? { ...c, district: h.district, hook: h.hook } : c;
  });
  return { routes, communities };
}

export function buildRouteWanderSystemPrompt(): string {
  const { routes, communities } = enrichKnowledgeFromSource();
  const routeLines = routes
    .map((r) =>
      `- [id:${r.id}] ${r.title}${r.district ? ` (${r.district}` : ''}${r.duration ? `, ${r.duration}` : ''}${r.stops ? `, ${r.stops} จุด` : ''}${r.aiMatch ? `, AI ${r.aiMatch}%` : ''}${r.district ? ')' : ''}`,
    )
    .join('\n');
  const communityLines = communities
    .map((c) => `- ชุมชนที่ ${c.no}: ${c.name}${c.district ? ` (${c.district})` : ''}${c.hook ? ` — ${c.hook}` : ''}`)
    .join('\n');

  return `คุณคือ RouteWander AI ผู้ช่วยแนะนำเส้นทางท่องเที่ยวชุมชนภูเก็ต ประเทศไทย
ตอบเป็นภาษาไทย กระชับ เป็นมิตร ใช้ข้อมูลด้านล่างเป็นหลัก ห้ามแต่งข้อมูลที่ไม่มีในระบบ

บทบาท:
- แนะนำเส้นทางจากตลาด RouteWander ให้โรงแรม ไกด์ และนักท่องเที่ยว
- จับคู่ความสนใจ (ครอบครัว อาหาร มรดก ธรรมชาติ) กับเส้นทางที่เหมาะ
- อธิบายชุมชนท้องถิ่น 15 แห่งบนแผนที่
- เมื่อแนะนำเส้นทาง ให้ระบุชื่อเส้นทางและเหตุผลสั้นๆ

เส้นทางในตลาด (${routes.length} เส้นทาง):
${routeLines}

ชุมชนบนแผนที่ (${communities.length} ชุมชน):
${communityLines}

หมายเหตุ: ไลเซนส์มีแบบรายสัปดาห์ รายเดือน และรายปี ผู้ใช้ดูรายละเอียดและซื้อได้ที่หน้าเส้นทาง`;
}
