import { TLink } from '@/components/TLink';
import { ClipReveal } from '@/components/motion/ClipReveal';
import { Parallax } from '@/components/motion/Parallax';
import { Reveal } from '@/components/motion/Reveal';
import { ArrowIcon } from '@/components/ui/Icons';
import { Img } from '@/components/ui/Img';
import type { Category } from '@/lib/types';

export interface CollectionItem extends Category {
  count: number;
  hero: { src: string; alt: string };
  detail: { src: string; alt: string };
}

/** Three departments as alternating editorial spreads rather than a card grid. */
export function Collections({ items }: { items: CollectionItem[] }) {
  return (
    <section className="relative pb-24 md:pb-40" aria-labelledby="collections-title">
      <div className="wrap">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6 border-t border-line/10 pt-6 md:mb-24">
          <h2 id="collections-title" className="text-sm text-graphite">
            The collections
          </h2>
          <TLink href="/shop" className="link-underline text-sm font-semibold">
            Shop everything
          </TLink>
        </div>

        <div className="flex flex-col gap-28 md:gap-44">
          {items.map((c, i) => {
            const flip = i % 2 === 1;
            return (
              <article key={c.slug} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-6">
                <div className={`relative lg:col-span-7 ${flip ? 'lg:order-2 lg:col-start-6' : ''}`}>
                  <TLink href={`/shop/${c.slug}`} data-cursor="Explore" className="group block" aria-label={`Explore ${c.name}`}>
                    <ClipReveal className="relative aspect-[5/4] rounded-[3px] bg-sheet lg:aspect-[4/3]">
                      <Img src={c.hero.src} alt={c.hero.alt} fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover transition-transform duration-[1800ms] ease-expo group-hover:scale-[1.03]" />
                    </ClipReveal>
                  </TLink>
                  <Parallax speed={-0.35} className={`absolute -bottom-12 hidden w-[34%] lg:block ${flip ? '-left-10' : '-right-10'}`}>
                    <ClipReveal direction={flip ? 'right' : 'left'} delay={0.25} className="relative aspect-[4/5] rounded-[3px] bg-sheet shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)] ring-[10px] ring-paper">
                      <Img src={c.detail.src} alt={c.detail.alt} fill sizes="20vw" className="object-cover" />
                    </ClipReveal>
                  </Parallax>
                </div>

                <Reveal className={`min-w-0 lg:col-span-5 ${flip ? 'lg:order-1 lg:col-start-1 lg:pr-8' : 'lg:col-start-8 lg:pl-8'}`}>
                  <p className="text-sm tabular-nums text-graphite">
                    {c.count} pieces
                  </p>
                  <h3 className="display mt-4 text-[clamp(34px,8vw,64px)] lg:text-[clamp(34px,4vw,76px)]">{c.short}</h3>
                  <p className="mt-6 max-w-[38ch] text-lg leading-relaxed text-graphite">{c.blurb}</p>
                  <TLink href={`/shop/${c.slug}`} className="group mt-8 inline-flex items-center gap-3 text-[15px] font-semibold">
                    <span className="link-underline">Explore {c.short}</span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line/25 transition-[background-color,color,border-color] duration-500 ease-expo group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
                      <ArrowIcon width={16} height={16} />
                    </span>
                  </TLink>
                </Reveal>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
