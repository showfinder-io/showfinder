import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

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
  readingTime: string;
  content: string;
}

/** Recupere tous les articles, tries par date decroissante */
export function getAllPosts(): Post[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    return getPostBySlug(slug);
  });

  return posts
    .filter((p): p is Post => p !== null)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
}

/** Recupere un article par son slug */
export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  return {
    slug,
    frontmatter: data as PostFrontmatter,
    readingTime: `${Math.ceil(stats.minutes)} min de lecture`,
    content,
  };
}
