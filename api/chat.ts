import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleChatRequest } from '../server/chatHandler.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await handleChatRequest(req.body ?? {});
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error('[api/chat]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
