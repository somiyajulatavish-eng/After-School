'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { TLink } from '@/components/TLink';
import { useStore } from '@/components/providers/StoreProvider';
import { PlusIcon, CloseIcon } from '@/components/ui/Icons';
import { Price } from '@/components/ui/Price';
import { Stars } from '@/components/ui/Stars';
import { WishlistButton } from '@/components/ui/WishlistButton';
import { getRating, variantStock } from '@/lib/catalog';
import type { Product } from '@/lib/types';

const badgeStyle: Record<string, string> = {
  New: 'bg-marker text-ink',
  Sale: 'bg-margin text-white',
  Bestseller: 'bg-ink text-paper',
};

export function ProductCard({ product, sizes = '(min-width: 1024px) 25vw, 50vw' }: { product: Product; sizes?: string }) {
  const { addItem } = useStore();
  const [colorIdx, setColorIdx] = useState(0);
  const [picking, setPicking] = useState(false);
  const [message, setMessage] = useState('');
  const color = product.colors[colorIdx];
  const [imgA, imgB] = product.images[colorIdx];
  const rating = getRating(product.slug);
  const href = `/product/${product.slug}`;

  const quickAdd = () => {
    if (product.sizes.length) {
      setPicking(true);
      return;
    }
    const r = addItem(product.slug, color.name, undefined, 1);
    if (!r.ok) setMessage(r.message);
  };

  const addSize = (size: string) => {
    const r = addItem(product.slug, color.name, size, 1);
    if (r.ok) setPicking(false);
    else setMessage(r.message);
  };

  return (
    <article className="group relative flex flex-col gap-4" onMouseLeave={() => setPicking(false)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-sheet">
        <TLink href={href} className="absolute inset-0 block" data-cursor="View" aria-label={`${product.name}, ${color.name}`}>
          <img
            src={imgA}
            alt={`${product.name} in ${color.name}`}
            width={600}
            height={750}
            sizes={sizes}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-expo group-hover:scale-[1.05]"
          />
          <img
            src={imgB}
            alt=""
            width={600}
            height={750}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full scale-[1.08] object-cover opacity-0 transition-[opacity,transform] duration-700 ease-expo group-hover:scale-100 group-hover:opacity-100"
          />
        </TLink>

        {product.badge && (
          <span className={`pointer-events-none absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${badgeStyle[product.badge]}`}>
            {product.badge}
          </span>
        )}
        <WishlistButton slug={product.slug} name={product.name} className="absolute right-3 top-3" />

        <div className="absolute inset-x-3 bottom-3">
          <AnimatePresence mode="wait" initial={false}>
            {picking ? (
              <motion.div
                key="sizes"
                initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="glass rounded-xl p-2 shadow-lg"
              >
                <div className="mb-1 flex items-center justify-between px-1">
                  <span className="text-xs font-medium">Pick a size</span>
                  <button type="button" onClick={() => setPicking(false)} aria-label="Close size picker" className="rounded-full p-1 hover:bg-ink/10">
                    <CloseIcon width={14} height={14} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {product.sizes.slice(0, 12).map((s) => {
                    const out = variantStock(product.slug, color.name, s) <= 0;
                    return (
                      <button
                        key={s}
                        type="button"
                        disabled={out}
                        onClick={() => addSize(s)}
                        className="h-8 min-w-[2.5rem] rounded-md bg-white px-2 text-xs font-semibold transition-colors hover:bg-ink hover:text-paper disabled:bg-transparent disabled:text-graphite/50 disabled:line-through"
                        aria-label={out ? `${s}, sold out` : `Add size ${s}`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.button
                key="add"
                type="button"
                onClick={quickAdd}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass ml-auto flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold shadow-sm transition-[opacity,transform,background-color] duration-500 ease-expo hover:bg-white lg:translate-y-2 lg:opacity-0 lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
                aria-label={`Quick add ${product.name}`}
              >
                <PlusIcon width={16} height={16} />
                Quick add
              </motion.button>
            )}
          </AnimatePresence>
          <span className="sr-only" role="status">
            {message}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-semibold leading-snug">
            <TLink href={href} className="link-underline">
              {product.name}
            </TLink>
          </h3>
          <Price price={product.price} compareAt={product.compareAt} className="shrink-0 text-[15px] font-semibold" />
        </div>
        <div className="flex items-center justify-between gap-3 text-sm text-graphite">
          <span>{product.type}</span>
          <Stars value={rating.average} />
        </div>
        {product.colors.length > 1 && (
          <div className="mt-1 flex gap-1.5" role="radiogroup" aria-label={`${product.name} colours`}>
            {product.colors.map((c, i) => (
              <button
                key={c.name}
                type="button"
                role="radio"
                aria-checked={i === colorIdx}
                aria-label={c.name}
                title={c.name}
                onMouseEnter={() => setColorIdx(i)}
                onFocus={() => setColorIdx(i)}
                onClick={() => setColorIdx(i)}
                className={`h-4 w-4 rounded-full border transition-transform duration-300 hover:scale-125 ${i === colorIdx ? 'border-ink ring-2 ring-ink/20 ring-offset-1 ring-offset-paper' : 'border-ink/20'}`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
