import Link from "next/link";
import { Suspense } from "react";
import { getDoc, getDocParams, getDocs, Markdown } from "@/lib/docs";

export function generateStaticParams() {
  return getDocParams();
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
  const currentIndex = docs.findIndex((candidate) => candidate.slug === doc.slug);
  const previous = docs[currentIndex - 1];
  const next = docs[currentIndex + 1];

  return (
    <>
      <div className="docs-breadcrumb"><Link href="/docs">Documentation</Link><span>/</span><span>{doc.title}</span></div>
      <Markdown source={doc.content} />
      <div className="docs-article-footer">
        {previous ? <Link href={previous.slug ? `/docs/${previous.slug}` : "/docs"}><small>PREVIOUS</small><strong>← {previous.title}</strong></Link> : <span />}
        {next ? <Link className="next-doc" href={next.slug ? `/docs/${next.slug}` : "/docs"}><small>NEXT</small><strong>{next.title} →</strong></Link> : <span />}
      </div>
    </>
  );
}
