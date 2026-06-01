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
 * Lit le MDX éditorial d'un salon depuis la DB. Retourne null si le
 * salon n'a pas de MDX éditorial (= fiche standard sans contenu enrichi).
 */
export async function getSalonContent(
  slug: string
): Promise<SalonContent | null> {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("salons")
    .select("editorial_mdx, editorial_updated_at")
    .eq("slug", slug)
    .maybeSingle();

  if (!data || !data.editorial_mdx) return null;

  return {
    frontmatter: {
      updated: data.editorial_updated_at ?? new Date().toISOString(),
    },
    content: data.editorial_mdx,
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
