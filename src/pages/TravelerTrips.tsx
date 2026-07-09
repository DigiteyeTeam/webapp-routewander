import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Circle,
  Compass,
  Map,
  MapPin,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react';
import ProfileAvatar from '../components/ProfileAvatar';
import TravelerBadgeCard from '../components/traveler/TravelerBadgeCard';
import { MotionPage, MotionHeader, MotionSection, MotionList, MotionListItem, MotionCard } from '../components/motion/PortalMotion';
import {
  MOCK_TRAVELER_PROFILE,
  TRAVELER_BADGES,
  TRAVELER_MISSIONS,
  getTravelerDashboardStats,
  getTravelerTrips,
} from '../data/travelerProfile';

const statusLabel: Record<string, { text: string; className: string }> = {
  active: { text: 'กำลังเดินทาง', className: 'bg-blue-500 text-white' },
  upcoming: { text: 'นัดหมาย', className: 'bg-sky-100 text-sky-800' },
  completed: { text: 'จบแล้ว', className: 'bg-surface-variant text-secondary' },
};

export default function TravelerTrips() {
  const profile = MOCK_TRAVELER_PROFILE;
  const stats = getTravelerDashboardStats();
  const trips = getTravelerTrips();
  const xpPercent = Math.round((profile.xp / profile.xpToNextLevel) * 100);

  return (
    <MotionPage className="w-full max-w-7xl mx-auto space-y-10">
      <MotionHeader className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            Traveler Hub
          </div>
          <h1 className="font-display-lg text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
            เที่ยวของฉัน
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl">
            เส้นทางที่จอง ภารกิจบนเส้นทาง และแบดจ์ที่สะสมได้
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white h-14 px-8 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-md shrink-0"
        >
          <Map className="w-5 h-5" />
          ตลาดเส้นทาง
        </Link>
      </MotionHeader>

      <MotionSection className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 md:p-6 rounded-2xl bg-surface-container-lowest border border-blue-100 shadow-sm">
        <ProfileAvatar src={profile.avatar} alt={profile.name} tone="traveler" size="md" />
        <div className="flex-1 text-center sm:text-left min-w-0">
          <h2 className="text-xl md:text-2xl font-bold text-on-surface mb-1">{profile.name}</h2>
          <p className="text-secondary text-sm md:text-base mb-2">{profile.tagline}</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-xs text-secondary">
            <span>Lv.{profile.level}</span>
            <span>·</span>
            <span>{profile.xp} XP</span>
            <span>·</span>
            <span>{profile.badgesEarned} แบดจ์</span>
            <span>·</span>
            <span>สมาชิกตั้งแต่ {profile.memberSince}</span>
          </div>
        </div>
        <div className="shrink-0 grid grid-cols-3 gap-2 text-center">
          <div className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-100">
            <p className="text-xl font-extrabold text-blue-700">{stats.activeTrips}</p>
            <p className="text-[10px] font-bold text-secondary uppercase">กำลังเดินทาง</p>
          </div>
          <div className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-100">
            <p className="text-xl font-extrabold text-blue-700">{stats.upcomingTrips}</p>
            <p className="text-[10px] font-bold text-secondary uppercase">นัดหมาย</p>
          </div>
          <div className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-100">
            <p className="text-xl font-extrabold text-blue-700">{stats.completedTrips}</p>
            <p className="text-[10px] font-bold text-secondary uppercase">จบแล้ว</p>
          </div>
        </div>
      </MotionSection>

      <MotionSection className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-on-surface">ทริปของฉัน</h2>
            <p className="text-secondary text-sm mt-1">เส้นทางที่จองและกำลังเดินทาง</p>
          </div>
        </div>

        <div className="space-y-4">
          {trips.map((trip) => {
            const badge = statusLabel[trip.status];
            return (
              <div
                key={trip.id}
                className="flex flex-col lg:flex-row items-stretch gap-5 p-5 bg-surface-container-lowest rounded-2xl border border-surface-variant hover:shadow-md transition-all"
              >
                <div className="relative w-full lg:w-48 h-32 rounded-xl overflow-hidden shrink-0">
                  <img src={trip.image} alt={trip.title} className="w-full h-full object-cover" />
                  <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.className}`}>
                    {badge.text}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-on-surface mb-1">{trip.title}</h3>
                  <p className="text-xs text-secondary mb-3 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {trip.district} · {trip.dateLabel}
                  </p>
                  {trip.hotelName && (
                    <p className="text-xs text-blue-700 font-medium mb-3 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      จองผ่าน {trip.hotelName}
                    </p>
                  )}
                  <div className="mb-3">
                    <div className="flex justify-between text-[10px] font-bold text-secondary uppercase mb-1">
                      <span>ความคืบหน้าเส้นทาง</span>
                      <span>{trip.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-variant overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${trip.progress}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-secondary">
                    ภารกิจ {trip.missionsDone}/{trip.missionsTotal} สำเร็จ
                  </p>
                </div>
                <Link
                  to={`/route/${trip.routeId}`}
                  className="self-center lg:self-auto shrink-0 px-5 h-11 bg-blue-50 text-blue-800 font-bold rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 text-sm border border-blue-200"
                >
                  ดูเส้นทาง <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </MotionSection>

      <MotionSection id="missions" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-2xl border border-blue-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-blue-100 bg-blue-50 flex items-center gap-3">
            <Target className="w-5 h-5 text-blue-700" />
            <div>
              <p className="text-[10px] font-bold text-blue-600 uppercase">Missions</p>
              <h3 className="font-bold text-on-surface">ภารกิจ & XP</h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-3 gap-3 mb-2">
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 text-center">
                <p className="text-2xl font-extrabold text-blue-700">{profile.xp}</p>
                <p className="text-[10px] font-bold text-secondary uppercase">XP สะสม</p>
              </div>
              <div className="rounded-xl bg-surface border border-surface-variant p-3 text-center">
                <p className="text-2xl font-extrabold text-on-surface">{profile.badgesEarned}</p>
                <p className="text-[10px] font-bold text-secondary uppercase">แบดจ์</p>
              </div>
              <div className="rounded-xl bg-surface border border-surface-variant p-3 text-center">
                <p className="text-2xl font-extrabold text-on-surface">Lv.{profile.level}</p>
                <p className="text-[10px] font-bold text-secondary uppercase">ระดับ</p>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-xs font-bold text-secondary mb-1">
                <span>ถัดไป Lv.{profile.level + 1}</span>
                <span>{profile.xp}/{profile.xpToNextLevel} XP</span>
              </div>
              <div className="h-2.5 rounded-full bg-surface-variant overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${xpPercent}%` }} />
              </div>
            </div>
            <ul className="space-y-2">
              {TRAVELER_MISSIONS.map((m) => (
                <li
                  key={m.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border ${
                    m.done ? 'border-blue-100 bg-blue-50/50' : 'border-surface-variant bg-surface'
                  }`}
                >
                  {m.done ? (
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm ${m.done ? 'text-secondary line-through' : 'text-on-surface'}`}>
                      {m.title}
                    </p>
                    {m.tripTitle && <p className="text-[11px] text-secondary mt-0.5">{m.tripTitle}</p>}
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-full shrink-0">
                    +{m.xp} XP
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-blue-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 via-indigo-50/80 to-violet-50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/80 border border-blue-100 flex items-center justify-center shadow-sm">
                <Trophy className="w-5 h-5 text-blue-700" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Achievement</p>
                <h3 className="font-bold text-on-surface">แบดจ์ของฉัน</h3>
              </div>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-white/70 border border-blue-100 px-3 py-1.5 rounded-full">
              {TRAVELER_BADGES.filter((b) => b.earned).length}/{TRAVELER_BADGES.length}
            </span>
          </div>
          <div className="p-6 bg-gradient-to-b from-blue-50/30 to-transparent">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {TRAVELER_BADGES.map((badge) => (
                <TravelerBadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
            <p className="mt-6 text-center text-sm text-secondary flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-500" />
              ทำภารกิจขณะเดินทางเพื่อปลดล็อกแบดจ์เพิ่ม
            </p>
          </div>
        </div>
      </MotionSection>

      {trips.length === 0 && (
        <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/30 p-10 text-center">
          <Compass className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <p className="text-on-surface-variant mb-6">ยังไม่มีทริปที่จอง — เริ่มจากตลาดเส้นทาง</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 text-white px-6 py-2.5 font-bold text-sm hover:bg-blue-700 transition-colors"
          >
            <CalendarDays className="w-4 h-4" />
            ไปตลาดเส้นทาง
          </Link>
        </div>
      )}
    </MotionPage>
  );
}
