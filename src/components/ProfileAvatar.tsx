import type { UserRole } from '../types/auth';

export type ProfileAvatarTone = 'creator' | 'hotel' | 'traveler';

const TONE_RING: Record<ProfileAvatarTone, string> = {
  creator: 'bg-emerald-100 ring-emerald-500 shadow-[0_4px_16px_rgba(16,185,129,0.4)]',
  hotel: 'bg-orange-100 ring-orange-500 shadow-[0_4px_16px_rgba(249,115,22,0.4)]',
  traveler: 'bg-blue-100 ring-blue-500 shadow-[0_4px_16px_rgba(59,130,246,0.4)]',
};

const SIZE_CLASS: Record<'2xs' | 'xs' | 'sm' | 'md' | 'card' | 'lg', string> = {
  '2xs': 'w-6 h-6 ring-2',
  xs: 'w-8 h-8 ring-2',
  sm: 'w-10 h-10 ring-[3px]',
  md: 'w-20 h-20 sm:w-24 sm:h-24 ring-4',
  card: 'w-14 h-14 md:w-16 md:h-16 ring-[3px]',
  lg: 'w-40 h-40 md:w-48 md:h-48 ring-4',
};

export function roleToAvatarTone(role: UserRole): ProfileAvatarTone {
  if (role === 'hotel') return 'hotel';
  if (role === 'traveler') return 'traveler';
  return 'creator';
}

type ProfileAvatarProps = {
  src: string;
  alt: string;
  tone: ProfileAvatarTone;
  size?: '2xs' | 'xs' | 'sm' | 'md' | 'card' | 'lg';
  className?: string;
  imgClassName?: string;
};

export default function ProfileAvatar({
  src,
  alt,
  tone,
  size = 'sm',
  className = '',
  imgClassName = '',
}: ProfileAvatarProps) {
  return (
    <div
      className={`rounded-full overflow-hidden shrink-0 ${SIZE_CLASS[size]} ${TONE_RING[tone]} ${className}`}
    >
      <img src={src} alt={alt} className={`w-full h-full object-cover ${imgClassName}`} />
    </div>
  );
}

export function profileAvatarRingClass(tone: ProfileAvatarTone, size: '2xs' | 'xs' | 'sm' | 'md' | 'card' | 'lg' = 'sm'): string {
  return `rounded-full overflow-hidden shrink-0 ${SIZE_CLASS[size]} ${TONE_RING[tone]}`;
}
