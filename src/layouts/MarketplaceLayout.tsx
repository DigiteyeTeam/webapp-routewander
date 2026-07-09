import { useState } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { Search, Bell, LogIn, LogOut, User, ShoppingCart } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';
import ProfileAvatar, { roleToAvatarTone } from '../components/ProfileAvatar';
import { getMarketplaceNav } from '../config/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ROLE_LABELS } from '../types/auth';
import { PROFILE_AVATAR } from '../data/profileAvatar';
import { headerReveal } from '../lib/motion';

export type MarketplaceOutletContext = {
  setMapFullscreen: (value: boolean) => void;
};

export default function MarketplaceLayout() {
  const [mapFullscreen, setMapFullscreen] = useState(false);
  const reduceMotion = useReducedMotion();
  const { role, user, isLoggedIn, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const navItems = getMarketplaceNav(role);

  const profileLink =
    role === 'creator' ? '/creator/profile' : role === 'hotel' ? '/hotel/profile' : '/traveler/profile';

  return (
    <div
      className={`bg-surface font-body-md text-on-surface flex flex-col selection:bg-primary selection:text-on-primary ${
        mapFullscreen ? 'h-screen overflow-hidden' : 'min-h-screen'
      }`}
    >
      <motion.header
        className="sticky top-0 w-full z-40 bg-surface/80 backdrop-blur-md border-b border-surface-variant flex justify-between items-center h-[64px] md:h-[72px] px-4 md:px-6 shrink-0"
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        variants={headerReveal}
      >
        <div className="flex items-center gap-6 md:gap-8 min-w-0">
          <BrandLogo to="/" iconClassName="w-14 h-14" textClassName="text-base md:text-lg font-bold text-primary leading-none" />
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `font-semibold text-sm transition-colors flex items-center gap-1 ${
                    isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          <div className="hidden lg:flex bg-surface-container-low border border-surface-variant rounded-full px-4 py-2 items-center gap-2 w-64 focus-within:border-primary transition-all">
            <Search className="text-on-surface-variant w-5 h-5" />
            <input className="bg-transparent border-none focus:ring-0 w-full text-sm outline-none" placeholder="ค้นหาเส้นทาง..." type="text" />
          </div>
          {isLoggedIn && user && (
            <span className="hidden xl:inline text-xs font-medium text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-full border border-surface-variant">
              {ROLE_LABELS[user.role]}
            </span>
          )}
          <Link
            to="/cart"
            className="relative text-on-surface-variant hover:text-primary transition-opacity p-2"
            aria-label="ตะกร้า"
          >
            <ShoppingCart className="w-6 h-6" />
            {itemCount > 0 && (
              <motion.span
                key={itemCount}
                initial={reduceMotion ? false : { scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center"
              >
                {itemCount}
              </motion.span>
            )}
          </Link>
          <button type="button" className="text-on-surface-variant hover:text-primary transition-opacity p-2">
            <Bell className="w-6 h-6" />
          </button>
          {isLoggedIn ? (
            <>
              <Link to={profileLink} className="hover:opacity-90 transition-opacity">
                <ProfileAvatar
                  src={PROFILE_AVATAR}
                  alt="รูปโปรไฟล์"
                  tone={roleToAvatarTone(role)}
                  size="sm"
                />
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="hidden md:flex items-center gap-1 text-xs font-semibold text-on-surface-variant hover:text-primary px-2 py-1"
                title="ออกจากระบบ"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary text-on-primary px-4 py-2 text-sm font-bold hover:opacity-90 transition-opacity"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">เข้าสู่ระบบ</span>
            </Link>
          )}
        </div>
      </motion.header>

      {isLoggedIn && (
        <nav className="md:hidden flex gap-1 overflow-x-auto px-4 py-2 border-b border-surface-variant bg-surface-container-lowest shrink-0">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  isActive ? 'bg-primary text-on-primary' : 'text-on-surface-variant bg-surface'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}

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
        <motion.footer
          className="bg-surface-variant w-full flex flex-col gap-8 py-12 px-5 md:px-6 mt-auto border-t border-outline-variant/20 shrink-0"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h4 className="font-semibold text-sm text-on-surface mb-2">RouteWander</h4>
              <p className="text-on-surface-variant text-xs">© 2026 RouteWander ระบบอนุญาตเส้นทางท่องเที่ยว สงวนลิขสิทธิ์</p>
            </div>
            <div className="flex flex-wrap gap-6">
              <a className="text-on-surface-variant hover:text-primary transition-colors text-xs" href="#">
                นโยบายความเป็นส่วนตัว
              </a>
              <a className="text-on-surface-variant hover:text-primary transition-colors text-xs" href="#">
                ข้อกำหนดการใช้งาน
              </a>
              <Link to="/login" className="text-on-surface-variant hover:text-primary transition-colors text-xs">
                เข้าสู่ระบบ
              </Link>
            </div>
          </div>

          <div className="max-w-7xl mx-auto w-full pt-6 border-t border-outline-variant/20">
            <Link
              to="/login#creator"
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-violet-200 bg-violet-50/80 px-5 py-4 hover:bg-violet-50 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-violet-100 text-violet-700">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-violet-900">ผู้สร้างเส้นทางชุมชน</p>
                  <p className="text-xs text-violet-900/70 mt-0.5">
                    สร้างและเผยแพร่เส้นทางท่องเที่ยวชุมชนผ่าน Creator Studio
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-violet-700 group-hover:underline shrink-0">เข้าสู่ระบบครีเอเตอร์ →</span>
            </Link>
          </div>
        </motion.footer>
      )}
    </div>
  );
}
