export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'list'; items: string[] }
  | { type: 'products'; slugs: string[] };

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readingMinutes: number;
  cover: string;
  coverAlt: string;
  topic: 'Studio' | 'Football' | 'Print lab' | 'Guides';
  body: Block[];
}

export const POSTS: Post[] = [
  {
    slug: 'how-we-print-a-60cm-dragon',
    title: 'How we print a 60 cm dragon in one piece',
    excerpt: 'Fourteen hours, 280 grams of silk PLA and zero glue. A look inside the print lab at our biggest bestseller.',
    date: '2026-09-20',
    author: 'Rafi Okon, print lab',
    readingMinutes: 6,
    cover: '/products/articulated-crystal-dragon/0-b.svg',
    coverAlt: 'Close-up of an articulated purple dragon',
    topic: 'Print lab',
    body: [
      { type: 'p', text: 'The first time someone picks up our Articulated Crystal Dragon, they usually ask the same thing: where are the joints glued? They aren’t. The dragon comes off the printer in one piece, with every segment already linked to the next.' },
      { type: 'h2', text: 'Print in place' },
      { type: 'p', text: 'Print-in-place means the moving parts are printed already assembled, separated by a gap of about 0.3 mm. Too tight and the joints fuse together; too loose and the dragon flops like a wet sock. We tested eleven tolerances before we found the one that gives each segment a satisfying click.' },
      { type: 'p', text: 'The model is laid flat across the bed in a coiled S shape so the whole 60 cm body fits on a 35 cm plate. That coil is also why our dragons arrive looking like they’re mid-swim.' },
      { type: 'h2', text: 'Why silk PLA' },
      { type: 'p', text: 'Silk PLA is regular plant-based PLA blended with additives that give it a satin sheen. Dual and tri-colour silk filaments shift colour as the nozzle moves, which is where the galaxy and fire effects come from. No two dragons come out with exactly the same pattern.' },
      { type: 'list', items: ['Print time: about 14 hours', 'Material: 280 g silk PLA', 'Layer height: 0.2 mm', 'Post-processing: a light pass to remove any stringing, then a full articulation test'] },
      { type: 'quote', text: 'We bend every single segment before it goes in the box. If one sticks, it gets reprinted.', cite: 'Rafi, print lab' },
      { type: 'h2', text: 'Made to order, not to stock' },
      { type: 'p', text: 'We don’t keep shelves of dragons. When you order, your colour goes into the print queue, which is why 3D items ship two to four days after clothing. It keeps waste low and means we can offer colours that would be impossible to stock.' },
      { type: 'products', slugs: ['articulated-crystal-dragon', 'mini-articulated-dragon', 'skeleton-dragon'] },
    ],
  },
  {
    slug: 'retro-shirts-without-the-badge',
    title: 'Retro football shirts, without the badge',
    excerpt: 'Why our football range celebrates colours and eras rather than crests, and what that means when you buy one.',
    date: '2026-08-31',
    author: 'Ines Duarte, design',
    readingMinutes: 5,
    cover: '/products/samba-gold-retro-shirt/0-b.svg',
    coverAlt: 'Detail of a gold football shirt with a green collar',
    topic: 'Football',
    body: [
      { type: 'p', text: 'Football shirts are the closest thing most of us have to a flag. You remember the summer you got your first one, and who you watched the final with. Our football range is built around that feeling rather than around any one club or federation.' },
      { type: 'h2', text: 'Inspired by, not licensed by' },
      { type: 'p', text: 'Every shirt in the range is an original After School design inspired by the colours and eras of national teams and clubs. None of it is official merchandise, and none of it carries a real crest, sponsor or federation mark. We say that clearly on every product page because it matters: you should know exactly what you’re buying.' },
      { type: 'p', text: 'What you get instead is the stuff we love about old shirts: chunky collars, simple patterns, colours that look good on a terrace and in a photo. Without a sponsor across the chest they work just as well on a Tuesday as on a match day.' },
      { type: 'h2', text: 'How we choose the colours' },
      { type: 'list', items: ['We start with the colours fans already wear to the ground', 'We pick a pattern from football’s shared history: stripes, hoops, halves or plain', 'We design our own heritage-style badge so the shirt still has a focal point'] },
      { type: 'quote', text: 'A green and white hoop belongs to a whole city’s memory, not to a logo.', cite: 'Ines' },
      { type: 'products', slugs: ['samba-gold-retro-shirt', 'albiceleste-stripe-shirt', 'green-hoops-shirt'] },
    ],
  },
  {
    slug: 'heavyweight-fleece-explained',
    title: 'What “heavyweight” actually means',
    excerpt: 'GSM, loopback, brushed back: a plain-English guide to why some hoodies feel like armour and others feel like tissue.',
    date: '2026-07-18',
    author: 'Kit Mensah, product',
    readingMinutes: 4,
    cover: '/products/bell-heavyweight-hoodie/0-b.svg',
    coverAlt: 'Close-up of a green heavyweight hoodie',
    topic: 'Guides',
    body: [
      { type: 'p', text: 'You’ll see “heavyweight” on a lot of hoodies. Usually it means nothing. Here’s how to tell when it does.' },
      { type: 'h2', text: 'GSM is the number to look for' },
      { type: 'p', text: 'GSM stands for grams per square metre. It measures how dense the fabric is. A typical fast-fashion hoodie sits around 280 to 320 gsm. Ours start at 400 and the Bell Hoodie is 480. You feel the difference immediately: it drapes rather than clings, and it keeps its shape after washing.' },
      { type: 'h2', text: 'Loopback vs brushed back' },
      { type: 'p', text: 'Inside a sweatshirt, the fabric is either left as small loops (loopback) or brushed until the loops turn into soft fluff (brushed back). Loopback breathes better and ages well. Brushed back is warmer and feels softer from day one. We use loopback for zips and crews, and brushed back for the Bell Hoodie and joggers.' },
      { type: 'h2', text: 'Care that keeps it heavy' },
      { type: 'list', items: ['Wash cold, inside out', 'Skip the tumble dryer: heat shrinks cotton and flattens fleece', 'Hang to dry over a chair back, not on a thin hanger'] },
      { type: 'products', slugs: ['bell-heavyweight-hoodie', 'detention-zip-hoodie', 'late-bus-joggers'] },
    ],
  },
  {
    slug: 'desk-setup-under-50',
    title: 'A better desk setup for under $45',
    excerpt: 'Three printed pieces that clear the clutter: a phone stand, a controller dock and a modular organiser.',
    date: '2026-06-12',
    author: 'Rafi Okon, print lab',
    readingMinutes: 3,
    cover: '/products/dual-controller-stand/0-a.svg',
    coverAlt: 'A black dual controller stand holding two game controllers',
    topic: 'Print lab',
    body: [
      { type: 'p', text: 'A messy desk makes homework, gaming and everything in between harder. These are the three pieces we use on our own desks.' },
      { type: 'h2', text: 'Get the phone off the desk' },
      { type: 'p', text: 'A phone lying flat is a phone you keep picking up. The Desk Phone Stand holds it upright at a readable angle, so notifications are glanceable rather than distracting, and the cable slot means it charges while it sits.' },
      { type: 'h2', text: 'Give controllers a home' },
      { type: 'p', text: 'The Dual Controller Stand stacks two pads vertically and routes the charging cables out the back. It takes a footprint smaller than a paperback.' },
      { type: 'h2', text: 'Group the small stuff' },
      { type: 'p', text: 'The Modular Desk Organiser is three trays that clip together in any order. Pens in one, cables in the second, earbuds and keys in the third.' },
      { type: 'products', slugs: ['desk-phone-stand', 'dual-controller-stand', 'modular-desk-organizer'] },
    ],
  },
  {
    slug: 'why-we-are-called-after-school',
    title: 'Why we’re called After School',
    excerpt: 'The hours between the last bell and dinner were where we figured out who we were. That’s who we make things for.',
    date: '2026-05-02',
    author: 'Jules Arden, founder',
    readingMinutes: 4,
    cover: '/products/margin-oversized-tee/0-a.svg',
    coverAlt: 'A white oversized tee with a small AS print',
    topic: 'Studio',
    body: [
      { type: 'p', text: 'Most of the important stuff happened after school. Kickabouts that went on until it was too dark to see the ball. Bus rides home in the same hoodie every day. The friend who had a 3D printer before anyone knew what one was.' },
      { type: 'p', text: 'After School started as three friends selling hoodies and printed dragons from a single table at a weekend market. The combination confused people at first. Then it didn’t: the same people who wanted a good hoodie also wanted a football shirt for Sunday and something to fidget with at their desk.' },
      { type: 'h2', text: 'What we care about' },
      { type: 'list', items: ['Making fewer, better things that last longer than one season', 'Printing 3D items to order, so nothing sits in a warehouse', 'Being honest about what our football range is: fan-made, unofficial and proud of it'] },
      { type: 'quote', text: 'We make things for the hours that belong to you.', cite: 'Jules' },
      { type: 'p', text: 'Thanks for being here. If you ever want to tell us what to make next, our inbox is always open.' },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
