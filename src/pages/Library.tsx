import { useMemo, useState } from 'react';
import { Search, Edit, Copy, Play, MapPin, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  CATEGORY_META,
} from '../data/marketplaceRoutes';
import {
  LIBRARY_ENTRIES,
  resolveLibrarySourceRoute,
  getLibraryDisplayTitle,
  getLibraryDisplayDescription,
  type LibraryEntry,
  type LibraryLicenseKind,
} from '../data/libraryRoutes';

function licenseBadge(license: LibraryLicenseKind, renewal?: string) {
  switch (license) {
    case 'lifetime':
      return { className: 'bg-primary text-on-primary', label: 'ไลเซนส์ตลอดชีพ' };
    case 'monthly':
      return {
        className: 'bg-secondary-container text-on-secondary-container',
        label: renewal ? `สมาชิกรายเดือน · ${renewal}` : 'สมาชิกรายเดือน (ใช้งานอยู่)',
      };
    case 'annual':
      return {
        className: 'bg-secondary-container text-on-secondary-container',
        label: renewal ? `สมาชิกรายปี · ${renewal}` : 'สมาชิกรายปี (ใช้งานอยู่)',
      };
    default:
      return null;
  }
}

function LibraryCard({ entry }: { entry: LibraryEntry }) {
  const source = resolveLibrarySourceRoute(entry);
  if (!source) return null;

  const meta = CATEGORY_META[source.category];
  const title = getLibraryDisplayTitle(entry, source);
  const description = getLibraryDisplayDescription(entry, source);
  const badge = licenseBadge(entry.license, entry.annualRenewal);
  const isCustom = entry.license === 'custom';

  return (
    <div
      className={`bg-surface-container-lowest border overflow-hidden rounded-2xl hover:shadow-soft transition-all group flex flex-col relative ${
        isCustom ? 'border-2 border-primary/20' : 'border-outline-variant'
      }`}
    >
      {isCustom && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-primary font-bold text-xs z-10 flex items-center gap-1">
          <Copy className="w-3 h-3" /> เวอร์ชันปรับแต่ง
        </div>
      )}

      <div className="h-48 relative overflow-hidden shrink-0">
        <img
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            isCustom ? 'grayscale-[15%]' : ''
          }`}
          alt={title}
          src={source.image}
        />
        {badge && (
          <div
            className={`absolute top-4 left-4 px-3 py-1 rounded-lg font-bold text-xs max-w-[85%] leading-snug ${badge.className}`}
          >
            {badge.label}
          </div>
        )}
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

        <div className="mt-auto space-y-3">
          <Link
            to={`/route/${source.id}`}
            className="w-full bg-primary text-on-primary px-4 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" /> ใช้เส้นทาง
          </Link>
          <button
            type="button"
            className="w-full bg-surface-container-low text-on-surface border border-surface-variant px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <Edit className="w-5 h-5" />
            {isCustom ? 'แก้ไขเวอร์ชัน' : 'ปรับแต่งและแก้ไข'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Library() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LIBRARY_ENTRIES;

    return LIBRARY_ENTRIES.filter((entry) => {
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
  }, [query]);

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="font-display-lg text-4xl md:text-5xl font-bold mb-4 tracking-tight text-on-surface">
            คลังของฉัน
          </h2>
          <p className="text-on-surface-variant text-lg max-w-2xl">
            เส้นทางชุมชนภูเก็ตที่คุณมีไลเซนส์แล้ว จากตลาด RouteWander — เปิดดูและใช้งานได้ทันที
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-surface-container-low border border-surface-variant rounded-full px-4 py-2 flex items-center gap-2 w-full md:w-64 focus-within:border-primary transition-all">
            <Search className="text-on-surface-variant w-5 h-5 shrink-0" />
            <input
              className="bg-transparent border-none focus:ring-0 w-full text-sm outline-none"
              placeholder="ค้นหาเส้นทางของฉัน..."
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-surface-container-lowest rounded-2xl border border-surface-variant">
          <p className="text-on-surface-variant mb-4">ไม่พบเส้นทางที่ตรงกับคำค้นหา</p>
          <Link to="/" className="text-primary font-bold hover:underline">
            ไปที่ตลาดเส้นทาง
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((entry) => (
            <LibraryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}

      <p className="text-center text-sm text-secondary">
        มีเส้นทางในคลัง {LIBRARY_ENTRIES.length} รายการ ·{' '}
        <Link to="/" className="text-primary font-semibold hover:underline">
          สำรวจเส้นทางเพิ่มเติมในตลาด
        </Link>
      </p>
    </div>
  );
}
