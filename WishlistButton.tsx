'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/components/providers/StoreProvider';
import { HeartIcon } from './Icons';

export function WishlistButton({ slug, name, className = '' }: { slug: string; name: string; className?: string }) {
  const { isWished, toggleWishlist, hydrated } = useStore();
  const on = hydrated && isWished(slug);
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(slug);
      }}
      aria-pressed={on}
      aria-label={on ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-300 ${on ? 'bg-margin text-white' : 'glass text-ink hover:bg-white'} ${className}`}
    >
      <motion.span key={on ? 'on' : 'off'} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }}>
        <HeartIcon filled={on} width={18} height={18} />
      </motion.span>
    </motion.button>
  );
}
