import Link from "next/link";
import { DetailsArrow } from "@/components/blogs/DetailsArrow";
import {
  formatPostDate,
  isExternalPost,
  postHref,
  type Post,
} from "@/lib/posts";

export function PostCard({ post }: { post: Post }) {
  const href = postHref(post);
  const external = isExternalPost(post);
  const className =
    "group flex items-center justify-between gap-6 rounded-2xl border border-border bg-bg/70 px-5 py-5 backdrop-blur-sm transition-colors hover:border-accent sm:px-6";

  const inner = (
    <>
      <div className="min-w-0">
        <time
          dateTime={post.date}
          className="font-mono text-[11px] uppercase tracking-widest text-text-muted"
        >
          {formatPostDate(post.date)}
        </time>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-text group-hover:text-accent">
          {post.title}
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-text-soft">
          {post.description}
        </p>
      </div>
      <DetailsArrow className="text-text-muted transition-colors group-hover:text-accent" />
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}
