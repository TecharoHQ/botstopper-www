"use client";

import { useEffect, useId, useState } from "react";

export function MermaidDiagram({ source }: { source: string }) {
  const id = `mermaid-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [svg, setSvg] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function render() {
      try {
        const { default: mermaid } = await import("mermaid");
        mermaid.initialize({ startOnLoad: false, securityLevel: "strict", theme: "neutral", suppressErrorRendering: true });
        const result = await mermaid.render(id, source);
        if (!cancelled) setSvg(result.svg);
      } catch {
        if (!cancelled) setFailed(true);
      }
    }
    void render();
    return () => { cancelled = true; };
  }, [id, source]);

  if (failed) return <p role="alert">The diagram could not load.</p>;
  if (!svg) return <p role="status">Loading diagram...</p>;

  return <div className="mermaid-diagram" role="region" aria-label="Diagram" tabIndex={0} style={{ overflowX: "auto", margin: "24px 0" }} dangerouslySetInnerHTML={{ __html: svg }} />;
}
