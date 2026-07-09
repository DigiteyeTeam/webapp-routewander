import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { getHealthPayload, handleChatRequest } from './chatHandler';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.API_PORT) || 3001;

const app = express();
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json(getHealthPayload());
});

app.post('/api/chat', async (req, res) => {
  const result = await handleChatRequest(req.body ?? {});
  res.status(result.status).json(result.body);
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
  const health = getHealthPayload();
  console.log(`RouteWander API http://localhost:${PORT}`);
  if (health.mode === 'mock') {
    if (health.keyWarning) {
      console.warn(`[chat] mock mode — ${health.keyWarning}`);
    } else if (!process.env.GEMINI_API_KEY) {
      console.warn('[chat] mock mode — GEMINI_API_KEY not set');
    } else {
      console.log('[chat] mock mode (CHAT_MODE=mock)');
    }
  } else {
    console.log(`[chat] Gemini ready (models: ${health.models.join(', ')})`);
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
