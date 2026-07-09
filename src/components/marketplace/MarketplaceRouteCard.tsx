import { Link } from 'react-router-dom';
import { Star, Sparkles, MapPin, Clock, Verified, Trees } from 'lucide-react';
import {
  type MarketplaceRoute,
  CATEGORY_META,
  formatPrice,
} from '../../data/marketplaceRoutes';
import RouteTrail from './RouteTrail';

export function MarketplaceRouteCard({
  route,
  variant = 'default',
}: {
  route: MarketplaceRoute;
  variant?: 'default' | 'featured' | 'compact';
}) {
  const meta = CATEGORY_META[route.category];

  if (variant === 'featured') {
    return (
      <Link
        to={`/route/${route.id}`}
        className="group relative rounded-2xl overflow-hidden border border-surface-variant bg-surface-container-lowest shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row min-h-[280px]"
      >
        <div className="md:w-1/2 h-56 md:h-auto relative overflow-hidden">
          <img src={route.image} alt={route.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/20" />
          {route.badge && (
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary text-white text-xs font-bold shadow">
              {route.badge}
            </span>
          )}
          <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-violet-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow">
            <Sparkles className="w-3.5 h-3.5" /> AI {route.aiMatch}%
          </div>
        </div>
        <div className="md:w-1/2 p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: meta.bg, color: meta.color }}>
              {meta.label}
            </span>
            <span className="text-[10px] text-secondary">{route.district}</span>
          </div>
          <h3 className="font-headline-md text-xl font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">{route.title}</h3>
          <p className="text-sm text-secondary line-clamp-2 mb-4">{route.description}</p>
          <div className="mb-4 p-3 rounded-xl bg-surface-container-low border border-surface-variant">
            <p className="text-[10px] font-bold text-secondary uppercase mb-2">เส้นทางชุมชน</p>
            <RouteTrail waypoints={route.waypoints} color={meta.color} />
          </div>
          <div className="mt-auto flex items-end justify-between gap-4">
            <CreatorChip route={route} />
            <div className="text-right">
              <p className="text-xl font-extrabold text-on-surface">{formatPrice(route.price)}<span className="text-sm font-normal text-secondary">/ปี</span></p>
              <div className="flex items-center gap-1 justify-end mt-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold">{route.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link
        to={`/route/${route.id}`}
        className="group flex gap-3 p-3 rounded-xl border border-surface-variant bg-surface-container-lowest hover:border-primary/40 hover:shadow-md transition-all"
      >
        <img src={route.image} alt={route.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-on-surface truncate group-hover:text-primary">{route.title}</p>
          <p className="text-xs text-secondary truncate">{route.creator.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-bold text-primary">{formatPrice(route.price)}</span>
            <span className="text-[10px] text-violet-600 font-bold">AI {route.aiMatch}%</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/route/${route.id}`}
      className="group bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:border-primary/30 transition-all duration-300 flex flex-col h-full"
    >
      <div className="h-44 relative overflow-hidden">
        <img src={route.image} alt={route.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur bg-white/90" style={{ color: meta.color }}>
            {meta.label}
          </span>
          {route.isNew && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-white">ใหม่</span>
          )}
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-violet-500/95 text-white px-2 py-0.5 rounded-lg text-[10px] font-bold">
          <Sparkles className="w-3 h-3" /> {route.aiMatch}%
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h4 className="font-bold text-base text-on-surface mb-1 line-clamp-2 group-hover:text-primary transition-colors">{route.title}</h4>
        <CreatorChip route={route} small />
        <div className="my-3 py-2 border-y border-surface-variant/60">
          <RouteTrail waypoints={route.waypoints} color={meta.color} maxDots={4} />
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {route.tags.slice(0, 3).map((t) => (
            <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-surface-container-low text-secondary font-medium">{t}</span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-3 text-xs text-secondary">
            <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{route.stops} จุด</span>
            <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{route.duration}</span>
          </div>
          <p className="font-extrabold text-primary text-sm">{formatPrice(route.price)}<span className="text-[10px] font-normal text-secondary">/ปี</span></p>
        </div>
      </div>
    </Link>
  );
}

function CreatorChip({ route, small }: { route: MarketplaceRoute; small?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${small ? 'mb-2' : ''}`}>
      <img src={route.creator.avatar} alt={route.creator.name} className={`rounded-full object-cover border border-surface-variant ${small ? 'w-6 h-6' : 'w-8 h-8'}`} />
      <div className="min-w-0">
        <p className={`font-medium text-on-surface truncate flex items-center gap-1 ${small ? 'text-xs' : 'text-sm'}`}>
          {route.creator.name}
          {route.creator.verified && <Verified className="w-3 h-3 text-primary shrink-0" />}
        </p>
        {!small && (
          <p className="text-[10px] text-primary flex items-center gap-0.5">
            <Trees className="w-3 h-3" /> ครีเอเตอร์ท้องถิ่น
          </p>
        )}
      </div>
    </div>
  );
}
