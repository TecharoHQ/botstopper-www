import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getDoc, getDocParams, getDocs } from "@/lib/docs";
import { socialImageSize } from "@/lib/social-image";

export function generateStaticParams() {
  return getDocParams();
}

export async function generateMetadata({ params }: PageProps<"/docs/[[...slug]]">): Promise<Metadata> {
  const { slug = [] } = await params;
  const doc = getDoc(slug);
  const title = `${doc.title} | BotStopper documentation`;
  const image = {
    url: `/social/docs${doc.slug ? `/${doc.slug}` : ""}`,
    ...socialImageSize,
    alt: `${doc.title} - BotStopper from Techaro`,
    type: "image/png",
  };

  return {
    title,
    alternates: {
      canonical: doc.slug ? `/docs/${doc.slug}` : "/docs",
      types: { "text/markdown": doc.slug ? `/docs/${doc.slug}.md` : "/docs.md" },
    },
    openGraph: { title, images: [image] },
    twitter: { card: "summary_large_image", title, images: [image] },
  };
}

export default function DocsPage({ params }: PageProps<"/docs/[[...slug]]">) {
  return (
    <article className="docs-article">
      <div className="docs-article-top"><span className="eyebrow">BOTSTOPPER FROM TECHARO</span><span className="docs-updated">PRODUCT DOCUMENTATION</span></div>
      <Suspense fallback={<DocsPlaceholder />}>
        <DocsContent params={params} />
      </Suspense>
    </article>
  );
}

function DocsPlaceholder() {
  return (
    <div role="status" aria-live="polite">
      <div className="docs-breadcrumb"><Link href="/docs">Documentation</Link><span>/</span><span>Loading document</span></div>
      <div className="markdown-content"><h1>Loading documentation...</h1><p>The document will appear here shortly.</p></div>
    </div>
  );
}

async function DocsContent({ params }: Pick<PageProps<"/docs/[[...slug]]">, "params">) {
  const { slug = [] } = await params;
  const doc = getDoc(slug);
  const docs = getDocs();
  const { default: Content } = await import(`@/content/docs/${doc.file}.mdx`);
  const currentIndex = docs.findIndex((candidate) => candidate.slug === doc.slug);
  const previous = docs[currentIndex - 1];
  const next = docs[currentIndex + 1];

  return (
    <>
      <div className="docs-breadcrumb"><Link href="/docs">Documentation</Link><span>/</span><span>{doc.title}</span></div>
      <div className="markdown-content"><Content /></div>
      <div className="docs-article-footer">
        {previous ? <Link href={previous.slug ? `/docs/${previous.slug}` : "/docs"}><small>PREVIOUS</small><strong>← {previous.title}</strong></Link> : <span />}
        {next ? <Link className="next-doc" href={next.slug ? `/docs/${next.slug}` : "/docs"}><small>NEXT</small><strong>{next.title} →</strong></Link> : <span />}
      </div>
    </>
  );
}
