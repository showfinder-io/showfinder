import type { MDXComponents } from "mdx/types";
import Image, { type ImageProps } from "next/image";
import Link from "next/link";

export const mdxComponents: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-10 font-serif text-2xl font-bold tracking-tight">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 font-serif text-xl font-semibold tracking-tight">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mt-4 leading-7 text-ink/85">{children}</p>
  ),
  a: ({ href, children }) => (
    <Link
      href={href ?? "#"}
      className="font-medium text-accent underline underline-offset-4 transition-colors hover:text-accent-hover"
    >
      {children}
    </Link>
  ),
  ul: ({ children }) => (
    <ul className="mt-4 list-disc space-y-2 pl-6 text-ink/85">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-4 list-decimal space-y-2 pl-6 text-ink/85">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-7">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="mt-6 border-l-4 border-accent pl-4 italic text-muted">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded bg-border/50 px-1.5 py-0.5 font-mono text-sm">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mt-4 overflow-x-auto rounded-lg bg-ink p-4 text-sm text-paper">
      {children}
    </pre>
  ),
  img: (props) => (
    <Image
      sizes="100vw"
      className="mt-6 rounded-lg"
      style={{ width: "100%", height: "auto" }}
      {...(props as ImageProps)}
    />
  ),
  hr: () => <hr className="my-8 border-border" />,
  strong: ({ children }) => (
    <strong className="font-semibold text-ink">{children}</strong>
  ),
};
