'use client';

import { usePathname, useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';
import { useLenis } from './SmoothScroll';

interface TransitionCtx {
  navigate: (href: string) => void;
}

const Ctx = createContext<TransitionCtx>({ navigate: () => undefined });
export const usePageTransition = () => useContext(Ctx);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const curtain = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const covering = useRef(false);
  const failsafe = useRef<number>();

  const reveal = useCallback(() => {
    const el = curtain.current;
    if (!el) return;
    window.clearTimeout(failsafe.current);
    gsap
      .timeline({
        onComplete: () => {
          covering.current = false;
          gsap.set(el, { visibility: 'hidden' });
        },
      })
      .to(label.current, { yPercent: -120, opacity: 0, duration: 0.4, ease: 'expo.in' })
      .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.85, ease: 'expo.inOut' }, '-=0.1');
  }, []);

  const navigate = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) {
        window.location.href = href;
        return;
      }
      const target = url.pathname + url.search + url.hash;
      if (url.pathname === window.location.pathname) {
        if (url.search !== window.location.search) router.push(target);
        else if (url.hash) {
          const el = document.querySelector(url.hash);
          if (el instanceof HTMLElement) lenis ? lenis.scrollTo(el, { offset: -80 }) : el.scrollIntoView();
        } else lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (prefersReducedMotion() || !curtain.current) {
        router.push(target);
        return;
      }
      if (covering.current) return;
      covering.current = true;
      const el = curtain.current;
      gsap
        .timeline()
        .set(el, { visibility: 'visible', clipPath: 'inset(100% 0% 0% 0%)' })
        .set(label.current, { yPercent: 120, opacity: 0 })
        .to(el, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'expo.inOut' })
        .to(label.current, { yPercent: 0, opacity: 1, duration: 0.5 }, '-=0.3')
        .call(() => {
          router.push(target);
          failsafe.current = window.setTimeout(reveal, 4000);
        });
    },
    [router, lenis, reveal],
  );

  useEffect(() => {
    if (!covering.current) {
      requestAnimationFrame(() => ScrollTrigger.refresh());
      return;
    }
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      reveal();
    });
    return () => cancelAnimationFrame(id);
  }, [pathname, lenis, reveal]);

  useEffect(() => () => window.clearTimeout(failsafe.current), []);

  return (
    <Ctx.Provider value={{ navigate }}>
      {children}
      <div
        ref={curtain}
        aria-hidden="true"
        className="on-dark pointer-events-none fixed inset-0 z-[120] flex items-center justify-center bg-chalk text-chalkline"
        style={{ visibility: 'hidden' }}
      >
        <span className="block overflow-hidden">
          <span ref={label} className="display block text-[clamp(48px,10vw,160px)]">
            After School
          </span>
        </span>
        <span className="absolute bottom-10 left-1/2 h-px w-40 -translate-x-1/2 bg-chalkline/30" />
      </div>
    </Ctx.Provider>
  );
}
