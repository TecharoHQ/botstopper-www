import { NextResponse, type NextRequest } from "next/server";

export const config = {
  matcher: [
    // Everything except Next internals, non-markdown static assets, and the
    // metadata routes that must keep their own content types. Paths ending
    // in .md fall through so the proxy can strip the suffix.
    "/((?!_next|social|healthz|md|fonts|opengraph-image|twitter-image|.*\\.(?:png|jpe?g|gif|webp|svg|ico|css|mjs|js|map|json|woff2?|ttf|otf|xml|txt|webmanifest)$).*)",
  ],
};

function prefersMarkdown(accept: string | null): boolean {
  if (!accept?.includes("text/markdown")) return false;
  // text/markdown;q=0 means "explicitly not acceptable".
  return !/text\/markdown\s*;\s*q\s*=\s*"?0(?:\.0+)?"?/i.test(accept);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Defense in depth: the matcher regex is easy to get wrong, so guard the
  // paths that must never be rewritten.
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/social/") ||
    pathname.startsWith("/md/") ||
    pathname === "/healthz"
  ) {
    return NextResponse.next();
  }

  // Only negotiate body-bearing reads; leave POSTs, RSC requests, and
  // Server Actions alone.
  if (request.method !== "GET" && request.method !== "HEAD") {
    return NextResponse.next();
  }

  if (pathname.endsWith(".md")) {
    return NextResponse.rewrite(new URL(`/md${pathname.slice(0, -3)}`, request.url));
  }

  if (prefersMarkdown(request.headers.get("accept"))) {
    return NextResponse.rewrite(new URL(`/md${pathname === "/" ? "" : pathname}`, request.url));
  }

  return NextResponse.next();
}
