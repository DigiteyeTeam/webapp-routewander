import { buildRouteWanderSystemPrompt } from './prompt';
import { getChatConfig } from './chatConfig';
import { toUserFacingGeminiError } from './geminiErrors';
import { generateMockChatReply } from './mockChat';
import { extractChatCardRefs, stripChatMarkers } from './chatMarkers';
import type { ChatRole, ServerChatContext } from './rolePrompt';

export type ChatRequestBody = {
  messages?: { role: string; text: string }[];
  role?: ChatRole;
  context?: ServerChatContext;
};

export { getHealthPayload } from './chatConfig';

function buildChatPayload(rawText: string, extra?: Record<string, unknown>) {
  const cards = extractChatCardRefs(rawText);
  const text = stripChatMarkers(rawText);
  return { text, cards, ...extra };
}

export async function handleChatRequest(body: ChatRequestBody) {
  const messages = body?.messages;
  const role = body?.role ?? 'marketplace';
  const context = body?.context;
  const systemPrompt = buildRouteWanderSystemPrompt(role, context);
  const { CHAT_MODE, apiKey, geminiEnabled, models } = getChatConfig();

  if (!Array.isArray(messages) || messages.length === 0) {
    return { status: 400 as const, body: { error: 'messages is required' } };
  }

  const contents = messages
    .filter((m) => m?.text?.trim())
    .map((m) => ({
      role: m.role === 'user' ? ('user' as const) : ('model' as const),
      parts: [{ text: m.text.trim() }],
    }));

  if (contents.length === 0) {
    return { status: 400 as const, body: { error: 'no valid messages' } };
  }

  if (!geminiEnabled || !apiKey) {
    const raw = await generateMockChatReply(messages, role, context);
    return { status: 200 as const, body: buildChatPayload(raw, { model: 'mock', mode: 'mock' }) };
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });
    let lastError: unknown;

    for (const model of models) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        });

        const raw = response.text?.trim() || 'ขออภัยครับ ไม่สามารถสร้างคำตอบได้ในขณะนี้';
        return { status: 200 as const, body: buildChatPayload(raw, { model, mode: 'gemini' }) };
      } catch (err) {
        lastError = err;
        console.error(`[gemini] model ${model} failed:`, err instanceof Error ? err.message : err);
      }
    }

    if (CHAT_MODE === 'auto') {
      const userError = toUserFacingGeminiError(lastError);
      const raw = await generateMockChatReply(messages, role, context);
      return {
        status: 200 as const,
        body: buildChatPayload(raw, {
          model: 'mock',
          mode: 'mock',
          fallback: true,
          notice: `${userError}\n\n(ตอบจากโหมดสาธิตชั่วคราว)`,
        }),
      };
    }

    return { status: 500 as const, body: { error: toUserFacingGeminiError(lastError) } };
  } catch (err) {
    if (CHAT_MODE === 'auto') {
      const userError = toUserFacingGeminiError(err);
      const raw = await generateMockChatReply(messages, role, context);
      return {
        status: 200 as const,
        body: buildChatPayload(raw, {
          model: 'mock',
          mode: 'mock',
          fallback: true,
          notice: `${userError}\n\n(ตอบจากโหมดสาธิตชั่วคราว)`,
        }),
      };
    }
    return { status: 500 as const, body: { error: toUserFacingGeminiError(err) } };
  }
}
