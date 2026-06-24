import type { Metadata } from "next";
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
    title: "Politique de confidentialité",
    description:
      "Politique de confidentialité d'Agoris : RGPD, données personnelles, droits des utilisateurs.",
    robots: { index: true, follow: true },
    alternates: buildAlternates("/confidentialite", locale),
  };
}

export default function ConfidentialitePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <SectionTitle as="h1" size="lg">
        Politique de confidentialité
      </SectionTitle>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-prune/85">
        <p className="text-sm italic text-muted">
          Pour la V1. À actualiser quand la société sera juridiquement créée.
        </p>

        <p>
          La présente politique décrit comment Agoris collecte, utilise et
          protège vos données personnelles, conformément au Règlement Général
          sur la Protection des Données (RGPD) et à la loi Informatique et
          Libertés.
        </p>

        <section>
          <h2 className="font-serif text-xl font-normal tracking-[-0.015em] text-prune">
            Responsable de traitement
          </h2>
          <p className="mt-3">
            Agoris SAS (à compléter), basée à Paris. Contact :{" "}
            <a
              href="mailto:hello@agoris.io"
              className="underline decoration-prune/30 underline-offset-4 transition-colors hover:decoration-prune"
            >
              hello@agoris.io
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-normal tracking-[-0.015em] text-prune">
            Données collectées
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              Adresse email : lorsque vous créez un compte, vous inscrivez à
              une alerte salon ou à notre newsletter.
            </li>
            <li>
              Préférences éditoriales : secteurs et villes suivis, pour
              personnaliser vos alertes.
            </li>
            <li>
              Données techniques anonymisées : type de navigateur, pages
              consultées (via Google Analytics 4).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-normal tracking-[-0.015em] text-prune">
            Finalités du traitement
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Vous envoyer les alertes salons auxquelles vous êtes inscrit.</li>
            <li>
              Vous adresser notre newsletter mensuelle (uniquement avec
              consentement explicite).
            </li>
            <li>
              Améliorer le service en mesurant l&apos;audience de manière
              agrégée.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-normal tracking-[-0.015em] text-prune">
            Base légale
          </h2>
          <p className="mt-3">
            Vos données sont traitées sur la base de votre consentement
            (inscription explicite) ou de l&apos;intérêt légitime
            d&apos;Agoris à fournir un service éditorial pertinent.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-normal tracking-[-0.015em] text-prune">
            Durée de conservation
          </h2>
          <p className="mt-3">
            Les données de compte et d&apos;abonnement sont conservées tant
            que votre compte est actif, et jusqu&apos;à 3 ans après votre
            dernière interaction. Les données analytiques anonymisées sont
            conservées 14 mois (paramétrage Google Analytics).
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-normal tracking-[-0.015em] text-prune">
            Vos droits
          </h2>
          <p className="mt-3">Vous disposez à tout moment des droits suivants :</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Droit d&apos;accès à vos données personnelles.</li>
            <li>Droit de rectification et de mise à jour.</li>
            <li>Droit d&apos;effacement (droit à l&apos;oubli).</li>
            <li>Droit à la portabilité.</li>
            <li>Droit d&apos;opposition au traitement.</li>
            <li>Droit de retirer votre consentement à tout moment.</li>
          </ul>
          <p className="mt-3">
            Pour exercer ces droits, contactez notre DPO à{" "}
            <a
              href="mailto:hello@agoris.io"
              className="underline decoration-prune/30 underline-offset-4 transition-colors hover:decoration-prune"
            >
              hello@agoris.io
            </a>
            . En cas de litige, vous pouvez saisir la CNIL (cnil.fr).
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-normal tracking-[-0.015em] text-prune">
            Partage des données
          </h2>
          <p className="mt-3">
            Agoris ne vend ni ne loue vos données. Elles peuvent être
            transmises uniquement à nos sous-traitants techniques (hébergement
            Vercel, base de données Supabase, mesure d&apos;audience Google
            Analytics), tous soumis à des engagements de confidentialité et de
            sécurité conformes au RGPD.
          </p>
        </section>
      </div>
    </div>
  );
}
