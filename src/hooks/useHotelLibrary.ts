import { useCallback, useMemo, useState } from 'react';
import {
  LIBRARY_ENTRIES,
} from '../data/libraryRoutes';
import {
  addMarketplaceRouteToLibrary,
  getAddedLibraryEntries,
  removeAddedLibraryEntry,
  type AddToLibraryResult,
} from '../data/hotelLibraryStore';

export function useHotelLibrary() {
  const [added, setAdded] = useState(getAddedLibraryEntries);

  const entries = useMemo(
    () => [...LIBRARY_ENTRIES, ...added],
    [added],
  );

  const addRoute = useCallback((sourceRouteId: string): AddToLibraryResult => {
    const result = addMarketplaceRouteToLibrary(sourceRouteId);
    if (result.ok) {
      setAdded((prev) => [...prev, result.entry]);
    }
    return result;
  }, []);

  const removeRoute = useCallback((entryId: string): boolean => {
    const ok = removeAddedLibraryEntry(entryId);
    if (ok) {
      setAdded((prev) => prev.filter((e) => e.id !== entryId));
    }
    return ok;
  }, []);

  const isInLibrary = useCallback(
    (sourceRouteId: string) =>
      entries.some((e) => e.sourceRouteId === sourceRouteId),
    [entries],
  );

  return { entries, addRoute, removeRoute, isInLibrary };
}
