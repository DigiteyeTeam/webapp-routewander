import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
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
  Building2,
  Minus,
  Plus,
  ShoppingCart,
} from 'lucide-react';
import { getRouteById, formatDistance, formatDurationLong } from '../data/routeStore';
import { formatPrice } from '../data/marketplaceRoutes';
import VehicleServiceNote from '../components/route/VehicleServiceNote';
import {
  calculateBookingTotal,
  clampGuestCount,
  formatBookingTotal,
  formatPerPersonPrice,
  getRoutePricePerPerson,
  getRoutePricePerPersonWithVehicle,
  MAX_GUESTS,
  MIN_GUESTS,
} from '../data/routePricing';
import { WAYPOINT_TYPE_LABELS, type WaypointType } from '../types/route';
import RouteDetailMap from '../components/route/RouteDetailMap';
import RouteTrail from '../components/marketplace/RouteTrail';
import ProfileAvatar from '../components/ProfileAvatar';
import { useHotelReferral } from '../context/HotelReferralContext';
import { useCart } from '../context/CartContext';
import { calculateBookingSplit } from '../data/hotelProfile';
import {
  fadeIn,
  fadeUp,
  scaleIn,
  slideFromLeft,
  slideFromRight,
  springSnappy,
  staggerContainer,
  timelineItem,
} from '../lib/motion';

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
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="text-center py-24"
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={reduceMotion ? false : { scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, ...springSnappy }}
      >
        <RouteIcon className="w-16 h-16 mx-auto mb-4 text-surface-variant" />
      </motion.div>
      <h1 className="text-2xl font-bold mb-2">ไม่พบเส้นทาง</h1>
      <p className="text-secondary mb-6">เส้นทางนี้อาจถูกลบหรือไม่มีอยู่ในระบบ</p>
      <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        กลับตลาดเส้นทาง
      </Link>
    </motion.div>
  );
}

export default function RouteDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const route = useMemo(() => (id ? getRouteById(id) : null), [id]);
  const [guestCount, setGuestCount] = useState(1);
  const [added, setAdded] = useState(false);
  const { referralHotel } = useHotelReferral();
  const { addItem } = useCart();

  if (!route) return <NotFound />;

  const tripBasePerPerson = getRoutePricePerPerson(route.price);
  const pricePerPerson = getRoutePricePerPersonWithVehicle(route.price, route);
  const subtotal = calculateBookingTotal(route.price, guestCount, route);
  const hotelSplit = referralHotel ? calculateBookingSplit(subtotal, true, 1) : null;
  const checkoutTotal = hotelSplit?.gross ?? subtotal;
  const distanceLabel = formatDistance(route.routeStats?.distance);
  const durationLabel = route.routeStats ? formatDurationLong(route.routeStats.duration) : route.duration;

  const aiReasons = [
    `สอดคล้องกับกลุ่มที่สนใจ${route.categoryLabel}`,
    route.tags.includes('ครอบครัว')
      ? 'เหมาะกับแขกที่มาพร้อมครอบครัว'
      : 'ระยะเวลาเหมาะกับกิจกรรมครึ่งวัน',
    `ได้รับคะแนนสูง ${route.rating}/5 จากนักท่องเที่ยวที่จอง`,
  ];

  const heroImage =
    route.image ||
    'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80';

  const adjustGuests = (delta: number) => {
    setGuestCount((prev) => clampGuestCount(prev + delta));
    setAdded(false);
  };

  const handleAddToCart = () => {
    if (!route) return;
    const ok = addItem({
      routeId: route.id,
      guestCount,
      hotel: referralHotel ? { slug: referralHotel.slug, name: referralHotel.name } : undefined,
    });
    if (ok) setAdded(true);
  };

  return (
    <motion.div
      key={route.id}
      className="space-y-10 pb-20"
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={staggerContainer(0.08, 0.04)}
    >
      {referralHotel && (
        <motion.div
          variants={slideFromLeft}
          className="rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-orange-700 uppercase tracking-wider">จองผ่านโรงแรมพันธมิตร</p>
            <p className="font-bold text-on-surface">
              {referralHotel.name}
              {referralHotel.isHeadquarters && (
                <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-orange-600">สาขาใหญ่</span>
              )}
            </p>
            <p className="text-xs text-secondary font-mono mt-0.5">{referralHotel.name} {referralHotel.slug}</p>
          </div>
          {hotelSplit && hotelSplit.guestSavings > 0 && (
            <p className="text-sm font-bold text-orange-700 shrink-0">
              ประหยัด {formatPrice(hotelSplit.guestSavings)} จากราคาปกติ
            </p>
          )}
        </motion.div>
      )}

      <motion.div variants={fadeIn}>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับตลาดเส้นทาง
        </Link>
      </motion.div>

      <motion.div
        variants={scaleIn}
        className="w-full h-[38vh] md:h-[46vh] rounded-3xl overflow-hidden relative"
      >
        <motion.img
          src={heroImage}
          alt={route.title}
          className="w-full h-full object-cover"
          initial={reduceMotion ? false : { scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <motion.div
          className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 text-white"
          variants={staggerContainer(0.08, 0.15)}
          initial={reduceMotion ? false : 'hidden'}
          animate="visible"
        >
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2 mb-3">
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
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-3xl md:text-4xl lg:text-5xl font-bold font-display-lg mb-2">
            {route.title}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-base md:text-lg text-white/90 max-w-3xl">
            {route.description}
          </motion.p>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
        <motion.div
          className="lg:col-span-2 space-y-10"
          variants={staggerContainer(0.1, 0.08)}
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          <motion.div
            variants={fadeUp}
            className="flex items-center justify-between p-5 md:p-6 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm"
          >
            <div className="flex items-center gap-4 min-w-0">
              <ProfileAvatar src={route.creator.avatar} alt={route.creator.name} tone="creator" size="card" />
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
          </motion.div>

          <motion.section variants={fadeUp}>
            <h3 className="text-2xl font-bold mb-4">เส้นทางบนแผนที่</h3>
            <motion.div
              className="rounded-2xl overflow-hidden"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              <RouteDetailMap waypoints={route.waypoints} color={route.categoryColor} />
            </motion.div>
            <div className="mt-4 p-4 bg-surface-container-low rounded-2xl">
              <RouteTrail
                waypoints={route.waypoints.map((w) => ({ name: w.name, lat: w.location.lat, lng: w.location.lng }))}
                color={route.categoryColor}
                maxDots={6}
              />
            </div>
          </motion.section>

          <motion.section variants={fadeUp}>
            <h3 className="text-2xl font-bold mb-4">จุดแวะตามลำดับ ({route.waypoints.length})</h3>
            <motion.div
              className="space-y-0 border border-surface-variant rounded-2xl overflow-hidden bg-surface-container-lowest"
              variants={staggerContainer(0.06, 0.05)}
              initial={reduceMotion ? false : 'hidden'}
              whileInView="visible"
              viewport={{ once: true, margin: '-20px' }}
            >
              {route.waypoints.map((wp, index) => (
                <motion.div
                  key={wp.id}
                  variants={timelineItem}
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
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          <motion.section variants={fadeUp}>
            <h3 className="text-2xl font-bold mb-4">เกี่ยวกับเส้นทางนี้</h3>
            <p className="text-on-surface-variant leading-relaxed text-lg mb-6">
              {route.description} เมื่อจองเส้นทาง คุณช่วยสนับสนุนชุมชนในภูเก็ตโดยตรงผ่านครีเอเตอร์ท้องถิ่น
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
              {route.tags.map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-surface border border-surface-variant text-secondary"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.section>

          <motion.section variants={fadeUp}>
            <h3 className="text-2xl font-bold mb-4">ข้อมูลเชิงลึกจาก AI</h3>
            <div className="bg-gradient-to-br from-primary/10 to-surface border border-primary/20 p-6 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary text-on-primary rounded-xl flex items-center justify-center shrink-0 shadow-md">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">ทำไมเส้นทางนี้เหมาะกับคุณ {route.aiMatch}%</h4>
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
          </motion.section>
        </motion.div>

        <motion.div
          className="lg:col-span-1"
          variants={slideFromRight}
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-soft sticky top-24">
            {referralHotel && (
              <div className="mb-6 p-4 rounded-2xl border border-orange-200 bg-orange-50/80">
                <p className="text-[10px] font-bold text-orange-700 uppercase tracking-wider mb-1">โรงแรมที่อ้างอิง</p>
                <p className="font-bold text-on-surface">{referralHotel.name}</p>
                <p className="text-xs text-secondary font-mono mt-1">{referralHotel.slug}</p>
              </div>
            )}

            <h3 className="text-xl font-bold mb-6">จองเส้นทาง</h3>

            <div className="border-2 border-primary bg-primary-container/20 rounded-2xl p-5 mb-5">
              <p className="text-sm text-secondary mb-1">ราคาต่อคน</p>
              <div className="flex items-baseline gap-2 flex-wrap">
                {hotelSplit && hotelSplit.listPrice > pricePerPerson && (
                  <span className="text-lg text-secondary line-through">
                    {formatPrice(Math.round(hotelSplit.listPrice / guestCount))}
                  </span>
                )}
                <span className="text-3xl font-extrabold">{formatPrice(pricePerPerson)}</span>
                <span className="text-secondary font-medium">/ คน</span>
              </div>
              <VehicleServiceNote
                route={route}
                variant="detail"
                basePerPerson={tripBasePerPerson}
                className="mt-3 p-3 rounded-xl bg-surface/80 border border-primary/15"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="guest-count" className="block text-sm font-medium text-on-surface mb-2">
                จำนวนคน
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => adjustGuests(-1)}
                  disabled={guestCount <= MIN_GUESTS}
                  className="w-11 h-11 rounded-xl border border-surface-variant bg-surface flex items-center justify-center text-on-surface hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="ลดจำนวนคน"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  id="guest-count"
                  type="number"
                  min={MIN_GUESTS}
                  max={MAX_GUESTS}
                  value={guestCount}
                  onChange={(e) => {
                    setGuestCount(clampGuestCount(Number(e.target.value) || MIN_GUESTS));
                    setAdded(false);
                  }}
                  className="flex-1 text-center rounded-xl border border-surface-variant bg-surface px-3 py-2.5 text-lg font-bold outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => adjustGuests(1)}
                  disabled={guestCount >= MAX_GUESTS}
                  className="w-11 h-11 rounded-xl border border-surface-variant bg-surface flex items-center justify-center text-on-surface hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="เพิ่มจำนวนคน"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-secondary mt-2">
                ราคารวม {guestCount} คน · {formatPerPersonPrice(route.price, route)} × {guestCount}
              </p>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low border border-surface-variant mb-6">
              <span className="text-sm font-medium text-on-surface-variant">ยอดชำระทั้งหมด</span>
              <div className="text-right overflow-hidden">
                {hotelSplit && hotelSplit.listPrice > checkoutTotal && (
                  <span className="text-sm text-secondary line-through block">{formatPrice(hotelSplit.listPrice)}</span>
                )}
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={checkoutTotal}
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="text-2xl font-extrabold text-on-surface block"
                  >
                    {formatPrice(checkoutTotal)}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0" /> เข้าถึงแผนที่ จุดแวะ และภารกิจบนเส้นทาง
              </li>
              <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                <Edit className="w-5 h-5 text-primary shrink-0" /> สะสมแบดจ์และบันทึกประสบการณ์ระหว่างเดินทาง
              </li>
              <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                <Zap className="w-5 h-5 text-primary shrink-0" /> รายได้ส่งตรงสู่ชุมชนและครีเอเตอร์ท้องถิ่น
              </li>
            </ul>

            <motion.button
              type="button"
              onClick={handleAddToCart}
              whileHover={reduceMotion ? undefined : { y: -2, boxShadow: '0 12px 28px rgba(22, 163, 74, 0.25)' }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              animate={added && !reduceMotion ? { scale: [1, 1.02, 1] } : undefined}
              transition={springSnappy}
              className="w-full h-14 bg-primary text-on-primary rounded-xl font-bold shadow-md hover:shadow-lg transition-shadow text-lg mb-3 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              {added ? 'เพิ่มลงตะกร้าแล้ว' : `เพิ่มลงตะกร้า · ${formatBookingTotal(route.price, guestCount, route)}`}
            </motion.button>
            <AnimatePresence>
              {added && (
                <motion.button
                  type="button"
                  initial={reduceMotion ? false : { opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => navigate('/cart')}
                  className="w-full h-12 border-2 border-primary text-primary rounded-xl font-bold hover:bg-primary-container/20 transition-colors overflow-hidden"
                >
                  ไปที่ตะกร้า
                </motion.button>
              )}
            </AnimatePresence>
            <p className="text-center text-xs text-secondary">รายได้ส่งตรงถึง {route.creator.name}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
