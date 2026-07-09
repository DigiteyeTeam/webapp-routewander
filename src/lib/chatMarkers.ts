import type { ChatCardRef } from '../types/chat';

const MARKER_RE = /\[\[(route|community|landmark):([^\]]+)\]\]/g;

export function extractChatCardRefs(text: string): ChatCardRef[] {
  const refs: ChatCardRef[] = [];
  const seen = new Set<string>();

  for (const match of text.matchAll(MARKER_RE)) {
    const kind = match[1];
    const value = match[2].trim();
    const key = `${kind}:${value}`;
    if (seen.has(key)) continue;
    seen.add(key);

    if (kind === 'route') refs.push({ type: 'route', id: value });
    else if (kind === 'community') refs.push({ type: 'community', no: Number(value) });
    else if (kind === 'landmark') refs.push({ type: 'landmark', id: value });
  }

  return refs.slice(0, 4);
}

export function stripChatMarkers(text: string): string {
  return text
    .replace(MARKER_RE, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
