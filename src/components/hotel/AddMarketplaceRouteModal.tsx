import { useMemo, useState } from 'react';
import { X, Search, Plus, Check, Store } from 'lucide-react';
import {
  CATEGORY_META,
  MARKETPLACE_ROUTES,
  type MarketplaceCategory,
} from '../../data/marketplaceRoutes';
import { formatPerPersonPrice } from '../../data/routePricing';

type AddMarketplaceRouteModalProps = {
  open: boolean;
  onClose: () => void;
  isInLibrary: (routeId: string) => boolean;
  onAdd: (routeId: string) => void;
};

export default function AddMarketplaceRouteModal({
  open,
  onClose,
  isInLibrary,
  onAdd,
}: AddMarketplaceRouteModalProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<MarketplaceCategory | 'all'>('all');

  const available = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MARKETPLACE_ROUTES.filter((route) => {
      if (category !== 'all' && route.category !== category) return false;
      if (!q) return true;
      const meta = CATEGORY_META[route.category];
      return (
        route.title.toLowerCase().includes(q) ||
        route.district.toLowerCase().includes(q) ||
        meta.label.toLowerCase().includes(q) ||
        route.creator.name.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  if (!open) return null;

  const handleAdd = (routeId: string) => {
    onAdd(routeId);
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label="ปิด"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-3xl max-h-[90vh] bg-surface rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-surface-variant">
        <div className="flex items-start justify-between gap-4 p-5 border-b border-surface-variant shrink-0">
          <div>
            <div className="flex items-center gap-2 text-orange-600 mb-1">
              <Store className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">ตลาดเส้นทาง</span>
            </div>
            <h3 className="text-xl font-bold text-on-surface">เพิ่มเส้นทางในคลังโรงแรม</h3>
            <p className="text-sm text-secondary mt-1">เลือกเส้นทางจากตลาด RouteWander เพื่อแนะนำแขกและรับคอมมิชชัน</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-surface-variant text-secondary"
            aria-label="ปิด"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 border-b border-surface-variant shrink-0 space-y-3">
          <div className="flex items-center gap-2 bg-surface-container-low border border-surface-variant rounded-xl px-4 py-2.5 focus-within:border-orange-400 transition-colors">
            <Search className="w-5 h-5 text-secondary shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหาเส้นทาง..."
              className="flex-1 bg-transparent border-none outline-none text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategory('all')}
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                category === 'all' ? 'bg-orange-500 text-white' : 'bg-surface-container-low text-secondary border border-surface-variant'
              }`}
            >
              ทั้งหมด
            </button>
            {(Object.keys(CATEGORY_META) as MarketplaceCategory[]).map((cat) => {
              const meta = CATEGORY_META[cat];
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    category === cat ? 'text-white' : 'bg-surface-container-low text-secondary border border-surface-variant'
                  }`}
                  style={category === cat ? { backgroundColor: meta.color } : undefined}
                >
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-3 min-h-0">
          {available.length === 0 ? (
            <p className="text-center text-secondary py-12">ไม่พบเส้นทาง</p>
          ) : (
            available.map((route) => {
              const meta = CATEGORY_META[route.category];
              const inLibrary = isInLibrary(route.id);
              return (
                <div
                  key={route.id}
                  className="flex gap-4 p-4 rounded-2xl border border-surface-variant bg-surface-container-lowest hover:border-orange-200 transition-colors"
                >
                  <img
                    src={route.image}
                    alt=""
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: meta.bg, color: meta.color }}
                      >
                        {meta.label}
                      </span>
                      <span className="text-[10px] text-violet-600 font-bold">AI {route.aiMatch}%</span>
                    </div>
                    <p className="font-bold text-sm text-on-surface line-clamp-2">{route.title}</p>
                    <p className="text-xs text-secondary mt-0.5">{route.district} · {route.duration}</p>
                    <p className="text-xs font-bold text-primary mt-1">{formatPerPersonPrice(route.price, route)}</p>
                  </div>
                  <div className="shrink-0 flex items-center">
                    {inLibrary ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl">
                        <Check className="w-4 h-4" />
                        ในคลังแล้ว
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAdd(route.id)}
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 px-4 py-2.5 rounded-xl transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        เพิ่ม
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
