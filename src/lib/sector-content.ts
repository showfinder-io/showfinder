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
 * Lit le MDX éditorial d'un secteur depuis la DB.
 * Phase 2 i18n : selon la locale, tente de lire editorial_mdx_en / description_en
 * / name_en. Si la colonne _en est nulle, retombe sur le champ FR.
 * Retourne null si aucun MDX disponible dans aucune des deux locales.
 */
export async function getSectorContent(
  slug: string,
  locale: string = "fr"
): Promise<SectorContent | null> {
  const supabase = await createClient();
  // Les colonnes _en ne sont pas encore dans les types Supabase générés.
  // On utilise select("*") et on lit via cast pour éviter SelectQueryError.
  const { data } = await supabase
    .from("sectors")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!data) return null;

  // Cast en Record pour accéder aux colonnes _en sans erreur TS.
  const raw = data as unknown as Record<string, unknown>;

  // Fallback : si la colonne EN est nulle, on revient sur le FR.
  const mdx =
    locale === "en" && raw.editorial_mdx_en
      ? (raw.editorial_mdx_en as string)
      : (raw.editorial_mdx as string | null | undefined);

  if (!mdx) return null;

  const name =
    (locale === "en" && raw.name_en ? (raw.name_en as string) : null) ??
    (raw.name as string);
  const description =
    (locale === "en" && raw.description_en
      ? (raw.description_en as string)
      : null) ?? (raw.description as string | null);

  return {
    frontmatter: {
      title:
        locale === "en"
          ? `${name} Trade Shows: 2026 Sector Analysis in France`
          : `Salons ${name} : analyse 2026 du secteur en France`,
      description:
        description ??
        (locale === "en"
          ? `All professional trade shows in the ${name} sector.`
          : `Tous les salons professionnels du secteur ${name}.`),
      updated: (raw.editorial_updated_at as string | null) ?? new Date().toISOString(),
    },
    content: mdx,
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
 * Reste câblé sur FR pour la rétrocompatibilité (appelé depuis des contextes
 * sans locale explicite). Utiliser formatEditorialMonthLocale quand la locale
 * est disponible.
 */
export function formatEditorialMonth(iso: string): string {
  const d = new Date(iso);
  return `${FR_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/**
 * Variante locale-aware de formatEditorialMonth.
 * EN : "May 2026" | FR : "mai 2026"
 */
export function formatEditorialMonthLocale(iso: string, locale: string): string {
  if (locale !== "en") return formatEditorialMonth(iso);
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}
