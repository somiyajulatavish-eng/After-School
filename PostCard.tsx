import { TLink } from '@/components/TLink';
import { ClipReveal } from '@/components/motion/ClipReveal';
import type { Post } from '@/lib/blog';
import { formatDate } from '@/lib/format';

export function PostCard({ post, large = false }: { post: Post; large?: boolean }) {
  return (
    <article className="group">
      <TLink href={`/blog/${post.slug}`} className="block" data-cursor="Read">
        <ClipReveal className={`rounded-lg bg-sheet ${large ? 'aspect-[16/11]' : 'aspect-[4/3]'}`}>
          <img src={post.cover} alt={post.coverAlt} width={600} height={750} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1400ms] ease-expo group-hover:scale-105" />
        </ClipReveal>
        <div className="mt-5 flex items-center gap-3 text-sm text-graphite">
          <span className="rounded-full border border-ink/15 px-3 py-1 text-ink">{post.topic}</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
        <h3 className={`mt-3 font-semibold leading-tight ${large ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'}`}>
          <span className="link-underline">{post.title}</span>
        </h3>
        <p className="mt-3 max-w-[56ch] text-graphite">{post.excerpt}</p>
      </TLink>
    </article>
  );
}
