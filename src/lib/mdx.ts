import { compile, run } from "@mdx-js/mdx";
import type { MDXComponents } from "mdx/types";
import * as runtime from "react/jsx-runtime";
import { mdxComponents } from "@/components/mdx-components";

export async function compileMdxContent(
  source: string,
  components: MDXComponents = mdxComponents
): Promise<React.ComponentType> {
  const compiled = await compile(source, {
    outputFormat: "function-body",
  });

  const { default: Content } = await run(String(compiled), {
    ...runtime,
    baseUrl: import.meta.url,
  });

  return function MdxWrapper() {
    return Content({ components });
  };
}

/**
 * Variante tolérante pour le contenu MDX venant de la base (fiches salon,
 * lieux, secteurs) : un contenu invalide (erreur de parsing, composant non
 * fourni) masque le bloc éditorial au lieu de mettre toute la page en 500.
 */
export async function compileMdxContentSafe(
  source: string,
  components: MDXComponents = mdxComponents
): Promise<React.ComponentType | null> {
  try {
    const compiled = await compile(source, { outputFormat: "function-body" });
    const { default: Content } = await run(String(compiled), {
      ...runtime,
      baseUrl: import.meta.url,
    });
    return function MdxSafeWrapper() {
      try {
        return Content({ components });
      } catch (error) {
        console.error("[mdx] rendu échoué, bloc éditorial masqué :", error);
        return null;
      }
    };
  } catch (error) {
    console.error("[mdx] compilation échouée, bloc éditorial masqué :", error);
    return null;
  }
}
