import { buildLlmsIndex } from "@/lib/llms";

export function GET() {
  return new Response(buildLlmsIndex(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
