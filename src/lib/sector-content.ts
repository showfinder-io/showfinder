import { createClient } from "@/lib/supabase/server";

export type SectorContentFrontmatter = {
  title: string;
  description: string;
  updated: string;
};

export type SectorContent = {
  frontmatter: SectorContentFrontmatter;
  content: string;
};

/**
 * Lit le MDX éditorial d'un secteur depuis la DB (champ editorial_mdx).
 * Retourne null si pas de contenu (= secteur sans chapeau éditorial).
 * Le frontmatter est synthétisé depuis les colonnes name + description + editorial_updated_at.
 */
export async function getSectorContent(slug: string): Promise<SectorContent | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("sectors")
    .select("name, description, editorial_mdx, editorial_updated_at")
    .eq("slug", slug)
    .maybeSingle();

  if (!data?.editorial_mdx) return null;

  return {
    frontmatter: {
      title: `Salons ${data.name} : analyse 2026 du secteur en France`,
      description:
        data.description ??
        `Tous les salons professionnels du secteur ${data.name}.`,
      updated: data.editorial_updated_at ?? new Date().toISOString(),
    },
    content: data.editorial_mdx,
  };
}

/**
 * Renvoie la liste des slugs de secteurs qui ont un MDX éditorial.
 * Utilisé par le sitemap pour ne référencer que les pages travaillées.
 */
export async function getEditorialSectorSlugs(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("sectors")
    .select("slug")
    .not("editorial_mdx", "is", null);
  return (data ?? []).map((s) => s.slug);
}

const FR_MONTHS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
] as const;

/**
 * Formate une date ISO ("2026-05-24") en "mois année" français ("mai 2026").
 * Utilisé pour la mention de fraîcheur éditoriale des pages secteur.
 */
export function formatEditorialMonth(iso: string): string {
  const d = new Date(iso);
  return `${FR_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
