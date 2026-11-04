'use client';

import { createElement, useEffect, useRef, type ElementType } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

interface Props {
  text: string;
  as?: ElementType;
  className?: string;
  mode?: 'words' | 'chars';
  delay?: number;
  stagger?: number;
  /** Animate on mount instead of when scrolled into view. */
  immediate?: boolean;
  id?: string;
}

/**
 * Accessible split-text reveal. The visible letters are aria-hidden; screen readers get the
 * plain string. Use "\n" in text to force a line break.
 */
export function SplitText({ text, as = 'h2', className, mode = 'words', delay = 0, stagger, immediate = false, id }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const inners = el.querySelectorAll<HTMLElement>('.split-inner');
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        inners,
        { yPercent: 108, rotate: mode === 'chars' ? 4 : 0 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 1.25,
          ease: 'expo.out',
          delay,
          stagger: stagger ?? (mode === 'chars' ? 0.028 : 0.07),
          scrollTrigger: immediate ? undefined : { trigger: el, start: 'top 90%', once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [delay, immediate, mode, stagger, text]);

  const lines = text.split('\n');
  const visual = lines.map((line, li) => (
    <span key={li} className="block" aria-hidden="true">
      {line.split(' ').map((word, wi, arr) => (
        <span key={wi}>
          <span className="split-word">
            {mode === 'chars' ? (
              Array.from(word).map((ch, ci) => (
                <span key={ci} className="split-inner">
                  {ch}
                </span>
              ))
            ) : (
              <span className="split-inner">{word}</span>
            )}
          </span>
          {wi < arr.length - 1 ? ' ' : null}
        </span>
      ))}
    </span>
  ));

  return createElement(as, { ref, className, id }, <span className="sr-only">{text.replace(/\n/g, ' ')}</span>, visual);
}
