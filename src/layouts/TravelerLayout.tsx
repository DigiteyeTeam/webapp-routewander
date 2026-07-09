import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Compass, CreditCard, LogOut, Map, Menu, Settings, User } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';
import ProfileAvatar from '../components/ProfileAvatar';
import { PortalMobileBackdrop, PortalPageOutlet } from '../components/motion/PortalMotion';
import PortalAIChatWidget from '../components/chat/PortalAIChatWidget';
import { useAuth } from '../context/AuthContext';
import { PROFILE_AVATAR } from '../data/profileAvatar';
import { slideFromLeft } from '../lib/motion';

export default function TravelerLayout() {
  const location = useLocation();
  const { logout, user } = useAuth();
  const reduceMotion = useReducedMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname.startsWith(path);

  const navItems = [
    { to: '/traveler/trips', label: 'เที่ยวของฉัน', icon: Compass },
    { to: '/traveler/purchases', label: 'ซื้อ & ชำระเงิน', icon: CreditCard },
    { to: '/traveler/profile', label: 'โปรไฟล์', icon: User },
  ];

  return (
    <div className="font-body-md text-on-surface min-h-screen flex bg-surface">
      <motion.aside
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        variants={slideFromLeft}
        className={`fixed md:sticky top-0 h-screen w-64 bg-emerald-950/5 border-r border-emerald-100 z-40 transition-transform ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 flex flex-col`}
      >
        <div className="px-6 py-8">
          <BrandLogo to="/traveler/trips" iconClassName="w-12 h-12" textClassName="text-base font-bold text-primary" />
          <p className="font-label-sm text-emerald-800 mt-2 text-sm">พอร์ทัลนักท่องเที่ยว</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors ${
                  active
                    ? 'bg-emerald-100 text-emerald-900 font-bold border-l-4 border-emerald-600'
                    : 'text-secondary hover:bg-surface-variant/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-3 mt-3 border-t-2 border-emerald-300/80">
            <Link
              to="/"
              className={`flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors ${
                location.pathname === '/'
                  ? 'bg-emerald-100 text-emerald-900 font-bold border-l-4 border-emerald-600'
                  : 'text-secondary hover:bg-surface-variant/50'
              }`}
            >
              <Map className="w-5 h-5" />
              <span>ตลาดเส้นทาง</span>
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-surface-variant space-y-2 mt-auto">
          <Link
            to="#"
            className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-variant/50 rounded-lg font-medium"
          >
            <Settings className="w-5 h-5" />
            <span>ตั้งค่า</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              window.location.href = '/';
            }}
            className="w-full flex items-center gap-4 px-4 py-3 text-emerald-800 hover:bg-emerald-50 rounded-lg font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col min-h-screen w-full md:w-[calc(100%-256px)]">
        <motion.header
          className="md:hidden bg-surface flex justify-between items-center px-5 py-4 sticky top-0 z-30 border-b border-surface-variant"
          initial={reduceMotion ? false : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-emerald-800 text-sm">{user?.name ?? 'นักท่องเที่ยว'}</span>
          <Link to="/traveler/profile">
            <ProfileAvatar src={PROFILE_AVATAR} alt="" tone="traveler" size="xs" />
          </Link>
        </motion.header>

        <AnimatePresence>
          {mobileMenuOpen && <PortalMobileBackdrop onClose={() => setMobileMenuOpen(false)} />}
        </AnimatePresence>

        <main className="flex-1 px-5 md:px-12 py-10">
          <PortalPageOutlet />
        </main>
        <PortalAIChatWidget role="traveler" />
      </div>
    </div>
  );
}
