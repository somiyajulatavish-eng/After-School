'use client';

import { useEffect, useRef } from 'react';
import { ProductCard } from '@/components/shop/ProductCard';
import { SplitText } from '@/components/motion/SplitText';
import { TLink } from '@/components/TLink';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import type { Product } from '@/lib/types';

/** Pinned horizontal product rail on desktop; native swipe with scroll-snap on touch and small screens. */
export function HorizontalRail({ products, title, href, linkLabel }: { products: Product[]; title: string; href: string; linkLabel: string }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const s = section.current;
    const t = track.current;
    if (!s || !t || prefersReducedMotion()) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px) and (hover: hover)', () => {
      const distance = () => Math.max(0, t.scrollWidth - window.innerWidth + 80);
      gsap.to(t, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: s,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={section} className="relative overflow-hidden border-t border-line/10 py-20 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:py-0" aria-labelledby="rail-title">
      <div className="wrap mb-10 flex items-end justify-between gap-6">
        <SplitText as="h2" id="rail-title" text={title} className="display text-[clamp(34px,6vw,96px)]" />
        <TLink href={href} className="link-underline shrink-0 pb-2 text-[15px] font-semibold">
          {linkLabel}
        </TLink>
      </div>
      <ul ref={track} className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 sm:px-6 lg:snap-none lg:overflow-visible lg:px-10">
        {products.map((p) => (
          <li key={p.slug} className="w-[70vw] shrink-0 snap-start sm:w-[42vw] lg:w-[22vw] lg:max-w-[340px]">
            <ProductCard product={p} sizes="(min-width: 1024px) 22vw, 70vw" />
          </li>
        ))}
      </ul>
      <div className="wrap mt-10 hidden lg:block" aria-hidden>
        <div className="h-px w-full bg-ink/15">
          <span ref={bar} className="block h-px w-full origin-left bg-ink" style={{ transform: 'scaleX(0)' }} />
        </div>
      </div>
    </section>
  );
}
