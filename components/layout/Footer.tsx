import { TLink } from '@/components/TLink';
import { NewsletterForm } from '@/components/forms/NewsletterForm';
import { SplitText } from '@/components/motion/SplitText';
import { CATEGORIES } from '@/lib/catalog';
import { CurrencySelect } from '@/components/ui/CurrencySelector';
import { SITE } from '@/lib/site';

const help = [
  { href: '/contact#faq', label: 'Shipping and returns' },
  { href: '/contact', label: 'Contact us' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Journal' },
];

export function Footer() {
  return (
    <footer className="on-dark relative overflow-hidden bg-chalk pb-[calc(2rem+env(safe-area-inset-bottom))] pt-24 text-chalkline">
      <div className="wrap">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SplitText as="p" text={'See you\nafter school.'} className="display text-[clamp(38px,8vw,128px)]" />
          </div>
          <div className="flex items-end lg:col-span-5">
            <NewsletterForm id="footer-newsletter" />
          </div>
        </div>

        <div className="mt-24 grid grid-cols-2 gap-x-6 gap-y-12 border-t border-chalkline/15 pt-10 md:grid-cols-3 lg:grid-cols-12 [&>*]:min-w-0">
          <div className="lg:col-span-2">
            <p className="mb-4 text-sm text-chalkline/60">Shop</p>
            <ul className="space-y-2">
              <li><TLink href="/shop" className="link-underline">Shop all</TLink></li>
              {CATEGORIES.map((c) => (
                <li key={c.slug}><TLink href={`/shop/${c.slug}`} className="link-underline">{c.name}</TLink></li>
              ))}
              <li><TLink href="/wishlist" className="link-underline">Wishlist</TLink></li>
            </ul>
          </div>
          <div className="lg:col-span-2">
            <p className="mb-4 text-sm text-chalkline/60">Help</p>
            <ul className="space-y-2">
              {help.map((l) => (
                <li key={l.href}><TLink href={l.href} className="link-underline">{l.label}</TLink></li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-3">
            <p className="mb-4 text-sm text-chalkline/60">Follow</p>
            <ul className="space-y-2">
              <li><a href={SITE.instagram} target="_blank" rel="noreferrer" className="link-underline">Instagram</a></li>
              <li><a href={SITE.tiktok} target="_blank" rel="noreferrer" className="link-underline">TikTok</a></li>
              <li><a href={`mailto:${SITE.email}`} className="link-underline break-all">{SITE.email}</a></li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <CurrencySelect id="footer-currency" label="Shop in" />
          </div>
          <div className="col-span-2 text-sm text-chalkline/60 md:col-span-2 lg:col-span-3">
            <p>
              Football items are original fan designs inspired by team colours and history. They are unofficial and not affiliated with, licensed or endorsed by any club, league or federation.
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-4 text-sm text-chalkline/50 sm:flex-row">
          <p>© {new Date().getFullYear()} After School Studio. Prices shown in your chosen currency.</p>
          <p>
            Founder <span aria-hidden>—</span> <span className="text-chalkline">{SITE.founder}</span>
          </p>
        </div>
      </div>
      <p aria-hidden className="display pointer-events-none mt-12 select-none whitespace-nowrap text-center text-[19vw] leading-[0.75] text-chalkline/[0.06]">
        After School
      </p>
    </footer>
  );
}
