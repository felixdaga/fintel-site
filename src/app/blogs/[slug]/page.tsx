import type { Metadata } from "next";
import type { ComponentType } from "react";
import { notFound } from "next/navigation";
import {
  allPosts,
  getPost,
  getPostBody,
  isExternalPost,
} from "@/lib/posts";
import { PAGE_TITLE } from "@/components/landing/whyEvalData";

type Params = { slug: string };

function PostBody({ Component }: { Component: ComponentType }) {
  return <Component />;
}

export function generateStaticParams() {
  return allPosts()
    .filter((post) => !post.externalUrl)
    .map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  // External posts link out from the listing; no on-site URL to index.
  if (isExternalPost(post)) notFound();

  const Body = getPostBody(slug);
  if (!Body) notFound();

  return (
    <article className="bg-bg">
      <div className="mx-auto max-w-5xl px-5 py-20">
        <header className="text-center">
          <h1 className={PAGE_TITLE}>
            {post.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-text-soft">
            {post.description}
          </p>
        </header>
        <div className="mt-14 space-y-5 text-base leading-relaxed text-text-soft">
          <PostBody Component={Body} />
        </div>
      </div>
    </article>
  );
}
