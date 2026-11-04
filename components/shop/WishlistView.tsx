'use client';

import { TLink } from '@/components/TLink';
import { useStore } from '@/components/providers/StoreProvider';
import { getProduct } from '@/lib/catalog';
import type { Product } from '@/lib/types';
import { ProductGrid } from './ProductGrid';

export function WishlistView() {
  const { wishlist, hydrated } = useStore();
  if (!hydrated) return <div className="h-[40vh] animate-pulse rounded-xl bg-sheet" aria-label="Loading wishlist" />;
  const items = wishlist.map(getProduct).filter((p): p is Product => !!p);
  if (!items.length) {
    return (
      <div className="rounded-xl bg-sheet px-6 py-20 text-center">
        <p className="display-narrow text-5xl">Nothing saved yet.</p>
        <p className="mt-3 text-graphite">Tap the heart on any product to keep it here for later.</p>
        <TLink href="/shop" className="btn-primary mt-8">
          Browse the shop
        </TLink>
      </div>
    );
  }
  return (
    <>
      <p className="mb-8 text-graphite" aria-live="polite">
        {items.length} saved {items.length === 1 ? 'item' : 'items'}. Saved on this device.
      </p>
      <ProductGrid products={items} />
    </>
  );
}
