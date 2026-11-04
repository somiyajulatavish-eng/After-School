import { Reveal } from '@/components/motion/Reveal';
import { SplitText } from '@/components/motion/SplitText';
import { SITE } from '@/lib/site';

export function Manifesto() {
  return (
    <section className="relative py-28 md:py-44" aria-labelledby="manifesto-title">
      <div className="wrap grid gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-3">
          <p className="eyebrow-serif text-2xl text-graphite">Since 2022</p>
        </Reveal>
        <div className="md:col-span-9">
          <SplitText
            as="h2"
            id="manifesto-title"
            text={'We make things for the hours that belong to you: the walk home, the kickabout, the desk where homework never quite gets done.'}
            className="text-[clamp(28px,4.2vw,64px)] font-semibold leading-[1.08] tracking-[-0.02em] [text-wrap:balance]"
          />
          <Reveal delay={0.15} className="mt-14 grid gap-10 sm:grid-cols-2 md:mt-20 lg:max-w-4xl">
            <p className="text-lg leading-relaxed text-graphite">
              Heavyweight fabrics cut to last more than a season. Football shirts that celebrate colours, not crests. 3D prints made to order in our studio, every joint tested by hand.
            </p>
            <div className="flex flex-col justify-end">
              <p className="eyebrow-serif text-[clamp(36px,4vw,56px)] leading-none text-ink">{SITE.founder}</p>
              <p className="mt-3 text-sm text-graphite">
                Founder <span aria-hidden>—</span> {SITE.name}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
