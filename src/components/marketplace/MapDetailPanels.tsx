import { Link } from 'react-router-dom';
import {
  X,
  MapPin,
  Clock,
  Star,
  Sparkles,
  Utensils,
  Compass,
  Heart,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import type { PhuketPoi } from '../../data/phuketPois';
import { getCommunityFlipbookUrl } from '../../data/communityFlipbook';
import {
  CATEGORY_META,
  formatPrice,
  type MarketplaceRoute,
} from '../../data/marketplaceRoutes';
import { formatPerPersonPrice } from '../../data/routePricing';
import VehicleServiceNote from '../route/VehicleServiceNote';
export function MapSlidePanel({
  onClose,
  children,
  footer,
}: {
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="absolute inset-0 z-[450] flex flex-col justify-end pointer-events-none p-3 sm:p-4">
      <div
        className="pointer-events-auto flex flex-col max-h-[min(78vh,100%)] w-full max-w-2xl mx-auto rounded-3xl border border-white/60 bg-white/92 backdrop-blur-xl shadow-[0_-8px_40px_rgba(0,0,0,0.12)] overflow-hidden animate-[slideUp_0.32s_cubic-bezier(0.16,1,0.3,1)]"
        role="dialog"
        aria-modal="true"
      >
        {/* drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-surface-variant/80" />
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain map-detail-scroll px-5 pb-2">
          {children}
        </div>

        {footer && (
          <div className="shrink-0 px-4 py-3 border-t border-surface-variant/60 bg-white/80 backdrop-blur-sm">
            {footer}
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/20 hover:bg-black/30 text-white backdrop-blur-sm flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          aria-label="ปิด"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function SectionBlock({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-surface-container-low/80 border border-surface-variant/50 p-3.5">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-primary" />
        </span>
        <p className="text-xs font-bold text-on-surface tracking-wide">{title}</p>
      </div>
      {children}
    </div>
  );
}

function ChipList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="text-[11px] leading-snug px-2.5 py-1 rounded-full bg-white border border-surface-variant text-on-surface"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export function CommunityMapDetail({ community }: { community: PhuketPoi }) {
  return (
    <div className="font-body-md pb-2">
      {/* hero */}
      <div className="relative -mx-5 -mt-1 mb-4 h-44 sm:h-48 overflow-hidden">
        {community.imageUrl && (
          <img src={community.imageUrl} alt="" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 pt-10">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary text-white shadow-sm">
            ชุมชนที่ {community.communityNo}
          </span>
          <h4 className="font-bold text-lg text-white mt-2 leading-tight drop-shadow-sm">
            {community.name}
          </h4>
          {community.nameEn && (
            <p className="text-xs text-white/75 mt-0.5">{community.nameEn}</p>
          )}
          <p className="text-xs text-white/90 mt-1.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {community.district}
          </p>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-on-surface">{community.hook}</p>
      <p className="text-sm mt-2 text-primary font-semibold leading-relaxed rounded-xl bg-primary/5 border border-primary/15 px-3 py-2.5">
        {community.highlight}
      </p>

      <div className="space-y-3 mt-4">
        {community.activities && community.activities.length > 0 && (
          <SectionBlock icon={Compass} title="กิจกรรมในชุมชน">
            <ChipList items={community.activities} />
          </SectionBlock>
        )}

        {community.food && community.food.length > 0 && (
          <SectionBlock icon={Utensils} title="อาหารท้องถิ่น">
            <ChipList items={community.food} />
          </SectionBlock>
        )}

        {community.localLife && (
          <SectionBlock icon={Heart} title="สำผัสชีวิตจริง">
            <p className="text-xs leading-relaxed text-on-surface-variant">{community.localLife}</p>
          </SectionBlock>
        )}
      </div>
    </div>
  );
}

export function CommunityMapDetailFooter({ community }: { community: PhuketPoi }) {
  const communityNo = community.communityNo ?? 1;
  const flipbookUrl = getCommunityFlipbookUrl(communityNo);

  return (
    <a
      href={flipbookUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full h-11 rounded-2xl bg-gradient-to-r from-primary to-emerald-600 text-white font-bold text-sm items-center justify-center gap-1.5 hover:opacity-95 transition-opacity shadow-md shadow-primary/20"
    >
      ดูข้อมูลชุมชน (Phuket Local Stories)
      <ExternalLink className="w-4 h-4" />
    </a>
  );
}

export function RouteMapDetail({ route }: { route: MarketplaceRoute }) {
  const meta = CATEGORY_META[route.category];

  return (
    <>
      <div className="font-body-md pb-2">
        {/* hero */}
        <div className="relative -mx-5 -mt-1 mb-4 h-44 sm:h-48 overflow-hidden">
          <img src={route.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 pt-10">
            <span
              className="inline-flex text-[10px] font-bold px-2.5 py-1 rounded-full text-white shadow-sm"
              style={{ backgroundColor: meta.color }}
            >
              {meta.label}
            </span>
            <h4 className="font-bold text-lg text-white mt-2 leading-tight drop-shadow-sm line-clamp-2">
              {route.title}
            </h4>
            <p className="text-xs text-white/80 mt-1">โดย {route.creator.name}</p>
          </div>
        </div>

        {/* stats row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { icon: MapPin, label: `${route.stops} จุด` },
            { icon: Clock, label: route.duration },
            { icon: Star, label: String(route.rating) },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 rounded-xl bg-surface-container-low border border-surface-variant/60 py-2.5 px-2"
            >
              <Icon className="w-4 h-4 text-primary" />
              <span className="text-[11px] font-bold text-on-surface text-center">{label}</span>
            </div>
          ))}
        </div>

        <p className="text-sm text-on-surface-variant leading-relaxed">{route.description}</p>

        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="text-base font-bold text-primary">
            {formatPerPersonPrice(route.price, route)}
          </span>
          <span className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-violet-600 bg-violet-50 border border-violet-100 px-2.5 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            AI {route.aiMatch}%
          </span>
        </div>
        <VehicleServiceNote route={route} className="mt-2" />

        {route.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {route.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-variant/50 text-secondary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export function RouteMapDetailFooter({ route }: { route: MarketplaceRoute }) {
  return (
    <Link
      to={`/route/${route.id}`}
      className="flex w-full h-11 rounded-2xl bg-gradient-to-r from-primary to-emerald-600 text-white font-bold text-sm items-center justify-center gap-1.5 hover:opacity-95 transition-opacity shadow-md shadow-primary/20"
    >
      ดูรายละเอียดเส้นทาง
      <ChevronRight className="w-4 h-4" />
    </Link>
  );
}
