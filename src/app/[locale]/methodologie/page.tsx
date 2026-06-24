import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Metadata } from "next";
import Link from "next/link";
import { compileMdxContent } from "@/lib/mdx";
import { SectionTitle } from "@/components/section-title";
import { buildAlternates } from "@/lib/i18n-metadata";
import type { AppLocale } from "@/i18n/routing";

const METHODOLOGIE_PATH = path.join(
  process.cwd(),
  "content/methodologie.mdx"
);

type Frontmatter = {
  title: string;
  description: string;
  updated: string;
};

function getMethodologie(): { frontmatter: Frontmatter; content: string } {
  const raw = fs.readFileSync(METHODOLOGIE_PATH, "utf-8");
  const { data, content } = matter(raw);
  return {
    frontmatter: data as Frontmatter,
    content,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { frontmatter } = getMethodologie();
  return {
    title: frontmatter.title,
    description: frontmatter.description,
    alternates: buildAlternates("/methodologie", locale),
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      type: "article",
    },
    robots: { index: true, follow: true },
  };
}

export default async function MethodologiePage() {
  const { frontmatter, content } = getMethodologie();
  const Content = await compileMdxContent(content);

  const updatedDate = new Date(frontmatter.updated).toLocaleDateString(
    "fr-FR",
    { day: "numeric", month: "long", year: "numeric" }
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:py-24">
      <nav className="mb-10 text-sm text-muted" aria-label="Fil d'Ariane">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/" className="transition-colors hover:text-prune">
              Accueil
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-prune">Méthodologie</li>
        </ol>
      </nav>

      <header className="mb-12">
        <SectionTitle as="h1" size="xl">
          Méthodologie
        </SectionTitle>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          Mise à jour le {updatedDate}
        </p>
      </header>

      <article className="prose-agoris">
        <Content />
      </article>
    </div>
  );
}
