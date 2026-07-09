import { loadRouteWanderKnowledge } from './knowledge';
import type { ChatRole, ServerChatContext } from './rolePrompt';

type ChatMsg = { role: string; text: string };

const GREETINGS = /^(สวัสดี|หวัดดี|hello|hi|hey|ดีครับ|ดีค่ะ)/;
const ROUTE_ASK = /แนะนำ|เส้นทาง|ไปไหน|ทริป|route|ที่เที่ยว|สักที่|อยากไป/;
const COMMUNITY_ASK = /ชุมชน|community|ท้องถิ่น/;
const FOOD = /อาหาร|กิน|ร้าน|halal|ฮาลาล|สาคู|ล็อบสเตอร์|ซีฟู้ด|ของกิน/;
const FAMILY = /ครอบครัว|เด็ก|family|พาเด็ก|ลูก/;
const BEACH = /ทะเล|หาด|ชายหาด|เกาะ|ทริปทะเล/;
const HERITAGE = /มรดก|วัฒนธรรม|ถลาง|โนรา|หนังตะลุง|เมืองเก่า|ประวัติ/;
const NATURE = /ธรรมชาติ|ป่าชายเลน|ออร์แกนิก|ฟาร์ม|ชายเลน|สิ่งแวดล้อม/;
const PRICE = /ราคา|จอง|กี่บาท|ต่อคน|ค่าใช้จ่าย/;
const HOW_MANY = /กี่เส้นทาง|มีกี่|ทั้งหมด|กี่ชุมชน|มีอะไรบ้าง/;

function normalize(text: string) {
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

function scoreRoute(r: ReturnType<typeof loadRouteWanderKnowledge>['routes'][number], q: string) {
  let score = 0;
  const title = r.title.toLowerCase();
  const district = (r.district ?? '').toLowerCase();
  const desc = (r.description ?? '').toLowerCase();

  for (const word of q.split(/\s+/).filter((w) => w.length > 1)) {
    if (title.includes(word)) score += 3;
    if (district.includes(word)) score += 2;
    if (desc.includes(word)) score += 1;
  }

  if (FOOD.test(q) && /อาหาร|สาคู|ล็อบสเตอร์|ฮาลาล|ซีฟู้ด|ทะเลชาวบ้าน|คราฟต์|รส/.test(title + desc)) score += 4;
  if (FAMILY.test(q) && /ครบ|ไฮไลท์|เมืองเก่า|ครอบครัว/.test(title + desc)) score += 3;
  if (BEACH.test(q) && /ทะเล|หาด|เกาะ|ชายหาด|ปลายแหลม|ลิพอน/.test(title + desc)) score += 4;
  if (HERITAGE.test(q) && /มรดก|ถลาง|โนรา|เมืองเก่า|ศิลปะ|วัฒนธรรม|ฮาลาล/.test(title + desc)) score += 4;
  if (NATURE.test(q) && /ป่า|ออร์แกนิก|ฟาร์ม|ชายเลน|ตลาดทะเล/.test(title + desc)) score += 4;

  return score;
}

export async function generateMockChatReply(
  messages: ChatMsg[],
  role: ChatRole = 'marketplace',
  ctx?: ServerChatContext,
): Promise<string> {
  await new Promise((r) => setTimeout(r, 400 + Math.random() * 300));

  const { routes, communities, landmarks } = loadRouteWanderKnowledge();
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.text?.trim() ?? '';
  const q = normalize(lastUser);

  if (role === 'creator') {
    if (PRICE.test(q) || /ตั้งราคา|ราคาเท่าไหร่|กี่บาท/.test(q)) {
      return `สำหรับครีเอเตอร์อย่าง${ctx?.userName ?? 'คุณ'} แนะนำช่วงราคาต่อคน:
• ครึ่งวัน 3–5 จุด: 3,500–5,500 บาท
• เต็มวัน 5–7 จุด: 5,500–8,500 บาท
• เส้นทางพรีเมียม/เกาะ: 7,500+ บาท

ดูตัวอย่างเส้นทางขายดี [[route:1]] (AI Match 98%) — เน้นมรดกเมืองเก่า + อาหารท้องถิ่น
สร้างเส้นทางใหม่ได้ที่ Route Wizard ในแดชบอร์ดครับ`;
    }
    if (ROUTE_ASK.test(q) || /สร้าง|ออกแบบ|ดึงดูด/.test(q)) {
      const top = routes.sort((a, b) => (b.aiMatch ?? 0) - (a.aiMatch ?? 0)).slice(0, 3);
      return `เส้นทางที่ดึงดูดนักท่องเที่ยวมักมี:
✓ Storytelling ชุมชนจริง (ผูก 15 ชุมชน ททท.)
✓ อาหารท้องถิ่น + กิจกรรมลงมือทำ
✓ 4–7 จุดแวะ ไม่เร่งรีบ

ตัวอย่างที่ขายดี:
${top.map((r) => `• ${r.title} — ${r.district} [[route:${r.id}]]`).join('\n')}

ลองผูกชุมชน [[community:4]] หรือ [[community:8]] กับเรื่องราวท้องถิ่นครับ`;
    }
  }

  if (role === 'hotel') {
    if (PRICE.test(q) || /รายได้|คอมมิชชัน|commission|ทำเงิน/.test(q)) {
      const topIds = ctx?.topRouteIds ?? ['1', '3', '8'];
      return `โรงแรม${ctx?.userName ?? ''} คอมมิชชันเดือนนี้ ${ctx?.monthlyCommission ?? '-'} จาก ${ctx?.bookingsThisMonth ?? 0} การจอง

เส้นทางทำรายได้สูง:
${topIds.map((id) => {
  const r = routes.find((x) => x.id === id);
  return r ? `• ${r.title} — AI Match ${r.aiMatch}% [[route:${id}]]` : '';
}).filter(Boolean).join('\n')}

แนะนำวาง QR ล็อบบี้และแนะนำแขกตอนเช็คอิน คอมมิชชัน ~15% ต่อการจองครับ`;
    }
    if (FAMILY.test(q) || ROUTE_ASK.test(q) || /แขก|ลูกค้า|แนะนำ/.test(q)) {
      return `แนะนำแขกโรงแรม${ctx?.district ? ` (${ctx.district})` : ''}:

ครอบครัว → เส้นทางสั้นมีอาหาร [[route:3]] + ชุมชนบางโรง [[community:12]]
นักท่องเที่ยวต่างชาติ → มรดกเมืองเก่า [[route:1]] [[community:4]]
คู่รัก → ปลายแหลมพรหมเทพ [[landmark:promthep]] + [[route:5]]

ให้แขกสแกน QR โรงแรมเพื่อจอง — โรงแรมได้คอมมิชชันเต็มจำนวนครับ`;
    }
  }

  if (!lastUser) {
    return 'พิมพ์คำถามเกี่ยวกับเส้นทางหรือชุมชนภูเก็ตได้เลยครับ — ผมจะแนะนำพร้อมการ์ดสวยๆ ให้ดูครับ';
  }

  if (GREETINGS.test(q)) {
    return `สวัสดีครับ! ผม RouteWander AI ผู้เชี่ยวชาญเส้นทางชุมชนภูเก็ต 🌴

รู้จัก 15 ชุมชน ททท. Phuket Local Stories และเส้นทางในตลาด ${routes.length} เส้นทางเป็นอย่างดี

ลองถามได้เลย เช่น
• แนะนำเส้นทางครอบครัว
• ชุมชนเมืองเก่ามีอะไรบ้าง [[community:4]]
• อยากกินอาหารท้องถิ่น [[route:3]]`;
  }

  if (HOW_MANY.test(q) && !ROUTE_ASK.test(q)) {
    return `RouteWander มีเส้นทางชุมชนภูเก็ต ${routes.length} เส้นทาง และชุมชนบนแผนที่ ${communities.length} แห่ง (ข้อมูล ททท.)

ไฮไลท์ชุมชน:
• ท่าฉัตรไชย์ — วิถีชาวประมงเหนือ [[community:1]]
• เมืองเก่าภูเก็ต — มรดกโลก [[community:4]]
• เกาะมะพร้าว — ล็อบสเตอร์และวิถีชาวเกาะ [[community:11]]`;
  }

  if (PRICE.test(q)) {
    return 'ราคาเส้นทางคิดต่อคน ปรับจำนวนผู้เข้าร่วมได้ที่หน้ารายละเอียดเส้นทางครับ โรงแรมพันธมิตรยังได้รับคอมมิชชันเมื่อแขกจองผ่าน QR [[route:20]]';
  }

  for (const c of communities) {
    const shortName = c.name.replace(/^ชุมชน/, '').trim();
    if (
      q.includes(shortName.toLowerCase()) ||
      q.includes(`ชุมชนที่ ${c.no}`) ||
      q.includes(`ชุมชน ${c.no}`)
    ) {
      const related = routes
        .filter((r) => r.title.includes(shortName) || (r.district && r.district.includes(c.district.split(',')[0])))
        .slice(0, 2);
      const acts = c.activities.slice(0, 2).join(' · ');
      const foods = c.food.slice(0, 2).join(' · ');
      let reply = `${c.name} (${c.district})\n\n${c.hook}\n\nไฮไลท์: ${c.highlight}`;
      if (acts) reply += `\nกิจกรรม: ${acts}`;
      if (foods) reply += `\nอาหารท้องถิ่น: ${foods}`;
      reply += `\n\n[[community:${c.no}]]`;
      if (related[0]) reply += `\n\nเส้นทางแนะนำ: ${related[0].title} [[route:${related[0].id}]]`;
      return reply;
    }
  }

  for (const l of landmarks) {
    const slug = l.name.toLowerCase();
    if (q.includes(slug) || q.includes(l.id.replace(/-/g, ' '))) {
      return `${l.name} (${l.district})\n\n${l.hook}\n\n${l.highlight}\n\n[[landmark:${l.id}]]\n\nแนะนำจับคู่กับเส้นทางชุมชนใกล้เคียงบน RouteWander เพื่อสัมผัสวิถีท้องถิ่นแท้ๆ ครับ`;
    }
  }

  if (COMMUNITY_ASK.test(q)) {
    const picks = [communities[3], communities[0], communities[10]].filter(Boolean);
    return `15 ชุมชน ททท. บนแผนที่ RouteWander — แต่ละแห่งมีเอกลักษณ์ไม่ซ้ำกัน:

${picks.map((c) => `• ${c.name}: ${c.hook.slice(0, 60)}… [[community:${c.no}]]`).join('\n')}

ถามชื่อชุมชนเฉพาะได้เลยครับ ผมเล่ารายละเอียดกิจกรรมและอาหารให้`;
  }

  if (ROUTE_ASK.test(q) || FOOD.test(q) || FAMILY.test(q) || BEACH.test(q) || HERITAGE.test(q) || NATURE.test(q)) {
    const scored = routes
      .map((r) => ({ r, score: scoreRoute(r, q) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    if (scored.length) {
      const intro = FOOD.test(q)
        ? 'เส้นทางเน้นรสชาติท้องถิ่นภูเก็ต:'
        : FAMILY.test(q)
          ? 'เหมาะกับครอบครัวและเด็ก:'
          : BEACH.test(q)
            ? 'เส้นทางชายทะเลและเกาะ:'
            : HERITAGE.test(q)
              ? 'เน้นมรดกและวัฒนธรรมถลาง:'
              : NATURE.test(q)
                ? 'เน้นธรรมชาติและชุมชน:'
                : 'แนะนำเส้นทางเหล่านี้ครับ:';

      return `${intro}\n\n${scored.map(({ r }) => `• ${r.title} — ${r.district}, ${r.duration} [[route:${r.id}]]`).join('\n')}`;
    }

    const top = [...routes].sort((a, b) => (b.aiMatch ?? 0) - (a.aiMatch ?? 0)).slice(0, 3);
    return `เส้นทางยอดนิยมบน RouteWander:\n\n${top.map((r) => `• ${r.title} (AI Match ${r.aiMatch}%) [[route:${r.id}]]`).join('\n')}\n\nบอกความสนใจเพิ่มได้ เช่น อาหาร ทะเล มรดก หรือครอบครัว`;
  }

  return `ผมช่วยเรื่องเส้นทางชุมชนภูเก็ตได้ครับ 🗺️

• แนะนำเส้นทางตามความสนใจ [[route:20]]
• ข้อมูล 15 ชุมชน ททท. เช่น [[community:4]] [[community:11]]
• แลนด์มาร์กสำคัญ เช่น [[landmark:promthep]]

ลองถามให้เจาะจงขึ้นได้เลยครับ`;
}
