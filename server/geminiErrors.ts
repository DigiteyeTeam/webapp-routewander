const DEFAULT_MODELS = [
  'gemini-2.0-flash-lite',
  'gemini-1.5-flash',
  'gemini-2.0-flash',
] as const;

export function getGeminiModels(): string[] {
  const preferred = process.env.GEMINI_MODEL?.trim();
  const list = preferred ? [preferred, ...DEFAULT_MODELS] : [...DEFAULT_MODELS];
  return [...new Set(list)];
}

export function validateApiKeyFormat(apiKey: string | undefined): string | null {
  if (!apiKey?.trim()) {
    return 'ยังไม่ได้ตั้งค่า GEMINI_API_KEY ในไฟล์ .env';
  }
  if (!apiKey.startsWith('AIza')) {
    return 'API key รูปแบบไม่ถูกต้อง — ต้องใช้ key จาก Google AI Studio (ขึ้นต้น AIzaSy...) ที่ https://aistudio.google.com/apikey';
  }
  return null;
}

export function toUserFacingGeminiError(raw: unknown): string {
  const message = raw instanceof Error ? raw.message : String(raw);

  let code: number | undefined;
  let apiMessage = message;

  try {
    const outer = JSON.parse(message) as { error?: { code?: number; message?: string } };
    if (outer.error?.message) {
      code = outer.error.code;
      apiMessage = outer.error.message;
    }
  } catch {
    const nested = message.match(/\{"error":\{[^}]+\}/);
    if (nested) {
      try {
        const parsed = JSON.parse(nested[0] + '}}') as { error?: { code?: number; message?: string } };
        code = parsed.error?.code;
        apiMessage = parsed.error?.message ?? message;
      } catch {
        /* keep original */
      }
    }
  }

  if (code === 429 || apiMessage.includes('RESOURCE_EXHAUSTED') || apiMessage.includes('quota')) {
    return 'โควต้า Gemini API หมดหรือ key นี้ไม่มีสิทธิ์ free tier — สร้าง API key ใหม่ที่ Google AI Studio (ขึ้นต้น AIzaSy...) แล้วใส่ใน .env จากนั้นรัน npm run dev ใหม่';
  }

  if (code === 400 || apiMessage.toLowerCase().includes('api key not valid')) {
    return 'API key ไม่ถูกต้อง — คัดลอก key ใหม่จาก https://aistudio.google.com/apikey (ต้องขึ้นต้น AIzaSy...)';
  }

  if (apiMessage.includes('fetch failed') || apiMessage.includes('ECONNREFUSED')) {
    return 'เชื่อมต่อ API ไม่ได้ — รันคำสั่ง npm run dev (ต้องมีทั้งเว็บและ API server)';
  }

  return `ระบบ AI ขัดข้องชั่วคราว: ${apiMessage.slice(0, 200)}`;
}
