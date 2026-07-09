import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Vercel ใส่ env ใน process.env ตอน build — loadEnv อ่านแค่ไฟล์ .env
  const geminiKey = (
    process.env.VITE_GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    env.VITE_GEMINI_API_KEY ||
    env.GEMINI_API_KEY ||
    ''
  ).trim();
  const chatMode =
    process.env.VITE_CHAT_MODE ||
    process.env.CHAT_MODE ||
    env.VITE_CHAT_MODE ||
    env.CHAT_MODE ||
    'auto';
  const geminiModel =
    process.env.VITE_GEMINI_MODEL ||
    process.env.GEMINI_MODEL ||
    env.VITE_GEMINI_MODEL ||
    env.GEMINI_MODEL ||
    '';

  return {
    define: {
      'process.env.GOOGLE_MAPS_PLATFORM_KEY': JSON.stringify(env.GOOGLE_MAPS_PLATFORM_KEY || ''),
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(geminiKey),
      'import.meta.env.VITE_CHAT_MODE': JSON.stringify(chatMode),
      'import.meta.env.VITE_GEMINI_MODEL': JSON.stringify(geminiModel),
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 4000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
