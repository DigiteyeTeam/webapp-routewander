import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getHealthPayload } from '../server/chatHandler.ts';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  return res.status(200).json(getHealthPayload());
}
