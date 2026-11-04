'use client';

import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';
export const THEME_KEY = 'after-school:theme';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'dark' ? '#0A0A0B' : '#F2F1EC');
    try {
      window.localStorage.setItem(THEME_KEY, next);
    } catch {
      /* storage unavailable: preference lasts for this visit */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-ink/10 ${className}`}
    >
      <span className="relative block h-4 w-4 overflow-hidden rounded-full border-[1.5px] border-current" aria-hidden>
        <span className={`absolute inset-y-0 left-1/2 w-1/2 bg-current transition-transform duration-500 ease-expo ${theme === 'light' ? '-translate-x-full' : ''}`} />
      </span>
    </button>
  );
}
