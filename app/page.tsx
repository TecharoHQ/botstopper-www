import Image from "next/image";
import Link from "next/link";

const features = [
  {
    number: "01",
    title: "A proven open source foundation",
    description:
      "Built by the same team behind Anubis, BotStopper brings its practical approach to automated traffic into a product designed for organizations.",
    icon: "↗",
  },
  {
    number: "02",
    title: "Your brand, at the front door",
    description:
      "Start with a corporate-friendly default experience, then tailor the challenge and presentation to match your organization.",
    icon: "◇",
  },
  {
    number: "03",
    title: "Detect headless browsers",
    description:
      "Identify browser automation signals and apply friction where it helps protect your site and its resources.",
    icon: "⌘",
  },
  {
    number: "04",
    title: "A hybrid challenge architecture",
    description:
      "Combine signals and challenges to distinguish useful visitors from unwanted automated traffic with a flexible flow.",
    icon: "⤢",
  },
];

function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link className={`brand${inverse ? " brand-inverse" : ""}`} href="/" aria-label="BotStopper from Techaro home">
      <Image src="/botstopper-mark.svg" alt="" width={44} height={44} priority />
      <span className="brand-copy">
        <strong>BotStopper</strong>
        <small>from Techaro</small>
      </span>
    </Link>
  );
}

function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#platform">Platform</a>
          <a href="#features">Features</a>
          <Link href="/docs">Documentation</Link>
        </nav>
        <a className="header-cta" href="http://github.com/sponsors/Xe" target="_blank" rel="noreferrer">
          Support the project <span aria-hidden="true">↗</span>
        </a>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="hero" id="platform">
          <div className="hero-glow" aria-hidden="true" />
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow"><span className="eyebrow-line" /> BOTSTOPPER FROM TECHARO</p>
              <h1>Good traffic gets through.<br /><em>Bad bots don&apos;t.</em></h1>
              <p className="hero-lede">
                A smarter front door for the modern web. BotStopper helps protect your site from scraping and automated abuse while keeping the experience straightforward for people.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#features">Explore the platform <span aria-hidden="true">→</span></a>
                <Link className="button button-quiet" href="/docs">Read the docs <span aria-hidden="true">↗</span></Link>
              </div>
              <div className="hero-proof"><span className="proof-mark">✳</span> Built by the creators of Anubis</div>
            </div>

            <div className="hero-art" aria-label="Animated layered shield featuring the BotStopper triangle mark">
              <div className="art-orbit orbit-one" aria-hidden="true" />
              <div className="art-orbit orbit-two" aria-hidden="true" />
              <div className="art-shadow" aria-hidden="true" />
              <div className="shield-scene" aria-hidden="true">
                <div className="shield shield-back"><span /></div>
                <div className="shield shield-front">
                  <div className="shield-glint" />
                  <Image src="/botstopper-mark.svg" alt="" width={190} height={190} priority />
                </div>
              </div>
              <div className="art-caption"><span className="caption-dot" /> CHALLENGE ACTIVE <span className="caption-rule" /> PROTECTION ONLINE</div>
              <div className="art-tag tag-top"><span>01</span> HUMAN TRAFFIC</div>
              <div className="art-tag tag-bottom"><span>02</span> AUTOMATED ABUSE</div>
            </div>
          </div>
          <div className="hero-bottom container">
            <span>BUILT FOR THE OPEN WEB</span>
            <div className="bottom-rule" />
            <span>OPEN SOURCE ROOTS. ORGANIZATION READY.</span>
          </div>
        </section>

        <section className="intro-section section-pad">
          <div className="container intro-grid">
            <p className="eyebrow">THE BOTSTOPPER APPROACH</p>
            <div>
              <h2>Keep your front door open.<br /><span>Keep the bots guessing.</span></h2>
              <p className="section-lede">BotStopper brings the practical, open source approach of Anubis to teams that need a polished way to manage scraping and automated traffic.</p>
            </div>
          </div>
        </section>

        <section className="feature-section section-pad" id="features">
          <div className="container">
            <div className="section-heading">
              <div><p className="eyebrow">A BETTER WAY THROUGH</p><h2>Protection with a human side.</h2></div>
              <p>Useful defenses. A considered visitor experience. One product that feels at home in your organization.</p>
            </div>
            <div className="feature-grid">
              {features.map((feature) => (
                <article className="feature-card" key={feature.number}>
                  <div className="feature-top"><span>{feature.number} / 04</span><span className="feature-icon" aria-hidden="true">{feature.icon}</span></div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <span className="feature-arrow" aria-hidden="true">↗</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="brand-section section-pad">
          <div className="container brand-panel">
            <div className="brand-panel-copy">
              <p className="eyebrow">MADE TO FIT YOUR ORGANIZATION</p>
              <h2>Enterprise ready.<br /><em>Still unmistakably yours.</em></h2>
              <p>BotStopper starts with calm, corporate-friendly branding. Shape the challenge flow and visual identity to fit the experience you want visitors to have.</p>
              <Link className="text-link" href="/docs">Explore the documentation <span aria-hidden="true">→</span></Link>
            </div>
            <div className="brand-preview" aria-label="BotStopper challenge page preview">
              <div className="preview-window"><span /><span /><span /><small>YOUR SITE / CHECKING REQUEST</small></div>
              <div className="preview-card">
                <Image src="/botstopper-mark.svg" alt="" width={54} height={54} />
                <p className="preview-kicker">BOTSTOPPER FROM TECHARO</p>
                <strong>One moment, please.</strong>
                <span className="preview-loader"><i /></span>
                <small>Checking your browser before continuing.</small>
              </div>
              <div className="preview-stamp">YOUR BRAND<br /><b>YOUR RULES</b></div>
            </div>
          </div>
        </section>

        <section className="support-section section-pad">
          <div className="container support-panel">
            <div className="support-star" aria-hidden="true">✳</div>
            <p className="eyebrow">GOOD THINGS GROW WITH SUPPORT</p>
            <h2>Help keep the open web<br />a little more human.</h2>
            <p>BotStopper is made by the people behind Anubis. Your support helps fund the work.</p>
            <a className="button button-light" href="http://github.com/sponsors/Xe" target="_blank" rel="noreferrer">Sponsor BotStopper <span aria-hidden="true">↗</span></a>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="container footer-inner"><Brand inverse /><p>Protecting the places people come to on the internet.</p><div className="footer-links"><Link href="/docs">Documentation</Link><a href="http://github.com/sponsors/Xe" target="_blank" rel="noreferrer">GitHub Sponsors ↗</a></div><small>© Techaro. BotStopper from Techaro.</small></div>
      </footer>
    </>
  );
}
