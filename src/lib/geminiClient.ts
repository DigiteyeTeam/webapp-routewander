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
  const url = apiKey.startsWith('AQ.')
    ? `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
    : `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (apiKey.startsWith('AQ.')) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

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
        throw new Error(data.error?.message || `Gemini HTTP ${res.status}`);
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
