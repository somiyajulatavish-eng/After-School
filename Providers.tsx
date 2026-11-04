'use client';

import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';
import { SmoothScroll } from './SmoothScroll';
import { StoreProvider } from './StoreProvider';
import { TransitionProvider } from './TransitionProvider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <StoreProvider>
          <TransitionProvider>{children}</TransitionProvider>
        </StoreProvider>
      </SmoothScroll>
    </MotionConfig>
  );
}
