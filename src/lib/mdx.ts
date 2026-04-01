import { compile, run } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { mdxComponents } from "@/components/mdx-components";

export async function compileMdxContent(
  source: string
): Promise<React.ComponentType> {
  const compiled = await compile(source, {
    outputFormat: "function-body",
  });

  const { default: Content } = await run(String(compiled), {
    ...runtime,
    baseUrl: import.meta.url,
  });

  // Wrapper pour injecter les composants custom
  return function MdxWrapper() {
    return Content({ components: mdxComponents });
  };
}
