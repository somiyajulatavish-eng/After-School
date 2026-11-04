'use client';

import Link from 'next/link';
import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from 'react';
import { usePageTransition } from './providers/TransitionProvider';

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: string; prefetch?: boolean };

/** next/link with the curtain page transition. Modifier clicks and new tabs fall through to the browser. */
export const TLink = forwardRef<HTMLAnchorElement, Props>(function TLink({ href, onClick, prefetch, ...rest }, ref) {
  const { navigate } = usePageTransition();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0 || rest.target === '_blank') return;
    if (href.startsWith('mailto:') || href.startsWith('tel:')) return;
    e.preventDefault();
    navigate(href);
  };
  return <Link ref={ref} href={href} prefetch={prefetch} onClick={handle} {...rest} />;
});
