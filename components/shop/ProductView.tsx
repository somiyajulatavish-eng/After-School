'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { TLink } from '@/components/TLink';
import { Magnetic } from '@/components/motion/Magnetic';
import { useStore } from '@/components/providers/StoreProvider';
import { CheckIcon, TruckIcon } from '@/components/ui/Icons';
import { Price } from '@/components/ui/Price';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { Stars } from '@/components/ui/Stars';
import { WishlistButton } from '@/components/ui/WishlistButton';
import { getCategory, variantStock } from '@/lib/catalog';
import { COUNTRIES, quoteShipping } from '@/lib/shipping';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import type { Product } from '@/lib/types';
import { Accordion } from './Accordion';
import { SizeGuide } from './SizeGuide';

export function ProductView({ product, rating }: { product: Product; rating: { average: number; count: number } }) {
  const { addItem, setCartOpen, price, country } = useStore();
  const freeOver = price(quoteShipping(country, 'standard', 0).freeThreshold);
  const countryName = COUNTRIES.find((c) => c.code === country)?.name ?? 'your country';
  const [colorIdx, setColorIdx] = useState(0);
  const [size, setSize] = useState<string | undefined>(product.sizes.length === 1 ? product.sizes[0] : undefined);
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [slide, setSlide] = useState(0);
  const info = useRef<HTMLDivElement>(null);
  const gallery = useRef<HTMLDivElement>(null);
  const color = product.colors[colorIdx];
  const needsSize = product.sizes.length > 0;
  const stock = needsSize && !size ? null : variantStock(product.slug, color.name, size);
  const category = getCategory(product.category);
  const printed = product.category === '3d-printed';

  useEffect(() => {
    if (stock !== null && qty > Math.max(1, Math.min(stock, 10))) setQty(Math.max(1, Math.min(stock, 10)));
  }, [stock, qty]);

  useEffect(() => {
    const el = info.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-pdp-in]', { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.07, delay: 0.5, ease: 'expo.out' });
    }, el);
    return () => ctx.revert();
  }, []);

  const onScrollGallery = () => {
    const g = gallery.current;
    if (!g) return;
    setSlide(Math.round(g.scrollLeft / g.clientWidth));
  };

  const add = () => {
    if (needsSize && !size) {
      setStatus({ ok: false, msg: 'Choose a size to continue.' });
      return;
    }
    const r = addItem(product.slug, color.name, size, qty);
    setStatus({ ok: r.ok, msg: r.message });
  };

  const stockText =
    stock === null
      ? 'Select a size to check availability.'
      : stock === 0
        ? 'Sold out in this option.'
        : stock <= 3
          ? `Only ${stock} left.`
          : printed
            ? 'Printed to order. Ships in 2 to 4 days.'
            : 'In stock. Ships in 1 to 2 days.';

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-7">
        <div ref={gallery} onScroll={onScrollGallery} className="no-scrollbar -mx-4 flex snap-x snap-mandatory overflow-x-auto sm:-mx-6 lg:mx-0 lg:flex-col lg:gap-4 lg:overflow-visible" aria-label="Product images">
          {product.images[colorIdx].map((src, i) => (
            <div key={i} className="relative aspect-[4/5] w-full shrink-0 snap-center overflow-hidden bg-sheet lg:rounded-lg">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.img
                  key={src}
                  src={src}
                  alt={i === 0 ? `${product.name} in ${color.name}` : `${product.name} in ${color.name}, detail`}
                  width={600}
                  height={750}
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={{ clipPath: 'inset(0% 0% 100% 0%)', scale: 1.1 }}
                  animate={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
                />
              </AnimatePresence>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center gap-2 lg:hidden" aria-hidden>
          {product.images[colorIdx].map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all duration-500 ${slide === i ? 'w-6 bg-ink' : 'w-1.5 bg-ink/25'}`} />
          ))}
        </div>
      </div>

      <div className="lg:col-span-5">
        <div ref={info} className="lg:sticky lg:top-28">
          <div data-pdp-in className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm text-graphite">
            <TLink href={`/shop/${product.category}`} className="link-underline">
              {category?.name}
            </TLink>
            <a href="#reviews" className="link-underline">
              <Stars value={rating.average} count={rating.count} />
            </a>
          </div>
          <h1 data-pdp-in className="display-narrow mt-4 text-[clamp(34px,4vw,64px)] [overflow-wrap:anywhere]">
            {product.name}
          </h1>
          <div data-pdp-in className="mt-4 flex items-center gap-3 text-2xl font-semibold">
            <Price price={product.price} compareAt={product.compareAt} />
            {product.compareAt && <span className="rounded-full bg-margin px-2.5 py-1 text-xs font-semibold text-white">Save {Math.round((1 - product.price / product.compareAt) * 100)}%</span>}
          </div>
          <p data-pdp-in className="mt-6 max-w-[48ch] text-lg leading-relaxed text-graphite">
            {product.description}
          </p>

          <fieldset data-pdp-in className="mt-8">
            <legend className="mb-3 text-sm">
              Colour: <span className="font-semibold">{color.name}</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c, i) => (
                <label key={c.name} className="cursor-pointer" title={c.name}>
                  <input type="radio" name="color" value={c.name} checked={i === colorIdx} onChange={() => { setColorIdx(i); setStatus(null); }} className="peer sr-only" />
                  <span className="block h-10 w-10 rounded-full border border-line/20 ring-offset-2 ring-offset-paper transition-transform duration-300 hover:scale-110 peer-checked:ring-2 peer-checked:ring-ink peer-focus-visible:ring-2 peer-focus-visible:ring-pen" style={{ backgroundColor: c.hex }} />
                  <span className="sr-only">{c.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {needsSize && (
            <fieldset data-pdp-in className="mt-6">
              <legend className="mb-3 text-sm">
                {product.slug === 'initial-keychain' ? 'Letter' : 'Size'}: <span className="font-semibold">{size ?? 'choose one'}</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => {
                  const out = variantStock(product.slug, color.name, s) <= 0;
                  return (
                    <label key={s} className={out ? 'cursor-not-allowed' : 'cursor-pointer'}>
                      <input type="radio" name="size" value={s} checked={size === s} disabled={out} onChange={() => { setSize(s); setStatus(null); }} className="peer sr-only" />
                      <span className="flex h-11 min-w-[3rem] items-center justify-center rounded-lg border border-line/20 px-3 text-sm font-semibold transition-colors duration-300 hover:border-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-disabled:border-dashed peer-disabled:text-graphite/50 peer-disabled:line-through peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-pen">
                        {s}
                      </span>
                      {out && <span className="sr-only">sold out</span>}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          <p data-pdp-in className={`mt-5 flex items-center gap-2 text-sm ${stock === 0 ? 'text-margin' : stock !== null && stock <= 3 ? 'font-medium text-margin' : 'text-graphite'}`} aria-live="polite">
            <span className={`h-2 w-2 rounded-full ${stock === 0 ? 'bg-margin' : stock === null ? 'bg-ink/30' : stock <= 3 ? 'bg-[#E89B2B]' : 'bg-[#2FA35B]'}`} />
            {stockText}
          </p>

          <div data-pdp-in className="mt-6 flex flex-wrap items-center gap-3">
            <QuantityStepper value={qty} min={1} max={stock === null ? 10 : Math.max(1, Math.min(stock, 10))} onChange={setQty} label="Quantity" />
            <Magnetic strength={0.2} className="flex-1">
              <button type="button" onClick={add} disabled={stock === 0} className="btn-primary w-full min-w-[200px]" data-cursor="Add">
                {stock === 0 ? 'Sold out' : 'Add to bag'}
              </button>
            </Magnetic>
            <WishlistButton slug={product.slug} name={product.name} className="h-14 w-14 border border-line/15" />
          </div>
          <div className="min-h-[2.5rem] pt-3" aria-live="polite">
            <AnimatePresence mode="wait">
              {status && (
                <motion.p key={status.msg} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`flex items-center gap-2 text-sm ${status.ok ? 'text-ink' : 'text-margin'}`}>
                  {status.ok && <CheckIcon width={16} height={16} />}
                  {status.msg}
                  {status.ok && (
                    <button type="button" onClick={() => setCartOpen(true)} className="link-underline ml-1 font-semibold">
                      View bag
                    </button>
                  )}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <p data-pdp-in className="mt-2 flex items-center gap-2 text-sm text-graphite">
            <TruckIcon width={18} height={18} /> Free standard shipping to {countryName} over {freeOver}. Free 30-day returns on unworn clothing.
          </p>

          <div data-pdp-in className="mt-8">
            <Accordion
              items={[
                {
                  title: 'Details',
                  content: (
                    <ul className="list-disc space-y-1 pl-5">
                      {product.details.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  ),
                },
                ...(needsSize ? [{ title: product.slug === 'initial-keychain' ? 'Letters' : 'Size guide', content: <SizeGuide sizes={product.sizes} /> }] : []),
                {
                  title: 'Shipping and returns',
                  content: (
                    <div className="space-y-2">
                      <p>Standard US delivery takes 3 to 5 business days, express 1 to 2. We ship to 15 countries; use the calculator in your bag for an exact quote.</p>
                      <p>{printed ? '3D printed items are made to order. If one arrives damaged, we’ll reprint it free.' : 'Return unworn items within 30 days for a full refund.'}</p>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
