import type { Metadata } from 'next';
import { CheckoutView } from '@/components/checkout/CheckoutView';
import { PageHeader } from '@/components/layout/PageHeader';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Secure checkout.',
  robots: { index: false, follow: false },
};

export default function CheckoutPage({ searchParams }: { searchParams: { cancelled?: string } }) {
  return (
    <>
      <PageHeader title="Checkout" intro={process.env.STRIPE_SECRET_KEY ? undefined : 'Demo mode: payments are not configured on this deployment, so no card will be charged.'} />
      <div className="wrap pb-32">
        <CheckoutView cancelled={searchParams.cancelled === '1'} />
      </div>
    </>
  );
}
