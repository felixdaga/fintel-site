import type { Metadata } from "next";
import type { ComponentType } from "react";
import { notFound, redirect } from "next/navigation";
import {
  allPosts,
  formatPostDate,
  getPost,
  getPostBody,
  isExternalPost,
} from "@/lib/posts";

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
  if (isExternalPost(post) && post.externalUrl) {
    redirect(post.externalUrl);
  }

  const Body = getPostBody(slug);
  if (!Body) notFound();

  return (
    <article className="bg-bg">
      <div className="mx-auto max-w-5xl px-5 py-20">
        <header className="text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            {formatPostDate(post.date)}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text sm:text-5xl">
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
