import {
  PlusCircle,
  ArrowRight,
  Edit,
  MapPin,
  Sparkles,
  BarChart3,
  Hotel,
  Store,
  Users,
  Coins,
  Building2,
  Luggage,
  Target,
  Route,
  TrendingUp,
  CircleDollarSign,
  Star,
  Link2,
  Verified,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ProfileAvatar from '../components/ProfileAvatar';
import { MotionPage, MotionHeader, MotionSection, MotionList, MotionListItem, MotionCard } from '../components/motion/PortalMotion';
import {
  MOCK_CREATOR_PROFILE,
  getCreatorDashboardStats,
  getCreatorRoutePerformance,
  getCreatorAiMatches,
  CREATOR_ECOSYSTEM_LINKS,
  CREATOR_REVENUE_BARS,
  CREATOR_IMPACT_METRICS,
} from '../data/creatorProfile';

const INNOVATIONS = [
  {
    id: 1,
    title: 'Creator Economy Engine',
    titleTh: 'เครื่องมือเศรษฐกิจครีเอเตอร์',
    desc: 'เปิดโอกาสให้คนท้องถิ่นสร้าง Route ของตนเอง และสร้างรายได้อย่างยั่งยืน',
    icon: Route,
    accent: 'bg-emerald-500',
    light: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-700',
  },
  {
    id: 2,
    title: 'AI Experience Matching',
    titleTh: 'AI จับคู่ประสบการณ์',
    desc: 'แนะนำเส้นทางและประสบการณ์ที่เหมาะกับความสนใจ เวลา งบประมาณของนักท่องเที่ยว',
    icon: Sparkles,
    accent: 'bg-violet-500',
    light: 'bg-violet-50 border-violet-200',
    text: 'text-violet-700',
  },
  {
    id: 3,
    title: 'Community Intelligence',
    titleTh: 'ข้อมูลเชิงลึกชุมชน',
    desc: 'วิเคราะห์ข้อมูลเชิงลึก เพื่อพัฒนาเส้นทาง คุณภาพ และเศรษฐกิจชุมชน',
    icon: BarChart3,
    accent: 'bg-sky-500',
    light: 'bg-sky-50 border-sky-200',
    text: 'text-sky-700',
  },
  {
    id: 4,
    title: 'Hotel & Local Ecosystem',
    titleTh: 'ระบบนิเวศโรงแรมและท้องถิ่น',
    desc: 'เชื่อมโยง Creator โรงแรม ร้านค้า และนักท่องเที่ยว ในระบบนิเวศเดียวกัน',
    icon: Link2,
    accent: 'bg-amber-500',
    light: 'bg-amber-50 border-amber-200',
    text: 'text-amber-700',
  },
] as const;

function InnovationBadge({ num, accent }: { num: number; accent: string }) {
  return (
    <span className={`w-7 h-7 rounded-full ${accent} text-white text-xs font-bold flex items-center justify-center shrink-0`}>
      {num}
    </span>
  );
}

export default function Dashboard() {
  const profile = MOCK_CREATOR_PROFILE;
  const stats = getCreatorDashboardStats();
  const topRoutes = getCreatorRoutePerformance();
  const aiMatches = getCreatorAiMatches();

  const impactIcons: Record<string, typeof Coins> = {
    'creator-income': Coins,
    'local-business': Store,
    'hotel-experience': Building2,
    'traveler-experience': Luggage,
  };

  const ecosystemIcons: Record<string, typeof Hotel> = {
    โรงแรม: Hotel,
    ร้านค้า: Store,
    ชุมชน: Users,
  };

  return (
    <MotionPage className="p-6 md:p-10 lg:p-14 w-full max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <MotionHeader className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            RW Innovation
          </div>
          <h1 className="font-display-lg text-3xl md:text-4xl lg:text-5xl font-bold text-on-surface tracking-tight">
            ศูนย์ครีเอเตอร์ RouteWander
          </h1>
          <p className="font-body-lg text-lg text-on-surface-variant max-w-2xl">
            แพลตฟอร์มเศรษฐกิจครีเอเตอร์สำหรับการท่องเที่ยวท้องถิ่น · ภูเก็ต
          </p>
        </div>
        <Link
          to="/creator/routes/create"
          className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary h-14 px-8 rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-md shrink-0"
        >
          <PlusCircle className="w-5 h-5" />
          สร้างเส้นทางใหม่
        </Link>
      </MotionHeader>

      {/* Creator profile */}
      <MotionSection className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 md:p-6 rounded-2xl bg-surface-container-lowest border border-surface-variant shadow-sm">
        <ProfileAvatar src={profile.avatar} alt={profile.name} tone="creator" size="md" />
        <div className="flex-1 text-center sm:text-left min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <h2 className="font-headline-md text-xl md:text-2xl font-bold text-on-surface">{profile.name}</h2>
            {profile.verified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-container text-primary text-xs font-bold">
                <Verified className="w-3.5 h-3.5" /> ยืนยันแล้ว
              </span>
            )}
          </div>
          <p className="text-secondary text-sm md:text-base mb-2">{profile.tagline}</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-xs text-secondary">
            <span>{profile.district}</span>
            <span>·</span>
            <span>สมาชิกตั้งแต่ {profile.memberSince}</span>
            <span>·</span>
            <span>{stats.routeCount} เส้นทางในตลาด</span>
          </div>
        </div>
        <Link
          to="/creator/profile"
          className="shrink-0 px-5 h-11 rounded-xl border border-surface-variant font-bold text-sm text-on-surface hover:bg-surface-container-low transition-colors flex items-center justify-center"
        >
          แก้ไขโปรไฟล์
        </Link>
      </MotionSection>

      {/* IMPACT */}
      <MotionSection className="rounded-2xl overflow-hidden border border-primary/20 shadow-sm">
        <div className="bg-primary px-5 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-white text-lg leading-tight">IMPACT</h2>
            <p className="text-white/80 text-xs">ผลกระทบที่ RouteWander สร้างให้ชุมชนและระบบนิเวศ</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-surface-container-lowest divide-y sm:divide-y-0 sm:divide-x divide-surface-variant">
          {CREATOR_IMPACT_METRICS.map((m) => {
            const Icon = impactIcons[m.key] ?? Coins;
            return (
              <div key={m.key} className="p-5 hover:bg-primary/5 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${m.trendUp ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {m.trend}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-secondary uppercase tracking-wider">{m.labelEn}</p>
                <p className="font-bold text-on-surface text-sm mb-1">{m.label}</p>
                <p className="text-2xl font-extrabold text-primary mb-2">{m.value}</p>
                <p className="text-xs text-secondary leading-snug">{m.desc}</p>
              </div>
            );
          })}
        </div>
      </MotionSection>

      {/* 4 Innovations overview */}
      <MotionSection>
        <h2 className="font-headline-md text-xl font-bold text-on-surface mb-4">4 นวัตกรรมหลักของ RouteWander</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INNOVATIONS.map((inv) => {
            const Icon = inv.icon;
            return (
              <div key={inv.id} className={`rounded-2xl border p-4 ${inv.light} transition-shadow hover:shadow-md`}>
                <div className="flex items-center gap-2 mb-3">
                  <InnovationBadge num={inv.id} accent={inv.accent} />
                  <div className={`w-9 h-9 rounded-xl ${inv.accent} text-white flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-[10px] font-bold text-secondary uppercase tracking-wider">{inv.title}</p>
                <h3 className={`font-bold text-sm mb-1.5 ${inv.text}`}>{inv.titleTh}</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">{inv.desc}</p>
              </div>
            );
          })}
        </div>
      </MotionSection>

      {/* Pillar 1 + 3: Creator Economy + Community Intelligence */}
      <MotionSection className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Creator Economy Engine */}
        <div className="bg-surface-container-lowest rounded-2xl border border-emerald-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-emerald-100 bg-emerald-50 flex items-center gap-3">
            <InnovationBadge num={1} accent="bg-emerald-500" />
            <div>
              <p className="text-[10px] font-bold text-emerald-600 uppercase">Creator Economy Engine</p>
              <h3 className="font-bold text-on-surface">เส้นทางและรายได้ของคุณ</h3>
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col gap-5">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-surface rounded-xl p-4 border border-surface-variant text-center">
                <p className="text-3xl font-extrabold text-on-surface">{stats.routeCount}</p>
                <p className="text-xs text-secondary mt-1">เส้นทางของฉัน</p>
              </div>
              <div className="bg-surface rounded-xl p-4 border border-surface-variant text-center">
                <p className="text-3xl font-extrabold text-primary">{stats.purchases}</p>
                <p className="text-xs text-secondary mt-1">ซื้อเส้นทางแล้ว</p>
              </div>
              <div className="bg-surface rounded-xl p-4 border border-surface-variant text-center">
                <p className="text-3xl font-extrabold text-on-surface">{stats.monthlyRevenueFormatted}</p>
                <p className="text-xs text-secondary mt-1">รายได้เดือนนี้</p>
              </div>
            </div>
            <div className="flex-1 flex gap-3 relative pt-2 min-h-[140px]">
              <div className="flex flex-col justify-between text-[10px] text-secondary pr-2 border-r border-surface-variant pb-6">
                <span>฿15k</span><span>฿10k</span><span>฿5k</span><span>฿0</span>
              </div>
              <div className="flex-1 flex items-end justify-between gap-1.5 pb-6 h-full">
                {CREATOR_REVENUE_BARS.map((h, i) => (
                  <div key={i} className="flex-1 h-full flex items-end">
                    <div className="w-full bg-emerald-500 rounded-t-md opacity-90 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }} />
                  </div>
                ))}
              </div>
              <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[10px] text-secondary">
                {['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.'].map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/creator/routes" className="flex-1 h-11 rounded-xl border border-emerald-200 text-emerald-700 font-bold text-sm flex items-center justify-center gap-1 hover:bg-emerald-50 transition-colors">
                <MapPin className="w-4 h-4" /> จัดการเส้นทาง
              </Link>
              <Link to="/creator/earnings" className="flex-1 h-11 rounded-xl bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-1 hover:bg-emerald-600 transition-colors">
                <CircleDollarSign className="w-4 h-4" /> ดูรายได้
              </Link>
            </div>
          </div>
        </div>

        {/* Community Intelligence */}
        <div className="bg-surface-container-lowest rounded-2xl border border-sky-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-sky-100 bg-sky-50 flex items-center gap-3">
            <InnovationBadge num={3} accent="bg-sky-500" />
            <div>
              <p className="text-[10px] font-bold text-sky-600 uppercase">Community Intelligence</p>
              <h3 className="font-bold text-on-surface">ข้อมูลเชิงลึกชุมชน</h3>
            </div>
          </div>
          <div className="p-6 flex-1 space-y-4">
            <div className="bg-sky-50/80 rounded-xl p-4 border border-sky-100">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-on-surface text-sm">ผลกระทบต่อธุรกิจท้องถิ่น</span>
                <span className="text-sky-600 font-bold text-sm">สูง</span>
              </div>
              <p className="text-xs text-secondary leading-relaxed">
                เส้นทางของคุณพานักท่องเที่ยวไปยังร้านค้าท้องถิ่น{' '}
                <strong className="text-on-surface">{stats.localShopsImpact} ร้าน</strong> ในเดือนนี้
                สร้างรายได้ต่อเนื่องให้ชุมชน
              </p>
            </div>
            <div className="bg-sky-50/80 rounded-xl p-4 border border-sky-100">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-on-surface text-sm flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-sky-500" /> คุณภาพเส้นทางชุมชน
                </span>
                <span className="bg-sky-500 text-white text-[10px] px-2 py-0.5 rounded font-bold">แนะนำ</span>
              </div>
              <p className="text-xs text-secondary leading-relaxed">
                เพิ่มจุดแวะชุมชนสนับสนุนในเส้นทางมรดกเมืองเก่า — AI พบว่าความต้องการเพิ่มขึ้น{' '}
                <strong className="text-on-surface">32%</strong>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-surface-variant p-3 text-center">
                <p className="text-xl font-extrabold text-sky-600">{stats.communitiesLinked}</p>
                <p className="text-[11px] text-secondary">ชุมชนที่เชื่อมแล้ว</p>
              </div>
              <div className="rounded-xl border border-surface-variant p-3 text-center">
                <p className="text-xl font-extrabold text-sky-600">{stats.avgRating}</p>
                <p className="text-[11px] text-secondary">คะแนนคุณภาพเฉลี่ย</p>
              </div>
            </div>
          </div>
        </div>
      </MotionSection>

      {/* Pillar 2 + 4: AI Matching + Ecosystem */}
      <MotionSection className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Experience Matching */}
        <div className="bg-surface-container-lowest rounded-2xl border border-violet-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-violet-100 bg-violet-50 flex items-center gap-3">
            <InnovationBadge num={2} accent="bg-violet-500" />
            <div>
              <p className="text-[10px] font-bold text-violet-600 uppercase">AI Experience Matching</p>
              <h3 className="font-bold text-on-surface">การจับคู่ประสบการณ์จาก AI</h3>
            </div>
          </div>
          <div className="p-6 space-y-3">
            <p className="text-xs text-secondary mb-2">เส้นทางของคุณที่ AI แนะนำให้นักท่องเที่ยวและโรงแรมมากที่สุด</p>
            {aiMatches.map((item) => (
              <div key={item.routeId} className="flex items-center gap-4 p-3 rounded-xl border border-surface-variant hover:border-violet-200 hover:bg-violet-50/30 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex flex-col items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[10px] font-extrabold">{item.match}%</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-on-surface truncate">{item.route}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.tags.map((t) => (
                      <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 font-medium">{t}</span>
                    ))}
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 ${
                  item.demand === 'สูงมาก' ? 'bg-primary text-white' : item.demand === 'สูง' ? 'bg-violet-100 text-violet-700' : 'bg-surface-variant text-secondary'
                }`}>
                  {item.demand}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hotel & Local Ecosystem */}
        <div className="bg-surface-container-lowest rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-amber-100 bg-amber-50 flex items-center gap-3">
            <InnovationBadge num={4} accent="bg-amber-500" />
            <div>
              <p className="text-[10px] font-bold text-amber-700 uppercase">Hotel & Local Ecosystem</p>
              <h3 className="font-bold text-on-surface">ระบบนิเวศที่เชื่อมโยงแล้ว</h3>
            </div>
          </div>
          <div className="p-6 space-y-3">
            <p className="text-xs text-secondary mb-2">Creator · โรงแรม · ร้านค้า · นักท่องเที่ยว ในเครือข่ายเดียวกัน</p>
            {CREATOR_ECOSYSTEM_LINKS.map((link) => {
              const Icon = ecosystemIcons[link.type] ?? Users;
              return (
                <div key={link.name} className="flex items-center gap-3 p-3 rounded-xl border border-surface-variant">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-amber-700 uppercase">{link.type}</p>
                    <p className="font-bold text-sm text-on-surface truncate">{link.name}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                    {link.status}
                  </span>
                </div>
              );
            })}
            <div className="mt-4 pt-4 border-t border-surface-variant grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-extrabold text-amber-600">12</p>
                <p className="text-[10px] text-secondary">โรงแรม</p>
              </div>
              <div>
                <p className="text-lg font-extrabold text-amber-600">28</p>
                <p className="text-[10px] text-secondary">ร้านค้า</p>
              </div>
              <div>
                <p className="text-lg font-extrabold text-amber-600">10</p>
                <p className="text-[10px] text-secondary">ชุมชน</p>
              </div>
            </div>
          </div>
        </div>
      </MotionSection>

      {/* Top performing routes */}
      <MotionSection className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-headline-lg text-2xl font-bold text-on-surface">เส้นทางของฉัน</h2>
            <p className="text-secondary text-sm mt-1">เส้นทางของ {profile.name} ในตลาด RouteWander</p>
          </div>
          <Link to="/creator/routes" className="hidden sm:flex items-center gap-2 text-primary font-bold text-sm hover:underline shrink-0">
            ดูเส้นทางทั้งหมด <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {topRoutes.map((route) => (
            <div
              key={route.routeId}
              className="flex flex-col sm:flex-row items-center gap-5 p-5 bg-surface-container-lowest rounded-2xl border border-surface-variant hover:shadow-md transition-all group"
            >
              <div className="relative w-full sm:w-44 h-28 rounded-xl overflow-hidden shrink-0">
                <img src={route.image} alt={route.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className={`absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm shadow ${route.rank === 1 ? 'bg-primary text-white' : 'bg-surface-variant text-on-surface'}`}>
                  {route.rank}
                </div>
                <div className="absolute bottom-2 right-2 flex items-center gap-0.5 bg-violet-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-white" /> AI {route.aiMatch}%
                </div>
              </div>
              <div className="flex-1 min-w-0 w-full">
                <h3 className="font-bold text-lg text-on-surface truncate mb-3">{route.title}</h3>
                <div className="flex flex-wrap gap-x-10 gap-y-2">
                  <div>
                    <span className="block text-[10px] font-bold text-secondary uppercase mb-0.5">ซื้อแล้ว</span>
                    <span className="text-lg font-bold text-on-surface">{route.purchases}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-secondary uppercase mb-0.5">รายได้</span>
                    <span className="text-lg font-bold text-primary">{route.revenueFormatted}</span>
                  </div>
                </div>
              </div>
              <Link
                to={`/route/${route.routeId}`}
                className="w-full sm:w-auto px-5 h-11 bg-primary-container/30 text-primary font-bold rounded-xl hover:bg-primary-container transition-colors flex items-center justify-center gap-2 text-sm"
              >
                ดูรายละเอียด <Edit className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </MotionSection>
    </MotionPage>
  );
}
