import fs from "fs";
import path from "path";
import matter from "gray-matter";

const SECTEURS_DIR = path.join(process.cwd(), "content/secteurs");

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
 * Lit le MDX éditorial d'un secteur si il existe.
 * Retourne null si pas de fichier (= secteur sans contenu chapeau).
 */
export function getSectorContent(slug: string): SectorContent | null {
  const filepath = path.join(SECTEURS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filepath)) return null;

  const raw = fs.readFileSync(filepath, "utf-8");
  const { data, content } = matter(raw);
  return {
    frontmatter: data as SectorContentFrontmatter,
    content,
  };
}

/**
 * Renvoie la liste des slugs de secteurs qui ont un MDX éditorial.
 * Utilisé par le sitemap pour ne référencer que les pages travaillées.
 */
export function getEditorialSectorSlugs(): string[] {
  if (!fs.existsSync(SECTEURS_DIR)) return [];
  return fs
    .readdirSync(SECTEURS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
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
