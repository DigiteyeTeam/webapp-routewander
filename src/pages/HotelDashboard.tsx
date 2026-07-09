import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Building2,
  CircleDollarSign,
  Hotel,
  Luggage,
  MapPin,
  QrCode,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Verified,
} from 'lucide-react';
import { HOTEL_LIBRARY_PATH } from '../config/navigation';
import ProfileAvatar from '../components/ProfileAvatar';
import { MotionPage, MotionHeader, MotionSection, MotionList, MotionListItem, MotionCard } from '../components/motion/PortalMotion';
import {
  HOTEL_COMMISSION_BARS,
  HOTEL_IMPACT_METRICS,
  MOCK_HOTEL_PROFILE,
  getHotelAiRecommendations,
  getHotelDashboardStats,
  getHotelFollowedRoutes,
  getHotelRecentBookings,
} from '../data/hotelProfile';

const impactIcons: Record<string, typeof CircleDollarSign> = {
  'hotel-commission': CircleDollarSign,
  'guest-bookings': Luggage,
  'qr-scans': QrCode,
  conversion: TrendingUp,
};

export default function HotelDashboard() {
  const profile = MOCK_HOTEL_PROFILE;
  const stats = getHotelDashboardStats();
  const followedRoutes = getHotelFollowedRoutes();
  const aiRecommendations = getHotelAiRecommendations();
  const recentBookings = getHotelRecentBookings();

  return (
    <MotionPage className="w-full max-w-7xl mx-auto space-y-10">
      <MotionHeader className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider">
            Hotel Partner
          </div>
          <h1 className="font-display-lg text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
            ศูนย์โรงแรม RouteWander
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl">
            วิเคราะห์การจองจากแขก · คอมมิชชันของโรงแรม · และเส้นทางที่ติดตาม
          </p>
        </div>
        <Link
          to={HOTEL_LIBRARY_PATH}
          className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white h-14 px-8 rounded-xl font-bold text-lg hover:bg-orange-600 transition-all shadow-md shrink-0"
        >
          <MapPin className="w-5 h-5" />
          คลังเส้นทาง
        </Link>
      </MotionHeader>

      <MotionSection className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 md:p-6 rounded-2xl bg-surface-container-lowest border border-orange-100 shadow-sm">
        <ProfileAvatar src={profile.avatar} alt={profile.name} tone="hotel" size="md" />
        <div className="flex-1 text-center sm:text-left min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <h2 className="text-xl md:text-2xl font-bold text-on-surface">{profile.name}</h2>
            {profile.verified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
                <Verified className="w-3.5 h-3.5" /> พันธมิตร
              </span>
            )}
          </div>
          <p className="text-secondary text-sm md:text-base mb-2">{profile.tagline}</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-xs text-secondary">
            <span>{profile.district}</span>
            <span>·</span>
            <span>พันธมิตรตั้งแต่ {profile.memberSince}</span>
            <span>·</span>
            <span>ติดตาม {stats.routesFollowed} เส้นทาง</span>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 border border-orange-100 text-orange-800 text-sm font-bold">
          <QrCode className="w-4 h-4" />
          QR {profile.qrPlacements} จุด
        </div>
      </MotionSection>

      <MotionSection className="rounded-2xl overflow-hidden border border-orange-200 shadow-sm">
        <div className="bg-orange-600 px-5 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-white text-lg leading-tight">IMPACT</h2>
            <p className="text-white/80 text-xs">ภาพรวมผลงานของโรงแรมในเดือนนี้</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-surface-container-lowest divide-y sm:divide-y-0 sm:divide-x divide-surface-variant">
          {HOTEL_IMPACT_METRICS.map((m) => {
            const Icon = impactIcons[m.key] ?? CircleDollarSign;
            return (
              <div key={m.key} className="p-5 hover:bg-orange-50/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${m.trendUp ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}
                  >
                    {m.trend}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-secondary uppercase tracking-wider">{m.labelEn}</p>
                <p className="font-bold text-on-surface text-sm mb-1">{m.label}</p>
                <p className="text-2xl font-extrabold text-orange-700 mb-2">{m.value}</p>
                <p className="text-xs text-secondary leading-snug">{m.desc}</p>
              </div>
            );
          })}
        </div>
      </MotionSection>

      <MotionSection className="rounded-2xl border border-orange-100 bg-orange-50/40 p-6">
        <h3 className="font-bold text-on-surface mb-2">การจองผ่านโรงแรมทำงานอย่างไร</h3>
        <p className="text-sm text-on-surface-variant leading-relaxed max-w-3xl">
          แขกที่พักโรงแรมสามารถจองเส้นทางที่คุณ<strong className="text-on-surface">ติดตามไว้</strong>ในตลาดเส้นทางผ่าน QR หรือลิงก์ของโรงแรม
          — เส้นทางหนึ่งอาจมีหลายโรงแรมติดตาม แต่การจองจะผูกกับช่องทางที่แขกเข้ามา
          คุณจะเห็นเฉพาะ<strong className="text-orange-800">คอมมิชชันและสถิติของโรงแรม</strong>ในหน้านี้
        </p>
      </MotionSection>

      <MotionSection className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-2xl border border-orange-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-orange-100 bg-orange-50 flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-orange-700" />
            <div>
              <p className="text-[10px] font-bold text-orange-600 uppercase">Booking Analytics</p>
              <h3 className="font-bold text-on-surface">การจองและคอมมิชชันของคุณ</h3>
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col gap-5">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-surface rounded-xl p-4 border border-surface-variant text-center">
                <p className="text-3xl font-extrabold text-on-surface">{stats.bookingsThisMonth}</p>
                <p className="text-xs text-secondary mt-1">จองผ่านโรงแรม</p>
              </div>
              <div className="bg-surface rounded-xl p-4 border border-surface-variant text-center">
                <p className="text-3xl font-extrabold text-orange-700">{stats.qrScansThisMonth}</p>
                <p className="text-xs text-secondary mt-1">สแกน QR</p>
              </div>
              <div className="bg-surface rounded-xl p-4 border border-surface-variant text-center">
                <p className="text-3xl font-extrabold text-orange-700">{stats.monthlyCommissionFormatted}</p>
                <p className="text-xs text-secondary mt-1">คอมมิชชันเดือนนี้</p>
              </div>
            </div>
            <div className="flex-1 flex gap-3 relative pt-2 min-h-[120px]">
              <div className="flex flex-col justify-between text-[10px] text-secondary pr-2 border-r border-surface-variant pb-6">
                <span>สูง</span>
                <span>กลาง</span>
                <span>ต่ำ</span>
              </div>
              <div className="flex-1 flex items-end justify-between gap-1.5 pb-6 h-full">
                {HOTEL_COMMISSION_BARS.map((h, i) => (
                  <div key={i} className="flex-1 h-full flex items-end">
                    <div
                      className="w-full bg-orange-500 rounded-t-md opacity-90 hover:opacity-100 transition-opacity"
                      style={{ height: `${h}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[10px] text-secondary">
                {['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.'].map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </div>
            <p className="text-xs text-secondary text-center">อัตราแปลงจากสแกน QR เป็นจอง: {stats.conversionRate}%</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-violet-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-violet-100 bg-violet-50 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-violet-600" />
            <div>
              <p className="text-[10px] font-bold text-violet-600 uppercase">AI Guest Route Matching</p>
              <h3 className="font-bold text-on-surface">AI แนะนำเส้นทางให้แขกโรงแรม</h3>
            </div>
          </div>
          <div className="p-6 space-y-3">
            <p className="text-xs text-secondary mb-2">
              วิเคราะห์พฤติกรรมแขกที่พัก · แนะนำเส้นทางที่ติดตามไว้ให้โปรโมตที่ล็อบบี้
            </p>
            {aiRecommendations.map((item) => (
              <div
                key={item.routeId}
                className="flex items-start gap-4 p-3 rounded-xl border border-surface-variant hover:border-violet-200 hover:bg-violet-50/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex flex-col items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[10px] font-extrabold">{item.match}%</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-on-surface">{item.route}</p>
                  <p className="text-[11px] text-violet-700 font-medium mt-0.5">{item.guestProfile}</p>
                  <p className="text-xs text-secondary mt-1 leading-snug">{item.reason}</p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 ${
                    item.demand === 'สูงมาก'
                      ? 'bg-orange-500 text-white'
                      : item.demand === 'สูง'
                        ? 'bg-violet-100 text-violet-700'
                        : 'bg-surface-variant text-secondary'
                  }`}
                >
                  {item.demand}
                </span>
              </div>
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-on-surface">เส้นทางที่ติดตาม</h2>
            <p className="text-secondary text-sm mt-1">เส้นทางในตลาดที่โรงแรมกดติดตาม — แขกจองผ่านช่องทางของคุณได้</p>
          </div>
          <Link
            to={HOTEL_LIBRARY_PATH}
            className="hidden sm:flex items-center gap-2 text-orange-600 font-bold text-sm hover:underline shrink-0"
          >
            ดูในคลังเส้นทาง <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {followedRoutes.map((route) => (
            <div
              key={route.routeId}
              className="flex flex-col lg:flex-row items-center gap-5 p-5 bg-surface-container-lowest rounded-2xl border border-surface-variant hover:shadow-md transition-all group"
            >
              <div className="relative w-full lg:w-44 h-28 rounded-xl overflow-hidden shrink-0">
                <img
                  src={route.image}
                  alt={route.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-2 right-2 flex items-center gap-0.5 bg-violet-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-white" /> AI {route.aiMatch}%
                </div>
              </div>
              <div className="flex-1 min-w-0 w-full">
                <h3 className="font-bold text-lg text-on-surface mb-1">{route.title}</h3>
                <p className="text-xs text-secondary mb-3">โรงแรมติดตาม {route.hotelsFollowing} แห่ง</p>
                <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                  <div>
                    <span className="block text-[10px] font-bold text-secondary uppercase">จองผ่านคุณ</span>
                    <span className="font-bold text-on-surface">{route.bookingsViaHotel} ครั้ง</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-secondary uppercase">คอมมิชชันเดือนนี้</span>
                    <span className="font-bold text-orange-700">{route.commissionFormatted}</span>
                  </div>
                </div>
              </div>
              <Link
                to={`/route/${route.routeId}`}
                className="w-full lg:w-auto px-5 h-11 bg-orange-50 text-orange-800 font-bold rounded-xl hover:bg-orange-100 transition-colors flex items-center justify-center gap-2 text-sm border border-orange-200"
              >
                ดูในตลาด <Hotel className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </MotionSection>

      <MotionSection className="rounded-2xl border border-surface-variant bg-surface-container-lowest overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-surface-variant flex items-center gap-3">
          <Building2 className="w-5 h-5 text-orange-700" />
          <h3 className="font-bold text-on-surface">รายการจองล่าสุดผ่านโรงแรม</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-container-low text-left text-[11px] font-bold text-secondary uppercase">
                <th className="px-5 py-3">วันที่</th>
                <th className="px-5 py-3">เส้นทาง</th>
                <th className="px-5 py-3 text-right">คอมมิชชันของคุณ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant">
              {recentBookings.map((bk) => (
                <tr key={bk.id} className="hover:bg-orange-50/30">
                  <td className="px-5 py-3 text-secondary whitespace-nowrap">{bk.date}</td>
                  <td className="px-5 py-3 font-medium text-on-surface max-w-[200px] truncate">{bk.routeTitle}</td>
                  <td className="px-5 py-3 text-right font-bold text-orange-700">{bk.hotelCommissionFormatted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MotionSection>
    </MotionPage>
  );
}
