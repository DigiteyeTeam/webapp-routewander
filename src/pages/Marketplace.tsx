import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { LayoutList, Map, Search, Sparkles, Trees, Filter } from 'lucide-react';
import type { MarketplaceOutletContext } from '../layouts/MarketplaceLayout';
import {
  MARKETPLACE_ROUTES,
  CATEGORY_META,
  type MarketplaceCategory,
} from '../data/marketplaceRoutes';
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
  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-4 sticky top-[80px] z-30 bg-surface/90 backdrop-blur-md py-3 -mt-2 rounded-2xl">
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
    </div>
  );
}

function MapTopBar({ query, onQueryChange, category, onCategoryChange, view, onViewChange }: ToolbarProps) {
  return (
    <div className="shrink-0 z-30 border-b border-surface-variant bg-surface/95 backdrop-blur-md">
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
    </div>
  );
}

export default function Marketplace() {
  const { setMapFullscreen } = useOutletContext<MarketplaceOutletContext>();
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

  const mapView = (
    <div className="flex flex-col flex-1 min-h-0 h-full w-full">
      <MapTopBar {...toolbarProps} />

      {filtered.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-8 min-h-0">
          <div className="text-center rounded-2xl border border-dashed border-surface-variant p-12">
            <p className="font-bold text-on-surface mb-1">ไม่พบเส้นทาง</p>
            <p className="text-sm text-secondary">ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>
          </div>
        </div>
      ) : (
        <MarketplaceMapView
          fullscreen
          routes={filtered}
          selectedId={selectedMapId}
          onSelect={setSelectedMapId}
        />
      )}
    </div>
  );

  const listView = (
    <div className="space-y-8">
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-emerald-600 to-teal-700 text-white p-8 md:p-12">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white/90 text-xs font-bold mb-4">
            <Trees className="w-3.5 h-3.5" />
            เส้นทางจากครีเอเตอร์ท้องถิ่นภูเก็ต
          </div>
          <h1 className="font-display-lg text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3">ตลาดเส้นทาง</h1>
          <p className="text-white/85 text-lg leading-relaxed mb-6">
            ค้นหาและซื้อไลเซนส์เส้นทางชุมชนที่สร้างโดยคนท้องถิ่น พร้อม AI จับคู่ประสบการณ์ให้โรงแรมและนักท่องเที่ยว
          </p>
          <div className="flex flex-wrap gap-4 text-sm font-bold">
            <span className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-lg">
              <Sparkles className="w-4 h-4" /> AI จับคู่ประสบการณ์
            </span>
            <span className="bg-white/15 px-3 py-1.5 rounded-lg">{MARKETPLACE_ROUTES.length} เส้นทาง</span>
            <span className="bg-white/15 px-3 py-1.5 rounded-lg">15 ชุมชนสนับสนุน</span>
          </div>
        </div>
      </section>

      <MarketplaceToolbar {...toolbarProps} />

      {filtered.length === 0 && (
        <div className="text-center py-20 rounded-2xl border border-dashed border-surface-variant">
          <p className="font-bold text-on-surface mb-1">ไม่พบเส้นทาง</p>
          <p className="text-sm text-secondary">ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="space-y-10">
          {featured.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-headline-lg text-2xl font-bold text-on-surface">แนะนำพิเศษ</h2>
                  <p className="text-sm text-secondary mt-0.5">เส้นทางชุมชนที่ AI จับคู่ให้โรงแรมได้ดีที่สุด</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {featured.map((route) => (
                  <MarketplaceRouteCard key={route.id} route={route} variant="featured" />
                ))}
              </div>
            </section>
          )}

          <section>
            <div className="flex items-center justify-between mb-5 border-l-4 border-primary pl-4">
              <div>
                <h2 className="font-headline-lg text-2xl font-bold text-on-surface">เส้นทางทั้งหมด</h2>
                <p className="text-sm text-secondary mt-0.5">{filtered.length} เส้นทาง · แต่ละการ์ดแสดงเส้นทางชุมชนที่เชื่อม</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((route) => (
                <MarketplaceRouteCard key={route.id} route={route} variant="default" />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );

  return (
    <>
      {view === 'map' ? mapView : listView}
    </>
  );
}
