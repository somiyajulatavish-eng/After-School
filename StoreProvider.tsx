'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { getProduct, variantStock } from '@/lib/catalog';
import { findDiscount } from '@/lib/discounts';
import { computeTotals, lineKey, type Totals } from '@/lib/pricing';
import { isSupportedCountry, type ShippingMethodId } from '@/lib/shipping';
import type { CartLine } from '@/lib/types';

const STORAGE_KEY = 'after-school:store:v1';

export interface Toast {
  id: number;
  title: string;
  body?: string;
  image?: string;
}

interface Persisted {
  lines: CartLine[];
  wishlist: string[];
  code: string | null;
  country: string;
  method: ShippingMethodId;
}

interface StoreCtx extends Persisted {
  hydrated: boolean;
  totals: Totals;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addItem: (slug: string, color: string, size: string | undefined, qty?: number) => { ok: boolean; message: string };
  setQty: (key: string, qty: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  toggleWishlist: (slug: string) => boolean;
  isWished: (slug: string) => boolean;
  applyCode: (code: string) => { ok: boolean; message: string };
  removeCode: () => void;
  setCountry: (c: string) => void;
  setMethod: (m: ShippingMethodId) => void;
  toasts: Toast[];
  dismissToast: (id: number) => void;
}

const defaults: Persisted = { lines: [], wishlist: [], code: null, country: 'US', method: 'standard' };
const Ctx = createContext<StoreCtx | null>(null);

export function useStore(): StoreCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}

function sanitize(data: unknown): Persisted {
  if (!data || typeof data !== 'object') return defaults;
  const d = data as Partial<Persisted>;
  const lines = Array.isArray(d.lines)
    ? d.lines
        .filter((l): l is CartLine => !!l && typeof l.slug === 'string' && typeof l.color === 'string' && typeof l.qty === 'number' && !!getProduct(l.slug))
        .map((l) => ({ ...l, key: lineKey(l) }))
    : [];
  return {
    lines,
    wishlist: Array.isArray(d.wishlist) ? d.wishlist.filter((s): s is string => typeof s === 'string' && !!getProduct(s)) : [],
    code: typeof d.code === 'string' && findDiscount(d.code) ? d.code : null,
    country: typeof d.country === 'string' && isSupportedCountry(d.country) ? d.country : 'US',
    method: d.method === 'express' ? 'express' : 'standard',
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(defaults);
  const [hydrated, setHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState(sanitize(JSON.parse(raw)));
    } catch {
      /* storage unavailable: start empty */
    }
    setHydrated(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setState(sanitize(JSON.parse(e.newValue)));
        } catch {
          /* ignore malformed */
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* quota or private mode */
    }
  }, [state, hydrated]);

  const pushToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev.slice(-2), { ...t, id }]);
    window.setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 3800);
  }, []);

  const dismissToast = useCallback((id: number) => setToasts((prev) => prev.filter((x) => x.id !== id)), []);

  const addItem = useCallback<StoreCtx['addItem']>(
    (slug, color, size, qty = 1) => {
      const p = getProduct(slug);
      if (!p) return { ok: false, message: 'This product is no longer available.' };
      if (p.sizes.length && !size) return { ok: false, message: 'Choose a size first.' };
      const stock = variantStock(slug, color, size);
      if (stock <= 0) return { ok: false, message: 'That option is sold out.' };
      const key = lineKey({ slug, color, size, qty });
      const existing = state.lines.find((l) => l.key === key);
      const nextQty = Math.min((existing?.qty ?? 0) + qty, stock, 10);
      if (existing && nextQty === existing.qty) return { ok: false, message: `You already have the maximum available (${nextQty}).` };
      setState((s) => ({
        ...s,
        lines: existing
          ? s.lines.map((l) => (l.key === key ? { ...l, qty: nextQty } : l))
          : [...s.lines, { key, slug, color, size, qty: nextQty }],
      }));
      const ci = Math.max(0, p.colors.findIndex((c) => c.name === color));
      pushToast({ title: 'Added to bag', body: `${p.name}, ${[color, size].filter(Boolean).join(' / ')}`, image: p.images[ci][0] });
      return { ok: true, message: 'Added to bag' };
    },
    [state.lines, pushToast],
  );

  const setQty = useCallback((key: string, qty: number) => {
    setState((s) => ({
      ...s,
      lines: s.lines
        .map((l) => (l.key === key ? { ...l, qty: Math.max(0, Math.min(qty, variantStock(l.slug, l.color, l.size), 10)) } : l))
        .filter((l) => l.qty > 0),
    }));
  }, []);

  const removeItem = useCallback((key: string) => setState((s) => ({ ...s, lines: s.lines.filter((l) => l.key !== key) })), []);
  const clearCart = useCallback(() => setState((s) => ({ ...s, lines: [], code: null })), []);

  const toggleWishlist = useCallback(
    (slug: string) => {
      const has = state.wishlist.includes(slug);
      setState((s) => ({ ...s, wishlist: has ? s.wishlist.filter((x) => x !== slug) : [...s.wishlist, slug] }));
      const p = getProduct(slug);
      if (p) pushToast({ title: has ? 'Removed from wishlist' : 'Saved to wishlist', body: p.name, image: p.images[0][0] });
      return !has;
    },
    [state.wishlist, pushToast],
  );

  const isWished = useCallback((slug: string) => state.wishlist.includes(slug), [state.wishlist]);

  const applyCode = useCallback(
    (code: string) => {
      const d = findDiscount(code);
      if (!d) return { ok: false, message: 'That code isn’t valid. Check the spelling and try again.' };
      const t = computeTotals(state.lines, d.code, state.country, state.method);
      if (t.discountError) return { ok: false, message: t.discountError };
      setState((s) => ({ ...s, code: d.code }));
      return { ok: true, message: `${d.code} applied: ${d.description}.` };
    },
    [state.lines, state.country, state.method],
  );

  const removeCode = useCallback(() => setState((s) => ({ ...s, code: null })), []);
  const setCountry = useCallback((country: string) => setState((s) => ({ ...s, country })), []);
  const setMethod = useCallback((method: ShippingMethodId) => setState((s) => ({ ...s, method })), []);

  const totals = useMemo(() => computeTotals(state.lines, state.code, state.country, state.method), [state]);

  const value: StoreCtx = {
    ...state,
    hydrated,
    totals,
    cartOpen,
    setCartOpen,
    addItem,
    setQty,
    removeItem,
    clearCart,
    toggleWishlist,
    isWished,
    applyCode,
    removeCode,
    setCountry,
    setMethod,
    toasts,
    dismissToast,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
