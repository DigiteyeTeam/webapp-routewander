import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Search, Bell, Library } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';
import { PROFILE_AVATAR } from '../data/profileAvatar';

export type MarketplaceOutletContext = {
  setMapFullscreen: (value: boolean) => void;
};

export default function MarketplaceLayout() {
  const [mapFullscreen, setMapFullscreen] = useState(false);

  return (
    <div
      className={`bg-surface font-body-md text-on-surface flex flex-col selection:bg-primary selection:text-on-primary ${
        mapFullscreen ? 'h-screen overflow-hidden' : 'min-h-screen'
      }`}
    >
      <header className="sticky top-0 w-full z-40 bg-surface/80 backdrop-blur-md border-b border-surface-variant flex justify-between items-center h-[64px] md:h-[72px] px-4 md:px-6 shrink-0">
          <div className="flex items-center gap-8">
            <BrandLogo to="/" iconClassName="w-14 h-14" textClassName="text-base md:text-lg font-bold text-primary leading-none" />
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-on-surface-variant hover:text-primary transition-colors font-semibold text-sm">ตลาดเส้นทาง</Link>
              <Link to="/library" className="text-on-surface-variant hover:text-primary transition-colors font-semibold text-sm flex items-center gap-1"><Library className="w-4 h-4"/> คลังของฉัน</Link>
              <Link to="/creator/dashboard" className="text-on-surface-variant hover:text-primary transition-colors font-semibold text-sm">ศูนย์ครีเอเตอร์</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex bg-surface-container-low border border-surface-variant rounded-full px-4 py-2 items-center gap-2 w-64 focus-within:border-primary transition-all">
              <Search className="text-on-surface-variant w-5 h-5" />
              <input className="bg-transparent border-none focus:ring-0 w-full text-sm outline-none" placeholder="ค้นหาเส้นทาง..." type="text" />
            </div>
            <button className="text-on-surface-variant hover:text-primary transition-opacity p-2">
              <Bell className="w-6 h-6" />
            </button>
            <Link to="/creator/profile" className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary overflow-hidden border border-surface-variant hover:opacity-80 transition-opacity">
              <img className="w-full h-full object-cover" src={PROFILE_AVATAR} alt="รูปโปรไฟล์" />
            </Link>
          </div>
        </header>

      <main
        className={
          mapFullscreen
            ? 'flex-1 w-full min-h-0 flex flex-col overflow-hidden'
            : 'flex-1 w-full max-w-7xl mx-auto px-5 md:px-16 py-12'
        }
      >
        <Outlet context={{ setMapFullscreen } satisfies MarketplaceOutletContext} />
      </main>

      {!mapFullscreen && (
        <footer className="bg-surface-variant w-full flex flex-col md:flex-row justify-between items-center py-12 px-5 md:px-6 mt-auto border-t border-outline-variant/20 shrink-0">
          <div className="mb-8 md:mb-0">
            <h4 className="font-semibold text-sm text-on-surface mb-2">RouteWander</h4>
            <p className="text-on-surface-variant text-xs">© 2026 RouteWander ระบบอนุญาตเส้นทางท่องเที่ยว สงวนลิขสิทธิ์</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <a className="text-on-surface-variant hover:text-primary transition-colors text-xs" href="#">นโยบายความเป็นส่วนตัว</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors text-xs" href="#">ข้อกำหนดการใช้งาน</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors text-xs" href="#">คู่มือการอนุญาต</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors text-xs" href="#">ติดต่อฝ่ายสนับสนุน</a>
          </div>
        </footer>
      )}
    </div>
  );
}
