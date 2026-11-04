import type { Metadata } from 'next';
import { CartView } from '@/components/cart/CartView';
import { PageHeader } from '@/components/layout/PageHeader';

export const metadata: Metadata = {
  title: 'Your bag',
  description: 'Review your bag, apply a discount code and estimate shipping.',
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <>
      <PageHeader title="Your bag" />
      <div className="wrap pb-32">
        <CartView />
      </div>
    </>
  );
}
