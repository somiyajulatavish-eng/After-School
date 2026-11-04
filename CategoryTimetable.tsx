'use client';

import { useEffect, useRef, useState } from 'react';
import { TLink } from '@/components/TLink';
import { SplitText } from '@/components/motion/SplitText';
import { ArrowIcon } from '@/components/ui/Icons';
import { gsap, isFinePointer, prefersReducedMotion } from '@/lib/gsap';
import type { Category } from '@/lib/types';

interface Row extends Category {
  count: number;
  image: string;
}

/** Category list styled as an after-school timetable, with a hover image that trails the pointer. */
export function CategoryTimetable({ rows }: { rows: Row[] }) {
  const [active, setActive] = useState<number | null>(null);
  const preview = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = preview.current;
    const host = list.current;
    if (!el || !host || !isFinePointer() || prefersReducedMotion()) return;
    gsap.set(el, { xPercent: -50, yPercent: -50 });
    const x = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3' });
    const y = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3' });
    const r = gsap.quickTo(el, 'rotation', { duration: 0.9, ease: 'power3' });
    let lastX = 0;
    const move = (e: PointerEvent) => {
      const b = host.getBoundingClientRect();
      x(e.clientX - b.left);
      y(e.clientY - b.top);
      r(Math.max(-12, Math.min(12, (e.clientX - lastX) * 0.6)));
      lastX = e.clientX;
    };
    host.addEventListener('pointermove', move);
    return () => host.removeEventListener('pointermove', move);
  }, []);

  return (
    <section className="relative py-24 md:py-36" aria-labelledby="timetable-title">
      <div className="wrap">
        <div className="mb-14 grid gap-6 md:grid-cols-12">
          <SplitText as="h2" id="timetable-title" text={'The after\nschool timetable'} className="display text-[clamp(44px,7vw,112px)] md:col-span-8" />
          <p className="self-end text-graphite md:col-span-4">
            Three departments, one studio. Pick the period you’re here for.
          </p>
        </div>

        <div ref={list} className="relative" onPointerLeave={() => setActive(null)}>
        <ul className="border-t border-ink/15">
          {rows.map((row, i) => (
            <li key={row.slug} className="border-b border-ink/15">
              <TLink
                href={`/shop/${row.slug}`}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 py-7 md:grid-cols-12 md:gap-6 md:py-10"
                data-cursor="Open"
              >
                <span className="text-sm font-semibold tabular-nums text-margin md:col-span-1 md:text-base">{row.time}</span>
                <span className="display text-[clamp(36px,6.5vw,104px)] transition-transform duration-700 ease-expo group-hover:translate-x-4 md:col-span-6">
                  {row.short}
                </span>
                <span className="hidden text-[15px] leading-relaxed text-graphite md:col-span-4 md:block">{row.blurb}</span>
                <span className="flex items-center justify-end gap-3 md:col-span-1">
                  <span className="hidden text-sm text-graphite lg:inline">{row.count} items</span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 transition-all duration-500 ease-expo group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
                    <ArrowIcon width={18} height={18} className="-rotate-45 transition-transform duration-500 ease-expo group-hover:rotate-0" />
                  </span>
                </span>
              </TLink>
            </li>
          ))}
        </ul>

          <div
            ref={preview}
            aria-hidden
            className={`pointer-events-none absolute left-0 top-0 z-20 hidden w-[240px] overflow-hidden rounded-lg shadow-2xl transition-[opacity,clip-path] duration-500 ease-expo lg:block ${
              active === null ? 'opacity-0 [clip-path:inset(50%_50%_50%_50%)]' : 'opacity-100 [clip-path:inset(0%_0%_0%_0%)]'
            }`}
          >
            {rows.map((row, i) => (
              <img
                key={row.slug}
                src={row.image}
                alt=""
                width={600}
                height={750}
                className={`h-auto w-full transition-opacity duration-300 ${i === active ? 'relative opacity-100' : 'absolute inset-0 opacity-0'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
