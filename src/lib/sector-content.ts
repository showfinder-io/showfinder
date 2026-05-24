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
