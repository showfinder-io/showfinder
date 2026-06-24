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
    title: "Mentions légales",
    description:
      "Mentions légales d'Agoris : éditeur, hébergeur, directeur de la publication.",
    robots: { index: true, follow: true },
    alternates: buildAlternates("/mentions", locale),
  };
}

export default function MentionsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <SectionTitle as="h1" size="lg">
        Mentions légales
      </SectionTitle>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-prune/85">
        <p className="text-sm italic text-muted">
          Pour la V1. À actualiser quand la société sera juridiquement créée.
        </p>

        <section>
          <h2 className="font-serif text-xl font-normal tracking-[-0.015em] text-prune">
            Éditeur du site
          </h2>
          <p className="mt-3">
            Agoris SAS (à compléter)
            <br />
            Siège social : Paris, France
            <br />
            SIRET : TBD
            <br />
            Contact : hello@agoris.io
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-normal tracking-[-0.015em] text-prune">
            Directeur de la publication
          </h2>
          <p className="mt-3">Julien Zakoian</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-normal tracking-[-0.015em] text-prune">
            Hébergeur
          </h2>
          <p className="mt-3">
            Vercel Inc.
            <br />
            440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis
            <br />
            vercel.com
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-normal tracking-[-0.015em] text-prune">
            Propriété intellectuelle
          </h2>
          <p className="mt-3">
            L&apos;ensemble du contenu de ce site (textes, graphismes, logos,
            structure) est protégé par le droit d&apos;auteur. Toute
            reproduction, représentation, modification ou exploitation, totale
            ou partielle, sans autorisation préalable est interdite.
          </p>
          <p className="mt-3">
            Les marques et logos tiers (salons, prestataires, lieux) cités sont
            la propriété de leurs détenteurs respectifs et sont utilisés à des
            fins d&apos;information éditoriale.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-normal tracking-[-0.015em] text-prune">
            Signalement
          </h2>
          <p className="mt-3">
            Pour toute demande de correction, retrait d&apos;information ou
            signalement, écrivez à{" "}
            <a
              href="mailto:hello@agoris.io"
              className="underline decoration-prune/30 underline-offset-4 transition-colors hover:decoration-prune"
            >
              hello@agoris.io
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
