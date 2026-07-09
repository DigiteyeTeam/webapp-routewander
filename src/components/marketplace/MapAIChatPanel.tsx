import { useState } from 'react';
import { ChevronRight, Send, User, Loader2 } from 'lucide-react';
import aiMascot from '../../images/rwai1.png';
import { useRouteWanderChat } from '../../hooks/useRouteWanderChat';
import { resolveChatCards } from '../../lib/chatCards';
import { PORTAL_AI_CONFIG } from '../../config/portalAiChat';
import { ChatMessageBody } from '../chat/ChatRichMessage';

const marketplaceConfig = PORTAL_AI_CONFIG.marketplace;
const WELCOME_CARDS = resolveChatCards(marketplaceConfig.welcomeCards);

function MascotAvatar({ className = 'w-9 h-9' }: { className?: string }) {
  return <img src={aiMascot} alt="" className={`object-contain shrink-0 ${className}`} draggable={false} />;
}

export function MapAICollapsedFab({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="fixed bottom-5 right-5 z-[500] flex items-center gap-2 pl-1 pr-4 py-1 rounded-full bg-white border-2 border-primary shadow-lg hover:scale-105 active:scale-95 transition-transform"
      title="เปิดแชท AI"
      aria-label="เปิดแชท AI"
    >
      <MascotAvatar className="w-11 h-11 rounded-full object-cover" />
      <span className="font-bold text-sm text-primary tracking-wide">AI</span>
    </button>
  );
}

interface MapAIChatPanelProps {
  onCollapse?: () => void;
}

export default function MapAIChatPanel({ onCollapse }: MapAIChatPanelProps) {
  const [message, setMessage] = useState('');
  const { chat, loading, sendMessage } = useRouteWanderChat({
    role: 'marketplace',
    initialMessage: marketplaceConfig.initialMessage,
    initialCards: WELCOME_CARDS,
  });

  const handleSend = () => {
    if (!message.trim() || loading) return;
    const userText = message.trim();
    setMessage('');
    void sendMessage(userText);
  };

  return (
    <div className="w-full lg:w-[300px] xl:w-[340px] shrink-0 flex flex-col h-full min-h-0 max-h-[40vh] lg:max-h-none px-3 pb-3 lg:px-0 lg:pb-0">
      <aside className="flex flex-col h-full min-h-0 bg-surface-container-lowest rounded-none lg:rounded-l-2xl border border-surface-variant lg:border-r-0 shadow-lg overflow-hidden">
        <div className="shrink-0 bg-gradient-to-r from-primary to-emerald-600 text-white px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 bg-white rounded-full p-0.5 shrink-0">
              <MascotAvatar className="w-full h-full" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm leading-tight truncate">RouteWander AI</p>
              <p className="text-[10px] text-white/80">ผู้เชี่ยวชาญ 15 ชุมชนภูเก็ต</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onCollapse?.()}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors shrink-0"
            title="ย่อแชท"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0 bg-surface-container-low">
          {chat.map((msg, idx) => (
            <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role === 'user' ? (
                <div className="w-7 h-7 rounded-full bg-surface-variant flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-white border border-primary/20 p-0.5 shrink-0">
                  <MascotAvatar className="w-full h-full" />
                </div>
              )}
              <div
                className={`px-3 py-2.5 max-w-[92%] text-xs leading-relaxed rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-primary text-white rounded-tr-sm whitespace-pre-wrap'
                    : 'bg-surface border border-surface-variant text-on-surface rounded-tl-sm'
                }`}
              >
                {msg.role === 'user' ? (
                  msg.text
                ) : (
                  <ChatMessageBody
                    compact
                    text={msg.notice ? `${msg.text}\n---\n⚠️ ${msg.notice}` : msg.text}
                    cards={msg.cards}
                  />
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-2 items-center text-xs text-secondary px-1">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              กำลังคิด...
            </div>
          )}
        </div>

        <div className="shrink-0 p-3 border-t border-surface-variant bg-surface">
          <div className="relative flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="ถามเรื่องเส้นทางหรือชุมชน..."
              disabled={loading}
              className="w-full h-10 pl-3 pr-10 rounded-xl border border-surface-variant bg-surface-container-low text-sm focus:outline-none focus:border-primary disabled:opacity-60"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!message.trim() || loading}
              className={`absolute right-1 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                message.trim() && !loading ? 'bg-primary text-white' : 'text-secondary'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
