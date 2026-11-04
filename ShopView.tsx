'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useScrollLock } from '@/components/providers/SmoothScroll';
import { CloseIcon, FilterIcon } from '@/components/ui/Icons';
import { CATEGORIES, getRating, totalStock } from '@/lib/catalog';
import { hash } from '@/lib/format';
import type { CategorySlug, Product } from '@/lib/types';
import { ProductGrid } from './ProductGrid';

export type SortKey = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';
const SORTS: { id: SortKey; label: string }[] = [
  { id: 'featured', label: 'Featured' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'rating', label: 'Top rated' },
];

const PRICE_BANDS = [
  { id: 'u25', label: 'Under $25', min: 0, max: 2499 },
  { id: '25-50', label: '$25 to $50', min: 2500, max: 5000 },
  { id: '50-100', label: '$50 to $100', min: 5001, max: 10000 },
  { id: '100+', label: '$100 and up', min: 10001, max: Infinity },
];

interface Props {
  products: Product[];
  showCategoryFilter?: boolean;
  initialSort?: SortKey;
  initialCategory?: CategorySlug;
  emptyAction?: ReactNode;
}

const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

export function ShopView({ products, showCategoryFilter = false, initialSort = 'featured', initialCategory, emptyAction }: Props) {
  const [sort, setSort] = useState<SortKey>(initialSort);
  const [cats, setCats] = useState<CategorySlug[]>(initialCategory ? [initialCategory] : []);
  const [types, setTypes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [price, setPrice] = useState<string | null>(null);
  const [inStock, setInStock] = useState(false);
  const [panel, setPanel] = useState(false);
  useScrollLock(panel);

  useEffect(() => setSort(initialSort), [initialSort]);

  const options = useMemo(() => {
    const pool = cats.length ? products.filter((p) => cats.includes(p.category)) : products;
    return {
      types: Array.from(new Set(pool.map((p) => p.type))).sort(),
      colors: Array.from(new Map(pool.flatMap((p) => p.colors).map((c) => [c.name, c])).values()).sort((a, b) => a.name.localeCompare(b.name)),
      sizes: Array.from(new Set(pool.flatMap((p) => p.sizes).filter((s) => s.length > 1 || /\d/.test(s)))),
    };
  }, [products, cats]);

  const filtered = useMemo(() => {
    const band = PRICE_BANDS.find((b) => b.id === price);
    const list = products.filter(
      (p) =>
        (!cats.length || cats.includes(p.category)) &&
        (!types.length || types.includes(p.type)) &&
        (!colors.length || p.colors.some((c) => colors.includes(c.name))) &&
        (!sizes.length || p.sizes.some((s) => sizes.includes(s))) &&
        (!band || (p.price >= band.min && p.price <= band.max)) &&
        (!inStock || totalStock(p) > 0),
    );
    const sorted = [...list];
    switch (sort) {
      case 'newest':
        sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => getRating(b.slug).average - getRating(a.slug).average || getRating(b.slug).count - getRating(a.slug).count);
        break;
      default:
        sorted.sort((a, b) => (b.badge === 'Bestseller' ? 1 : 0) - (a.badge === 'Bestseller' ? 1 : 0) || (hash(a.slug) % 97) - (hash(b.slug) % 97));
    }
    return sorted;
  }, [products, cats, types, colors, sizes, price, inStock, sort]);

  const chips = [
    ...cats.map((c) => ({ key: `c-${c}`, label: CATEGORIES.find((x) => x.slug === c)?.name ?? c, clear: () => setCats((v) => v.filter((x) => x !== c)) })),
    ...types.map((t) => ({ key: `t-${t}`, label: t, clear: () => setTypes((v) => v.filter((x) => x !== t)) })),
    ...colors.map((c) => ({ key: `col-${c}`, label: c, clear: () => setColors((v) => v.filter((x) => x !== c)) })),
    ...sizes.map((s) => ({ key: `s-${s}`, label: `Size ${s}`, clear: () => setSizes((v) => v.filter((x) => x !== s)) })),
    ...(price ? [{ key: 'price', label: PRICE_BANDS.find((b) => b.id === price)?.label ?? '', clear: () => setPrice(null) }] : []),
    ...(inStock ? [{ key: 'stock', label: 'In stock', clear: () => setInStock(false) }] : []),
  ];
  const clearAll = () => {
    setCats(initialCategory && !showCategoryFilter ? [initialCategory] : []);
    setTypes([]);
    setColors([]);
    setSizes([]);
    setPrice(null);
    setInStock(false);
  };
  const visibleChips = initialCategory && !showCategoryFilter ? chips.filter((c) => !c.key.startsWith('c-')) : chips;

  const renderFilters = (scope: string) => (
    <div className="flex flex-col gap-8">
      {showCategoryFilter && (
        <fieldset>
          <legend className="mb-3 text-sm font-semibold">Category</legend>
          <div className="flex flex-col gap-2">
            {CATEGORIES.map((c) => (
              <label key={c.slug} className="flex cursor-pointer items-center gap-3 text-[15px]">
                <input type="checkbox" checked={cats.includes(c.slug)} onChange={() => setCats((v) => toggle(v, c.slug))} className="h-4 w-4 accent-ink" />
                {c.name}
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <fieldset>
        <legend className="mb-3 text-sm font-semibold">Type</legend>
        <div className="flex flex-wrap gap-2">
          {options.types.map((t) => (
            <button key={t} type="button" aria-pressed={types.includes(t)} onClick={() => setTypes((v) => toggle(v, t))} className={`rounded-full border px-3 py-1.5 text-sm transition-colors duration-300 ${types.includes(t) ? 'border-ink bg-ink text-paper' : 'border-ink/15 hover:border-ink'}`}>
              {t}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-3 text-sm font-semibold">Colour</legend>
        <div className="flex flex-wrap gap-2">
          {options.colors.map((c) => (
            <button key={c.name} type="button" aria-pressed={colors.includes(c.name)} onClick={() => setColors((v) => toggle(v, c.name))} title={c.name} aria-label={c.name} className={`h-8 w-8 rounded-full border transition-transform duration-300 hover:scale-110 ${colors.includes(c.name) ? 'border-ink ring-2 ring-ink ring-offset-2 ring-offset-paper' : 'border-ink/15'}`} style={{ backgroundColor: c.hex }} />
          ))}
        </div>
      </fieldset>
      {options.sizes.length > 0 && (
        <fieldset>
          <legend className="mb-3 text-sm font-semibold">Size</legend>
          <div className="flex flex-wrap gap-2">
            {options.sizes.map((s) => (
              <button key={s} type="button" aria-pressed={sizes.includes(s)} onClick={() => setSizes((v) => toggle(v, s))} className={`h-9 min-w-[2.75rem] rounded-md border px-2 text-sm transition-colors duration-300 ${sizes.includes(s) ? 'border-ink bg-ink text-paper' : 'border-ink/15 hover:border-ink'}`}>
                {s}
              </button>
            ))}
          </div>
        </fieldset>
      )}
      <fieldset>
        <legend className="mb-3 text-sm font-semibold">Price</legend>
        <div className="flex flex-col gap-2">
          {PRICE_BANDS.map((b) => (
            <label key={b.id} className="flex cursor-pointer items-center gap-3 text-[15px]">
              <input type="radio" name={`price-${scope}`} checked={price === b.id} onChange={() => setPrice(b.id)} onClick={() => price === b.id && setPrice(null)} className="h-4 w-4 accent-ink" />
              {b.label}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="flex cursor-pointer items-center justify-between gap-3 text-[15px]">
        In stock only
        <span className="relative inline-flex">
          <input type="checkbox" role="switch" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="peer sr-only" />
          <span className="h-6 w-11 rounded-full bg-ink/15 transition-colors duration-300 peer-checked:bg-pen peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-pen" />
          <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ease-expo peer-checked:translate-x-5" />
        </span>
      </label>
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-10">
      <aside className="hidden lg:col-span-3 lg:block" aria-label="Filters">
        <div className="sticky top-28">{renderFilters('desktop')}</div>
      </aside>

      <div className="lg:col-span-9">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-4">
          <p className="text-[15px] text-graphite" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
          </p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setPanel(true)} className="flex h-11 items-center gap-2 rounded-full border border-ink/15 px-4 text-sm font-semibold lg:hidden">
              <FilterIcon width={18} height={18} /> Filters{visibleChips.length ? ` (${visibleChips.length})` : ''}
            </button>
            <label htmlFor="sort" className="sr-only">
              Sort products
            </label>
            <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="h-11 cursor-pointer rounded-full border border-ink/15 bg-transparent px-4 text-sm font-semibold">
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {visibleChips.length > 0 && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <ul className="mb-8 flex flex-wrap items-center gap-2">
                <AnimatePresence initial={false}>
                  {visibleChips.map((c) => (
                    <motion.li key={c.key} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                      <button type="button" onClick={c.clear} className="flex items-center gap-1.5 rounded-full bg-marker px-3 py-1.5 text-sm font-medium">
                        {c.label}
                        <CloseIcon width={14} height={14} />
                        <span className="sr-only">Remove filter</span>
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
                <li>
                  <button type="button" onClick={clearAll} className="link-underline px-2 text-sm font-semibold">
                    Clear all
                  </button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {filtered.length ? (
          <ProductGrid products={filtered} columns="grid-cols-2 md:grid-cols-3" />
        ) : (
          <div className="rounded-xl bg-sheet px-6 py-16 text-center">
            <p className="display-narrow text-4xl">Nothing matches those filters.</p>
            <p className="mt-3 text-graphite">Remove a filter or two to see more.</p>
            <div className="mt-6 flex justify-center gap-3">
              <button type="button" onClick={clearAll} className="btn-primary">
                Clear filters
              </button>
              {emptyAction}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {panel && (
          <div className="fixed inset-0 z-[110] lg:hidden">
            <motion.button type="button" aria-label="Close filters" className="absolute inset-0 h-full w-full bg-ink/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPanel(false)} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
              className="absolute inset-x-0 bottom-0 flex max-h-[88svh] flex-col rounded-t-3xl bg-paper pb-[env(safe-area-inset-bottom)]"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
                <p className="text-lg font-semibold">Filters</p>
                <button type="button" onClick={() => setPanel(false)} className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-ink/5" aria-label="Close filters">
                  <CloseIcon />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-6" data-lenis-prevent>
                {renderFilters('mobile')}
              </div>
              <div className="grid grid-cols-2 gap-3 border-t border-ink/10 px-5 py-4">
                <button type="button" onClick={clearAll} className="btn-ghost h-12">
                  Clear
                </button>
                <button type="button" onClick={() => setPanel(false)} className="btn-primary h-12">
                  Show {filtered.length}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
