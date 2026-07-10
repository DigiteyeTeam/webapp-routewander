import { useMemo, useState } from 'react';
import { Search, MapPin, Clock, Star, Eye, ShoppingCart, CircleDollarSign, Plus, Store } from 'lucide-react';
import {
  CATEGORY_META,
} from '../data/marketplaceRoutes';
import {
  resolveLibrarySourceRoute,
  getLibraryDisplayTitle,
  getLibraryDisplayDescription,
  type LibraryEntry,
} from '../data/libraryRoutes';
import { MotionPage, MotionHeader, MotionCard } from '../components/motion/PortalMotion';
import { getHotelRouteMetrics } from '../data/hotelProfile';
import { useHotelLibrary } from '../hooks/useHotelLibrary';
import AddMarketplaceRouteModal from '../components/hotel/AddMarketplaceRouteModal';
import { isRemovableLibraryEntry } from '../data/hotelLibraryStore';

function LibraryCard({ entry, onRemove }: { entry: LibraryEntry; onRemove?: () => void }) {
  const source = resolveLibrarySourceRoute(entry);
  if (!source) return null;

  const meta = CATEGORY_META[source.category];
  const title = getLibraryDisplayTitle(entry, source);
  const description = getLibraryDisplayDescription(entry, source);
  const isCustom = entry.license === 'custom';
  const metrics = getHotelRouteMetrics(source.id);

  return (
    <div
      className={`bg-surface-container-lowest border overflow-hidden rounded-2xl hover:shadow-soft transition-all group flex flex-col relative ${
        isCustom ? 'border-2 border-primary/20' : 'border-outline-variant'
      }`}
    >
      <div className="h-48 relative overflow-hidden shrink-0">
        <img
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            isCustom ? 'grayscale-15' : ''
          }`}
          alt={title}
          src={source.image}
        />
        <span
          className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm"
          style={{ backgroundColor: meta.bg, color: meta.color }}
        >
          {meta.label}
        </span>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h4 className="font-headline-md text-xl font-bold text-on-surface mb-1 line-clamp-2">
          {title}
        </h4>
        <p className="text-on-surface-variant text-sm mb-1">
          {isCustom && entry.forkedFromTitle
            ? `อิงจาก: ${entry.forkedFromTitle}`
            : `ต้นฉบับโดย ${source.creator.name}`}
        </p>
        <p className="text-xs text-secondary line-clamp-2 mb-4">{description}</p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-secondary mb-6">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            {source.district}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-primary" />
            {source.duration}
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {source.rating}
          </span>
          <span>{source.stops} จุดแวะ</span>
        </div>

        <div className="mt-auto grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div className="rounded-xl border border-surface-variant bg-surface px-3 py-3 text-center">
            <p className="text-[11px] text-secondary flex items-center justify-center gap-1">
              <Eye className="w-3.5 h-3.5" /> ลูกค้าดู
            </p>
            <p className="text-lg font-extrabold text-on-surface">{metrics.views}</p>
            <p className="text-[10px] text-secondary">ครั้ง</p>
          </div>
          <div className="rounded-xl border border-surface-variant bg-surface px-3 py-3 text-center">
            <p className="text-[11px] text-secondary flex items-center justify-center gap-1">
              <ShoppingCart className="w-3.5 h-3.5" /> ลูกค้าซื้อ
            </p>
            <p className="text-lg font-extrabold text-on-surface">{metrics.purchases}</p>
            <p className="text-[10px] text-secondary">ครั้ง</p>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-3 text-center">
            <p className="text-[11px] text-emerald-700 flex items-center justify-center gap-1">
              <CircleDollarSign className="w-3.5 h-3.5" /> รายได้โรงแรม
            </p>
            <p className="text-lg font-extrabold text-emerald-700">{metrics.commissionFormatted}</p>
            <p className="text-[10px] text-emerald-700/80">คอมมิชชันสะสม</p>
          </div>
        </div>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="mt-3 text-xs font-bold text-secondary hover:text-red-600 transition-colors"
          >
            นำออกจากคลัง
          </button>
        )}
      </div>
    </div>
  );
}

export default function Library() {
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const { entries, addRoute, removeRoute, isInLibrary } = useHotelLibrary();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;

    return entries.filter((entry) => {
      const source = resolveLibrarySourceRoute(entry);
      if (!source) return false;
      const title = getLibraryDisplayTitle(entry, source).toLowerCase();
      const meta = CATEGORY_META[source.category];
      return (
        title.includes(q) ||
        source.creator.name.toLowerCase().includes(q) ||
        source.district.toLowerCase().includes(q) ||
        meta.label.toLowerCase().includes(q) ||
        (entry.forkedFromTitle?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [query, entries]);

  const handleAdd = (routeId: string) => {
    addRoute(routeId);
  };

  return (
    <MotionPage className="space-y-12">
      <MotionHeader className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="font-display-lg text-4xl md:text-5xl font-bold mb-4 tracking-tight text-on-surface">
            คลังเส้นทางโรงแรม
          </h2>
          <p className="text-on-surface-variant text-lg max-w-2xl">
            เส้นทางที่โรงแรมติดตามและขายอยู่ พร้อมสถิติการดู การซื้อ และคอมมิชชันต่อเส้นทาง
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-full transition-colors shrink-0"
          >
            <Plus className="w-5 h-5" />
            เพิ่มจากตลาดเส้นทาง
          </button>
          <div className="bg-surface-container-low border border-surface-variant rounded-full px-4 py-2 flex items-center gap-2 w-full md:w-64 focus-within:border-primary transition-all">
            <Search className="text-on-surface-variant w-5 h-5 shrink-0" />
            <input
              className="bg-transparent border-none focus:ring-0 w-full text-sm outline-none"
              placeholder="ค้นหาเส้นทางโรงแรม..."
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </MotionHeader>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-surface-container-lowest rounded-2xl border border-surface-variant">
          <Store className="w-12 h-12 text-secondary mx-auto mb-4 opacity-50" />
          <p className="text-on-surface-variant mb-4">
            {query ? 'ไม่พบเส้นทางที่ตรงกับคำค้นหา' : 'ยังไม่มีเส้นทางในคลัง'}
          </p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="text-primary font-bold hover:underline"
          >
            เพิ่มเส้นทางจากตลาด RouteWander
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((entry) => (
            <MotionCard key={entry.id} className="h-full">
              <LibraryCard
                entry={entry}
                onRemove={
                  isRemovableLibraryEntry(entry)
                    ? () => removeRoute(entry.id)
                    : undefined
                }
              />
            </MotionCard>
          ))}
        </div>
      )}

      <p className="text-center text-sm text-secondary">มีเส้นทางในคลัง {entries.length} รายการ</p>

      <AddMarketplaceRouteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        isInLibrary={isInLibrary}
        onAdd={handleAdd}
      />
    </MotionPage>
  );
}
