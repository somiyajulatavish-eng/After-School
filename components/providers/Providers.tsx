'use client';

import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';
import type { ExchangeRates } from '@/lib/currency';
import { SmoothScroll } from './SmoothScroll';
import { StoreProvider } from './StoreProvider';
import { TransitionProvider } from './TransitionProvider';

export function Providers({ children, rates }: { children: ReactNode; rates: ExchangeRates }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <StoreProvider initialRates={rates}>
          <TransitionProvider>{children}</TransitionProvider>
        </StoreProvider>
      </SmoothScroll>
    </MotionConfig>
  );
}
