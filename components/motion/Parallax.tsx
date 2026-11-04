'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

interface Props {
  children: ReactNode;
  speed?: number;
  className?: string;
}

/** speed: fraction of element height to travel across the viewport. Negative moves up faster. */
export function Parallax({ children, speed = -0.15, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -speed * 50 },
        {
          yPercent: speed * 50,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
    });
    return () => ctx.revert();
  }, [speed]);
  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
}
