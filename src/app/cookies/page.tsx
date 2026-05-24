import type { Metadata } from "next";
import { SectionTitle } from "@/components/section-title";

export const metadata: Metadata = {
  title: "Politique cookies",
  description:
    "Politique cookies d'Agoris : cookies essentiels et mesure d'audience anonymisée.",
  robots: { index: true, follow: true },
};

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <SectionTitle as="h1" size="lg">
        Politique cookies
      </SectionTitle>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-prune/85">
        <p className="text-sm italic text-muted">
          Pour la V1. À actualiser quand la société sera juridiquement créée.
        </p>

        <p>
          Agoris utilise des cookies pour assurer le fonctionnement du site et
          mesurer son audience de manière anonymisée. Aucun cookie marketing
          ou publicitaire n&apos;est déposé au stade actuel.
        </p>

        <section>
          <h2 className="font-serif text-xl font-normal tracking-[-0.015em] text-prune">
            Cookies essentiels
          </h2>
          <p className="mt-3">
            Ces cookies sont indispensables au fonctionnement du site et ne
            peuvent pas être désactivés. Ils ne nécessitent pas de
            consentement.
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong>Supabase Auth</strong> : gestion de votre session
              (connexion, authentification). Durée : durée de la session ou 7
              jours en cas de « se souvenir de moi ».
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-normal tracking-[-0.015em] text-prune">
            Cookies de mesure d&apos;audience
          </h2>
          <p className="mt-3">
            Agoris utilise Google Analytics 4 pour mesurer l&apos;audience du
            site de manière anonymisée (anonymisation IP activée, pas de
            partage publicitaire). Ces données nous aident à améliorer le
            service.
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong>_ga, _ga_*</strong> : identifiants Google Analytics.
              Durée : 13 mois maximum.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-normal tracking-[-0.015em] text-prune">
            Cookies marketing
          </h2>
          <p className="mt-3">
            Aucun cookie marketing ou publicitaire n&apos;est déposé sur
            Agoris au stade du POC.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-normal tracking-[-0.015em] text-prune">
            Gestion des cookies
          </h2>
          <p className="mt-3">
            Vous pouvez refuser les cookies analytics directement dans les
            paramètres de votre navigateur (mode privé, blocage des traceurs,
            extensions type uBlock Origin). Le refus de ces cookies
            n&apos;empêche pas l&apos;utilisation du site.
          </p>
          <p className="mt-3">
            Pour toute question, contactez{" "}
            <a
              href="mailto:contact@agoris.io"
              className="underline decoration-prune/30 underline-offset-4 transition-colors hover:decoration-prune"
            >
              contact@agoris.io
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
