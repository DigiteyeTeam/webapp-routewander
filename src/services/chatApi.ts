import { resolveChatCards } from '../lib/chatCards';
import type { ChatMessage, ChatRole, ChatSessionContext } from '../types/chat';

export type ChatApiMessage = {
  role: 'user' | 'ai';
  text: string;
};

export type ChatApiResponse = {
  text: string;
  cards?: Array<{ type: string; id?: string; no?: number }>;
  model?: string;
  mode?: 'mock' | 'gemini';
  fallback?: boolean;
  notice?: string;
};

export type ChatRequestOptions = {
  role?: ChatRole;
  context?: ChatSessionContext;
};

export async function sendChatToGemini(
  messages: ChatApiMessage[],
  options: ChatRequestOptions = {},
): Promise<ChatMessage> {
  let res: Response;
  try {
    res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        role: options.role ?? 'marketplace',
        context: options.context,
      }),
    });
  } catch {
    throw new Error(
      'เชื่อมต่อ API ไม่ได้ — รันคำสั่ง npm run dev (ต้องมีทั้งเว็บ port 4000 และ API port 3001)',
    );
  }

  const data = (await res.json().catch(() => ({}))) as ChatApiResponse & { error?: string };

  if (!res.ok) {
    const errText = data.error || `Chat failed (${res.status})`;
    throw new Error(errText.length > 300 ? `${errText.slice(0, 300)}...` : errText);
  }

  if (!data.text?.trim()) {
    throw new Error('Empty response from AI');
  }

  const cards = resolveChatCards(
    (data.cards ?? []).map((c) => {
      if (c.type === 'route' && c.id) return { type: 'route' as const, id: c.id };
      if (c.type === 'community' && c.no) return { type: 'community' as const, no: c.no };
      if (c.type === 'landmark' && c.id) return { type: 'landmark' as const, id: c.id };
      return null;
    }).filter(Boolean) as Parameters<typeof resolveChatCards>[0],
  );

  return {
    role: 'ai',
    text: data.text.trim(),
    cards: cards.length ? cards : undefined,
    notice: data.fallback && data.notice ? data.notice : undefined,
  };
}
