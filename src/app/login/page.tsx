import Link from "next/link";
import { Logo } from "@/components/logo";
import { FacebookLoginButton } from "@/components/facebook-button";

export default function LoginPage() {
  return (
    <main className="flex-1 grid md:grid-cols-2 min-h-screen">
      <section className="flex flex-col p-8 md:p-12">
        <Logo size="md" />
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-sm mx-auto py-16">
            <h1 className="font-display font-bold text-4xl tracking-tight">
              Welcome back.
            </h1>
            <p className="mt-3 text-ink-muted leading-relaxed">
              Sign in with the Facebook account that manages your ad accounts. We only request the permissions we need, and you can revoke access any time.
            </p>

            <div className="mt-10">
              <FacebookLoginButton />
            </div>

            <div className="mt-6 flex items-start gap-2.5 rounded-lg bg-amber-soft border border-amber/40 p-3.5 text-[13px] text-amber-ink leading-relaxed">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 mt-0.5 shrink-0">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              <span>
                We request <strong>ads_read</strong>, <strong>ads_management</strong>,{" "}
                <strong>business_management</strong>, <strong>pages_show_list</strong>, and related
                permissions. No write action is taken without a rule you explicitly enable.
              </span>
            </div>

            <p className="mt-10 text-xs text-ink-muted leading-relaxed">
              By continuing, you agree to our{" "}
              <a className="underline decoration-line hover:decoration-ink" href="https://scalescientist.com/privacy">Privacy Policy</a>
              {" "}and the terms of Meta's platform. You can revoke access at any time from{" "}
              <a className="underline decoration-line hover:decoration-ink" href="https://www.facebook.com/settings?tab=business_tools">Facebook Business Integrations</a>.
            </p>
          </div>
        </div>
        <div className="text-sm text-ink-muted">
          <Link href="/" className="hover:text-ink">← Back to home</Link>
        </div>
      </section>

      <aside className="hidden md:flex flex-col justify-between bg-ink text-cream p-12 relative overflow-hidden grain">
        <div className="relative z-10">
          <span className="text-xs uppercase tracking-wider text-amber font-medium">Operator's view</span>
          <blockquote className="mt-5 font-display text-2xl leading-[1.3] tracking-tight text-cream">
            &ldquo;The week I turned on Scale Scientist's CPA guardrail, we saved more ad spend than the entire month prior.
            I stopped checking Ads Manager on Sundays.&rdquo;
          </blockquote>
          <div className="mt-6 flex items-center gap-3">
            <div className="size-10 rounded-full bg-forest grid place-items-center font-display font-bold">M</div>
            <div>
              <div className="font-medium text-sm">Maya R.</div>
              <div className="text-xs text-cream/60">Head of Growth, boutique eCom brand</div>
            </div>
          </div>
        </div>
        <div className="relative z-10 grid grid-cols-3 gap-4 pt-10 border-t border-cream/10">
          {[
            { label: "Actions logged", value: "12.4k" },
            { label: "Avg. response", value: "< 5 min" },
            { label: "Reversible", value: "30 days" },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-display text-2xl font-bold text-amber">{s.value}</div>
              <div className="text-xs text-cream/60 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
        <div aria-hidden className="absolute -top-32 -right-32 size-[500px] rounded-full bg-forest/30 blur-3xl" />
        <div aria-hidden className="absolute -bottom-40 -left-40 size-[400px] rounded-full bg-amber/10 blur-3xl" />
      </aside>
    </main>
  );
}
