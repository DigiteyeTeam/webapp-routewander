import {
  LIBRARY_ENTRIES,
  type LibraryEntry,
} from './libraryRoutes';
import { MARKETPLACE_ROUTES } from './marketplaceRoutes';

const STORAGE_KEY = 'routewander-hotel-library-added';

function readStored(): LibraryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LibraryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStored(entries: LibraryEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    /* ignore */
  }
}

export function getAddedLibraryEntries(): LibraryEntry[] {
  return readStored();
}

export function getAllLibraryEntries(): LibraryEntry[] {
  return [...LIBRARY_ENTRIES, ...readStored()];
}

export function getLibraryEntryById(id: string): LibraryEntry | undefined {
  return getAllLibraryEntries().find((e) => e.id === id);
}

export function isRouteInHotelLibrary(sourceRouteId: string): boolean {
  return getAllLibraryEntries().some((e) => e.sourceRouteId === sourceRouteId);
}

export type AddToLibraryResult =
  | { ok: true; entry: LibraryEntry }
  | { ok: false; reason: 'duplicate' | 'not_found' };

export function addMarketplaceRouteToLibrary(sourceRouteId: string): AddToLibraryResult {
  if (!MARKETPLACE_ROUTES.some((r) => r.id === sourceRouteId)) {
    return { ok: false, reason: 'not_found' };
  }
  if (isRouteInHotelLibrary(sourceRouteId)) {
    return { ok: false, reason: 'duplicate' };
  }

  const entry: LibraryEntry = {
    id: `added-${sourceRouteId}-${Date.now()}`,
    sourceRouteId,
    license: 'lifetime',
  };

  const next = [...readStored(), entry];
  writeStored(next);
  return { ok: true, entry };
}

export function removeAddedLibraryEntry(id: string): boolean {
  const stored = readStored();
  const next = stored.filter((e) => e.id !== id);
  if (next.length === stored.length) return false;
  writeStored(next);
  return true;
}

export function isRemovableLibraryEntry(entry: LibraryEntry): boolean {
  return entry.id.startsWith('added-');
}
