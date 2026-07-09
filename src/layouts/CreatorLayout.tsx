import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { LayoutDashboard, Map as MapIcon, PlusCircle, CircleDollarSign, User, Settings, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import BrandLogo from '../components/BrandLogo';
import ProfileAvatar from '../components/ProfileAvatar';
import { PortalMobileBackdrop, PortalPageOutlet } from '../components/motion/PortalMotion';
import PortalAIChatWidget from '../components/chat/PortalAIChatWidget';
import { useAuth } from '../context/AuthContext';
import { PROFILE_AVATAR } from '../data/profileAvatar';
import { slideFromLeft } from '../lib/motion';

export default function CreatorLayout() {
  const location = useLocation();
  const { logout } = useAuth();
  const reduceMotion = useReducedMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname.includes(path);

  const navLinkClass = (active: boolean) =>
    `flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors ${
      active
        ? 'bg-emerald-100 text-emerald-900 font-bold border-l-4 border-emerald-600'
        : 'text-secondary hover:bg-surface-variant/50'
    }`;

  return (
    <div className="font-body-md text-on-surface antialiased overflow-x-hidden min-h-screen flex bg-surface">
      <motion.aside
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        variants={slideFromLeft}
        className={`fixed md:sticky top-0 h-screen w-64 bg-emerald-950/5 border-r border-emerald-100 z-40 transition-transform transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col`}
      >
        <div className="px-6 py-8">
          <BrandLogo to="/creator/dashboard" iconClassName="w-12 h-12" textClassName="text-base font-bold text-primary leading-none" />
          <p className="font-label-sm text-emerald-800 mt-2 text-sm">พอร์ทัลครีเอเตอร์</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <Link to="/creator/dashboard" className={navLinkClass(isActive('/dashboard'))}>
            <LayoutDashboard className="w-5 h-5" />
            <span>แดชบอร์ด</span>
          </Link>
          <Link to="/creator/routes" className={navLinkClass(isActive('/routes') && !isActive('/routes/create'))}>
            <MapIcon className="w-5 h-5" />
            <span>เส้นทางของฉัน</span>
          </Link>
          <Link to="/creator/routes/create" className={navLinkClass(isActive('/routes/create'))}>
            <PlusCircle className="w-5 h-5" />
            <span>สร้างเส้นทาง</span>
          </Link>
          <Link to="/creator/earnings" className={navLinkClass(isActive('/earnings'))}>
            <CircleDollarSign className="w-5 h-5" />
            <span>รายได้</span>
          </Link>
          <Link to="/creator/profile" className={navLinkClass(isActive('/profile'))}>
            <User className="w-5 h-5" />
            <span>โปรไฟล์</span>
          </Link>
          <div className="pt-3 mt-3 border-t-2 border-emerald-300/80">
            <Link to="/" className={navLinkClass(location.pathname === '/')}>
              <MapIcon className="w-5 h-5" />
              <span>ตลาดเส้นทาง</span>
            </Link>
          </div>
        </nav>
        
        <div className="p-4 border-t border-surface-variant space-y-2 mt-auto">
          <Link to="#" className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-variant/50 rounded-lg font-medium transition-colors">
            <Settings className="w-5 h-5 text-secondary" />
            <span>ตั้งค่า</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              window.location.href = '/';
            }}
            className="w-full flex items-center gap-4 px-4 py-3 text-emerald-800 hover:bg-emerald-50 rounded-lg font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col min-h-screen relative w-full md:w-[calc(100%-256px)]">
        <header className="md:hidden bg-surface flex justify-between items-center w-full px-5 py-4 sticky top-0 z-30 shadow-sm border-b border-surface-variant">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-on-surface-variant hover:bg-surface-variant rounded-md">
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="font-headline-md text-primary font-bold text-xl">ศูนย์ครีเอเตอร์</h2>
          </div>
          <Link to="/creator/profile" className="hover:opacity-90 transition-opacity">
            <ProfileAvatar src={PROFILE_AVATAR} alt="รูปโปรไฟล์" tone="creator" size="xs" />
          </Link>
        </header>

        <AnimatePresence>
          {mobileMenuOpen && <PortalMobileBackdrop onClose={() => setMobileMenuOpen(false)} />}
        </AnimatePresence>

        <main className="flex-1 w-full flex flex-col bg-surface">
          <PortalPageOutlet />
        </main>

        <motion.footer
          className="w-full py-8 border-t border-surface-variant bg-surface-container-lowest mt-auto"
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 max-w-7xl mx-auto gap-4">
            <div className="font-bold text-primary">ศูนย์ครีเอเตอร์</div>
            <div className="flex gap-6 text-sm">
              <a className="text-secondary hover:text-primary transition-colors" href="#">ความเป็นส่วนตัว</a>
              <a className="text-secondary hover:text-primary transition-colors" href="#">ข้อกำหนด</a>
              <a className="text-secondary hover:text-primary transition-colors" href="#">ช่วยเหลือ</a>
            </div>
            <div className="text-xs text-secondary text-center">
              © 2026 RouteWander สงวนลิขสิทธิ์
            </div>
          </div>
        </motion.footer>

        {!isActive('/routes/create') && (
          <nav className="md:hidden sticky bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-surface-variant shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
            <div className="flex justify-around items-center h-16 px-2">
              <Link to="/creator/dashboard" className={`flex flex-col items-center justify-center w-full h-full ${isActive('/dashboard') ? 'text-primary' : 'text-secondary hover:text-on-surface'} transition-colors`}>
                <LayoutDashboard className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold">แดชบอร์ด</span>
              </Link>
              <Link to="/creator/routes" className={`flex flex-col items-center justify-center w-full h-full ${isActive('/routes') && !isActive('/routes/create') ? 'text-primary' : 'text-secondary hover:text-on-surface'} transition-colors`}>
                <MapIcon className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold">เส้นทาง</span>
              </Link>
              <Link to="/creator/earnings" className={`flex flex-col items-center justify-center w-full h-full ${isActive('/earnings') ? 'text-primary' : 'text-secondary hover:text-on-surface'} transition-colors`}>
                <CircleDollarSign className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold">รายได้</span>
              </Link>
              <Link to="/creator/profile" className={`flex flex-col items-center justify-center w-full h-full ${isActive('/profile') ? 'text-primary' : 'text-secondary hover:text-on-surface'} transition-colors`}>
                <User className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold">โปรไฟล์</span>
              </Link>
            </div>
          </nav>
        )}
      </div>
      {!isActive('/routes/create') && <PortalAIChatWidget role="creator" bottomOffset="above-nav" />}
    </div>
  );
}
