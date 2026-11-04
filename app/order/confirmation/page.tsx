import type { Metadata } from 'next';
import { ConfirmationView } from '@/components/checkout/ConfirmationView';

export const metadata: Metadata = {
  title: 'Order confirmed',
  robots: { index: false, follow: false },
};

export default function ConfirmationPage({ searchParams }: { searchParams: { session_id?: string; order?: string } }) {
  return (
    <div className="page-glow pb-32 pt-36 md:pt-44">
      <div className="wrap">
        <ConfirmationView sessionId={searchParams.session_id} demoOrder={searchParams.order} />
      </div>
    </div>
  );
}
