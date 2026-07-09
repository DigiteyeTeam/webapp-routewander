import { useState } from 'react';
import { X, Maximize2, Minimize2, Send, User, Loader2 } from 'lucide-react';
import aiMascot from '../../images/rwai1.png';
import { useRouteWanderChat } from '../../hooks/useRouteWanderChat';
import { resolveChatCards } from '../../lib/chatCards';
import { buildPortalChatContext, PORTAL_AI_CONFIG } from '../../config/portalAiChat';
import { ChatMessageBody } from './ChatRichMessage';
import type { ChatRole } from '../types/chat';

function MascotAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'fab' }) {
  const sizeClass =
    size === 'fab'
      ? 'w-full h-full'
      : size === 'lg'
        ? 'w-12 h-12'
        : size === 'sm'
          ? 'w-8 h-8'
          : 'w-10 h-10';

  return (
    <img
      src={aiMascot}
      alt="RouteWander AI"
      className={`${sizeClass} object-contain shrink-0`}
      draggable={false}
    />
  );
}

type PortalAIChatWidgetProps = {
  role: ChatRole;
  /** ยก FAB สูงขึ้นบนมือถือเมื่อมี bottom nav */
  bottomOffset?: 'default' | 'above-nav';
};

export default function PortalAIChatWidget({ role, bottomOffset = 'default' }: PortalAIChatWidgetProps) {
  const config = PORTAL_AI_CONFIG[role];
  const sessionContext = buildPortalChatContext(role);
  const welcomeCards = resolveChatCards(config.welcomeCards);

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const { chat, loading, sendMessage } = useRouteWanderChat({
    role,
    context: sessionContext,
    initialMessage: config.initialMessage,
    initialCards: welcomeCards,
  });

  const handleSend = () => {
    if (!message.trim() || loading) return;
    const userText = message.trim();
    setMessage('');
    void sendMessage(userText);
  };

  const fabBottom = bottomOffset === 'above-nav' ? 'bottom-20 md:bottom-6' : 'bottom-6';
  const panelBottom = bottomOffset === 'above-nav' ? 'bottom-20 md:bottom-6' : 'bottom-6';

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`fixed ${fabBottom} right-6 w-[72px] h-[72px] bg-white rounded-full flex items-center justify-center p-1.5 ${config.fabShadow} border-2 border-primary/20 hover:scale-105 active:scale-95 transition-all z-50 focus:outline-none focus:ring-4 focus:ring-primary/30`}
        title="เปิดแชท RouteWander AI"
      >
        <MascotAvatar size="fab" />
      </button>
    );
  }

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${
        isExpanded
          ? 'inset-0 md:inset-6 md:rounded-[2rem]'
          : `${panelBottom} right-6 w-[calc(100%-3rem)] md:w-full max-w-[400px] h-[min(600px,calc(100vh-6rem))] rounded-[2rem]`
      } bg-surface shadow-2xl border border-surface-variant flex flex-col overflow-hidden`}
    >
      <div className={`h-[72px] bg-gradient-to-r ${config.headerGradient} text-white flex items-center justify-between px-6 shrink-0`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center p-0.5 shadow-sm shrink-0">
            <MascotAvatar size="lg" />
          </div>
          <div className="min-w-0">
            <span className="font-bold block leading-tight truncate">RouteWander AI</span>
            <span className="text-xs text-white/80 font-medium truncate block">{config.subtitle}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors hidden md:block"
          >
            {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setIsExpanded(false);
            }}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface-container-lowest min-h-0">
        {chat.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.role === 'user' ? (
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-surface-variant text-on-surface">
                <User className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-white border border-primary/15 p-0.5 shadow-sm">
                <MascotAvatar size="sm" />
              </div>
            )}
            <div
              className={`px-5 py-4 max-w-[85%] ${
                msg.role === 'user'
                  ? 'bg-primary text-on-primary rounded-2xl rounded-tr-sm shadow-md whitespace-pre-wrap'
                  : 'bg-surface-container-low text-on-surface rounded-2xl rounded-tl-sm border border-surface-variant'
              }`}
            >
              {msg.role === 'user' ? (
                <p className="text-[15px] leading-relaxed">{msg.text}</p>
              ) : (
                <ChatMessageBody
                  text={msg.notice ? `${msg.text}\n---\n⚠️ ${msg.notice}` : msg.text}
                  cards={msg.cards}
                />
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2 items-center text-sm text-secondary">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            กำลังคิด...
          </div>
        )}
      </div>

      <div className="p-4 md:p-6 bg-surface border-t border-surface-variant shrink-0">
        <div className="relative flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={config.placeholder}
            disabled={loading}
            className="w-full h-14 pl-6 pr-14 rounded-full border-2 border-surface-variant bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[15px] shadow-sm transition-all disabled:opacity-60"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={loading}
            className={`absolute right-2 w-10 h-10 flex items-center justify-center rounded-full transition-all ${
              message.trim() && !loading ? 'bg-primary text-on-primary shadow-md hover:scale-105' : 'text-secondary hover:bg-surface-variant'
            }`}
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
