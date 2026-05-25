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
