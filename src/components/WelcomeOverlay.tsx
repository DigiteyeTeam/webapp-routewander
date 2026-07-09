import { useState } from 'react';
import { X } from 'lucide-react';
import welcomeImage from '../images/welcomm.png';

export default function WelcomeOverlay() {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div
      className="absolute inset-0 z-[500] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="ยินดีต้อนรับ"
    >
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-on-surface shadow-[0_4px_20px_rgba(0,0,0,0.35)] border-2 border-on-surface/10 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary active:scale-95 transition-all"
        aria-label="ปิด"
      >
        <X className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2.5} />
      </button>

      <img
        src={welcomeImage}
        alt="ยินดีต้อนรับ RouteWander"
        className="max-w-full max-h-full w-auto h-auto object-contain rounded-xl shadow-2xl select-none"
        draggable={false}
      />
    </div>
  );
}
