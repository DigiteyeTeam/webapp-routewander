import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';
import { getLoginRedirect } from '../config/navigation';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types/auth';
import loginHighlight from '../images/rwhilogin.png';
import { fadeIn, fadeUp, slideFromLeft, slideFromRight, staggerContainer } from '../lib/motion';

type EarnerRole = 'creator' | 'hotel';

function mockGoogleLogin(
  role: Exclude<UserRole, 'guest'>,
  login: (r: Exclude<UserRole, 'guest'>) => void,
  navigate: ReturnType<typeof useNavigate>,
  next?: string | null,
) {
  login(role);
  if (next && next.startsWith('/')) {
    navigate(next);
    return;
  }
  navigate(getLoginRedirect(role));
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [searchParams] = useSearchParams();
  const next = searchParams.get('next');
  const [earnerRole, setEarnerRole] = useState<EarnerRole>('creator');

  useEffect(() => {
    if (window.location.hash === '#creator') {
      document.getElementById('earn')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-body-md text-on-surface overflow-hidden">
      <motion.section
        className="login-page w-full lg:w-[70%] shrink-0 flex flex-col overflow-hidden lg:min-h-screen relative"
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        variants={slideFromLeft}
      >
        {!reduceMotion && (
          <>
            <motion.div
              className="absolute top-20 right-10 w-48 h-48 rounded-full bg-white/10 blur-3xl pointer-events-none"
              animate={{ y: [0, -20, 0], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute bottom-32 left-16 w-32 h-32 rounded-full bg-emerald-200/15 blur-2xl pointer-events-none"
              animate={{ y: [0, 16, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            />
          </>
        )}

        <div className="flex flex-col px-6 sm:px-8 md:px-10 lg:px-12 pt-6 md:pt-8 pb-8 lg:pb-4 flex-1 lg:min-h-0 relative z-10">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <BrandLogo to="/" iconClassName="w-11 h-11 lg:w-12 lg:h-12" textClassName="text-base lg:text-lg font-bold text-white" />
          </motion.div>

          <motion.div
            className="flex flex-col justify-center py-6 lg:flex-1 lg:py-8 max-w-2xl"
            variants={staggerContainer(0.1, 0.2)}
            initial={reduceMotion ? false : 'hidden'}
            animate="visible"
          >
            <motion.p
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white/90 text-xs font-bold uppercase tracking-wider mb-4 w-fit"
            >
              Welcome · RouteWander
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4"
            >
              ยินดีต้อนรับสู่ตลาดเส้นทางชุมชน
            </motion.h1>
            <motion.p variants={fadeUp} className="text-base sm:text-lg text-white/85 leading-relaxed max-w-xl">
              จองเส้นทางจากครีเอเตอร์ท้องถิ่น สะสมแบดจ์ และสร้างรายได้ให้ชุมชนภูเก็ตไปพร้อมกัน
            </motion.p>
          </motion.div>
        </div>

        <motion.div
          className="hidden lg:block shrink-0 w-full mt-auto relative z-10"
          initial={reduceMotion ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={loginHighlight}
            alt="RouteWander — ตลาดเส้นทางชุมชนภูเก็ต"
            className="w-full h-auto object-contain object-bottom block"
          />
        </motion.div>
      </motion.section>

      <motion.aside
        className="w-full lg:w-[30%] min-h-0 lg:min-h-screen flex flex-col bg-surface-container-low border-t lg:border-t-0 lg:border-l border-surface-variant"
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        variants={slideFromRight}
      >
        <div className="flex-1 flex items-center justify-center px-5 sm:px-6 py-8 lg:py-10 overflow-y-auto">
          <motion.div
            className="w-full max-w-[360px] space-y-5"
            variants={staggerContainer(0.12, 0.15)}
            initial={reduceMotion ? false : 'hidden'}
            animate="visible"
          >
            <motion.div variants={fadeIn}>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                กลับไปตลาดเส้นทาง
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUp}
              whileHover={reduceMotion ? undefined : { y: -3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="bg-surface-container-lowest rounded-2xl border border-surface-variant shadow-sm px-6 sm:px-7 py-7 sm:py-8"
            >
              <div className="mb-5">
                <h2 className="text-xl font-bold text-on-surface mb-1">ล็อกอิน นักท่องเที่ยว</h2>
                <p className="text-sm text-on-surface-variant">จองเส้นทาง สะสมแบดจ์ และติดตามทริปของคุณ</p>
              </div>
              <GoogleSignInButton onClick={() => mockGoogleLogin('traveler', login, navigate, next)} />
            </motion.div>

            <motion.div
              id="earn"
              variants={fadeUp}
              whileHover={reduceMotion ? undefined : { y: -3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="login-creator-card scroll-mt-8 rounded-2xl shadow-md px-6 sm:px-7 py-7 sm:py-8 text-white"
            >
              <div className="mb-5">
                <h2 className="text-xl font-bold mb-1">สร้างรายได้</h2>
                <p className="text-sm text-white/90 leading-relaxed">
                  สำหรับ<strong className="font-bold text-white">ผู้สร้างเส้นทางชุมชน</strong> และ<strong className="font-bold text-white">โรงแรมพันธมิตร</strong> — เข้าสู่ระบบเพื่อสร้างรายได้จากเส้นทาง
                </p>
              </div>

              <div className="mb-5">
                <label htmlFor="earner-role" className="block text-sm font-medium text-white/95 mb-1.5">
                  เลือกผู้สร้างรายได้
                </label>
                <select
                  id="earner-role"
                  value={earnerRole}
                  onChange={(e) => setEarnerRole(e.target.value as EarnerRole)}
                  className="w-full rounded-lg border border-white/30 bg-white/95 text-on-surface px-3 py-2.5 text-sm outline-none focus:border-white focus:ring-2 focus:ring-white/40"
                >
                  <option value="creator">ผู้สร้างเส้นทางชุมชน</option>
                  <option value="hotel">โรงแรมพันธมิตร</option>
                </select>
              </div>

              <GoogleSignInButton onClick={() => mockGoogleLogin(earnerRole, login, navigate, next)} />
            </motion.div>
          </motion.div>
        </div>
      </motion.aside>
    </div>
  );
}
