import type { Metadata } from 'next';
import { TLink } from '@/components/TLink';
import { PageHeader } from '@/components/layout/PageHeader';
import { ClipReveal } from '@/components/motion/ClipReveal';
import { Magnetic } from '@/components/motion/Magnetic';
import { Parallax } from '@/components/motion/Parallax';
import { Reveal } from '@/components/motion/Reveal';
import { SplitText } from '@/components/motion/SplitText';
import { SITE } from '@/lib/site';
import { Img } from '@/components/ui/Img';

export const metadata: Metadata = {
  title: 'About',
  description: 'After School started as three friends selling hoodies and 3D-printed dragons from a market table. Here’s what we make and why.',
  alternates: { canonical: '/about' },
};

const TIMELINE = [
  { year: '2022', text: 'A single table at a Brooklyn weekend market: twelve hoodies, one 3D printer and a box of dragons.' },
  { year: '2023', text: 'The first football shirt, a gold retro design, sells out in a weekend. The matchday range begins.' },
  { year: '2024', text: 'We move into a studio with six printers and start printing every 3D item to order.' },
  { year: '2026', text: 'Fifty-plus products, shipping to fifteen countries, still packed by hand after school hours.' },
];

const VALUES = [
  { title: 'Fewer, better things', text: 'Heavyweight fabrics and tested prints, designed to last more than one season.' },
  { title: 'Printed to order', text: 'No warehouses full of plastic. Your piece is printed after you order it.' },
  { title: 'Honest about football', text: 'Our football range is fan-made and unofficial, and we say so on every page.' },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader title="About us" intro="We make things for the hours that belong to you: the walk home, the kickabout, the desk where the homework never quite gets done." />

      <section className="wrap grid gap-10 pb-24 md:grid-cols-12">
        <div className="md:col-span-7">
          <ClipReveal className="aspect-[4/3] rounded-xl bg-sheet">
            <Img src="/products/bell-heavyweight-hoodie/1-b.svg" alt="Detail of a blue heavyweight hoodie" width={600} height={750} className="h-full w-full object-cover" />
          </ClipReveal>
        </div>
        <div className="md:col-span-4 md:col-start-9 md:pt-24">
          <Parallax speed={-0.4}>
            <ClipReveal direction="left" className="aspect-[4/5] rounded-xl bg-sheet">
              <Img src="/products/mini-articulated-dragon/0-a.svg" alt="Pink mini articulated dragon" width={600} height={750} className="h-full w-full object-cover" />
            </ClipReveal>
          </Parallax>
          <Reveal className="mt-10 space-y-4 text-lg leading-relaxed text-graphite">
            <p>After School is three friends, six printers and a sewing room in Brooklyn.</p>
            <p>We started making the things we wanted ourselves: a hoodie heavy enough to feel like something, a football shirt without a sponsor on it, a dragon that actually moves.</p>
            <p className="pt-4">
              <span className="eyebrow-serif block text-4xl text-ink">{SITE.founder}</span>
              <span className="mt-2 block text-sm">
                Founder <span aria-hidden>—</span> {SITE.name}
              </span>
            </p>
          </Reveal>
        </div>
      </section>

      <section className="on-dark bg-chalk py-24 text-chalkline md:py-36" aria-labelledby="values-title">
        <div className="wrap">
          <SplitText as="h2" id="values-title" text="What we care about" className="display mb-16 text-[clamp(36px,7vw,112px)]" />
          <ul className="grid gap-10 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal as="li" key={v.title} delay={i * 0.1} className="border-t border-chalkline/20 pt-6">
                <h3 className="text-2xl font-semibold">{v.title}</h3>
                <p className="mt-3 text-lg leading-relaxed text-chalkline/75">{v.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-24 md:py-36" aria-labelledby="story-title">
        <div className="wrap grid gap-12 md:grid-cols-12">
          <SplitText as="h2" id="story-title" text={'How we\ngot here'} className="display text-[clamp(36px,7vw,112px)] md:col-span-5" />
          <ol className="md:col-span-7">
            {TIMELINE.map((t, i) => (
              <Reveal as="li" key={t.year} delay={i * 0.08} className="grid grid-cols-[5rem_1fr] gap-6 border-b border-line/15 py-8 first:border-t">
                <span className="display-narrow text-3xl text-margin">{t.year}</span>
                <p className="text-lg leading-relaxed">{t.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-sheet py-24" aria-label="Get in touch">
        <div className="wrap flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SplitText as="p" text={'Got an idea for\nwhat we make next?'} className="display text-[clamp(36px,5vw,80px)]" />
          <Magnetic>
            <TLink href="/contact" className="btn-primary" data-cursor="Say hi">
              Tell us
            </TLink>
          </Magnetic>
        </div>
      </section>
    </>
  );
}
