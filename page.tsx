import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { WishlistView } from '@/components/shop/WishlistView';

export const metadata: Metadata = {
  title: 'Wishlist',
  description: 'Products you’ve saved for later.',
  robots: { index: false, follow: true },
};

export default function WishlistPage() {
  return (
    <>
      <PageHeader title="Wishlist" />
      <div className="wrap pb-32">
        <WishlistView />
      </div>
    </>
  );
}
