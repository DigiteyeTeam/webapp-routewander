import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Map as MapIcon, PlusCircle, CircleDollarSign, User, Settings, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import BrandLogo from '../components/BrandLogo';
import { PROFILE_AVATAR } from '../data/profileAvatar';

export default function CreatorLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <div className="font-body-md text-on-surface antialiased overflow-x-hidden min-h-screen flex bg-surface">
      <aside className={`fixed md:sticky top-0 h-screen w-64 bg-surface-container-low border-r border-surface-variant z-40 transition-transform transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col`}>
        <div className="px-6 py-8">
          <BrandLogo to="/creator/dashboard" iconClassName="w-12 h-12" textClassName="text-base font-bold text-primary leading-none" />
          <p className="font-label-sm text-secondary mt-2 text-sm">พอร์ทัลครีเอเตอร์</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <Link to="/creator/dashboard" className={`flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/dashboard') ? 'bg-primary-container text-primary font-bold border-l-4 border-primary' : 'text-secondary hover:bg-surface-variant/50'}`}>
            <LayoutDashboard className={`w-5 h-5 ${isActive('/dashboard') ? 'text-primary' : 'text-secondary'}`} />
            <span>ภาพรวม</span>
          </Link>
          <Link to="/creator/routes" className={`flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/routes') && !isActive('/routes/create') ? 'bg-primary-container text-primary font-bold border-l-4 border-primary' : 'text-secondary hover:bg-surface-variant/50'}`}>
            <MapIcon className={`w-5 h-5 ${isActive('/routes') && !isActive('/routes/create') ? 'text-primary' : 'text-secondary'}`} />
            <span>เส้นทางของฉัน</span>
          </Link>
          <Link to="/creator/routes/create" className={`flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/routes/create') ? 'bg-primary text-on-primary font-bold shadow-sm' : 'text-secondary hover:bg-surface-variant/50'}`}>
            <PlusCircle className={`w-5 h-5 ${isActive('/routes/create') ? 'text-on-primary' : 'text-secondary'}`} />
            <span>สร้างเส้นทาง</span>
          </Link>
          <Link to="/creator/earnings" className={`flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/earnings') ? 'bg-primary-container text-primary font-bold border-l-4 border-primary' : 'text-secondary hover:bg-surface-variant/50'}`}>
            <CircleDollarSign className={`w-5 h-5 ${isActive('/earnings') ? 'text-primary' : 'text-secondary'}`} />
            <span>รายได้</span>
          </Link>
          <Link to="/creator/profile" className={`flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors ${isActive('/profile') ? 'bg-primary text-on-primary font-bold shadow-sm' : 'text-secondary hover:bg-surface-variant/50'}`}>
            <User className={`w-5 h-5 ${isActive('/profile') ? 'text-on-primary' : 'text-secondary'}`} />
            <span>โปรไฟล์</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t border-surface-variant space-y-2 mt-auto">
          <Link to="#" className="flex items-center gap-4 px-4 py-3 text-secondary hover:bg-surface-variant/50 rounded-lg font-medium transition-colors">
            <Settings className="w-5 h-5 text-secondary" />
            <span>ตั้งค่า</span>
          </Link>
          <Link to="/" className="flex items-center gap-4 px-4 py-3 text-primary hover:bg-primary-container rounded-lg font-medium transition-colors">
            <LogOut className="w-5 h-5 text-primary" />
            <span>ออกจากพอร์ทัล</span>
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen relative w-full md:w-[calc(100%-256px)]">
        <header className="md:hidden bg-surface flex justify-between items-center w-full px-5 py-4 sticky top-0 z-30 shadow-sm border-b border-surface-variant">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-on-surface-variant hover:bg-surface-variant rounded-md">
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="font-headline-md text-primary font-bold text-xl">ศูนย์ครีเอเตอร์</h2>
          </div>
          <Link to="/creator/profile" className="w-8 h-8 rounded-full overflow-hidden border border-surface-variant">
             <img src={PROFILE_AVATAR} alt="รูปโปรไฟล์" className="w-full h-full object-cover" />
          </Link>
        </header>

        {mobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <main className="flex-1 w-full flex flex-col bg-surface">
          <Outlet />
        </main>

        <footer className="w-full py-8 border-t border-surface-variant bg-surface-container-lowest mt-auto">
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
        </footer>

        {!isActive('/routes/create') && (
          <nav className="md:hidden sticky bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-surface-variant shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
            <div className="flex justify-around items-center h-16 px-2">
              <Link to="/creator/dashboard" className={`flex flex-col items-center justify-center w-full h-full ${isActive('/dashboard') ? 'text-primary' : 'text-secondary hover:text-on-surface'} transition-colors`}>
                <LayoutDashboard className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold">ภาพรวม</span>
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
    </div>
  );
}
