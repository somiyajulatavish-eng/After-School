'use client';

import { createElement, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

export type RevealTag = 'div' | 'li' | 'aside' | 'figure' | 'section' | 'p';

interface Props {
  children?: ReactNode;
  as?: RevealTag;
  className?: string;
  delay?: number;
  y?: number;
}

export function Reveal({ children, as = 'div', className, delay = 0, y = 32 }: Props) {
  const node = useRef<HTMLElement | null>(null);
  const setNode = useCallback((el: HTMLElement | null) => {
    node.current = el;
  }, []);

  useEffect(() => {
    const el = node.current;
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

  return createElement(as, { ref: setNode, className, 'data-reveal': '' }, children);
}
