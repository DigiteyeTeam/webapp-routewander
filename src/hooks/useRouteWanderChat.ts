import { useCallback, useRef, useState } from 'react';
import { sendChatToGemini } from '../services/chatApi';
import type { ChatCard, ChatMessage, ChatRole, ChatSessionContext } from '../types/chat';

const FALLBACK_ERROR =
  'ขออภัยครับ ระบบ AI ไม่พร้อมใช้งานชั่วคราว กรุณาตรวจสอบ GEMINI_API_KEY ในไฟล์ .env แล้วรัน npm run dev ใหม่ หรือลองถามใหม่ภายหลังครับ';

type UseRouteWanderChatOptions = {
  role?: ChatRole;
  context?: ChatSessionContext;
  initialMessage: string;
  initialCards?: ChatCard[];
};

export function useRouteWanderChat(options: UseRouteWanderChatOptions) {
  const { role = 'marketplace', context, initialMessage, initialCards } = options;
  const [chat, setChat] = useState<ChatMessage[]>([
    { role: 'ai', text: initialMessage, cards: initialCards },
  ]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(chat);
  chatRef.current = chat;

  const sendMessage = useCallback(
    async (userText: string) => {
      const trimmed = userText.trim();
      if (!trimmed || loading) return;

      setLoading(true);
      const next: ChatMessage[] = [...chatRef.current, { role: 'user', text: trimmed }];
      setChat(next);

      try {
        const reply = await sendChatToGemini(next, { role, context });
        setChat([...next, reply]);
      } catch (err) {
        const detail = err instanceof Error ? err.message : FALLBACK_ERROR;
        setChat([...next, { role: 'ai', text: detail || FALLBACK_ERROR }]);
      } finally {
        setLoading(false);
      }
    },
    [loading, role, context],
  );

  return { chat, loading, sendMessage };
}
