'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TLink } from '@/components/TLink';
import { Magnetic } from '@/components/motion/Magnetic';
import { useLenis } from '@/components/providers/SmoothScroll';
import { useStore } from '@/components/providers/StoreProvider';
import { BagIcon, HeartIcon, SearchIcon } from '@/components/ui/Icons';
import { NAV } from '@/lib/nav';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { SearchOverlay } from './SearchOverlay';

export function Header() {
  const pathname = usePathname();
  const lenis = useLenis();
  const { totals, wishlist, hydrated, setCartOpen } = useStore();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    let last = 0;
    const onScroll = (y: number) => {
      setScrolled(y > 24);
      if (y <= 240) setHidden(false);
      else if (y > last + 2) setHidden(true);
      else if (y < last - 2) setHidden(false);
      last = y;
    };
    if (lenis) {
      const handler = ({ scroll }: { scroll: number }) => onScroll(scroll);
      lenis.on('scroll', handler);
      return () => lenis.off('scroll', handler);
    }
    const native = () => onScroll(window.scrollY);
    window.addEventListener('scroll', native, { passive: true });
    return () => window.removeEventListener('scroll', native);
  }, [lenis]);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setHidden(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const count = hydrated ? totals.itemCount : 0;
  const wishCount = hydrated ? wishlist.length : 0;
  const show = !hidden || menuOpen || searchOpen;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[90] pt-[env(safe-area-inset-top)] transition-[transform,background-color,box-shadow] duration-700 ease-expo ${
          show ? 'translate-y-0' : '-translate-y-full'
        } ${scrolled && !menuOpen ? 'glass shadow-[0_1px_0_rgba(19,28,94,0.08)]' : 'bg-transparent'}`}
      >
        <div className="wrap flex h-[72px] items-center justify-between gap-6">
          <TLink href="/" className="relative z-10 shrink-0" aria-label="After School home">
            <Logo />
          </TLink>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => {
                const active = item.href === '/shop' ? pathname === '/shop' : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <TLink
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={`relative block rounded-full px-4 py-2 text-[15px] font-medium transition-colors duration-300 hover:bg-ink/5 ${active ? 'text-ink' : 'text-ink/75'}`}
                    >
                      {item.label}
                      {active && <motion.span layoutId="nav-dot" className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-margin" />}
                    </TLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-11 items-center gap-2 rounded-full px-3 text-[15px] font-medium transition-colors hover:bg-ink/5"
              aria-label="Search products"
            >
              <SearchIcon />
              <span className="hidden xl:inline">Search</span>
            </button>
            <TLink href="/wishlist" className="relative hidden h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-ink/5 sm:flex" aria-label={`Wishlist, ${wishCount} items`}>
              <HeartIcon />
              {wishCount > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-margin" />}
            </TLink>
            <Magnetic strength={0.25}>
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative flex h-11 items-center gap-2 rounded-full bg-ink pl-4 pr-3 text-[15px] font-semibold text-paper transition-shadow hover:shadow-[0_8px_24px_-6px_rgba(19,28,94,0.6)]"
                aria-label={`Open bag, ${count} items`}
              >
                <BagIcon width={18} height={18} />
                <span className="relative inline-flex h-6 min-w-6 items-center justify-center overflow-hidden rounded-full bg-marker px-1.5 text-xs text-ink tabular-nums">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span key={count} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
                      {count}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </button>
            </Magnetic>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="ml-1 flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-ink/5 lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <span className="relative block h-3 w-5">
                <span className={`absolute left-0 h-0.5 w-5 bg-current transition-all duration-500 ease-expo ${menuOpen ? 'top-[5px] rotate-45' : 'top-0'}`} />
                <span className={`absolute left-0 h-0.5 w-5 bg-current transition-all duration-500 ease-expo ${menuOpen ? 'top-[5px] -rotate-45' : 'top-[10px]'}`} />
              </span>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
