import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { buildRouteWanderSystemPrompt } from './prompt.ts';
import { getGeminiModels, toUserFacingGeminiError, validateApiKeyFormat } from './geminiErrors.ts';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.API_PORT) || 3001;
const GEMINI_MODELS = getGeminiModels();

const apiKey = process.env.GEMINI_API_KEY?.trim();
const keyFormatError = validateApiKeyFormat(apiKey);
const ai = apiKey && !keyFormatError ? new GoogleGenAI({ apiKey }) : null;
const systemPrompt = buildRouteWanderSystemPrompt();

const app = express();
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    gemini: Boolean(ai),
    models: GEMINI_MODELS,
    keyWarning: keyFormatError,
  });
});

app.post('/api/chat', async (req, res) => {
  if (keyFormatError) {
    res.status(503).json({ error: keyFormatError });
    return;
  }

  if (!ai) {
    res.status(503).json({
      error: 'GEMINI_API_KEY ยังไม่ได้ตั้งค่า — สร้างไฟล์ .env แล้วใส่ GEMINI_API_KEY=...',
    });
    return;
  }

  const messages = req.body?.messages as { role: string; text: string }[] | undefined;
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

  try {
    let lastError: unknown;

    for (const model of GEMINI_MODELS) {
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

        const text = response.text?.trim() || 'ขออภัยครับ ไม่สามารถสร้างคำตอบได้ในขณะนี้';
        res.json({ text, model });
        return;
      } catch (err) {
        lastError = err;
        console.error(`[gemini] model ${model} failed:`, err instanceof Error ? err.message : err);
      }
    }

    const userError = toUserFacingGeminiError(lastError);
    res.status(500).json({ error: userError });
  } catch (err) {
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

app.listen(PORT, () => {
  console.log(`RouteWander API http://localhost:${PORT}`);
  if (keyFormatError) {
    console.warn(`[gemini] ${keyFormatError}`);
  } else if (ai) {
    console.log(`Gemini: ready (models: ${GEMINI_MODELS.join(', ')})`);
  } else {
    console.log('Gemini: disabled — set GEMINI_API_KEY in .env');
  }
});
