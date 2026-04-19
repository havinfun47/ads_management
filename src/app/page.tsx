import Link from "next/link";
import { Logo } from "@/components/logo";
import { LinkButton } from "@/components/ui/button";
import { Badge, StatusDot } from "@/components/ui/badge";

export default function Landing() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <ProductPreview />
        <Pillars />
        <HowItWorks />
        <Trust />
        <CTA />
      </main>
      <SiteFooter />
    </>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-cream/80 border-b border-line/60">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Logo size="md" />
        <nav className="hidden md:flex items-center gap-8 text-sm text-ink-muted">
          <a href="#product" className="hover:text-ink transition-colors">Product</a>
          <a href="#rules" className="hover:text-ink transition-colors">Rules</a>
          <a href="#trust" className="hover:text-ink transition-colors">Trust</a>
          <a href="#how" className="hover:text-ink transition-colors">How it works</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="text-sm text-ink-muted hover:text-ink transition-colors px-3">
            Sign in
          </Link>
          <LinkButton href="/login" size="sm">Get started</LinkButton>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="max-w-3xl">
          <Badge tone="forest">
            <StatusDot /> Boutique growth partner, now as software
          </Badge>
          <h1 className="mt-6 font-display font-bold tracking-tight text-[44px] leading-[1.05] md:text-[68px] md:leading-[1.02]">
            Meta ads that manage{" "}
            <span className="italic font-semibold text-forest">themselves</span>
            <br />
            — the way <span className="underline decoration-amber decoration-[6px] underline-offset-[6px]">you</span> would.
          </h1>
          <p className="mt-7 text-lg md:text-xl text-ink-muted max-w-2xl leading-relaxed">
            Codify your ad SOPs once. Scale Scientist watches every campaign 24/7, pausing
            losers, protecting spend, and keeping winners in the air — without you refreshing Ads Manager at midnight.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <LinkButton href="/login" size="lg">
              Connect your ad account
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </LinkButton>
            <LinkButton href="#product" variant="secondary" size="lg">
              See it in action
            </LinkButton>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink-muted">
            <span className="inline-flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              Direct Meta Marketing API
            </span>
            <span className="inline-flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              Read-only by default
            </span>
            <span className="inline-flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              Every action logged
            </span>
          </div>
        </div>
      </div>
      <HeroBackdrop />
    </section>
  );
}

function HeroBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none">
      <div className="absolute -top-40 -right-40 size-[600px] rounded-full bg-forest/10 blur-3xl" />
      <div className="absolute top-20 -left-20 size-[400px] rounded-full bg-amber/20 blur-3xl" />
    </div>
  );
}

function ProductPreview() {
  return (
    <section id="product" className="mx-auto max-w-6xl px-6 pb-24">
      <div className="rounded-[20px] border border-line bg-surface p-3 shadow-[0_30px_80px_-20px_rgba(28,28,26,0.25)]">
        <MockDashboard />
      </div>
    </section>
  );
}

function MockDashboard() {
  return (
    <div className="rounded-[14px] bg-cream border border-line overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-line bg-surface/60">
        <span className="size-2.5 rounded-full bg-line" />
        <span className="size-2.5 rounded-full bg-line" />
        <span className="size-2.5 rounded-full bg-line" />
        <div className="ml-4 text-xs text-ink-muted font-mono">app.scalescientist.com/dashboard</div>
      </div>
      <div className="grid grid-cols-12 min-h-[420px]">
        <div className="col-span-3 border-r border-line p-4 hidden md:block bg-surface/40">
          <div className="text-xs font-medium text-ink-subtle uppercase tracking-wider mb-3">Workspace</div>
          {["Overview", "Ad accounts", "Campaigns", "Rules", "Audit log"].map((label, i) => (
            <div key={label} className={`px-3 py-2 rounded-md text-sm ${i === 0 ? "bg-ink text-cream" : "text-ink-muted"}`}>
              {label}
            </div>
          ))}
        </div>
        <div className="col-span-12 md:col-span-9 p-6">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <div className="text-xs text-ink-muted">Last 7 days</div>
              <h4 className="font-display font-semibold text-lg mt-0.5">Campaign health</h4>
            </div>
            <Badge tone="forest"><StatusDot /> 12 rules active</Badge>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <Stat label="Spend saved" value="$4,820" delta="+18%" />
            <Stat label="Ads paused" value="47" delta="auto" tone="amber" />
            <Stat label="ROAS lift" value="1.9×" delta="+0.4" />
          </div>
          <div className="space-y-2">
            <RuleRow name="Pause if CPA > 2× target for 48h" pill="Active" tone="forest" count={3} />
            <RuleRow name="Shift budget to top 20% of ad sets daily" pill="Active" tone="forest" count={1} />
            <RuleRow name="Kill ad if frequency > 4.5" pill="Triggered" tone="amber" count={2} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, delta, tone = "forest" }: { label: string; value: string; delta: string; tone?: "forest" | "amber" }) {
  return (
    <div className="rounded-lg border border-line bg-surface px-4 py-3.5">
      <div className="text-xs text-ink-muted">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="font-display font-bold text-xl text-ink">{value}</span>
        <span className={`text-xs font-medium ${tone === "amber" ? "text-amber-ink" : "text-forest"}`}>{delta}</span>
      </div>
    </div>
  );
}

function RuleRow({ name, pill, tone, count }: { name: string; pill: string; tone: "forest" | "amber"; count: number }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-surface border border-line">
      <div className="flex items-center gap-3 min-w-0">
        <span className="font-mono text-[10px] text-ink-subtle">R{String(count).padStart(2, "0")}</span>
        <span className="text-sm truncate">{name}</span>
      </div>
      <Badge tone={tone}>{pill}</Badge>
    </div>
  );
}

function Pillars() {
  const items = [
    {
      title: "SOPs you can actually trust",
      body:
        "Write the rules the way your best media buyer would. We enforce them the moment conditions trigger — no more 'we'll do it Monday.'",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-6"><path d="M9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
      ),
    },
    {
      title: "24/7 budget protection",
      body:
        "CPA drifts past target at 2am? Frequency spikes on a Sunday? Scale Scientist is already pausing — you wake up to the fix, not the problem.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-6"><path d="M12 2v10l4 4" /><circle cx="12" cy="12" r="10" /></svg>
      ),
    },
    {
      title: "Every action, on the record",
      body:
        "Full audit log of what fired, why, and what changed — reviewable, reversible, and exportable for your agency clients or your own peace of mind.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-6"><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" /><path d="M9 13h6M9 17h4" /></svg>
      ),
    },
  ];
  return (
    <section id="rules" className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-2xl mb-14">
        <p className="text-sm font-medium text-forest uppercase tracking-wider">What you get</p>
        <h2 className="mt-3 font-display font-bold text-4xl md:text-5xl tracking-tight">
          A senior media buyer, <span className="italic text-forest">always on.</span>
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {items.map((it) => (
          <div key={it.title} className="rounded-lg border border-line bg-surface p-6">
            <div className="size-11 rounded-[10px] bg-forest-soft text-forest grid place-items-center">{it.icon}</div>
            <h3 className="mt-5 font-display font-semibold text-lg">{it.title}</h3>
            <p className="mt-2 text-ink-muted leading-relaxed text-[15px]">{it.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", t: "Connect your ad account", d: "One-click Facebook Login. Choose which ad accounts and pages to manage — you stay in control." },
    { n: "02", t: "Codify your SOPs", d: "Start from our battle-tested rule library or write your own. Simulate against real data before activating." },
    { n: "03", t: "Monitor, review, sleep", d: "We watch continuously, act within your guardrails, and send a morning briefing of everything that happened overnight." },
  ];
  return (
    <section id="how" className="border-t border-line bg-surface/50">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-medium text-forest uppercase tracking-wider">How it works</p>
          <h2 className="mt-3 font-display font-bold text-4xl md:text-5xl tracking-tight">
            Set up in an afternoon. Protect spend the next morning.
          </h2>
        </div>
        <ol className="grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <li key={s.n} className="relative rounded-lg border border-line bg-cream p-7">
              <div className="font-mono text-xs text-ink-subtle">{s.n}</div>
              <h3 className="mt-4 font-display font-semibold text-xl">{s.t}</h3>
              <p className="mt-2 text-ink-muted leading-relaxed text-[15px]">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Trust() {
  return (
    <section id="trust" className="mx-auto max-w-6xl px-6 py-24">
      <div className="rounded-[20px] bg-ink text-cream p-10 md:p-14 grain overflow-hidden relative">
        <div className="max-w-2xl">
          <Badge tone="amber">Built for trust</Badge>
          <h2 className="mt-5 font-display font-bold text-4xl md:text-5xl tracking-tight">
            Your data, your ad account, your rules.
          </h2>
          <p className="mt-5 text-cream/75 leading-relaxed text-lg">
            We never store your credentials. Access is scoped to the permissions you grant and can be revoked in one click.
            Every automated action is logged, reversible for 30 days, and kept private to your team.
          </p>
          <ul className="mt-8 grid sm:grid-cols-2 gap-x-6 gap-y-3 text-[15px] text-cream/80">
            {[
              "Direct Meta Marketing API",
              "Read-only until you approve writes",
              "Per-rule kill switch",
              "Exportable audit trail",
              "GDPR + CCPA compliant",
              "SOC 2 on the roadmap",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2.5">
                <span className="size-1.5 rounded-full bg-amber" /> {f}
              </li>
            ))}
          </ul>
        </div>
        <div aria-hidden className="absolute -bottom-24 -right-24 size-[400px] rounded-full bg-forest/30 blur-3xl" />
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-28">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="font-display font-bold text-4xl md:text-5xl tracking-tight">
          Stop babysitting Ads Manager.
        </h2>
        <p className="mt-5 text-ink-muted text-lg leading-relaxed">
          Connect an account in under a minute. Your first rule can be protecting CPA while you sleep tonight.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <LinkButton href="/login" size="lg">Get started free</LinkButton>
          <LinkButton href="https://scalescientist.com" variant="secondary" size="lg">
            About Scale Scientist
          </LinkButton>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-line/60 bg-surface/40">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <Logo size="sm" />
          <p className="mt-3 text-xs text-ink-muted max-w-sm">
            © {new Date().getFullYear()} Scale Scientist. Meta is a trademark of Meta Platforms, Inc. Scale Scientist is an independent product and not affiliated with Meta.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-muted">
          <a href="https://scalescientist.com/privacy" className="hover:text-ink">Privacy</a>
          <a href="https://scalescientist.com" className="hover:text-ink">Parent site</a>
          <Link href="/login" className="hover:text-ink">Sign in</Link>
        </div>
      </div>
    </footer>
  );
}
