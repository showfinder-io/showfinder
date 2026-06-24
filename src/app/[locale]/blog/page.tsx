import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/config";
import { PhotoPlaceholder } from "@/components/photo-placeholder";
import { SectionTitle } from "@/components/section-title";
import { buildAlternates } from "@/lib/i18n-metadata";
import type { AppLocale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Le journal : guides et analyses",
    description:
      "Conseils, guides et actualités pour réussir votre participation aux salons professionnels en France.",
    alternates: buildAlternates("/blog", locale),
  };
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
      <header className="mb-10 md:mb-14">
        <SectionTitle as="h1" size="xl" eyebrow="Guides et analyses">
          Le journal
        </SectionTitle>
        <p className="mt-4 max-w-2xl text-base text-muted">
          Conseils éditoriaux, comparatifs et benchmarks pour comprendre l&apos;écosystème
          des salons professionnels en France.
        </p>
      </header>

      {posts.length === 0 ? (
        <div className="rounded-lg border border-prune/10 bg-ivoire p-12 text-center">
          <p className="font-serif text-xl italic leading-relaxed text-prune/85">
            Le journal s&apos;ouvrira prochainement
            <em className="not-italic text-ocre">.</em>
          </p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group relative overflow-hidden rounded-lg bg-ivoire transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-[#FBF7EA]"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="flex h-full flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-ocre focus-visible:ring-offset-2 focus-visible:ring-offset-sable"
                aria-label={post.frontmatter.title}
              >
                {/* Thumbnail (cover image ou placeholder) */}
                {post.frontmatter.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.frontmatter.coverImage}
                    alt={post.frontmatter.title}
                    className="aspect-[3/2] w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <PhotoPlaceholder ratio="3/2" label="article" />
                )}

                <div className="flex flex-1 flex-col gap-4 p-7">
                  {/* Tags catégorie (outline éditorial mono) */}
                  {post.frontmatter.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.frontmatter.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block rounded-full border border-prune bg-transparent px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-prune"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Titre */}
                  <h2 className="font-serif text-[28px] font-normal leading-[1.1] tracking-[-0.015em] text-prune">
                    {post.frontmatter.title}
                  </h2>

                  {/* Extrait */}
                  <p className="line-clamp-3 text-sm leading-relaxed text-prune/70">
                    {post.frontmatter.description}
                  </p>

                  {/* Footer : date mono + temps de lecture */}
                  <div className="mt-auto flex items-center gap-3 border-t border-border pt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-prune/60">
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
                    <span aria-hidden="true" className="text-prune/30">
                      ·
                    </span>
                    <span>{post.readingTime}</span>
                  </div>
                </div>
              </Link>

              {/* Arrow ocre au hover */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-5 right-7 -translate-x-1.5 font-serif text-xl text-ocre opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0 group-hover:opacity-100"
              >
                →
              </span>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
