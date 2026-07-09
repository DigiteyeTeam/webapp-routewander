import {
  Award,
  Compass,
  Lock,
  MapPin,
  Mountain,
  Star,
  Utensils,
  type LucideIcon,
} from 'lucide-react';
import type { TravelerBadge } from '../../data/travelerProfile';

const ICONS: Record<TravelerBadge['icon'], LucideIcon> = {
  compass: Compass,
  utensils: Utensils,
  'map-pin': MapPin,
  star: Star,
  mountain: Mountain,
  award: Award,
};

const THEME_STYLES: Record<
  TravelerBadge['theme'],
  { ring: string; icon: string; glow: string; chip: string }
> = {
  sky: {
    ring: 'from-sky-400 via-blue-500 to-cyan-400',
    icon: 'text-sky-600',
    glow: 'shadow-[0_8px_24px_rgba(14,165,233,0.35)]',
    chip: 'bg-sky-100 text-sky-800',
  },
  amber: {
    ring: 'from-amber-400 via-orange-500 to-yellow-400',
    icon: 'text-amber-600',
    glow: 'shadow-[0_8px_24px_rgba(245,158,11,0.35)]',
    chip: 'bg-amber-100 text-amber-800',
  },
  violet: {
    ring: 'from-violet-400 via-purple-500 to-fuchsia-400',
    icon: 'text-violet-600',
    glow: 'shadow-[0_8px_24px_rgba(139,92,246,0.35)]',
    chip: 'bg-violet-100 text-violet-800',
  },
  gold: {
    ring: 'from-yellow-300 via-amber-400 to-orange-400',
    icon: 'text-amber-700',
    glow: 'shadow-[0_8px_24px_rgba(251,191,36,0.4)]',
    chip: 'bg-yellow-100 text-yellow-900',
  },
  emerald: {
    ring: 'from-emerald-400 via-teal-500 to-cyan-400',
    icon: 'text-emerald-600',
    glow: 'shadow-[0_8px_24px_rgba(16,185,129,0.35)]',
    chip: 'bg-emerald-100 text-emerald-800',
  },
  rose: {
    ring: 'from-rose-400 via-pink-500 to-fuchsia-400',
    icon: 'text-rose-600',
    glow: 'shadow-[0_8px_24px_rgba(244,63,94,0.35)]',
    chip: 'bg-rose-100 text-rose-800',
  },
};

export default function TravelerBadgeCard({ badge }: { badge: TravelerBadge }) {
  const Icon = ICONS[badge.icon];
  const theme = THEME_STYLES[badge.theme];

  return (
    <div
      className={`group relative rounded-2xl border p-4 transition-all duration-300 ${
        badge.earned
          ? `border-white/60 bg-white/80 backdrop-blur-sm hover:-translate-y-1 ${theme.glow}`
          : 'border-surface-variant bg-surface-container-low/80 hover:border-surface-variant'
      }`}
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-3">
          <div
            className={`rounded-full p-[3px] ${
              badge.earned
                ? `bg-gradient-to-br ${theme.ring}`
                : 'bg-gradient-to-br from-surface-variant to-surface-variant/60'
            }`}
          >
            <div
              className={`w-[4.5rem] h-[4.5rem] rounded-full flex items-center justify-center ${
                badge.earned
                  ? 'bg-gradient-to-b from-white to-blue-50/80'
                  : 'bg-surface-container-low'
              }`}
            >
              <Icon
                className={`w-8 h-8 ${badge.earned ? theme.icon : 'text-secondary/40'}`}
                strokeWidth={badge.earned ? 2.2 : 1.8}
              />
            </div>
          </div>

          {!badge.earned && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-surface/55 backdrop-blur-[1px]">
              <div className="w-8 h-8 rounded-full bg-surface border border-surface-variant flex items-center justify-center shadow-sm">
                <Lock className="w-3.5 h-3.5 text-secondary" />
              </div>
            </div>
          )}

          {badge.earned && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shadow-md ring-2 ring-white">
              ✓
            </span>
          )}
        </div>

        <p className={`font-bold text-sm leading-snug mb-1 ${badge.earned ? 'text-on-surface' : 'text-secondary'}`}>
          {badge.title}
        </p>
        <p className="text-[11px] text-secondary leading-snug line-clamp-2 min-h-[2rem]">{badge.description}</p>

        {badge.earned && badge.earnedAt ? (
          <span className={`mt-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${theme.chip}`}>
            {badge.earnedAt}
          </span>
        ) : (
          <span className="mt-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-surface-variant text-secondary">
            ยังไม่ปลดล็อก
          </span>
        )}
      </div>
    </div>
  );
}
