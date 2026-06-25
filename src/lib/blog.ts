import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { AppLocale } from "@/i18n/routing";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  coverImage?: string;
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  // Durée de lecture en minutes (arrondie). Le formatage localisé
  // ("min de lecture" / "min read") se fait côté page via next-intl.
  readingMinutes: number;
  content: string;
}

/**
 * Résout le chemin du fichier MDX pour un slug et une locale donnés.
 * En locale EN, on privilégie `{slug}.en.mdx` s'il existe, sinon fallback
 * sur la version FR canonique `{slug}.mdx`.
 */
function resolveFilePath(slug: string, locale: AppLocale): string | null {
  if (locale === "en") {
    const enPath = path.join(BLOG_DIR, `${slug}.en.mdx`);
    if (fs.existsSync(enPath)) return enPath;
  }
  const frPath = path.join(BLOG_DIR, `${slug}.mdx`);
  return fs.existsSync(frPath) ? frPath : null;
}

/** Recupere tous les articles (slugs canoniques FR), tries par date decroissante */
export function getAllPosts(locale: AppLocale = "fr"): Post[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  // Slugs canoniques : fichiers `.mdx` hors variantes localisées `.en.mdx`.
  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx") && !f.endsWith(".en.mdx"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    return getPostBySlug(slug, locale);
  });

  return posts
    .filter((p): p is Post => p !== null)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
}

/** Recupere un article par son slug, dans la locale demandée (fallback FR) */
export function getPostBySlug(
  slug: string,
  locale: AppLocale = "fr"
): Post | null {
  const filePath = resolveFilePath(slug, locale);

  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  return {
    slug,
    frontmatter: data as PostFrontmatter,
    readingMinutes: Math.ceil(stats.minutes),
    content,
  };
}
