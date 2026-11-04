'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

interface Props {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'left' | 'right';
  delay?: number;
}

const FROM = {
  up: 'inset(100% 0% 0% 0%)',
  left: 'inset(0% 100% 0% 0%)',
  right: 'inset(0% 0% 0% 100%)',
};

/** Clip-path wipe with a counter-zoom on the inner media. */
export function ClipReveal({ children, className = '', direction = 'up', delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const inner = el.firstElementChild;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
      tl.fromTo(el, { clipPath: FROM[direction] }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' });
      if (inner) tl.fromTo(inner, { scale: 1.3 }, { scale: 1, duration: 1.8, ease: 'expo.out' }, 0.15);
    });
    return () => ctx.revert();
  }, [delay, direction]);
  return (
    <div ref={ref} data-clip="" className={`overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
