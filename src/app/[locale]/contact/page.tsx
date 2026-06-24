import type { Metadata } from "next";
import { ContactForm } from "./contact-form";
import { Mail, Building2, Wrench } from "lucide-react";
import { buildAlternates } from "@/lib/i18n-metadata";
import type { AppLocale } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    // Pas de suffixe "| Agoris" ici : le template du root layout l'ajoute déjà
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: buildAlternates("/contact", locale),
  };
}

export default async function ContactPage() {
  const t = await getTranslations("contact");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
        {t("heading")}
      </h1>
      <p className="mt-3 text-muted">
        {t("intro")}
      </p>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        {/* Organisateurs */}
        <div className="rounded-lg border border-border bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
              <Building2 className="h-5 w-5 text-accent" />
            </div>
            <h2 className="font-serif text-xl font-bold">{t("organisateurs.title")}</h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {t("organisateurs.body")}
          </p>
          <a
            href="mailto:hello@agoris.io"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
          >
            <Mail className="h-4 w-4" />
            hello@agoris.io
          </a>
        </div>

        {/* Prestataires */}
        <div className="rounded-lg border border-border bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
              <Wrench className="h-5 w-5 text-accent" />
            </div>
            <h2 className="font-serif text-xl font-bold">{t("prestataires.title")}</h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {t("prestataires.body")}
          </p>
          <a
            href="mailto:hello@agoris.io"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
          >
            <Mail className="h-4 w-4" />
            hello@agoris.io
          </a>
        </div>
      </div>

      {/* Formulaire général */}
      <section className="mt-12">
        <h2 className="font-serif text-2xl font-bold tracking-tight">
          {t("general.title")}
        </h2>
        <p className="mt-2 text-sm text-muted">
          {t("general.intro")}
        </p>
        <div className="mt-6">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
