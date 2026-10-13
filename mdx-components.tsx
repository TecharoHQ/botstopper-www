import type { MDXComponents } from "mdx/types";
import { CodeBlock } from "@/components/docs/code-block";

const components = {
  a: ({ href, children, ...props }) => {
    const external = /^https?:/i.test(href ?? "");
    const resolved = !external && href?.endsWith(".md") ? href.slice(0, -3) : href;
    return <a href={resolved} {...props} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>{children}</a>;
  },
  table: ({ children, ...props }) => (
    <div className="markdown-table-scroll" tabIndex={0} role="region" aria-label="Scrollable table">
      <table {...props}>{children}</table>
    </div>
  ),
  pre: CodeBlock,
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
