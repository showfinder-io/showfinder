// V5.6 — Lecture du MDX editorial depuis la DB (au lieu de
// content/salons/*.mdx). Cf. migration 20260601800000 + script
// scripts/migrate-mdx-to-db.ts.
//
// Le frontmatter (updated) est reconstitue depuis editorial_updated_at
// de la DB pour rester compatible avec le rendering existant.

import { createStaticClient } from "@/lib/supabase/static";

export type SalonContentFrontmatter = {
  /** Date ISO de la dernière mise à jour éditoriale */
  updated: string;
};

export type SalonContent = {
  frontmatter: SalonContentFrontmatter;
  content: string;
};

/**
 * Lit le MDX éditorial d'un salon depuis la DB.
 * Phase 2 i18n : si locale === "en" et que editorial_mdx_en est non nul,
 * retourne le contenu EN. Sinon retombe sur editorial_mdx (FR).
 * Retourne null si aucun MDX disponible dans aucune des deux locales.
 */
export async function getSalonContent(
  slug: string,
  locale: string = "fr"
): Promise<SalonContent | null> {
  const supabase = createStaticClient();
  // Les colonnes _en ne sont pas encore dans les types Supabase générés.
  // On sélectionne les colonnes nécessaires et on cast via unknown pour
  // accéder à editorial_mdx_en sans erreur TS.
  const { data } = await supabase
    .from("salons")
    .select("editorial_mdx, editorial_updated_at")
    .eq("slug", slug)
    .maybeSingle();

  if (!data) return null;

  // Colonnes _en : présentes en runtime via Supabase même si absentes des types
  // générés. On les lit via cast.
  const raw = data as unknown as Record<string, unknown>;

  // Fallback : si la colonne EN est nulle, on revient sur le FR.
  const mdx =
    locale === "en" && raw.editorial_mdx_en
      ? (raw.editorial_mdx_en as string)
      : raw.editorial_mdx as string | null | undefined;

  if (!mdx) return null;

  return {
    frontmatter: {
      updated: (raw.editorial_updated_at as string | null) ?? new Date().toISOString(),
    },
    content: mdx,
  };
}

/**
 * Liste des slugs de salons avec MDX éditorial. Utilisée pour la
 * filtration du sitemap (RR : indexable ssi MDX editorial present).
 */
export async function getEditorialSalonSlugs(): Promise<string[]> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("salons")
    .select("slug")
    .not("editorial_mdx", "is", null);

  return (data ?? []).map((s) => s.slug);
}
