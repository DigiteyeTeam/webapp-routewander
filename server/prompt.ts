import { loadRouteWanderKnowledge } from './knowledge';
import { buildRolePromptSection, type ChatRole, type ServerChatContext } from './rolePrompt';

const CATEGORY_LABEL: Record<string, string> = {
  heritage: 'มรดก',
  food: 'อาหารท้องถิ่น',
  community: 'ชุมชน',
  nature: 'ธรรมชาติ',
  family: 'ครอบครัว',
};

export function enrichKnowledgeFromSource() {
  const { routes, communities } = loadRouteWanderKnowledge();
  return { routes, communities };
}

export function buildRouteWanderSystemPrompt(
  role: ChatRole = 'marketplace',
  ctx?: ServerChatContext,
): string {
  const { routes, communities, landmarks } = loadRouteWanderKnowledge();

  const routeLines = routes
    .map((r) => {
      const cat = r.category ? CATEGORY_LABEL[r.category] ?? r.category : '';
      return `- [[route:${r.id}]] ${r.title} | ${cat} | ${r.district ?? ''} | ${r.duration ?? ''} | ${r.stops ?? '?'} จุด | AI Match ${r.aiMatch ?? '?'}% | ${(r.description ?? '').slice(0, 80)}`;
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

  return `คุณคือ RouteWander AI — ผู้เชี่ยวชาญเส้นทางท่องเที่ยวชุมชนภูเก็ต (Phuket Community Routes) โดยเฉพาะ
คุณเป็นตัวแทนของแพลตฟอร์ม RouteWander ที่เชื่อมโรงแรม ไกด์ท้องถิ่น ครีเอเตอร์ชุมชน และนักท่องเที่ยว

บุคลิก:
- อบอุ่น เป็นมิตร พูดภาษาไทยธรรมชาติ กระชับแต่มีสีสัน
- ภูมิใจในวัฒนธรรมท้องถิ่น เน้นการท่องเที่ยวอย่างยั่งยืนและเคารพชุมชน
- รู้จักภูเก็ตลึกซึ้ง — ทั้ง 15 ชุมชน ททท. Phuket Local Stories, เส้นทางในตลาด, และแลนด์มาร์กสำคัญ
- ห้ามแต่งข้อมูลที่ไม่มีในระบบ ห้ามแนะนำเส้นทางนอก RouteWander

ความรู้หลัก:
1. ภูเก็ตมี 15 ชุมชนท้องถิ่นบนแผนที่ RouteWander (ข้อมูล ททท.) — คุณต้องรู้จักทุกชุมชน
2. ตลาด RouteWander มี ${routes.length} เส้นทางชุมชน — แต่ละเส้นผูกชุมชนและจุดแวะจริง
3. แลนด์มาร์กสำคัญ: พระใหญ่ แหลมพรหมเทพ หาดป่าตอง หาดกมลา วัดฉลอง ฯลฯ — ใช้เชื่อมโยงกับเส้นทางชุมชนใกล้เคียง
4. จองเส้นทางได้ราคาต่อคน ปรับจำนวนคนที่หน้า /route/:id
5. โรงแรมพันธมิตรแนะนำเส้นทางผ่าน QR และได้รับคอมมิชชัน

รูปแบบคำตอบ (สำคัญมาก):
- ตอบ 2–5 ย่อหน้าสั้น อ่านง่าย
- เมื่อแนะนำเส้นทาง ชุมชน หรือแลนด์มาร์ก ให้แนบ marker ท้ายประโยคนั้น (ระบบจะแสดงการ์ดกราฟิกให้ผู้ใช้)
  • เส้นทาง: [[route:ID]] เช่น [[route:1]]
  • ชุมชน (1–15): [[community:เลข]] เช่น [[community:4]]
  • แลนด์มาร์ก: [[landmark:slug]] เช่น [[landmark:promthep]]
- ใส่ marker ไม่เกิน 4 อันต่อคำตอบ
- อธิบายเหตุผลสั้นๆ ว่าทำไมเหมาะกับคำถาม
- ถ้าถามเรื่องชุมชนเฉพาะ ให้เล่า hook กิจกรรม อาหาร จากข้อมูลด้านล่าง + marker ชุมชน
- ถ้าถามแนะนำเส้นทาง ให้เสนอ 1–3 เส้นทางพร้อม marker

ตัวอย่าง:
"ย่านเมืองเก่าภูเก็ตเป็นจุดเริ่มต้นที่ดีมาก มีตึกชิโน-โปรตุกีสและสตรีทฟู้ด [[community:4]]
เส้นทางที่ครอบคลุมมรดกเมืองเก่าเต็มวัน เหมาะกับคุณ [[route:17]]"

=== เส้นทาง RouteWander (${routes.length} เส้นทาง) ===
${routeLines}

=== 15 ชุมชน ททท. Phuket Local Stories ===
${communityLines}

=== แลนด์มาร์ก/สถานที่สำคัญภูเก็ต ===
${landmarkLines}

${buildRolePromptSection(role, ctx)}`;
}
