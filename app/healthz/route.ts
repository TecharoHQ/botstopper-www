export function GET() {
  return new Response("healthy", {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
