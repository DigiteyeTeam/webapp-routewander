import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  CheckCircle,
  MapPin,
  Clock,
  ShieldCheck,
  Zap,
  Edit,
  Car,
  Hotel,
  Utensils,
  Flag,
  ShoppingBag,
  CalendarDays,
  Users,
  ArrowLeft,
  Star,
  Route as RouteIcon,
} from 'lucide-react';
import { getRouteById, formatDistance, formatDurationLong } from '../data/routeStore';
import { formatPrice } from '../data/marketplaceRoutes';
import { WAYPOINT_TYPE_LABELS, type WaypointType } from '../types/route';
import RouteDetailMap from '../components/route/RouteDetailMap';
import RouteTrail from '../components/marketplace/RouteTrail';

function getTypeIcon(type: WaypointType) {
  switch (type) {
    case 'meeting':
      return <Car className="w-4 h-4" />;
    case 'hotel':
      return <Hotel className="w-4 h-4" />;
    case 'restaurant':
      return <Utensils className="w-4 h-4" />;
    case 'shop':
      return <ShoppingBag className="w-4 h-4" />;
    case 'event':
      return <CalendarDays className="w-4 h-4" />;
    case 'activity':
      return <Users className="w-4 h-4" />;
    case 'end':
      return <Flag className="w-4 h-4" />;
    default:
      return <MapPin className="w-4 h-4" />;
  }
}

function NotFound() {
  return (
    <div className="text-center py-24">
      <RouteIcon className="w-16 h-16 mx-auto mb-4 text-surface-variant" />
      <h1 className="text-2xl font-bold mb-2">ไม่พบเส้นทาง</h1>
      <p className="text-secondary mb-6">เส้นทางนี้อาจถูกลบหรือไม่มีอยู่ในระบบ</p>
      <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        กลับตลาดเส้นทาง
      </Link>
    </div>
  );
}

export default function RouteDetails() {
  const { id } = useParams<{ id: string }>();
  const route = useMemo(() => (id ? getRouteById(id) : null), [id]);

  if (!route) return <NotFound />;

  const distanceLabel = formatDistance(route.routeStats?.distance);
  const durationLabel = route.routeStats ? formatDurationLong(route.routeStats.duration) : route.duration;
  const lifetimePrice = route.price * 3;
  const heroImage =
    route.image ||
    'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80';

  const aiReasons = [
    `สอดคล้องกับกลุ่มที่สนใจ${route.categoryLabel}`,
    route.tags.includes('ครอบครัว')
      ? 'เหมาะกับแขกที่มาพร้อมครอบครัว'
      : 'ระยะเวลาเหมาะกับกิจกรรมครึ่งวัน',
    `ได้รับคะแนนสูง ${route.rating}/5 จากผู้ใช้ไลเซนส์`,
  ];

  return (
    <div className="space-y-10 pb-20">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        กลับตลาดเส้นทาง
      </Link>

      <div className="w-full h-[38vh] md:h-[46vh] rounded-3xl overflow-hidden relative">
        <img src={heroImage} alt={route.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 text-white">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white"
              style={{ backgroundColor: route.categoryColor }}
            >
              {route.categoryLabel}
            </span>
            <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> AI เหมาะ {route.aiMatch}%
            </span>
            {route.district && (
              <span className="bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs font-bold">{route.district}</span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display-lg mb-2">{route.title}</h1>
          <p className="text-base md:text-lg text-white/90 max-w-3xl">{route.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center justify-between p-5 md:p-6 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-surface-variant shrink-0">
                <img src={route.creator.avatar} alt={route.creator.name} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-lg text-on-surface truncate">{route.creator.name}</h3>
                <p className="text-secondary text-sm">
                  {route.creator.verified ? 'ครีเอเตอร์ยืนยันแล้ว · สนับสนุนเศรษฐกิจท้องถิ่น' : 'ครีเอเตอร์ท้องถิ่น'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-amber-500 font-bold text-sm shrink-0 ml-3">
              <Star className="w-4 h-4 fill-amber-400" />
              {route.rating}
            </div>
          </div>

          <section>
            <h3 className="text-2xl font-bold mb-4">เส้นทางบนแผนที่</h3>
            <RouteDetailMap waypoints={route.waypoints} color={route.categoryColor} />
            <div className="mt-4 p-4 bg-surface-container-low rounded-2xl">
              <RouteTrail
                waypoints={route.waypoints.map((w) => ({ name: w.name, lat: w.location.lat, lng: w.location.lng }))}
                color={route.categoryColor}
                maxDots={6}
              />
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4">จุดแวะตามลำดับ ({route.waypoints.length})</h3>
            <div className="space-y-0 border border-surface-variant rounded-2xl overflow-hidden bg-surface-container-lowest">
              {route.waypoints.map((wp, index) => (
                <div
                  key={wp.id}
                  className={`flex gap-4 p-4 md:p-5 ${index < route.waypoints.length - 1 ? 'border-b border-surface-variant' : ''}`}
                >
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center">
                      {index + 1}
                    </div>
                    {index < route.waypoints.length - 1 && (
                      <div className="w-0.5 flex-1 min-h-6 bg-surface-variant my-1 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-primary">{getTypeIcon(wp.type)}</span>
                      <span className="text-[11px] font-bold text-secondary uppercase">{WAYPOINT_TYPE_LABELS[wp.type]}</span>
                    </div>
                    <p className="font-bold text-on-surface">{wp.name}</p>
                    {wp.description && <p className="text-sm text-secondary mt-1 leading-relaxed">{wp.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4">เกี่ยวกับเส้นทางนี้</h3>
            <p className="text-on-surface-variant leading-relaxed text-lg mb-6">
              {route.description} เมื่อซื้อไลเซนส์ คุณช่วยสนับสนุนชุมชนในภูเก็ตโดยตรงผ่านครีเอเตอร์ท้องถิ่น
            </p>
            <div className="flex flex-wrap gap-6 text-on-surface-variant bg-surface-container-low p-6 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-secondary font-bold uppercase">จุดแวะ</p>
                  <p className="font-bold">{route.stops || route.waypoints.length} สถานที่</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-primary">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-secondary font-bold uppercase">ระยะเวลา</p>
                  <p className="font-bold">{durationLabel}</p>
                </div>
              </div>
              {distanceLabel && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-primary">
                    <RouteIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary font-bold uppercase">ระยะทาง</p>
                    <p className="font-bold">{distanceLabel}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {route.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full text-xs font-bold bg-surface border border-surface-variant text-secondary">
                  {tag}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-bold mb-4">ข้อมูลเชิงลึกจาก AI</h3>
            <div className="bg-gradient-to-br from-primary/10 to-surface border border-primary/20 p-6 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary text-on-primary rounded-xl flex items-center justify-center shrink-0 shadow-md">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">ทำไมเส้นทางนี้เหมาะกับแขกของคุณ {route.aiMatch}%</h4>
                  <ul className="space-y-2 text-on-surface-variant">
                    {aiReasons.map((reason) => (
                      <li key={reason} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-soft sticky top-24">
            <h3 className="text-xl font-bold mb-6">ตัวเลือกไลเซนส์</h3>

            <label className="block border-2 border-primary rounded-2xl p-5 mb-4 cursor-pointer hover:bg-primary-container/30 transition-colors relative">
              <input type="radio" name="license" className="absolute opacity-0" defaultChecked />
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-bold text-lg block">สมาชิกรายปี</span>
                  <span className="text-sm text-secondary">เหมาะกับบริการตามฤดูกาล</span>
                </div>
                <div className="w-5 h-5 rounded-full border-4 border-primary bg-white" />
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold">{formatPrice(route.price)}</span>
                <span className="text-secondary font-medium">/ ปี</span>
              </div>
            </label>

            <label className="block border-2 border-surface-variant rounded-2xl p-5 mb-6 cursor-pointer hover:border-primary transition-colors relative">
              <input type="radio" name="license" className="absolute opacity-0" />
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-bold text-lg block">ไลเซนส์ตลอดชีพ</span>
                  <span className="text-sm text-secondary">จ่ายครั้งเดียว ใช้ได้ตลอด</span>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-surface-variant bg-white" />
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold">{formatPrice(lifetimePrice)}</span>
                <span className="text-secondary font-medium">ครั้งเดียว</span>
              </div>
            </label>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0" /> สิทธิ์ใช้งานและแจกจ่ายให้ลูกค้าของคุณ
              </li>
              <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                <Edit className="w-5 h-5 text-primary shrink-0" /> <b>ปรับแต่งได้:</b> แก้จุดแวะ เพิ่มแบรนด์ และปรับรายละเอียด
              </li>
              <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                <Zap className="w-5 h-5 text-primary shrink-0" /> อัปเดตและปรับเส้นทางจาก AI ฟรี
              </li>
            </ul>

            <button className="w-full h-14 bg-primary text-on-primary rounded-xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all text-lg mb-3">
              ซื้อไลเซนส์
            </button>
            <p className="text-center text-xs text-secondary">รายได้ส่งตรงถึง {route.creator.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
