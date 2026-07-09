import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { buildRouteWanderSystemPrompt } from './prompt.ts';
import { getGeminiModels, toUserFacingGeminiError, validateApiKeyFormat } from './geminiErrors.ts';
import { generateMockChatReply } from './mockChat.ts';
import { extractChatCardRefs, stripChatMarkers } from './chatMarkers.ts';
import type { ChatRole, ServerChatContext } from './rolePrompt.ts';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.API_PORT) || 3001;
const GEMINI_MODELS = getGeminiModels();
const CHAT_MODE = (process.env.CHAT_MODE?.trim() || 'auto').toLowerCase();

const apiKey = process.env.GEMINI_API_KEY?.trim();
const keyFormatError = validateApiKeyFormat(apiKey);
const forceMock = CHAT_MODE === 'mock';
const geminiEnabled = !forceMock && Boolean(apiKey && !keyFormatError);
const ai = geminiEnabled ? new GoogleGenAI({ apiKey: apiKey! }) : null;

function resolveChatMode(): 'mock' | 'gemini' {
  if (forceMock || !geminiEnabled) return 'mock';
  return 'gemini';
}

const app = express();
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    mode: resolveChatMode(),
    gemini: geminiEnabled,
    models: GEMINI_MODELS,
    keyWarning: keyFormatError,
  });
});

function buildChatPayload(rawText: string, extra?: Record<string, unknown>) {
  const cards = extractChatCardRefs(rawText);
  const text = stripChatMarkers(rawText);
  return { text, cards, ...extra };
}

app.post('/api/chat', async (req, res) => {
  const messages = req.body?.messages as { role: string; text: string }[] | undefined;
  const role = (req.body?.role as ChatRole) ?? 'marketplace';
  const context = req.body?.context as ServerChatContext | undefined;
  const systemPrompt = buildRouteWanderSystemPrompt(role, context);
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'messages is required' });
    return;
  }

  const contents = messages
    .filter((m) => m?.text?.trim())
    .map((m) => ({
      role: m.role === 'user' ? ('user' as const) : ('model' as const),
      parts: [{ text: m.text.trim() }],
    }));

  if (contents.length === 0) {
    res.status(400).json({ error: 'no valid messages' });
    return;
  }

  if (!geminiEnabled) {
    const raw = await generateMockChatReply(messages, role, context);
    res.json(buildChatPayload(raw, { model: 'mock', mode: 'mock' }));
    return;
  }

  try {
    let lastError: unknown;

    for (const model of GEMINI_MODELS) {
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
        res.json(buildChatPayload(raw, { model, mode: 'gemini' }));
        return;
      } catch (err) {
        lastError = err;
        console.error(`[gemini] model ${model} failed:`, err instanceof Error ? err.message : err);
      }
    }

    if (CHAT_MODE === 'auto') {
      const userError = toUserFacingGeminiError(lastError);
      console.warn('[gemini] all models failed — falling back to mock chat:', userError);
      const raw = await generateMockChatReply(messages, role, context);
      res.json(
        buildChatPayload(raw, {
          model: 'mock',
          mode: 'mock',
          fallback: true,
          notice: `${userError}\n\n(ตอบจากโหมดสาธิตชั่วคราว)`,
        }),
      );
      return;
    }

    const userError = toUserFacingGeminiError(lastError);
    res.status(500).json({ error: userError });
  } catch (err) {
    if (CHAT_MODE === 'auto') {
      const userError = toUserFacingGeminiError(err);
      const raw = await generateMockChatReply(messages, role, context);
      res.json(
        buildChatPayload(raw, {
          model: 'mock',
          mode: 'mock',
          fallback: true,
          notice: `${userError}\n\n(ตอบจากโหมดสาธิตชั่วคราว)`,
        }),
      );
      return;
    }
    const userError = toUserFacingGeminiError(err);
    console.error('[gemini]', userError);
    res.status(500).json({ error: userError });
  }
});

if (process.env.NODE_ENV === 'production') {
  const dist = path.join(__dirname, '..', 'dist');
  app.use(express.static(dist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(dist, 'index.html'));
  });
}

const server = app.listen(PORT, () => {
  console.log(`RouteWander API http://localhost:${PORT}`);
  const mode = resolveChatMode();
  if (mode === 'mock') {
    if (keyFormatError) {
      console.warn(`[chat] mock mode — ${keyFormatError}`);
    } else if (!apiKey) {
      console.warn('[chat] mock mode — GEMINI_API_KEY not set');
    } else {
      console.log('[chat] mock mode (CHAT_MODE=mock)');
    }
  } else {
    console.log(`[chat] Gemini ready (models: ${GEMINI_MODELS.join(', ')})`);
  }
});

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `\n[api] พอร์ต ${PORT} ถูกใช้งานอยู่แล้ว — ปิด process เก่าก่อน:\n` +
        `  Windows: netstat -ano | findstr :${PORT}  แล้ว  taskkill /PID <pid> /F\n` +
        `  หรือเปลี่ยนพอร์ตใน .env: API_PORT=3002 (และอัปเดต vite proxy)\n`,
    );
    process.exit(1);
  }
  throw err;
});
