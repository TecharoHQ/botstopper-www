import { buildDocsLlmsIndex } from "@/lib/llms";

export function GET() {
  return new Response(buildDocsLlmsIndex(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
