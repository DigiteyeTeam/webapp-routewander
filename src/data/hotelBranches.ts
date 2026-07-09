import { MOCK_HOTEL_PROFILE } from './hotelProfile';

export const MAX_HOTEL_BRANCHES = 10;

const STORAGE_KEY = 'routewander_hotel_branches';

export interface HotelBranch {
  id: string;
  name: string;
  slug: string;
  isHeadquarters: boolean;
  district?: string;
  qrPlacements: number;
  createdAt: string;
}

const DEFAULT_BRANCHES: HotelBranch[] = [
  {
    id: MOCK_HOTEL_PROFILE.id,
    name: MOCK_HOTEL_PROFILE.name,
    slug: 'phuket-view',
    isHeadquarters: true,
    district: MOCK_HOTEL_PROFILE.district,
    qrPlacements: MOCK_HOTEL_PROFILE.qrPlacements,
    createdAt: '2025-03-01T00:00:00.000Z',
  },
];

export function slugifyHotelInput(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
}

export function buildHotelReferralUrl(slug: string, path = '/'): string {
  if (typeof window === 'undefined') {
    return `https://routewander.app${path}?hotel=${slug}`;
  }
  const base = window.location.origin;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}?hotel=${encodeURIComponent(slug)}`;
}

export function formatHotelReferralLabel(branch: Pick<HotelBranch, 'name' | 'slug'>): string {
  return `${branch.name} ${branch.slug}`;
}

function readStoredBranches(): HotelBranch[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as HotelBranch[];
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function getHotelBranches(): HotelBranch[] {
  return readStoredBranches() ?? DEFAULT_BRANCHES.map((b) => ({ ...b }));
}

export function saveHotelBranches(branches: HotelBranch[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(branches));
}

export function resolveHotelBySlug(slug: string): HotelBranch | null {
  const normalized = slug.trim().toLowerCase();
  if (!normalized) return null;
  return getHotelBranches().find((b) => b.slug === normalized) ?? null;
}

export function isSlugAvailable(slug: string, excludeId?: string): boolean {
  const normalized = slug.trim().toLowerCase();
  if (!normalized) return false;
  return !getHotelBranches().some((b) => b.slug === normalized && b.id !== excludeId);
}

function createBranchId(): string {
  return `hotel-branch-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export interface CreateHotelBranchInput {
  name: string;
  slug: string;
  isHeadquarters?: boolean;
  district?: string;
}

export function createHotelBranch(input: CreateHotelBranchInput): HotelBranch {
  const branches = getHotelBranches();
  if (branches.length >= MAX_HOTEL_BRANCHES) {
    throw new Error(`สร้างโรงแรมได้สูงสุด ${MAX_HOTEL_BRANCHES} แห่ง`);
  }

  const name = input.name.trim();
  const slug = slugifyHotelInput(input.slug || name);
  if (!name) throw new Error('กรุณากรอกชื่อโรงแรม');
  if (!slug) throw new Error('กรุณากรอก slug เป็นตัวอักษร a-z 0-9');
  if (!isSlugAvailable(slug)) throw new Error('slug นี้ถูกใช้แล้ว');

  const shouldBeHq = input.isHeadquarters ?? branches.length === 0;
  const nextBranches = branches.map((b) =>
    shouldBeHq ? { ...b, isHeadquarters: false } : b,
  );

  const branch: HotelBranch = {
    id: createBranchId(),
    name,
    slug,
    isHeadquarters: shouldBeHq || branches.length === 0,
    district: input.district?.trim() || undefined,
    qrPlacements: 0,
    createdAt: new Date().toISOString(),
  };

  saveHotelBranches([...nextBranches, branch]);
  return branch;
}

export function updateHotelBranch(
  id: string,
  patch: Partial<Pick<HotelBranch, 'name' | 'slug' | 'district' | 'qrPlacements' | 'isHeadquarters'>>,
): HotelBranch {
  const branches = getHotelBranches();
  const index = branches.findIndex((b) => b.id === id);
  if (index < 0) throw new Error('ไม่พบโรงแรม');

  const current = branches[index];
  const nextSlug = patch.slug !== undefined ? slugifyHotelInput(patch.slug) : current.slug;
  const nextName = patch.name !== undefined ? patch.name.trim() : current.name;

  if (!nextName) throw new Error('กรุณากรอกชื่อโรงแรม');
  if (!nextSlug) throw new Error('กรุณากรอก slug ที่ถูกต้อง');
  if (!isSlugAvailable(nextSlug, id)) throw new Error('slug นี้ถูกใช้แล้ว');

  let nextBranches = [...branches];
  const isHq = patch.isHeadquarters ?? current.isHeadquarters;

  if (isHq && !current.isHeadquarters) {
    nextBranches = nextBranches.map((b) => ({ ...b, isHeadquarters: b.id === id }));
  }

  const updated: HotelBranch = {
    ...current,
    ...patch,
    name: nextName,
    slug: nextSlug,
    isHeadquarters: isHq,
  };

  nextBranches[index] = updated;

  if (nextBranches.length === 1) {
    nextBranches[0] = { ...nextBranches[0], isHeadquarters: true };
  } else if (!nextBranches.some((b) => b.isHeadquarters)) {
    nextBranches[0] = { ...nextBranches[0], isHeadquarters: true };
  }

  saveHotelBranches(nextBranches);
  return updated;
}

export function deleteHotelBranch(id: string): void {
  const branches = getHotelBranches();
  if (branches.length <= 1) {
    throw new Error('ต้องมีโรงแรมอย่างน้อย 1 แห่ง');
  }
  const next = branches.filter((b) => b.id !== id);
  if (!next.some((b) => b.isHeadquarters)) {
    next[0] = { ...next[0], isHeadquarters: true };
  }
  saveHotelBranches(next);
}

export function getHeadquartersBranch(): HotelBranch | null {
  const branches = getHotelBranches();
  return branches.find((b) => b.isHeadquarters) ?? branches[0] ?? null;
}
