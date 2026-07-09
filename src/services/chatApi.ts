export type ChatApiMessage = {
  role: 'user' | 'ai';
  text: string;
};

export async function sendChatToGemini(messages: ChatApiMessage[]): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  const data = (await res.json().catch(() => ({}))) as { text?: string; error?: string };

  if (!res.ok) {
    const errText = data.error || `Chat failed (${res.status})`;
    throw new Error(errText.length > 300 ? `${errText.slice(0, 300)}...` : errText);
  }

  if (!data.text?.trim()) {
    throw new Error('Empty response from AI');
  }

  return data.text.trim();
}
