import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { type HotelBranch, resolveHotelBySlug } from '../data/hotelBranches';

const SESSION_KEY = 'routewander_hotel_referral';

interface HotelReferralContextValue {
  referralHotel: HotelBranch | null;
  setReferralBySlug: (slug: string | null) => void;
  clearReferral: () => void;
}

const HotelReferralContext = createContext<HotelReferralContextValue | null>(null);

function readSessionSlug(): string | null {
  try {
    return sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

function writeSessionSlug(slug: string | null): void {
  try {
    if (slug) sessionStorage.setItem(SESSION_KEY, slug);
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

export function HotelReferralProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [referralSlug, setReferralSlug] = useState<string | null>(() => readSessionSlug());

  const setReferralBySlug = useCallback((slug: string | null) => {
    const normalized = slug?.trim().toLowerCase() || null;
    setReferralSlug(normalized);
    writeSessionSlug(normalized);
  }, []);

  const clearReferral = useCallback(() => {
    setReferralBySlug(null);
  }, [setReferralBySlug]);

  useEffect(() => {
    const fromQuery = searchParams.get('hotel') || searchParams.get('ref');
    if (!fromQuery) return;

    const normalized = fromQuery.trim().toLowerCase();
    setReferralBySlug(normalized);

    const next = new URLSearchParams(searchParams);
    next.delete('hotel');
    next.delete('ref');
    const qs = next.toString();
    const nextPath = qs ? `${location.pathname}?${qs}` : location.pathname;
    window.history.replaceState(null, '', nextPath);
  }, [location.pathname, searchParams, setReferralBySlug]);

  const referralHotel = useMemo(() => {
    if (!referralSlug) return null;
    return resolveHotelBySlug(referralSlug);
  }, [referralSlug]);

  const value = useMemo(
    () => ({ referralHotel, setReferralBySlug, clearReferral }),
    [referralHotel, setReferralBySlug, clearReferral],
  );

  return <HotelReferralContext.Provider value={value}>{children}</HotelReferralContext.Provider>;
}

export function useHotelReferral() {
  const ctx = useContext(HotelReferralContext);
  if (!ctx) {
    throw new Error('useHotelReferral must be used within HotelReferralProvider');
  }
  return ctx;
}
