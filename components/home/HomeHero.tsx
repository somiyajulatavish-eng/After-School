'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { TLink } from '@/components/TLink';
import { Magnetic } from '@/components/motion/Magnetic';
import { ArrowIcon } from '@/components/ui/Icons';
import { Img } from '@/components/ui/Img';
import { Price } from '@/components/ui/Price';
import { getProduct } from '@/lib/catalog';
import { gsap, isFinePointer, prefersReducedMotion } from '@/lib/gsap';
import { SITE } from '@/lib/site';

const price = (slug: string) => getProduct(slug)?.price ?? 0;

const FRAMES = [
  { src: '/products/bell-heavyweight-hoodie/0-a.svg', alt: 'Bell Heavyweight Hoodie in chalk green', href: '/product/bell-heavyweight-hoodie', price: price('bell-heavyweight-hoodie'), label: 'Bell Hoodie', cls: 'col-span-5 self-end md:col-span-3', h: 'h-[24svh] md:h-[30svh]', depth: 0.5 },
  { src: '/products/articulated-crystal-dragon/0-a.svg', alt: 'Articulated Crystal Dragon in galaxy purple', href: '/product/articulated-crystal-dragon', price: price('articulated-crystal-dragon'), label: 'Crystal Dragon', cls: 'col-span-7 md:col-span-5', h: 'h-[30svh] md:h-[40svh]', depth: 1 },
  { src: '/products/samba-gold-retro-shirt/0-a.svg', alt: "Samba Gold '94 Retro Shirt", href: '/product/samba-gold-retro-shirt', price: price('samba-gold-retro-shirt'), label: "Samba Gold '94", cls: 'hidden self-start md:col-span-3 md:col-start-10 md:block', h: 'md:h-[26svh]', depth: 0.75 },
];

/**
 * The brand line is revealed by a pure-CSS animation (see .hero-line in globals.css) so the full
 * "AFTER SCHOOL" wordmark is guaranteed to reach its final, fully visible state even if scripts
 * are slow, blocked or reduced motion is on. GSAP only adds parallax to the image frames.
 */
export function HomeHero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const frames = gsap.utils.toArray<HTMLElement>('[data-frame]');
      frames.forEach((f) => {
        const depth = Number(f.dataset.depth ?? 1);
        gsap.to(f, { yPercent: -14 * depth, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } });
      });
      if (!isFinePointer()) return;
      const movers = frames.map((f) => {
        const inner = f.querySelector('[data-frame-inner]');
        return { x: gsap.quickTo(inner, 'x', { duration: 1.4, ease: 'power3' }), y: gsap.quickTo(inner, 'y', { duration: 1.4, ease: 'power3' }), d: Number(f.dataset.depth ?? 1) };
      });
      const move = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        movers.forEach((m) => {
          m.x(nx * 18 * m.d);
          m.y(ny * 14 * m.d);
        });
      };
      el.addEventListener('pointermove', move);
      return () => el.removeEventListener('pointermove', move);
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="hero-shell relative isolate flex min-h-[100svh] flex-col overflow-x-clip pt-[calc(var(--header-h)+env(safe-area-inset-top))]" aria-labelledby="hero-title">
      <div aria-hidden className="hero-glow pointer-events-none absolute inset-0 -z-10" />

      <div className="wrap flex flex-1 flex-col">
        <div className="hero-fade flex items-center justify-between gap-4 border-b border-line/10 py-4 text-[13px] text-graphite [--d:900ms]">
          <span>Clothing, football and 3D printed objects</span>
          <span className="hidden sm:inline">
            Founder <span aria-hidden>—</span> <span className="text-ink">{SITE.founder}</span>
          </span>
        </div>

        <div className="grid flex-1 grid-cols-12 items-center gap-3 py-8 sm:gap-5 md:py-10">
          {FRAMES.map((f, i) => (
            <div key={f.src} data-frame data-depth={f.depth} className={f.cls}>
              <TLink href={f.href} data-frame-inner data-cursor="View" className="hero-frame group block" style={{ '--d': `${350 + i * 140}ms` } as CSSProperties}>
                <span className={`relative block min-h-[120px] overflow-hidden rounded-[3px] bg-sheet ${f.h}`}>
                  <Img src={f.src} alt={f.alt} fill priority sizes="(min-width: 768px) 40vw, 60vw" className="object-cover object-center transition-transform duration-[1600ms] ease-expo group-hover:scale-[1.04]" />
                </span>
                <span className="mt-2 flex justify-between text-[12px] text-graphite">
                  <span>{f.label}</span>
                  <Price price={f.price} />
                </span>
              </TLink>
            </div>
          ))}
        </div>

        <h1 id="hero-title" className="hero-brand display select-none" aria-label="After School">
          <span className="hero-line [--d:80ms]" aria-hidden>
            After
          </span>
          <span className="hero-space" aria-hidden>
            {' '}
          </span>
          <span className="hero-line [--d:200ms]" aria-hidden>
            School
          </span>
        </h1>

        <div className="hero-fade grid gap-6 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-6 [--d:700ms] md:grid-cols-12 md:items-end md:pb-10">
          <p className="max-w-[36ch] text-[17px] leading-relaxed text-ink/85 md:col-span-5 md:text-lg">
            Heavyweight clothing, unofficial football shirts and articulated 3D prints, made for the hours after the bell.
          </p>
          <div className="flex flex-wrap items-center gap-3 md:col-span-7 md:justify-end">
            <Magnetic>
              <TLink href="/shop" className="btn-primary" data-cursor="Shop">
                Shop the collection
              </TLink>
            </Magnetic>
            <TLink href="/about" className="btn-ghost">
              Our story
              <ArrowIcon width={16} height={16} />
            </TLink>
          </div>
        </div>
      </div>
    </section>
  );
}
