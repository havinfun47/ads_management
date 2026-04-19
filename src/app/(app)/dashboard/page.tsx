import { AppTopbar } from "@/components/app-topbar";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, StatusDot } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <>
      <AppTopbar
        title="Overview"
        subtitle="Grady's workspace · 1 connected account"
        action={<LinkButton href="/rules" size="sm" variant="secondary">+ New rule</LinkButton>}
      />
      <main className="flex-1 px-8 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <section className="grid md:grid-cols-4 gap-4">
            <Metric label="Ad accounts" value="1" hint="Test account" />
            <Metric label="Active campaigns" value="3" hint="of 4 visible" />
            <Metric label="Rules enabled" value="0" hint="Add your first" tone="amber" />
            <Metric label="Actions last 24h" value="0" hint="—" />
          </section>

          <section className="grid md:grid-cols-3 gap-5">
            <div className="md:col-span-2 space-y-5">
              <Card>
                <CardHeader
                  title="Recent activity"
                  description="Actions taken by Scale Scientist on your behalf."
                  action={<Badge tone="muted">Live</Badge>}
                />
                <CardBody>
                  <EmptyState
                    title="No activity yet"
                    body="Once you connect an ad account and enable a rule, every action will appear here — with the reason it fired and a way to revert it."
                  />
                </CardBody>
              </Card>

              <Card>
                <CardHeader
                  title="Suggested rules"
                  description="Battle-tested SOPs you can turn on in one click."
                />
                <CardBody className="space-y-2">
                  <Suggestion name="Pause if 3-day ROAS < 1.0" tag="Most popular" />
                  <Suggestion name="Stop ad if frequency > 4.5" tag="Creative fatigue" />
                  <Suggestion name="Protect target CPA: pause at 2× for 48h" tag="Spend guard" />
                  <Suggestion name="Reallocate to top 20% ad sets daily" tag="Optimizer" />
                </CardBody>
              </Card>
            </div>

            <div className="space-y-5">
              <Card tone="ink">
                <CardBody>
                  <div className="text-xs uppercase tracking-wider text-amber font-medium">Get started</div>
                  <h3 className="mt-2 font-display font-semibold text-xl">Connect a test ad account</h3>
                  <p className="mt-2 text-cream/70 text-sm leading-relaxed">
                    Your app is in testing mode. Create a Meta test ad account and connect it here to exercise API calls safely.
                  </p>
                  <div className="mt-5">
                    <LinkButton href="/accounts" size="sm" variant="secondary" className="bg-cream text-ink">
                      Connect account
                    </LinkButton>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader title="Review status" />
                <CardBody className="space-y-3 text-sm">
                  <StatusRow label="App submitted" status="pending" note="Not yet" />
                  <StatusRow label="Privacy policy" status="ok" note="scalescientist.com/privacy" />
                  <StatusRow label="Test user created" status="pending" note="Pending" />
                  <StatusRow label="API calls logged" status="pending" note="0 / 8" />
                </CardBody>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

function Metric({ label, value, hint, tone = "default" }: { label: string; value: string; hint: string; tone?: "default" | "amber" }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-5">
      <div className="text-xs text-ink-muted">{label}</div>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="font-display font-bold text-3xl tracking-tight">{value}</span>
        <span className={`text-xs ${tone === "amber" ? "text-amber-ink" : "text-ink-subtle"}`}>{hint}</span>
      </div>
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="text-center py-10">
      <div className="mx-auto size-12 rounded-full bg-cream-muted grid place-items-center">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-5 text-ink-muted">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      </div>
      <p className="mt-4 font-display font-semibold">{title}</p>
      <p className="mt-1.5 text-sm text-ink-muted max-w-sm mx-auto leading-relaxed">{body}</p>
    </div>
  );
}

function Suggestion({ name, tag }: { name: string; tag: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-line bg-cream/40 hover:bg-cream transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <span className="size-8 rounded-md bg-forest-soft text-forest grid place-items-center shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
        </span>
        <div className="min-w-0">
          <div className="text-sm font-medium truncate">{name}</div>
          <div className="text-xs text-ink-muted">{tag}</div>
        </div>
      </div>
      <Badge tone="muted">Preview</Badge>
    </div>
  );
}

function StatusRow({ label, status, note }: { label: string; status: "ok" | "pending"; note: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <StatusDot tone={status === "ok" ? "forest" : "amber"} />
        <span>{label}</span>
      </div>
      <span className="text-ink-muted text-xs">{note}</span>
    </div>
  );
}
