import Link from "next/link";

export function ChallengeMethodsCard() {
  return (
    <section className="docs-guide-card" aria-labelledby="challenge-methods-title" style={{ margin: "36px 0", position: "relative", isolation: "isolate", overflow: "hidden", padding: "clamp(32px, 6vw, 56px) 24px", border: "1px solid var(--plum)", borderRadius: "6px", background: "var(--plum-deep)", textAlign: "center", boxShadow: "0 18px 40px rgba(57, 40, 72, .15)" }}>
      <h2 id="challenge-methods-title" style={{ maxWidth: "520px", margin: "0 auto 18px", color: "var(--paper)", font: "600 clamp(30px, 4vw, 42px)/1.1 var(--font-heading), Georgia, serif", letterSpacing: "-.025em" }}>Protect your site, your way.</h2>
      <p style={{ maxWidth: "480px", margin: "0 auto", color: "var(--lavender)", fontSize: "15px", lineHeight: 1.8 }}>Explore BotStopper&apos;s challenge methods and choose the right protection for your site.</p>
      <div style={{ marginTop: "28px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "12px 20px" }}>
        <Link href="/docs/challenges" className="button button-primary" style={{ color: "white", textDecoration: "none" }}>Read More</Link>
        <Link href="/docs/configuration" className="button button-quiet" style={{ color: "var(--lavender)", textDecoration: "none" }}>Configure BotStopper <span aria-hidden="true">→</span></Link>
      </div>
      <svg viewBox="0 0 1024 1024" aria-hidden="true" style={{ position: "absolute", top: "50%", left: "50%", zIndex: -1, width: "900px", height: "900px", maxWidth: "none", transform: "translate(-50%, -20%)", maskImage: "radial-gradient(closest-side, white, transparent)", pointerEvents: "none" }}>
        <circle r={512} cx={512} cy={512} fill="url(#challenge-card-glow)" fillOpacity="0.6" />
        <defs>
          <radialGradient id="challenge-card-glow">
            <stop stopColor="#917ba3" />
            <stop offset={1} stopColor="#a8492d" />
          </radialGradient>
        </defs>
      </svg>
    </section>
  );
}
