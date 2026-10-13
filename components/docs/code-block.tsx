"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";

export function CodeBlock({ children, ...props }: ComponentProps<"pre">) {
  const code = useRef<HTMLPreElement>(null);
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    if (status === "idle") return;
    const timeout = setTimeout(() => setStatus("idle"), 3000);
    return () => clearTimeout(timeout);
  }, [status]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code.current?.textContent ?? "");
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="docs-code-block">
      <button type="button" className="docs-copy-code" aria-label="Copy code" onClick={copy}>
        {status === "copied" ? "Copied" : "Copy"}
      </button>
      <pre {...props} ref={code}>{children}</pre>
      <span className="docs-copy-status" role="status">
        {status === "copied" ? "Code copied." : status === "error" ? "Could not copy. Select the code and copy it manually." : ""}
      </span>
    </div>
  );
}
