import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Building2, LayoutList, Map, Search, Sparkles, Trees, Filter } from 'lucide-react';
import type { MarketplaceOutletContext } from '../layouts/MarketplaceLayout';
import { useHotelReferral } from '../context/HotelReferralContext';
import {
  MARKETPLACE_ROUTES,
  CATEGORY_META,
  type MarketplaceCategory,
} from '../data/marketplaceRoutes';
import { fadeUp, scaleIn, staggerContainer } from '../lib/motion';
import { MarketplaceRouteCard } from '../components/marketplace/MarketplaceRouteCard';
import MarketplaceMapView from '../components/marketplace/MarketplaceMapView';

type ViewMode = 'list' | 'map';

const ALL_CATEGORIES = Object.keys(CATEGORY_META) as MarketplaceCategory[];

type ToolbarProps = {
  query: string;
  onQueryChange: (v: string) => void;
  category: MarketplaceCategory | 'all';
  onCategoryChange: (c: MarketplaceCategory | 'all') => void;
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
};

function MarketplaceToolbar({ query, onQueryChange, category, onCategoryChange, view, onViewChange }: ToolbarProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="flex flex-col lg:flex-row lg:items-center gap-4 sticky top-[80px] z-30 bg-surface/90 backdrop-blur-md py-3 -mt-2 rounded-2xl"
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.35 }}
    >
      <div className="flex-1 flex items-center gap-2 bg-surface-container-low border border-surface-variant rounded-xl px-4 py-2.5 focus-within:border-primary transition-colors">
        <Search className="w-5 h-5 text-secondary shrink-0" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="ค้นหาเส้นทาง ชุมชน หรือครีเอเตอร์..."
          className="flex-1 bg-transparent border-none outline-none text-sm"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
        <Filter className="w-4 h-4 text-secondary shrink-0 hidden sm:block" />
        <button
          onClick={() => onCategoryChange('all')}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
            category === 'all' ? 'bg-primary text-white' : 'bg-surface-container-low border border-surface-variant text-secondary'
          }`}
        >
          ทั้งหมด
        </button>
        {ALL_CATEGORIES.map((cat) => {
          const m = CATEGORY_META[cat];
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                category === cat ? 'text-white' : 'bg-surface-container-low border border-surface-variant text-secondary'
              }`}
              style={category === cat ? { backgroundColor: m.color } : undefined}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      <div className="flex rounded-xl border border-surface-variant overflow-hidden shrink-0">
        <button
          onClick={() => onViewChange('map')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold transition-colors ${
            view === 'map' ? 'bg-primary text-white' : 'bg-surface-container-lowest text-secondary'
          }`}
        >
          <Map className="w-4 h-4" />
          แผนที่
        </button>
        <button
          onClick={() => onViewChange('list')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold transition-colors border-l border-surface-variant ${
            view === 'list' ? 'bg-primary text-white' : 'bg-surface-container-lowest text-secondary'
          }`}
        >
          <LayoutList className="w-4 h-4" />
          รายการ
        </button>
      </div>
    </motion.div>
  );
}

function MapTopBar({ query, onQueryChange, category, onCategoryChange, view, onViewChange }: ToolbarProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="shrink-0 z-30 border-b border-surface-variant bg-surface/95 backdrop-blur-md"
      initial={reduceMotion ? false : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 min-h-[52px]">
        <div className="flex-1 flex items-center gap-2 bg-surface-container-low border border-surface-variant rounded-xl px-3 py-2 focus-within:border-primary transition-colors min-w-0">
          <Search className="w-4 h-4 text-secondary shrink-0" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="ค้นหาเส้นทาง ชุมชน หรือครีเอเตอร์..."
            className="flex-1 bg-transparent border-none outline-none text-sm min-w-0"
          />
        </div>

        <div className="hidden md:flex items-center gap-1.5 overflow-x-auto shrink-0 max-w-[42%] lg:max-w-none">
          <button
            onClick={() => onCategoryChange('all')}
            className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
              category === 'all' ? 'bg-primary text-white' : 'bg-surface-container-low border border-surface-variant text-secondary'
            }`}
          >
            ทั้งหมด
          </button>
          {ALL_CATEGORIES.map((cat) => {
            const m = CATEGORY_META[cat];
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                  category === cat ? 'text-white' : 'bg-surface-container-low border border-surface-variant text-secondary'
                }`}
                style={category === cat ? { backgroundColor: m.color } : undefined}
              >
                {m.label}
              </button>
            );
          })}
        </div>

        <div className="flex rounded-xl border border-surface-variant overflow-hidden shrink-0">
          <button
            onClick={() => onViewChange('map')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-bold transition-colors ${
              view === 'map' ? 'bg-primary text-white' : 'bg-surface-container-lowest text-secondary'
            }`}
          >
            <Map className="w-4 h-4" />
            <span className="hidden sm:inline">แผนที่</span>
          </button>
          <button
            onClick={() => onViewChange('list')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-bold transition-colors border-l border-surface-variant ${
              view === 'list' ? 'bg-primary text-white' : 'bg-surface-container-lowest text-secondary'
            }`}
          >
            <LayoutList className="w-4 h-4" />
            <span className="hidden sm:inline">รายการ</span>
          </button>
        </div>
      </div>

      {/* ตัวกรองบนมือถือ */}
      <div className="md:hidden flex items-center gap-1.5 overflow-x-auto px-3 pb-2.5 -mt-0.5">
        <Filter className="w-3.5 h-3.5 text-secondary shrink-0" />
        <button
          onClick={() => onCategoryChange('all')}
          className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
            category === 'all' ? 'bg-primary text-white' : 'bg-surface-container-low border border-surface-variant text-secondary'
          }`}
        >
          ทั้งหมด
        </button>
        {ALL_CATEGORIES.map((cat) => {
          const m = CATEGORY_META[cat];
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                category === cat ? 'text-white' : 'bg-surface-container-low border border-surface-variant text-secondary'
              }`}
              style={category === cat ? { backgroundColor: m.color } : undefined}
            >
              {m.label}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-emerald-600 to-teal-700 text-white p-8 md:p-12"
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={scaleIn}
    >
      {!reduceMotion && (
        <>
          <motion.div
            className="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none"
            animate={{ y: [0, -18, 0], x: [0, 10, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-0 left-1/4 w-40 h-40 rounded-full bg-teal-300/20 blur-3xl pointer-events-none"
            animate={{ y: [0, 14, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
        </>
      )}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <motion.div
        className="relative z-10 max-w-2xl"
        variants={staggerContainer(0.1, 0.12)}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
      >
        <motion.div
          variants={fadeUp}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white/90 text-xs font-bold mb-4"
        >
          <Trees className="w-3.5 h-3.5" />
          เส้นทางจากครีเอเตอร์ท้องถิ่นภูเก็ต
        </motion.div>
        <motion.h1
          variants={fadeUp}
          className="font-display-lg text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3"
        >
          ตลาดเส้นทาง
        </motion.h1>
        <motion.p variants={fadeUp} className="text-white/85 text-lg leading-relaxed mb-6">
          ค้นหาและจองเส้นทางชุมชนที่สร้างโดยคนท้องถิ่น พร้อม AI จับคู่ประสบการณ์ให้โรงแรมและนักท่องเที่ยว
        </motion.p>
        <motion.div variants={fadeUp} className="flex flex-wrap gap-4 text-sm font-bold">
          <span className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-lg">
            <Sparkles className="w-4 h-4" /> AI จับคู่ประสบการณ์
          </span>
          <span className="bg-white/15 px-3 py-1.5 rounded-lg">{MARKETPLACE_ROUTES.length} เส้นทาง</span>
          <span className="bg-white/15 px-3 py-1.5 rounded-lg">15 ชุมชนสนับสนุน</span>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

export default function Marketplace() {
  const { setMapFullscreen } = useOutletContext<MarketplaceOutletContext>();
  const { referralHotel } = useHotelReferral();
  const [view, setView] = useState<ViewMode>('map');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<MarketplaceCategory | 'all'>('all');
  const [selectedMapId, setSelectedMapId] = useState<string | null>(null);

  useEffect(() => {
    setMapFullscreen(view === 'map');
    return () => setMapFullscreen(false);
  }, [view, setMapFullscreen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MARKETPLACE_ROUTES.filter((r) => {
      if (category !== 'all' && r.category !== category) return false;
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.creator.name.toLowerCase().includes(q) ||
        r.district.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [query, category]);

  const featured = filtered.filter((r) => r.featured);
  const rest = filtered.filter((r) => !r.featured);

  const toolbarProps: ToolbarProps = {
    query,
    onQueryChange: setQuery,
    category,
    onCategoryChange: setCategory,
    view,
    onViewChange: setView,
  };

  const reduceMotion = useReducedMotion();

  const mapView = (
    <motion.div
      key="map-view"
      className="flex flex-col flex-1 min-h-0 h-full w-full"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <MapTopBar {...toolbarProps} />

      {filtered.length === 0 ? (
        <motion.div
          className="flex-1 flex items-center justify-center p-8 min-h-0"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
        >
          <div className="text-center rounded-2xl border border-dashed border-surface-variant p-12">
            <p className="font-bold text-on-surface mb-1">ไม่พบเส้นทาง</p>
            <p className="text-sm text-secondary">ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="flex-1 min-h-0"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <MarketplaceMapView
            fullscreen
            routes={filtered}
            selectedId={selectedMapId}
            onSelect={setSelectedMapId}
          />
        </motion.div>
      )}
    </motion.div>
  );

  const listView = (
    <motion.div
      key="list-view"
      className="space-y-8"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {referralHotel && (
        <motion.div
          className="rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 flex items-center gap-3"
          initial={reduceMotion ? false : { opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-orange-700 uppercase tracking-wider">เข้าผ่านโรงแรมพันธมิตร</p>
            <p className="font-bold text-on-surface">
              {referralHotel.name}
              {referralHotel.isHeadquarters && (
                <span className="ml-2 text-[10px] font-bold text-orange-600 uppercase">สาขาใหญ่</span>
              )}
            </p>
          </div>
        </motion.div>
      )}

      <HeroSection />

      <MarketplaceToolbar {...toolbarProps} />

      {filtered.length === 0 && (
        <motion.div
          className="text-center py-20 rounded-2xl border border-dashed border-surface-variant"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="font-bold text-on-surface mb-1">ไม่พบเส้นทาง</p>
          <p className="text-sm text-secondary">ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>
        </motion.div>
      )}

      {filtered.length > 0 && (
        <div className="space-y-10">
          {featured.length > 0 && (
            <section>
              <motion.div
                className="flex items-center justify-between mb-5"
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
              >
                <div>
                  <h2 className="font-headline-lg text-2xl font-bold text-on-surface">แนะนำพิเศษ</h2>
                  <p className="text-sm text-secondary mt-0.5">เส้นทางชุมชนที่ AI จับคู่ให้โรงแรมได้ดีที่สุด</p>
                </div>
              </motion.div>
              <div className="grid grid-cols-1 gap-6">
                {featured.map((route, i) => (
                  <MarketplaceRouteCard key={route.id} route={route} variant="featured" index={i} />
                ))}
              </div>
            </section>
          )}

          <section>
            <motion.div
              className="flex items-center justify-between mb-5 border-l-4 border-primary pl-4"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              <div>
                <h2 className="font-headline-lg text-2xl font-bold text-on-surface">เส้นทางทั้งหมด</h2>
                <p className="text-sm text-secondary mt-0.5">{filtered.length} เส้นทาง · แต่ละการ์ดแสดงเส้นทางชุมชนที่เชื่อม</p>
              </div>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((route, i) => (
                <MarketplaceRouteCard key={route.id} route={route} variant="default" index={i} />
              ))}
            </div>
          </section>
        </div>
      )}
    </motion.div>
  );

  return (
    <AnimatePresence mode="wait">
      {view === 'map' ? mapView : listView}
    </AnimatePresence>
  );
}
