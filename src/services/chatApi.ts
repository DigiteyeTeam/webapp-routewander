import { resolveChatCards } from '../lib/chatCards';
import { extractChatCardRefs, stripChatMarkers } from '../lib/chatMarkers';
import { buildRouteWanderSystemPrompt } from '../lib/chatPrompt';
import { callGeminiChat, getChatMode, isGeminiEnabled } from '../lib/geminiClient';
import { generateMockChatReply } from '../lib/mockChat';
import type { ChatMessage, ChatRole, ChatSessionContext } from '../types/chat';

export type ChatApiMessage = {
  role: 'user' | 'ai';
  text: string;
};

export type ChatRequestOptions = {
  role?: ChatRole;
  context?: ChatSessionContext;
};

function toChatMessage(
  rawText: string,
  extra?: { notice?: string },
): ChatMessage {
  const cards = resolveChatCards(extractChatCardRefs(rawText));
  return {
    role: 'ai',
    text: stripChatMarkers(rawText),
    cards: cards.length ? cards : undefined,
    notice: extra?.notice,
  };
}

export async function sendChatToGemini(
  messages: ChatApiMessage[],
  options: ChatRequestOptions = {},
): Promise<ChatMessage> {
  const role = options.role ?? 'marketplace';
  const context = options.context;
  const mode = getChatMode();

  if (!isGeminiEnabled()) {
    const raw = await generateMockChatReply(messages, role, context);
    return toChatMessage(raw);
  }

  const systemPrompt = buildRouteWanderSystemPrompt(role, context);

  try {
    const { text } = await callGeminiChat(messages, systemPrompt);
    return toChatMessage(text);
  } catch (err) {
    if (mode === 'auto') {
      const detail = err instanceof Error ? err.message : 'Gemini error';
      const raw = await generateMockChatReply(messages, role, context);
      return toChatMessage(raw, {
        notice: `${detail}\n\n(ตอบจากโหมดสาธิตชั่วคราว)`,
      });
    }
    throw err;
  }
}
