import { reportContent } from "@/content/blogs/geopol-trade-war-2018/data";
import { postContent } from "@/content/blogs/iterative-agent-improvement/data";
import { f1CommentaryContent } from "@/content/blogs/f1-commentary-2026-07-23/data";

export type Post = {
  slug: string;
  title: string;
  description: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  /**
   * If set, listing cards link out instead of opening `/blogs/[slug]`.
   * Omit this for on-site posts.
   */
  externalUrl?: string;
  /** Optional tags used to group posts elsewhere (e.g. the strategy page). */
  tags?: string[];
};

/**
 * Newest first is applied at read time — append new posts anywhere.
 *
 * On-site post: omit `externalUrl`, then add a body in `src/content/blogs/`
 * and register it in `src/content/blogs/index.ts`.
 */
export const posts: Post[] = [
  {
    slug: "the-genesis",
    title: "Optimizing AI Agents for Alpha Generation",
    description: "Fintel Whitepaper",
    date: "2026-07-16",
    externalUrl:
      "https://felixdaga.github.io/Optimized_Agent/posts/2026-07-16-optimizing-ai-agents-for-alpha-generation/",
    tags: ["F1"],
  },
  {
    slug: reportContent.meta.slug,
    title: reportContent.meta.title,
    description: reportContent.meta.description,
    date: reportContent.meta.date,
  },
  {
    slug: postContent.meta.slug,
    title: postContent.meta.title,
    description: postContent.meta.description,
    date: postContent.meta.date,
    tags: ["F1"],
  },
  {
    slug: f1CommentaryContent.meta.slug,
    title: f1CommentaryContent.meta.title,
    description: f1CommentaryContent.meta.description,
    date: f1CommentaryContent.meta.date,
    tags: ["F1"],
  },
];
