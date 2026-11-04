import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { ContactForm } from '@/components/forms/ContactForm';
import { Reveal } from '@/components/motion/Reveal';
import { Accordion } from '@/components/shop/Accordion';
import { DISCOUNTS } from '@/lib/discounts';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Questions about an order, returns, wholesale or a custom 3D print? Get in touch with the After School team.',
  alternates: { canonical: '/contact' },
};

const FAQ = [
  {
    title: 'How long does shipping take?',
    content: 'US standard shipping takes 3 to 5 business days and express 1 to 2. International orders take 6 to 14 business days depending on the country. 3D printed items are made to order and add 2 to 4 days.',
  },
  {
    title: 'What is your returns policy?',
    content: 'Return unworn clothing and football merch within 30 days for a full refund. 3D printed items are made to order, so we can’t take them back unless they arrive damaged, in which case we reprint them free.',
  },
  {
    title: 'Is your football merch official?',
    content: 'No. Every football item is an original After School design inspired by team colours and football history. None of it is licensed by or affiliated with any club, league or federation, and none of it carries official crests or sponsor marks.',
  },
  {
    title: 'Are 3D printed toys safe for kids?',
    content: 'They’re printed in PLA, a plant-based plastic. Articulated pieces contain small parts, so we recommend them for ages 8 and up.',
  },
  {
    title: 'Do you take custom 3D print requests?',
    content: 'Yes, for colours, names on keychains and small batches for clubs or schools. Choose “Custom 3D print” in the form and tell us what you have in mind.',
  },
  {
    title: 'Which discount codes are active?',
    content: `Right now: ${DISCOUNTS.map((d) => `${d.code} (${d.description})`).join(', ')}. One code per order.`,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader title="Contact" intro="Questions about an order, returns, wholesale or a custom print. A real person replies within one working day." />
      <div className="wrap grid gap-16 pb-24 lg:grid-cols-12 [&>*]:min-w-0">
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
        <Reveal as="aside" className="space-y-8 lg:col-span-4 lg:col-start-9">
          <div>
            <p className="text-sm text-graphite">Email</p>
            <a href={`mailto:${SITE.email}`} className="link-underline break-all text-lg font-semibold">
              {SITE.email}
            </a>
          </div>
          <div>
            <p className="text-sm text-graphite">Studio hours</p>
            <p className="text-lg">Monday to Friday, 3 pm to 7 pm ET</p>
            <p className="text-graphite">After school, obviously.</p>
          </div>
          <div>
            <p className="text-sm text-graphite">Studio</p>
            <address className="text-lg not-italic">
              After School Studio
              <br />
              214 Market Street, Unit 3
              <br />
              Brooklyn, NY 11201
            </address>
          </div>
        </Reveal>
      </div>
      <section id="faq" className="scroll-mt-28 border-t border-line/10 py-24" aria-labelledby="faq-title">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <h2 id="faq-title" className="display text-[clamp(34px,6vw,96px)] lg:col-span-5">
            Questions
          </h2>
          <div className="lg:col-span-7">
            <Accordion items={FAQ} defaultOpen={null} />
          </div>
        </div>
      </section>
    </>
  );
}
