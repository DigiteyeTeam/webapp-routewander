import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { calculateBookingTotal, clampGuestCount, getRoutePricePerPersonWithVehicle } from '../data/routePricing';
import { calculateBookingSplit } from '../data/hotelProfile';
import { getRouteById } from '../data/routeStore';
import type { CartItem } from '../types/cart';

const STORAGE_KEY = 'routewander-cart';

type AddItemInput = {
  routeId: string;
  guestCount: number;
  hotel?: { slug: string; name: string };
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  cartTotal: number;
  listTotal: number;
  totalSavings: number;
  addItem: (input: AddItemInput) => boolean;
  removeItem: (id: string) => void;
  updateGuestCount: (id: string, guestCount: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistCart(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

function buildCartItem(
  routeId: string,
  guestCount: number,
  hotel?: { slug: string; name: string },
): CartItem | null {
  const route = getRouteById(routeId);
  if (!route) return null;

  const guests = clampGuestCount(guestCount);
  const unitPrice = getRoutePricePerPersonWithVehicle(route.price, route);
  const subtotal = calculateBookingTotal(route.price, guests, route);
  const split = hotel ? calculateBookingSplit(subtotal, true, 1) : null;

  return {
    id: crypto.randomUUID(),
    routeId: route.id,
    routeTitle: route.title,
    routeImage: route.image,
    creatorName: route.creator.name,
    guestCount: guests,
    unitPrice,
    subtotal: split?.gross ?? subtotal,
    listPrice: split?.listPrice,
    hotelSlug: hotel?.slug,
    hotelName: hotel?.name,
    addedAt: new Date().toISOString(),
  };
}

function recalcItem(item: CartItem, guestCount: number): CartItem {
  const route = getRouteById(item.routeId);
  if (!route) return item;

  const guests = clampGuestCount(guestCount);
  const unitPrice = getRoutePricePerPersonWithVehicle(route.price, route);
  const subtotal = calculateBookingTotal(route.price, guests, route);
  const split = item.hotelSlug
    ? calculateBookingSplit(subtotal, true, 1)
    : null;

  return {
    ...item,
    guestCount: guests,
    unitPrice,
    subtotal: split?.gross ?? subtotal,
    listPrice: split?.listPrice,
  };
}

function sameCartLine(a: CartItem, routeId: string, hotelSlug?: string) {
  return a.routeId === routeId && (a.hotelSlug ?? '') === (hotelSlug ?? '');
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readStoredCart());

  const commit = useCallback((next: CartItem[]) => {
    setItems(next);
    persistCart(next);
  }, []);

  const addItem = useCallback(
    (input: AddItemInput) => {
      const existing = items.find((item) => sameCartLine(item, input.routeId, input.hotel?.slug));
      if (existing) {
        const next = items.map((item) =>
          item.id === existing.id
            ? recalcItem(item, item.guestCount + clampGuestCount(input.guestCount))
            : item,
        );
        commit(next);
        return true;
      }

      const created = buildCartItem(input.routeId, input.guestCount, input.hotel);
      if (!created) return false;
      commit([...items, created]);
      return true;
    },
    [items, commit],
  );

  const removeItem = useCallback(
    (id: string) => {
      commit(items.filter((item) => item.id !== id));
    },
    [items, commit],
  );

  const updateGuestCount = useCallback(
    (id: string, guestCount: number) => {
      commit(items.map((item) => (item.id === id ? recalcItem(item, guestCount) : item)));
    },
    [items, commit],
  );

  const clearCart = useCallback(() => {
    commit([]);
  }, [commit]);

  const value = useMemo<CartContextValue>(() => {
    const cartTotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const listTotal = items.reduce((sum, item) => sum + (item.listPrice ?? item.subtotal), 0);
    return {
      items,
      itemCount: items.length,
      cartTotal,
      listTotal,
      totalSavings: Math.max(0, listTotal - cartTotal),
      addItem,
      removeItem,
      updateGuestCount,
      clearCart,
    };
  }, [items, addItem, removeItem, updateGuestCount, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
