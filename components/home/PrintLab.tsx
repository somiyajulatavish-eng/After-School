import { TLink } from '@/components/TLink';
import { ClipReveal } from '@/components/motion/ClipReveal';
import { Magnetic } from '@/components/motion/Magnetic';
import { Parallax } from '@/components/motion/Parallax';
import { Reveal } from '@/components/motion/Reveal';
import { SplitText } from '@/components/motion/SplitText';
import { Img } from '@/components/ui/Img';

export function PrintLab() {
  return (
    <section className="on-dark relative overflow-hidden bg-chalk py-24 text-chalkline md:py-40" aria-labelledby="lab-title">
      <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="relative lg:col-span-6">
          <ClipReveal className="aspect-[4/5] rounded-lg">
            <Img src="/products/articulated-crystal-dragon/0-b.svg" alt="Close-up of the articulated dragon's segmented body" width={600} height={750} className="h-full w-full object-cover" loading="lazy" />
          </ClipReveal>
          <Parallax speed={-0.5} className="absolute -bottom-10 -right-4 w-[42%] md:-right-10">
            <ClipReveal direction="left" delay={0.3} className="aspect-[4/5] rounded-lg shadow-2xl ring-8 ring-chalk">
              <Img src="/products/articulated-octopus/0-a.svg" alt="Pink articulated octopus" width={600} height={750} className="h-full w-full object-cover" loading="lazy" />
            </ClipReveal>
          </Parallax>
        </div>

        <div className="flex flex-col justify-center lg:col-span-5 lg:col-start-8">
          <SplitText as="h2" id="lab-title" text={'Printed to\norder. Every\njoint moves.'} className="display text-[clamp(36px,6vw,96px)]" />
          <Reveal className="mt-8 max-w-[46ch] space-y-4 text-lg leading-relaxed text-chalkline/80">
            <p>
              Our 3D items aren’t sitting in a warehouse. When you order a dragon, it goes into the queue at our print lab, comes off the bed in one piece, and gets every joint tested by hand before it ships.
            </p>
            <p>Most pieces ship within two to four days. The 60 cm dragon takes fourteen hours on the printer alone.</p>
          </Reveal>
          <Reveal delay={0.15} className="mt-10 flex flex-wrap gap-3">
            <Magnetic>
              <TLink href="/shop/3d-printed" className="btn-marker">
                Shop 3D printed
              </TLink>
            </Magnetic>
            <TLink href="/blog/how-we-print-a-60cm-dragon" className="btn h-14 border border-chalkline/30 text-chalkline hover:bg-chalkline hover:text-chalk">
              Inside the print lab
            </TLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
