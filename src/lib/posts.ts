import { posts, type Post } from "@/data/posts";
import { postBodies } from "@/content/blogs";

export type { Post };

export function allPosts(): Post[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function postHref(post: Post): string {
  return post.externalUrl ?? `/blogs/${post.slug}`;
}

export function isExternalPost(post: Post): boolean {
  return Boolean(post.externalUrl);
}

export function getPostBody(slug: string) {
  return postBodies[slug] ?? null;
}

export function formatPostDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
