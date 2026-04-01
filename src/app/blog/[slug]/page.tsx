import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { siteConfig } from "@/lib/config";
import { compileMdxContent } from "@/lib/mdx";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return {};

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: "article",
      publishedTime: post.frontmatter.date,
      authors: [post.frontmatter.author],
      ...(post.frontmatter.coverImage && {
        images: [{ url: post.frontmatter.coverImage }],
      }),
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  // Compiler le MDX (sans le frontmatter)
  const PostContent = await compileMdxContent(post.content);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      {/* Fil d'Ariane */}
      <nav className="mb-8 text-sm text-muted" aria-label="Fil d'Ariane">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link
              href="/"
              className="transition-colors hover:text-ink"
            >
              Accueil
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href="/blog"
              className="transition-colors hover:text-ink"
            >
              Blog
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-ink" aria-current="page">
            {post.frontmatter.title}
          </li>
        </ol>
      </nav>

      {/* En-tete de l'article */}
      <header className="mb-10 border-b border-border pb-8">
        <div className="flex flex-wrap gap-2">
          {post.frontmatter.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-border/50 px-2.5 py-0.5 text-xs font-medium text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          {post.frontmatter.title}
        </h1>
        <p className="mt-4 text-lg text-muted">
          {post.frontmatter.description}
        </p>
        <div className="mt-6 flex items-center gap-3 text-sm text-muted">
          <span>{post.frontmatter.author}</span>
          <span aria-hidden="true">&middot;</span>
          <time dateTime={post.frontmatter.date}>
            {new Date(post.frontmatter.date).toLocaleDateString(
              siteConfig.locale,
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </time>
          <span aria-hidden="true">&middot;</span>
          <span>{post.readingTime}</span>
        </div>
      </header>

      {/* Contenu MDX */}
      <article className="[&>*:first-child]:mt-0">
        <PostContent />
      </article>

      {/* Retour au blog */}
      <div className="mt-12 border-t border-border pt-8">
        <Link
          href="/blog"
          className="text-sm font-medium text-accent transition-colors hover:text-accent-hover"
        >
          &larr; Retour au blog
        </Link>
      </div>
    </div>
  );
}
