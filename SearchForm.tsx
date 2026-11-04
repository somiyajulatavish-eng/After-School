'use client';

import { useState, type FormEvent } from 'react';
import { usePageTransition } from '@/components/providers/TransitionProvider';
import { SearchIcon } from '@/components/ui/Icons';

export function SearchForm({ initial }: { initial: string }) {
  const [q, setQ] = useState(initial);
  const { navigate } = usePageTransition();
  const submit = (e: FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };
  return (
    <form role="search" action="/search" onSubmit={submit} className="flex w-full max-w-xl items-center gap-2 rounded-full border border-ink/20 bg-white/60 p-1.5 focus-within:border-pen">
      <label htmlFor="search-page-q" className="sr-only">
        Search products
      </label>
      <SearchIcon className="ml-3 shrink-0" />
      <input id="search-page-q" name="q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the shop" className="h-11 min-w-0 flex-1 bg-transparent px-2 focus:outline-none" />
      <button type="submit" className="btn-primary h-11 px-6">
        Search
      </button>
    </form>
  );
}
