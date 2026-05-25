import fs from "fs";
import path from "path";
import matter from "gray-matter";

const SALONS_DIR = path.join(process.cwd(), "content/salons");

export type SalonContentFrontmatter = {
  /** Date ISO de la dernière mise à jour éditoriale (ex "2026-05-25") */
  updated: string;
};

export type SalonContent = {
  frontmatter: SalonContentFrontmatter;
  content: string;
};

/**
 * Lit le MDX éditorial d'un salon si il existe.
 * Retourne null si pas de fichier (= fiche standard sans contenu enrichi).
 * Cohérent avec content/secteurs/[slug].mdx.
 */
export function getSalonContent(slug: string): SalonContent | null {
  const filepath = path.join(SALONS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filepath)) return null;

  const raw = fs.readFileSync(filepath, "utf-8");
  const { data, content } = matter(raw);
  return {
    frontmatter: data as SalonContentFrontmatter,
    content,
  };
}

/**
 * Liste des slugs de salons avec MDX éditorial. Pour la prochaine étape
 * (indexabilité différenciée des fiches "Certified" vs standard, si on
 * veut basculer le critère noindex de "description IS NULL" vers "présence
 * d'un MDX" plus tard).
 */
export function getEditorialSalonSlugs(): string[] {
  if (!fs.existsSync(SALONS_DIR)) return [];
  return fs
    .readdirSync(SALONS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}
