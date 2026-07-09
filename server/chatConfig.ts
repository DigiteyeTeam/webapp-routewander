import { getGeminiModels, validateApiKeyFormat } from './geminiErrors';

export function getChatConfig() {
  const CHAT_MODE = (process.env.CHAT_MODE?.trim() || 'auto').toLowerCase();
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const keyFormatError = validateApiKeyFormat(apiKey);
  const forceMock = CHAT_MODE === 'mock';
  const geminiEnabled = !forceMock && Boolean(apiKey && !keyFormatError);
  const models = getGeminiModels();

  return { CHAT_MODE, apiKey, keyFormatError, geminiEnabled, models };
}

export function getHealthPayload() {
  const { keyFormatError, geminiEnabled, models } = getChatConfig();
  return {
    ok: true,
    mode: geminiEnabled ? 'gemini' : 'mock',
    gemini: geminiEnabled,
    models,
    keyWarning: keyFormatError,
  };
}
