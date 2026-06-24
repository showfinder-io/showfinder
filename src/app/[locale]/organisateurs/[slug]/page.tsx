import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/config";
import { getAllOrganizerSlugs, getSalonsByOrganizer } from "@/lib/queries";
import { SalonCard } from "@/components/salon-card";
import { SectionTitle } from "@/components/section-title";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld";
import { buildAlternates } from "@/lib/i18n-metadata";
import type { AppLocale } from "@/i18n/routing";

type Props = {
  params: Promise<{ slug: string; locale: AppLocale }>;
};

export async function generateStaticParams() {
  const slugs = await getAllOrganizerSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "organisateurs.detail" });
  const result = await getSalonsByOrganizer(slug);
  if (!result) return { title: t("metaNotFound") };

  const title = t("metaTitle", { organizerName: result.organizerName });
  const description = t("metaDescription", { organizerName: result.organizerName, siteName: siteConfig.name });

  return {
    title,
    description,
    // Pages de navigation interne : 76% des organisateurs n'ont qu'1 salon
    // (thin content). noindex pour ne pas exposer ces pages à l'index, follow
    // pour préserver le maillage entre salons d'un même organisateur.
    robots: { index: false, follow: true },
    alternates: buildAlternates(`/organisateurs/${slug}`, locale),
    openGraph: { title, description, type: "website" },
  };
}

export default async function OrganisateurPage({ params }: Props) {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "organisateurs.detail" });
  const result = await getSalonsByOrganizer(slug);

  if (!result) notFound();

  const { organizerName, salons, total } = result;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", item: "/" },
          { name: t("breadcrumbSalons"), item: "/salons" },
          { name: organizerName, item: `/organisateurs/${slug}` },
        ]}
      />

      <nav className="mb-10 text-sm text-muted">
        <Link href="/salons" className="hover:text-prune transition-colors">
          {t("breadcrumbSalons")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-prune">{organizerName}</span>
      </nav>

      <header className="max-w-3xl">
        <SectionTitle as="h1" size="xl" eyebrow={t("eyebrow")}>
          {organizerName}
        </SectionTitle>
        <p className="mt-5 text-sm text-muted">
          <span className="font-serif text-[22px] font-normal text-ocre tabular-nums">
            {total}
          </span>{" "}
          {total > 1
            ? t("countLabelMany", { organizerName })
            : t("countLabelOne", { organizerName })}
        </p>
      </header>

      {salons.length > 0 ? (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {salons.map((salon) => (
            <SalonCard key={salon.id} salon={salon} />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-lg border border-border bg-ivoire p-12 text-center">
          <p className="font-serif text-xl italic leading-relaxed text-prune/85">
            {t("emptyResult")}
            <em className="not-italic text-ocre">.</em>
          </p>
        </div>
      )}
    </div>
  );
}
