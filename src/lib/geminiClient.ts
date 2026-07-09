const DEFAULT_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
];

function getModels(): string[] {
  const preferred = import.meta.env.VITE_GEMINI_MODEL?.trim();
  const list = preferred ? [preferred, ...DEFAULT_MODELS] : [...DEFAULT_MODELS];
  return [...new Set(list)];
}

function buildGeminiRequest(apiKey: string, model: string) {
  // AIza... = standard key (query param ได้) | AQ.... = auth key (ต้องใช้ x-goog-api-key)
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-goog-api-key': apiKey,
  };
  return { url, headers };
}

type GeminiMessage = { role: 'user' | 'ai'; text: string };

export async function callGeminiChat(
  messages: GeminiMessage[],
  systemPrompt: string,
): Promise<{ text: string; model: string }> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('ยังไม่ได้ตั้งค่า VITE_GEMINI_API_KEY ใน .env');
  }

  const contents = messages
    .filter((m) => m.text.trim())
    .map((m) => ({
      role: m.role === 'user' ? ('user' as const) : ('model' as const),
      parts: [{ text: m.text.trim() }],
    }));

  let lastError: unknown;

  for (const model of getModels()) {
    try {
      const { url, headers } = buildGeminiRequest(apiKey, model);
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
        }),
      });

      const data = (await res.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
        error?: { message?: string };
      };

      if (!res.ok) {
        const msg = data.error?.message || `Gemini HTTP ${res.status}`;
        if (res.status === 401 || msg.includes('authentication')) {
          throw new Error(
            'API key ไม่ถูกต้อง — สร้าง key ใหม่จาก https://aistudio.google.com/apikey (รองรับทั้ง AIzaSy... และ AQ....)',
          );
        }
        if (res.status === 429 || msg.includes('quota')) {
          throw new Error(
            'โควต้า Gemini API หมด — รอสักครู่แล้วลองใหม่ หรือเปิด Billing ที่ Google Cloud Console',
          );
        }
        throw new Error(msg);
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (!text) throw new Error('Empty response from Gemini');

      return { text, model };
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

export function getChatMode(): 'auto' | 'mock' | 'gemini' {
  const mode = (import.meta.env.VITE_CHAT_MODE?.trim() || 'auto').toLowerCase();
  if (mode === 'mock' || mode === 'gemini') return mode;
  return 'auto';
}

export function isGeminiEnabled(): boolean {
  const mode = getChatMode();
  if (mode === 'mock') return false;
  return Boolean(import.meta.env.VITE_GEMINI_API_KEY?.trim());
}
