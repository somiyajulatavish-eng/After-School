import { TLink } from '@/components/TLink';
import { ClipReveal } from '@/components/motion/ClipReveal';
import { Reveal } from '@/components/motion/Reveal';
import { SplitText } from '@/components/motion/SplitText';
import { ArrowIcon } from '@/components/ui/Icons';
import { Img } from '@/components/ui/Img';
import type { Post } from '@/lib/blog';
import { formatDate } from '@/lib/format';

export function JournalTeaser({ posts }: { posts: Post[] }) {
  const [lead, ...rest] = posts;
  return (
    <section className="py-24 md:py-40" aria-labelledby="journal-title">
      <div className="wrap">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6 md:mb-20">
          <SplitText as="h2" id="journal-title" text="The journal" className="display text-[clamp(36px,7vw,120px)]" />
          <TLink href="/blog" className="link-underline pb-2 text-[15px] font-semibold">
            All stories
          </TLink>
        </div>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <TLink href={`/blog/${lead.slug}`} data-cursor="Read" className="group block lg:col-span-7">
            <ClipReveal className="relative aspect-[16/11] rounded-[3px] bg-sheet">
              <Img src={lead.cover} alt={lead.coverAlt} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover transition-transform duration-[1800ms] ease-expo group-hover:scale-[1.03]" />
            </ClipReveal>
            <p className="mt-6 text-sm text-graphite">
              {lead.topic}, <time dateTime={lead.date}>{formatDate(lead.date)}</time>
            </p>
            <h3 className="mt-3 max-w-[22ch] text-[clamp(26px,3vw,44px)] font-semibold leading-[1.08] tracking-[-0.02em]">
              <span className="link-underline">{lead.title}</span>
            </h3>
          </TLink>
          <ul className="flex flex-col lg:col-span-5">
            {rest.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 0.08} className="border-t border-line/10 last:border-b">
                <TLink href={`/blog/${p.slug}`} className="group flex items-start justify-between gap-6 py-7">
                  <span>
                    <span className="block text-sm text-graphite">
                      {p.topic}, <time dateTime={p.date}>{formatDate(p.date)}</time>
                    </span>
                    <span className="mt-2 block text-xl font-semibold leading-snug transition-colors duration-300 group-hover:text-marker md:text-2xl">{p.title}</span>
                    <span className="mt-2 block max-w-[46ch] text-[15px] text-graphite">{p.excerpt}</span>
                  </span>
                  <ArrowIcon width={20} height={20} className="mt-8 shrink-0 -rotate-45 transition-transform duration-500 ease-expo group-hover:rotate-0" />
                </TLink>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
