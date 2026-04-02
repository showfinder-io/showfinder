import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Conseils, guides et actualités pour réussir votre participation aux salons professionnels en France.",
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <header className="mb-12">
        <h1 className="font-serif text-4xl font-bold tracking-tight">Blog</h1>
        <p className="mt-4 text-lg text-muted">
          Conseils, guides et actualités pour réussir votre participation aux
          salons professionnels.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-muted">Aucun article pour le moment.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group rounded-lg border border-border bg-white p-6 transition-shadow hover:shadow-md"
            >
              <Link href={`/blog/${post.slug}`} className="block">
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
                <h2 className="mt-3 font-serif text-xl font-bold tracking-tight transition-colors group-hover:text-accent">
                  {post.frontmatter.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
                  {post.frontmatter.description}
                </p>
                <div className="mt-4 flex items-center gap-3 text-xs text-muted">
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
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
