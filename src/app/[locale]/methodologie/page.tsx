import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
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
  const t = await getTranslations({ locale, namespace: "methodologie.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates("/methodologie", locale),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "article",
    },
    robots: { index: true, follow: true },
  };
}

export default async function MethodologiePage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  const { frontmatter, content } = getMethodologie();
  const Content = await compileMdxContent(content);
  const t = await getTranslations({ locale, namespace: "methodologie" });

  const updatedDate = new Date(frontmatter.updated).toLocaleDateString(
    locale === "en" ? "en-GB" : "fr-FR",
    { day: "numeric", month: "long", year: "numeric" }
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:py-24">
      <nav className="mb-10 text-sm text-muted" aria-label={t("breadcrumb.ariaLabel")}>
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/" className="transition-colors hover:text-prune">
              {t("breadcrumb.home")}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-prune">{t("breadcrumb.current")}</li>
        </ol>
      </nav>

      <header className="mb-12">
        <SectionTitle as="h1" size="xl">
          {t("heading")}
        </SectionTitle>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          {t("updatedAt", { date: updatedDate })}
        </p>
      </header>

      <article className="prose-agoris">
        <Content />
      </article>
    </div>
  );
}
