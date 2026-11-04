import type { ReactNode } from 'react';
import { SplitText } from '@/components/motion/SplitText';
import { Reveal } from '@/components/motion/Reveal';

export function PageHeader({ title, intro, children, crumbs }: { title: string; intro?: string; children?: ReactNode; crumbs?: ReactNode }) {
  return (
    <header className="ruled relative overflow-hidden pb-14 pt-36 md:pb-20 md:pt-44">
      <span aria-hidden className="absolute bottom-0 left-[6%] top-0 w-px bg-margin/50 md:left-[4%]" />
      <div className="wrap relative">
        {crumbs}
        <SplitText as="h1" text={title} immediate mode="chars" delay={0.55} className="display text-[clamp(52px,10vw,168px)]" />
        {(intro || children) && (
          <Reveal delay={0.4} className="mt-8 grid gap-6 md:grid-cols-12">
            {intro && <p className="max-w-[52ch] text-lg leading-relaxed text-graphite md:col-span-6">{intro}</p>}
            {children && <div className="md:col-span-6 md:flex md:justify-end">{children}</div>}
          </Reveal>
        )}
      </div>
    </header>
  );
}
