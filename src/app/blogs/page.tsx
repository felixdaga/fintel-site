import type { Metadata } from "next";
import { PostCard } from "@/components/blogs/PostCard";
import { allPosts } from "@/lib/posts";
import { PAGE_GUTTER, PAGE_PAD, PAGE_TITLE } from "@/components/landing/whyEvalData";

const PAGE_DESCRIPTION = "Showcasing the power of fintel";

export const metadata: Metadata = {
  title: "blogs",
  description: PAGE_DESCRIPTION,
};

export default function BlogsPage() {
  const posts = allPosts();

  return (
    <section className="relative flex min-h-[calc(100vh-3.5rem)] flex-col overflow-hidden bg-bg sm:min-h-[calc(100vh-4rem)]">
      <div className={`relative ${PAGE_PAD} py-12 sm:py-20`}>
        <div className={`${PAGE_GUTTER} mx-auto max-w-3xl`}>
        <header className="text-center">
          <h1 className={PAGE_TITLE}>
            blogs
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-text-soft">
            {PAGE_DESCRIPTION}
          </p>
        </header>

        <ul className="mt-14 space-y-4">
          {posts.map((post) => (
            <li key={post.slug}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
        </div>
      </div>
    </section>
  );
}
