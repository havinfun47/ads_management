import { AppTopbar } from "@/components/app-topbar";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, StatusDot } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";

export default function AuditPage() {
  return (
    <>
      <AppTopbar
        title="Audit log"
        subtitle="Every action Scale Scientist took on your accounts."
        action={
          <div className="flex gap-2">
            <LinkButton href="#" size="sm" variant="secondary">Export CSV</LinkButton>
            <LinkButton href="#" size="sm" variant="secondary">Filters</LinkButton>
          </div>
        }
      />
      <main className="flex-1 px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardHeader
              title="Last 30 days"
              description="Actions are reversible for 30 days from the moment they were taken."
              action={<Badge tone="muted">0 entries</Badge>}
            />
            <CardBody>
              <div className="text-center py-16">
                <div className="mx-auto size-14 rounded-full bg-cream-muted grid place-items-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-6 text-ink-muted">
                    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                    <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
                  </svg>
                </div>
                <h3 className="mt-5 font-display font-semibold text-lg">Nothing to show yet</h3>
                <p className="mt-2 text-sm text-ink-muted max-w-md mx-auto leading-relaxed">
                  Once you connect an ad account and enable at least one rule, every action — pause, budget shift, creative swap — will be recorded here with a full receipt.
                </p>
                <div className="mt-6 flex justify-center gap-2">
                  <LinkButton href="/accounts" size="sm" variant="secondary">Connect account</LinkButton>
                  <LinkButton href="/rules" size="sm">Enable a rule</LinkButton>
                </div>
              </div>
            </CardBody>
          </Card>

          <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
            <LogExample
              time="—"
              title="Ad set paused"
              detail="R01 · Protect target CPA"
              tone="forest"
            />
            <LogExample
              time="—"
              title="Budget reallocated"
              detail="R03 · Reallocate to winners"
              tone="forest"
            />
            <LogExample
              time="—"
              title="Ad killed"
              detail="R02 · Kill creative fatigue"
              tone="amber"
            />
          </div>
          <p className="mt-3 text-xs text-ink-muted text-center">
            Examples of what future entries will look like.
          </p>
        </div>
      </main>
    </>
  );
}

function LogExample({ time, title, detail, tone }: { time: string; title: string; detail: string; tone: "forest" | "amber" }) {
  return (
    <div className="rounded-lg border border-dashed border-line bg-cream/40 p-4 opacity-70">
      <div className="flex items-center justify-between">
        <Badge tone={tone}><StatusDot tone={tone} /> {tone === "forest" ? "Success" : "Triggered"}</Badge>
        <span className="text-xs text-ink-subtle font-mono">{time}</span>
      </div>
      <div className="mt-3 font-medium">{title}</div>
      <div className="text-xs text-ink-muted mt-0.5">{detail}</div>
    </div>
  );
}
