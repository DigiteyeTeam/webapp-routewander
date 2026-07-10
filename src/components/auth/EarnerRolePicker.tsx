import { Building2, Map } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type EarnerRole = 'creator' | 'hotel';

type RoleTheme = {
  ring: string;
  iconSelected: string;
  iconIdle: string;
  radioSelected: string;
  radioIdle: string;
  borderIdle: string;
  hoverIdle: string;
};

const ROLE_THEMES: Record<EarnerRole, RoleTheme> = {
  creator: {
    ring: 'ring-emerald-300/90',
    iconSelected: 'bg-emerald-50 text-emerald-700',
    iconIdle: 'bg-emerald-900/10 text-emerald-800',
    radioSelected: 'border-emerald-600 bg-emerald-600',
    radioIdle: 'border-emerald-800/30',
    borderIdle: 'border-emerald-900/20',
    hoverIdle: 'hover:bg-emerald-950/8 active:bg-emerald-950/12',
  },
  hotel: {
    ring: 'ring-orange-300/90',
    iconSelected: 'bg-orange-50 text-orange-700',
    iconIdle: 'bg-orange-900/10 text-orange-800',
    radioSelected: 'border-orange-500 bg-orange-500',
    radioIdle: 'border-orange-800/30',
    borderIdle: 'border-orange-900/20',
    hoverIdle: 'hover:bg-orange-950/8 active:bg-orange-950/12',
  },
};

const OPTIONS: {
  value: EarnerRole;
  label: string;
  hint: string;
  icon: LucideIcon;
}[] = [
  {
    value: 'creator',
    label: 'ผู้สร้างเส้นทางชุมชน',
    hint: 'ครีเอเตอร์ท้องถิ่น',
    icon: Map,
  },
  {
    value: 'hotel',
    label: 'โรงแรมพันธมิตร',
    hint: 'แนะนำและขายเส้นทางให้แขก',
    icon: Building2,
  },
];

type EarnerRolePickerProps = {
  value: EarnerRole;
  onChange: (role: EarnerRole) => void;
};

export default function EarnerRolePicker({ value, onChange }: EarnerRolePickerProps) {
  return (
    <div className="space-y-2" role="radiogroup" aria-label="เลือกผู้สร้างรายได้">
      {OPTIONS.map((option) => {
        const selected = value === option.value;
        const theme = ROLE_THEMES[option.value];
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={`w-full flex items-center gap-3.5 rounded-xl border px-4 py-3.5 min-h-[3.75rem] text-left transition-all cursor-pointer touch-manipulation select-none ${
              selected
                ? `bg-white border-white text-on-surface shadow-md ring-2 ${theme.ring}`
                : `bg-amber-950/6 ${theme.borderIdle} text-amber-950 ${theme.hoverIdle}`
            }`}
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                selected ? theme.iconSelected : theme.iconIdle
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={2.25} />
            </span>
            <span className="min-w-0 flex-1">
              <span className={`block text-[15px] leading-snug tracking-tight ${selected ? 'font-bold' : 'font-semibold'}`}>
                {option.label}
              </span>
              <span className={`block text-xs mt-0.5 ${selected ? 'text-on-surface-variant font-medium' : 'text-amber-950/75'}`}>
                {option.hint}
              </span>
            </span>
            <span
              className={`h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center ${
                selected ? theme.radioSelected : theme.radioIdle
              }`}
              aria-hidden
            >
              {selected && <span className="h-2 w-2 rounded-full bg-white" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
