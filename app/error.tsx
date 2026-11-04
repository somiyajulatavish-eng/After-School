'use client';

import { useEffect } from 'react';
import { TLink } from '@/components/TLink';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="page-glow flex min-h-[80svh] flex-col justify-center pb-16 pt-36">
      <div className="wrap">
        <p className="mb-6 text-sm font-semibold text-margin">Something went wrong</p>
        <h1 className="display text-[clamp(36px,9vw,144px)]">Bell rang early.</h1>
        <p className="mt-8 max-w-[44ch] text-lg text-graphite">This page hit an error while loading. Try again, or head back to the shop.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className="btn-primary">
            Try again
          </button>
          <TLink href="/shop" className="btn-ghost">
            Go to the shop
          </TLink>
        </div>
      </div>
    </section>
  );
}
