export type ChatRole = 'traveler' | 'creator' | 'hotel' | 'marketplace';

export type ServerChatContext = {
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

function buildRoleSection(role: ChatRole, ctx?: ServerChatContext): string {
  const name = ctx?.userName ?? 'ผู้ใช้';

  if (role === 'creator') {
    const top = ctx?.topRouteIds?.map((id) => `[[route:${id}]]`).join(' ') ?? '';
    return `
=== บทบาทปัจจุบัน: ผู้สร้างเส้นทางชุมชน (Creator) ===
ผู้ใช้: ${name}${ctx?.subtitle ? ` — ${ctx.subtitle}` : ''}${ctx?.district ? ` (${ctx.district})` : ''}
เส้นทางในระบบ: ${ctx?.routeCount ?? '?'} เส้นทาง | รายได้เดือนนี้: ${ctx?.monthlyRevenue ?? '-'}
เส้นทางยอดนิยมของครีเอเตอร์: ${top}

หน้าที่เฉพาะสำหรับ Creator:
- แนะนำการออกแบบเส้นทางชุมชนที่ดึงดูดนักท่องเที่ยว (storytelling, จุดแวะ, อาหาร, กิจกรรม)
- แนะนำการตั้งราคาต่อคนที่เหมาะสม (ช่วง 3,500–8,500 บาทตามระยะเวลาและจำนวนจุดแวะ)
- เน้นเชื่อมกับ 15 ชุมชน ททท. ให้เกิดรายได้ชุมชนอย่างยั่งยืน
- แนะนำหมวดเส้นทางที่ตลาดต้องการ: มรดก อาหาร ครอบครัว ธรรมชาติ
- ชี้แนะใช้ Route Wizard ที่ /creator/routes/create
- เมื่อแนะนำเส้นทางตัวอย่าง ให้ใส่ marker [[route:ID]]`;
  }

  if (role === 'hotel') {
    const top = ctx?.topRouteIds?.map((id) => `[[route:${id}]]`).join(' ') ?? '';
    return `
=== บทบาทปัจจุบัน: โรงแรมพันธมิตร (Hotel) ===
โรงแรม: ${name}${ctx?.subtitle ? ` — ${ctx.subtitle}` : ''}${ctx?.district ? ` · ${ctx.district}` : ''}
เส้นทางในคลัง: ${ctx?.routesFollowed ?? '?'} | จองผ่านโรงแรมเดือนนี้: ${ctx?.bookingsThisMonth ?? '?'} รายการ
คอมมิชชันเดือนนี้: ${ctx?.monthlyCommission ?? '-'} | สแกน QR: ${ctx?.qrScans ?? '?'} ครั้ง
เส้นทางทำรายได้สูง: ${top}

หน้าที่เฉพาะสำหรับ Hotel:
- แนะนำเส้นทางที่มีโอกาสทำรายได้/คอมมิชชันสูงให้โรงแรม (AI Match สูง, ความต้องการแขก)
- แนะนำวิธีแนะนำแขกโรงแรมให้จองผ่าน QR/ลิงก์โรงแรม (คอมมิชชัน ~15%)
- จับคู่โปรไฟล์แขก (ครอบครัว, ต่างชาติ, คู่รัก) กับเส้นทางและชุมชนใกล้โรงแรม
- แนะนำเพิ่มเส้นทางในคลังโรงแรม (/hotel/library) และวาง QR ล็อบบี้
- เมื่อแนะนำเส้นทาง ให้ใส่ marker [[route:ID]] และอธิบายเหตุผลเชิงรายได้`;
  }

  if (role === 'traveler') {
    return `
=== บทบาทปัจจุบัน: นักท่องเที่ยว (Traveler) ===
ผู้ใช้: ${name}

หน้าที่เฉพาะสำหรับ Traveler:
- แนะนำเส้นทางและชุมชนที่เหมาะกับทริป งบประมาณ และความสนใจ
- ช่วยวางแผนทริป 1 วัน ครึ่งวัน หรือหลายวัน
- อธิบายวิธีจองและปรับจำนวนคนที่หน้าเส้นทาง`;
  }

  return `
=== บทบาทปัจจุบัน: ผู้เยี่ยมชมตลาดเส้นทาง (Marketplace) ===
หน้าที่: แนะนำเส้นทางชุมชนภูเก็ตและ 15 ชุมชน ททท. แก่นักท่องเที่ยวทั่วไป`;
}

export function buildRolePromptSection(role: ChatRole = 'marketplace', ctx?: ServerChatContext): string {
  return buildRoleSection(role, ctx);
}
