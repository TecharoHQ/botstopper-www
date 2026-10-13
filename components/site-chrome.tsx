import Image from "next/image";
import Link from "next/link";

export function Brand({ inverse = false, size = 44 }: { inverse?: boolean; size?: number }) {
  return (
    <Link className={`brand${inverse ? " brand-inverse" : ""}`} href="/" aria-label="BotStopper from Techaro home">
      <Image src="/botstopper-mark.svg" alt="" width={size} height={size} priority />
      <span className="brand-copy">
        <strong>BotStopper</strong>
        <small>from Techaro</small>
      </span>
    </Link>
  );
}

type HeaderVariant = "home" | "docs" | "page";

export function SiteHeader({ variant = "page" }: { variant?: HeaderVariant }) {
  const isDocs = variant === "docs";
  return (
    <header className={isDocs ? "docs-header" : "site-header"}>
      <div className={`container ${isDocs ? "docs-header-inner" : "header-inner"}`}>
        <Brand size={isDocs ? 40 : 44} />
        {variant === "home" ? (
          <nav className="main-nav" aria-label="Main navigation">
            <a href="#platform">Platform</a>
            <a href="#features">Features</a>
            <Link href="/docs">Documentation</Link>
          </nav>
        ) : (
          <nav className={isDocs ? undefined : "main-nav"} aria-label="Main navigation">
            <Link href="/#platform">Platform</Link>
            <Link href="/#features">Features</Link>
            <Link href="/docs" className={isDocs ? "active" : undefined}>Documentation</Link>
          </nav>
        )}
        <a className="header-cta" href="http://github.com/sponsors/Xe" target="_blank" rel="noreferrer">
          Support the project <span aria-hidden="true">↗</span>
        </a>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <Brand inverse />
        <p>Protecting the places people come to on the internet.</p>
        <div className="footer-links">
          <Link href="/docs">Documentation</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
          <a href="http://github.com/sponsors/Xe" target="_blank" rel="noreferrer">GitHub Sponsors ↗</a>
        </div>
        <small>© Techaro. BotStopper from Techaro.</small>
      </div>
    </footer>
  );
}
