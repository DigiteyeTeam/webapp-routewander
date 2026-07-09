import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, Compass, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';

export default function TravelerCheckoutLogin() {
  const { login, role } = useAuth();
  const navigate = useNavigate();

  if (role === 'traveler') {
    return <Navigate to="/checkout" replace />;
  }

  const handleLogin = () => {
    login('traveler');
    navigate('/checkout', { replace: true });
  };

  return (
    <div className="max-w-md mx-auto py-8 md:py-16">
      <Link
        to="/cart"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        กลับตะกร้า
      </Link>

      <div className="rounded-3xl border border-surface-variant bg-surface-container-lowest shadow-soft overflow-hidden">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white px-6 py-8">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold mb-2">เข้าสู่ระบบเพื่อชำระเงิน</h1>
          <p className="text-white/85 text-sm leading-relaxed">
            การจองเส้นทางสำหรับ<strong className="text-white">นักท่องเที่ยว</strong>เท่านั้น — ล็อกอินเพื่อดำเนินการชำระเงินต่อ
          </p>
        </div>

        <div className="px-6 py-8 space-y-6">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100">
            <Compass className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-on-surface">ล็อกอินในฐานะนักท่องเที่ยว</p>
              <p className="text-xs text-secondary mt-1">จองเส้นทาง สะสมแบดจ์ และติดตามทริปของคุณ</p>
            </div>
          </div>

          <GoogleSignInButton onClick={handleLogin} label="เข้าสู่ระบบด้วย Google" />

          <p className="text-center text-xs text-secondary leading-relaxed">
            ครีเอเตอร์หรือโรงแรมพันธมิตร?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              ไปหน้าเข้าสู่ระบบหลัก
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
