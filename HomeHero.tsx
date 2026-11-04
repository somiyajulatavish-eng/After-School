'use client';

import { useEffect, useRef, useState } from 'react';
import { TLink } from '@/components/TLink';
import { Magnetic } from '@/components/motion/Magnetic';
import { gsap, isFinePointer, prefersReducedMotion } from '@/lib/gsap';
import { ArrowIcon } from '@/components/ui/Icons';

const FLOATERS = [
  { src: '/products/bell-heavyweight-hoodie/0-a.svg', alt: 'Bell Heavyweight Hoodie in chalk green', href: '/product/bell-heavyweight-hoodie', cls: 'left-[4%] top-[18%] w-[30vw] max-w-[300px] md:left-[6%] md:top-[14%] md:w-[19vw]', depth: 0.6, rot: -6 },
  { src: '/products/samba-gold-retro-shirt/0-a.svg', alt: "Samba Gold '94 Retro Shirt", href: '/product/samba-gold-retro-shirt', cls: 'right-[4%] top-[12%] w-[28vw] max-w-[280px] md:right-[8%] md:top-[10%] md:w-[16vw]', depth: 1, rot: 5 },
  { src: '/products/articulated-crystal-dragon/0-a.svg', alt: 'Articulated Crystal Dragon in galaxy purple', href: '/product/articulated-crystal-dragon', cls: 'bottom-[16%] right-[10%] hidden w-[22vw] max-w-[320px] md:block md:w-[20vw]', depth: 1.4, rot: -3 },
];

function greeting(d: Date): string {
  const h = d.getHours() + d.getMinutes() / 60;
  const day = d.getDay();
  if (day === 0 || day === 6) return 'It’s the weekend. Every hour is after school.';
  if (h < 8) return 'Too early for school. Not too early to shop.';
  if (h < 15) return 'School’s still in. We won’t tell.';
  if (h < 18) return 'The bell just went. You’re right on time.';
  return 'School’s long out. Settle in.';
}

export function HomeHero() {
  const root = useRef<HTMLElement>(null);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = prefersReducedMotion();
    const ctx = gsap.context(() => {
      const chars = el.querySelectorAll('.split-inner');
      const floaters = gsap.utils.toArray<HTMLElement>('[data-floater]');
      if (reduce) return;
      const tl = gsap.timeline({ delay: 0.2 });
      tl.fromTo(chars, { yPercent: 108, rotate: 6 }, { yPercent: 0, rotate: 0, duration: 1.5, stagger: 0.04, ease: 'expo.out' })
        .fromTo(floaters, { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.15 }, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.4, stagger: 0.12, ease: 'expo.inOut' }, 0.3)
        .fromTo('[data-hero-fade]', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, stagger: 0.08 }, 0.8);

      floaters.forEach((f) => {
        const depth = Number(f.dataset.depth ?? 1);
        gsap.to(f, { yPercent: -40 * depth, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } });
      });
      gsap.to('[data-hero-title]', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } });

      if (isFinePointer()) {
        const movers = floaters.map((f) => {
          const inner = f.querySelector('[data-float-inner]');
          const depth = Number(f.dataset.depth ?? 1);
          return { x: gsap.quickTo(inner, 'x', { duration: 1.2, ease: 'power3' }), y: gsap.quickTo(inner, 'y', { duration: 1.2, ease: 'power3' }), depth };
        });
        const move = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          movers.forEach((m) => {
            m.x(nx * 40 * m.depth);
            m.y(ny * 30 * m.depth);
          });
        };
        el.addEventListener('pointermove', move);
        return () => el.removeEventListener('pointermove', move);
      }
    }, el);
    return () => ctx.revert();
  }, []);

  const words = ['After', 'School'];

  return (
    <section ref={root} className="ruled relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-10 pt-28 md:pb-14" aria-labelledby="hero-title">
      <span aria-hidden className="absolute bottom-0 left-[6%] top-0 w-px bg-margin/50 md:left-[4%]" />

      {FLOATERS.map((f) => (
        <div key={f.src} data-floater data-depth={f.depth} className={`absolute z-0 ${f.cls}`} style={{ transform: `rotate(${f.rot}deg)` }}>
          <TLink href={f.href} data-float-inner data-cursor="Shop" className="block overflow-hidden rounded-lg shadow-[0_30px_60px_-20px_rgba(19,28,94,0.35)]">
            <img src={f.src} alt={f.alt} width={600} height={750} className="block h-auto w-full" />
          </TLink>
        </div>
      ))}

      <div className="wrap relative z-10">
        <h1 id="hero-title" data-hero-title className="display pointer-events-none text-[clamp(72px,18.5vw,340px)]">
          <span className="sr-only">After School</span>
          {words.map((w, i) => (
            <span key={w} aria-hidden className={`block ${i === 1 ? 'text-right' : ''}`}>
              <span className="split-word">
                {Array.from(w).map((ch, ci) => (
                  <span key={ci} className="split-inner">
                    {ch}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-8 grid items-end gap-8 md:mt-10 md:grid-cols-12">
          <p data-hero-fade className="max-w-[34ch] text-lg leading-relaxed md:col-span-5 md:text-xl">
            Heavyweight clothes, unofficial football shirts and 3D-printed toys for the hours after the bell.
          </p>
          <div data-hero-fade className="flex flex-wrap items-center gap-3 md:col-span-4">
            <Magnetic>
              <TLink href="/shop" className="btn-primary" data-cursor="Go">
                Shop everything
              </TLink>
            </Magnetic>
            <TLink href="/shop?sort=newest" className="btn-ghost">
              New this week
            </TLink>
          </div>
          <p data-hero-fade className="text-sm text-graphite md:col-span-3 md:text-right" aria-live="off">
            {now ? (
              <>
                <span className="font-semibold tabular-nums text-ink">{now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
                <br />
                {greeting(now)}
              </>
            ) : (
              <span className="opacity-0">.</span>
            )}
          </p>
        </div>
      </div>
      <span aria-hidden className="pointer-events-none absolute bottom-6 right-6 hidden items-center gap-2 text-xs text-graphite md:flex">
        Scroll <ArrowIcon width={14} height={14} className="rotate-90" />
      </span>
    </section>
  );
}
