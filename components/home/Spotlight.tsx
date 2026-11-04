'use client';

import { useState } from 'react';
import { TLink } from '@/components/TLink';
import { ClipReveal } from '@/components/motion/ClipReveal';
import { Magnetic } from '@/components/motion/Magnetic';
import { Reveal } from '@/components/motion/Reveal';
import { useStore } from '@/components/providers/StoreProvider';
import { Img } from '@/components/ui/Img';
import { Price } from '@/components/ui/Price';
import { Stars } from '@/components/ui/Stars';
import { variantStock } from '@/lib/catalog';
import type { Product } from '@/lib/types';

/** One product, given the space of a magazine spread. */
export function Spotlight({ product, rating }: { product: Product; rating: { average: number; count: number } }) {
  const { addItem } = useStore();
  const [colorIdx, setColorIdx] = useState(0);
  const [size, setSize] = useState<string | undefined>();
  const [note, setNote] = useState('');
  const color = product.colors[colorIdx];

  const add = () => {
    const r = addItem(product.slug, color.name, size, 1);
    setNote(r.ok ? '' : r.message);
  };

  return (
    <section className="relative overflow-hidden bg-sheet py-24 md:py-36" aria-labelledby="spotlight-title">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="relative lg:col-span-6 lg:col-start-1">
          <ClipReveal className="relative aspect-[4/5] rounded-[3px]">
            <Img key={product.images[colorIdx][0]} src={product.images[colorIdx][0]} alt={`${product.name} in ${color.name}`} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </ClipReveal>
        </div>

        <div className="flex flex-col justify-center lg:col-span-5 lg:col-start-8">
          <Reveal>
            <p className="eyebrow-serif text-2xl text-graphite">Object of the season</p>
            <h2 id="spotlight-title" className="display mt-5 text-[clamp(34px,5vw,84px)]">
              {product.name.replace('Heavyweight ', '')}
            </h2>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-lg">
              <Price price={product.price} compareAt={product.compareAt} className="font-semibold" />
              <TLink href={`/product/${product.slug}#reviews`} className="text-sm text-graphite">
                <Stars value={rating.average} count={rating.count} />
              </TLink>
            </div>
            <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-graphite">{product.description}</p>
            <ul className="mt-6 space-y-1.5 text-[15px] text-ink/80">
              {product.details.slice(0, 3).map((d) => (
                <li key={d} className="flex gap-3">
                  <span aria-hidden className="mt-[0.6em] h-px w-4 shrink-0 bg-line/40" />
                  {d}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="mt-10 space-y-6">
            <fieldset>
              <legend className="mb-3 text-sm text-graphite">
                Colour: <span className="text-ink">{color.name}</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c, i) => (
                  <label key={c.name} className="cursor-pointer" title={c.name}>
                    <input type="radio" name="spot-color" className="peer sr-only" checked={i === colorIdx} onChange={() => setColorIdx(i)} />
                    <span className="block h-9 w-9 rounded-full border border-line/25 ring-offset-2 ring-offset-sheet transition-transform duration-300 hover:scale-110 peer-checked:ring-2 peer-checked:ring-ink peer-focus-visible:ring-2 peer-focus-visible:ring-pen" style={{ backgroundColor: c.hex }} />
                    <span className="sr-only">{c.name}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            {product.sizes.length > 0 && (
              <fieldset>
                <legend className="mb-3 text-sm text-graphite">
                  Size: <span className="text-ink">{size ?? 'choose one'}</span>
                </legend>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => {
                    const out = variantStock(product.slug, color.name, s) <= 0;
                    return (
                      <label key={s} className={out ? 'cursor-not-allowed' : 'cursor-pointer'}>
                        <input type="radio" name="spot-size" className="peer sr-only" checked={size === s} disabled={out} onChange={() => { setSize(s); setNote(''); }} />
                        <span className="flex h-11 min-w-[3rem] items-center justify-center rounded-full border border-line/20 px-3 text-sm font-semibold transition-colors duration-300 hover:border-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-disabled:border-dashed peer-disabled:text-graphite/50 peer-disabled:line-through peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-pen">
                          {s}
                        </span>
                        {out && <span className="sr-only">sold out</span>}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <Magnetic strength={0.2}>
                <button type="button" onClick={add} className="btn-primary" data-cursor="Add">
                  Add to bag
                </button>
              </Magnetic>
              <TLink href={`/product/${product.slug}`} className="btn-ghost">
                Full details
              </TLink>
            </div>
            <p className="min-h-[1.25rem] text-sm text-margin" aria-live="polite">
              {note}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
