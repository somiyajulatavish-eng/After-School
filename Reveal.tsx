'use client';

import { createElement, useEffect, useRef, type ElementType, type ReactNode } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

interface Props {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  y?: number;
}

export function Reveal({ children, as = 'div', className, delay = 0, y = 32 }: Props) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        { opacity: 1, y: 0, duration: 1.1, delay, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } },
      );
    });
    return () => ctx.revert();
  }, [delay, y]);
  return createElement(as, { ref, className, 'data-reveal': '' }, children);
}
