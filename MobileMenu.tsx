'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { TLink } from '@/components/TLink';
import { useScrollLock } from '@/components/providers/SmoothScroll';
import { NAV, SECONDARY_NAV } from '@/lib/nav';

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  useScrollLock(open);
  const first = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => first.current?.focus(), 300);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="on-dark fixed inset-0 z-[80] flex flex-col justify-end bg-chalk px-5 pb-[calc(2.5rem+env(safe-area-inset-bottom))] pt-28 text-chalkline lg:hidden"
          initial={{ clipPath: 'circle(0% at 100% 0%)' }}
          animate={{ clipPath: 'circle(150% at 100% 0%)' }}
          exit={{ clipPath: 'circle(0% at 100% 0%)' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <nav aria-label="Mobile">
            <ul className="flex flex-col gap-1">
              {NAV.map((item, i) => (
                <li key={item.href} className="overflow-hidden">
                  <motion.div initial={{ y: '110%' }} animate={{ y: 0 }} exit={{ y: '110%' }} transition={{ duration: 0.7, delay: 0.15 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}>
                    <TLink ref={i === 0 ? first : undefined} href={item.href} className="display block py-1 text-[clamp(44px,13vw,88px)]" onClick={onClose}>
                      {item.label}
                    </TLink>
                  </motion.div>
                </li>
              ))}
            </ul>
            <motion.ul
              className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-lg text-chalkline/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
              exit={{ opacity: 0 }}
            >
              {SECONDARY_NAV.map((item) => (
                <li key={item.href}>
                  <TLink href={item.href} className="link-underline" onClick={onClose}>
                    {item.label}
                  </TLink>
                </li>
              ))}
            </motion.ul>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
