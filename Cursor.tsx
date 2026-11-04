'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { gsap, isFinePointer, prefersReducedMotion } from '@/lib/gsap';

/** Desktop-only cursor: a dot plus a trailing ring that grows and shows a label over [data-cursor]. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState('');
  const [mode, setMode] = useState<'idle' | 'link' | 'label'>('idle');
  const [enabled, setEnabled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setEnabled(isFinePointer() && !prefersReducedMotion());
  }, []);

  useEffect(() => {
    setMode('idle');
    setLabel('');
  }, [pathname]);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    const d = dot.current;
    const r = ring.current;
    gsap.set([d, r], { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    const dx = gsap.quickTo(d, 'x', { duration: 0.1, ease: 'power3' });
    const dy = gsap.quickTo(d, 'y', { duration: 0.1, ease: 'power3' });
    const rx = gsap.quickTo(r, 'x', { duration: 0.5, ease: 'power3' });
    const ry = gsap.quickTo(r, 'y', { duration: 0.5, ease: 'power3' });
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const labelled = t?.closest<HTMLElement>('[data-cursor]');
      if (labelled) {
        setLabel(labelled.dataset.cursor ?? '');
        setMode('label');
        return;
      }
      if (t?.closest('a, button, [role="button"], input, select, textarea, label')) setMode('link');
      else setMode('idle');
    };
    const hide = () => gsap.to([d, r], { opacity: 0, duration: 0.3 });
    const show = () => gsap.to([d, r], { opacity: 1, duration: 0.3 });
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over);
    document.documentElement.addEventListener('pointerleave', hide);
    document.documentElement.addEventListener('pointerenter', show);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', hide);
      document.documentElement.removeEventListener('pointerenter', show);
    };
  }, [enabled]);

  if (!enabled) return null;

  const ringSize = mode === 'label' ? 'h-24 w-24 bg-marker border-marker' : mode === 'link' ? 'h-14 w-14 border-pen bg-pen/10' : 'h-9 w-9 border-ink/40';

  return (
    <>
      <div
        ref={ring}
        aria-hidden="true"
        className={`cursor-ui pointer-events-none fixed left-0 top-0 z-[200] flex items-center justify-center rounded-full border transition-[width,height,background-color,border-color] duration-500 ease-expo ${ringSize}`}
      >
        <span className={`text-xs font-semibold text-ink transition-opacity duration-300 ${mode === 'label' ? 'opacity-100' : 'opacity-0'}`}>
          {label}
        </span>
      </div>
      <div ref={dot} aria-hidden="true" className="cursor-ui pointer-events-none fixed left-0 top-0 z-[201]">
        <span className={`block h-2 w-2 rounded-full bg-margin transition-opacity duration-300 ${mode === 'label' ? 'opacity-0' : 'opacity-100'}`} />
      </div>
    </>
  );
}
