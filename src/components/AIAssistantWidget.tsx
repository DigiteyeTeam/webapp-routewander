import { X, Maximize2, Minimize2, Send, User } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import aiMascot from '../images/rwai1.png';

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

export default function AIAssistantWidget() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');

  const [chat, setChat] = useState([
    {
      role: 'ai',
      text: 'สวัสดีครับ! ผมเป็นผู้ช่วย AI ด้านเส้นทางท่องเที่ยว ช่วยอะไรได้บ้างครับ? แนะนำเส้นทางที่เหมาะสม วิเคราะห์ผลกระทบต่อชุมชน หรือปรับแต่งเส้นทางที่คุณมีไลเซนส์อยู่',
    },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    setChat([...chat, { role: 'user', text: message }]);
    setMessage('');

    setTimeout(() => {
      setChat((prev) => [
        ...prev,
        {
          role: 'ai',
          text: 'นี่เป็นคำตอบจำลองจาก AI ในระบบจริงจะวิเคราะห์คำขอของคุณผ่านระบบข้อมูลเชิงลึกชุมชน แล้วแนะนำเส้นทาง ข้อมูลเชิงลึก หรือการปรับแต่งที่เหมาะกับคุณ',
        },
      ]);
    }, 1000);
  };

  if (location.pathname === '/') return null;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-[72px] h-[72px] bg-white rounded-full flex items-center justify-center p-1.5 shadow-[0_8px_28px_rgba(22,163,74,0.35)] border-2 border-primary/20 hover:scale-105 active:scale-95 transition-all z-50 focus:outline-none focus:ring-4 focus:ring-primary/30 group"
        title="เปิดแชท RouteWander AI"
      >
        <MascotAvatar size="fab" />
      </button>
    );
  }

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${isExpanded ? 'inset-0 md:inset-6 md:rounded-[2rem]' : 'bottom-6 right-6 w-[calc(100%-3rem)] md:w-full max-w-[400px] h-[600px] rounded-[2rem]'} bg-surface shadow-2xl border border-surface-variant flex flex-col overflow-hidden`}
    >
      <div className="h-[72px] bg-gradient-to-r from-primary to-emerald-600 text-white flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center p-0.5 shadow-sm shrink-0">
            <MascotAvatar size="lg" />
          </div>
          <div>
            <span className="font-bold block leading-tight">RouteWander AI</span>
            <span className="text-xs text-white/80 font-medium">ข้อมูลเชิงลึกชุมชน</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors hidden md:block"
          >
            {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button
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

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface-container-lowest">
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
              className={`px-5 py-4 max-w-[85%] ${msg.role === 'user' ? 'bg-primary text-on-primary rounded-2xl rounded-tr-sm shadow-md' : 'bg-surface-container-low text-on-surface rounded-2xl rounded-tl-sm border border-surface-variant'}`}
            >
              <p className="text-[15px] leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 md:p-6 bg-surface border-t border-surface-variant shrink-0">
        <div className="relative flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="ถาม AI เรื่องแนะนำเส้นทาง..."
            className="w-full h-14 pl-6 pr-14 rounded-full border-2 border-surface-variant bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-[15px] shadow-sm transition-all"
          />
          <button
            onClick={handleSend}
            className={`absolute right-2 w-10 h-10 flex items-center justify-center rounded-full transition-all ${message.trim() ? 'bg-primary text-on-primary shadow-md hover:scale-105' : 'text-secondary hover:bg-surface-variant'}`}
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </div>
        <div className="mt-3 text-center">
          <p className="text-xs text-secondary font-medium">AI อาจให้ข้อมูลผิดพลาดได้ กรุณาตรวจสอบข้อมูลสำคัญอีกครั้ง</p>
        </div>
      </div>
    </div>
  );
}
