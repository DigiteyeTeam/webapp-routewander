import { loadClientKnowledge } from './clientKnowledge';
import type { ChatRole, ChatSessionContext } from '../types/chat';

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

function scoreRoute(
  r: ReturnType<typeof loadClientKnowledge>['routes'][number],
  q: string,
) {
  let score = 0;
  const title = r.title.toLowerCase();
  const district = r.district.toLowerCase();
  const desc = r.description.toLowerCase();

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
  ctx?: ChatSessionContext,
): Promise<string> {
  await new Promise((r) => setTimeout(r, 300 + Math.random() * 200));

  const { routes, communities, landmarks } = loadClientKnowledge();
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.text?.trim() ?? '';
  const q = normalize(lastUser);

  if (role === 'creator') {
    if (PRICE.test(q) || /ตั้งราคา|ราคาเท่าไหร่|กี่บาท/.test(q)) {
      return `สำหรับครีเอเตอร์อย่าง${ctx?.userName ?? 'คุณ'} แนะนำช่วงราคาต่อคน:
• ครึ่งวัน 3–5 จุด: 3,500–5,500 บาท
• เต็มวัน 5–7 จุด: 5,500–8,500 บาท

ดูตัวอย่างเส้นทางขายดี [[route:1]] (AI Match 98%)`;
    }
    if (ROUTE_ASK.test(q) || /สร้าง|ออกแบบ|ดึงดูด/.test(q)) {
      const top = [...routes].sort((a, b) => b.aiMatch - a.aiMatch).slice(0, 3);
      return `เส้นทางที่ดึงดูดนักท่องเที่ยว:\n${top.map((r) => `• ${r.title} — ${r.district} [[route:${r.id}]]`).join('\n')}`;
    }
  }

  if (role === 'hotel') {
    if (PRICE.test(q) || /รายได้|คอมมิชชัน|commission|ทำเงิน/.test(q)) {
      const topIds = ctx?.topRouteIds ?? ['1', '3', '8'];
      return `โรงแรม${ctx?.userName ?? ''} คอมมิชชันเดือนนี้ ${ctx?.monthlyCommission ?? '-'}
${topIds.map((id) => {
  const r = routes.find((x) => x.id === id);
  return r ? `• ${r.title} [[route:${id}]]` : '';
}).filter(Boolean).join('\n')}`;
    }
    if (FAMILY.test(q) || ROUTE_ASK.test(q) || /แขก|ลูกค้า|แนะนำ/.test(q)) {
      return `แนะนำแขกโรงแรม:
ครอบครัว → [[route:3]] [[community:12]]
นักท่องเที่ยวต่างชาติ → [[route:1]] [[community:4]]
คู่รัก → [[landmark:promthep]] [[route:5]]`;
    }
  }

  if (!lastUser) {
    return 'พิมพ์คำถามเกี่ยวกับเส้นทางหรือชุมชนภูเก็ตได้เลยครับ';
  }

  if (GREETINGS.test(q)) {
    return `สวัสดีครับ! ผม RouteWander AI 🌴
รู้จัก 15 ชุมชน ททท. และเส้นทาง ${routes.length} เส้นทาง

ลองถามได้ เช่น "แนะนำเส้นทางครอบครัว" หรือ [[community:4]]`;
  }

  if (HOW_MANY.test(q) && !ROUTE_ASK.test(q)) {
    return `RouteWander มีเส้นทาง ${routes.length} เส้นทาง และชุมชน ${communities.length} แห่ง
ไฮไลท์: [[community:1]] [[community:4]] [[community:11]]`;
  }

  if (PRICE.test(q)) {
    return 'ราคาเส้นทางคิดต่อคน ปรับจำนวนผู้เข้าร่วมได้ที่หน้ารายละเอียด [[route:20]]';
  }

  for (const c of communities) {
    const shortName = c.name.replace(/^ชุมชน/, '').trim();
    if (
      q.includes(shortName.toLowerCase()) ||
      q.includes(`ชุมชนที่ ${c.no}`) ||
      q.includes(`ชุมชน ${c.no}`)
    ) {
      const related = routes
        .filter((r) => r.title.includes(shortName) || r.district.includes(c.district.split(',')[0]))
        .slice(0, 2);
      let reply = `${c.name} (${c.district})\n\n${c.hook}\n\nไฮไลท์: ${c.highlight}\n\n[[community:${c.no}]]`;
      if (related[0]) reply += `\n\nเส้นทางแนะนำ: ${related[0].title} [[route:${related[0].id}]]`;
      return reply;
    }
  }

  for (const l of landmarks) {
    if (q.includes(l.name.toLowerCase()) || q.includes(l.id.replace(/-/g, ' '))) {
      return `${l.name} (${l.district})\n\n${l.hook}\n\n${l.highlight}\n\n[[landmark:${l.id}]]`;
    }
  }

  if (COMMUNITY_ASK.test(q)) {
    const picks = [communities[3], communities[0], communities[10]].filter(Boolean);
    return picks.map((c) => `• ${c.name}: ${c.hook.slice(0, 60)}… [[community:${c.no}]]`).join('\n');
  }

  if (ROUTE_ASK.test(q) || FOOD.test(q) || FAMILY.test(q) || BEACH.test(q) || HERITAGE.test(q) || NATURE.test(q)) {
    const scored = routes
      .map((r) => ({ r, score: scoreRoute(r, q) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    if (scored.length) {
      return scored.map(({ r }) => `• ${r.title} — ${r.district} [[route:${r.id}]]`).join('\n');
    }

    const top = [...routes].sort((a, b) => b.aiMatch - a.aiMatch).slice(0, 3);
    return `เส้นทางยอดนิยม:\n${top.map((r) => `• ${r.title} (AI Match ${r.aiMatch}%) [[route:${r.id}]]`).join('\n')}`;
  }

  return `ผมช่วยเรื่องเส้นทางชุมชนภูเก็ตได้ครับ 🗺️
ลองถามเจาะจงขึ้น เช่น อาหาร ทะเล มรดก หรือครอบครัว [[route:20]] [[community:4]]`;
}
