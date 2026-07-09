import { GoogleGenAI } from '@google/genai';
import { buildRouteWanderSystemPrompt } from './prompt.ts';
import { getGeminiModels, toUserFacingGeminiError, validateApiKeyFormat } from './geminiErrors.ts';
import { generateMockChatReply } from './mockChat.ts';
import { extractChatCardRefs, stripChatMarkers } from './chatMarkers.ts';
import type { ChatRole, ServerChatContext } from './rolePrompt.ts';

export type ChatRequestBody = {
  messages?: { role: string; text: string }[];
  role?: ChatRole;
  context?: ServerChatContext;
};

function getConfig() {
  const CHAT_MODE = (process.env.CHAT_MODE?.trim() || 'auto').toLowerCase();
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const keyFormatError = validateApiKeyFormat(apiKey);
  const forceMock = CHAT_MODE === 'mock';
  const geminiEnabled = !forceMock && Boolean(apiKey && !keyFormatError);
  const ai = geminiEnabled ? new GoogleGenAI({ apiKey: apiKey! }) : null;
  const models = getGeminiModels();

  return { CHAT_MODE, keyFormatError, geminiEnabled, ai, models };
}

export function getHealthPayload() {
  const { keyFormatError, geminiEnabled, models } = getConfig();
  const mode = geminiEnabled ? 'gemini' : 'mock';
  return {
    ok: true,
    mode,
    gemini: geminiEnabled,
    models,
    keyWarning: keyFormatError,
  };
}

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
  const { CHAT_MODE, geminiEnabled, ai, models } = getConfig();

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

  if (!geminiEnabled) {
    const raw = await generateMockChatReply(messages, role, context);
    return { status: 200 as const, body: buildChatPayload(raw, { model: 'mock', mode: 'mock' }) };
  }

  try {
    let lastError: unknown;

    for (const model of models) {
      try {
        const response = await ai!.models.generateContent({
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
