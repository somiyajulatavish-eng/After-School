import type { Metadata } from 'next';
import { PostCard } from '@/components/blog/PostCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { POSTS } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Stories from the After School studio and print lab: how we make things, football culture and guides.',
  alternates: { canonical: '/blog' },
};

export default function BlogPage() {
  const [lead, ...rest] = POSTS;
  return (
    <>
      <PageHeader title="Journal" intro="Notes from the studio, the print lab and the stands." />
      <div className="wrap pb-32">
        <div className="mb-20">
          <PostCard post={lead} large />
        </div>
        <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
          {rest.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </div>
    </>
  );
}
