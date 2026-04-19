import { AppTopbar } from "@/components/app-topbar";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, StatusDot } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";

type Rule = {
  id: string;
  name: string;
  scope: string;
  condition: string;
  action: string;
  enabled: boolean;
  triggered: number;
};

const rules: Rule[] = [
  {
    id: "R01",
    name: "Protect target CPA",
    scope: "Campaign: Prospecting — Broad",
    condition: "If 48h CPA > 2× target ($60)",
    action: "Pause ad set",
    enabled: false,
    triggered: 0,
  },
  {
    id: "R02",
    name: "Kill creative fatigue",
    scope: "Ad account: all",
    condition: "If frequency > 4.5 over 7 days",
    action: "Pause ad",
    enabled: false,
    triggered: 0,
  },
  {
    id: "R03",
    name: "Reallocate to winners",
    scope: "Campaign: Retargeting — ATC 7d",
    condition: "Daily at 09:00",
    action: "Shift 20% budget to top-ROAS ad sets",
    enabled: false,
    triggered: 0,
  },
];

export default function RulesPage() {
  return (
    <>
      <AppTopbar
        title="Rules"
        subtitle="Your SOPs, enforced automatically."
        action={<LinkButton href="#" size="sm">+ New rule</LinkButton>}
      />
      <main className="flex-1 px-8 py-8">
        <div className="max-w-6xl mx-auto grid gap-5">
          <Card tone="amber">
            <CardBody className="flex items-start gap-4">
              <div className="size-10 rounded-md bg-amber/20 text-amber-ink grid place-items-center shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
              </div>
              <div>
                <h3 className="font-display font-semibold text-amber-ink">No rules are active yet</h3>
                <p className="mt-1 text-sm text-amber-ink/80 leading-relaxed">
                  Scale Scientist won't take any action on your ad accounts until you enable a rule. Start with a suggested rule or write your own.
                </p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Your rules"
              description="Each rule runs against the ad accounts listed in its scope."
            />
            <CardBody className="space-y-2.5">
              {rules.map((r) => (
                <RuleCard key={r.id} rule={r} />
              ))}
            </CardBody>
          </Card>
        </div>
      </main>
    </>
  );
}

function RuleCard({ rule }: { rule: Rule }) {
  return (
    <div className="rounded-lg border border-line bg-cream/40 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span className="font-mono text-[10px] text-ink-subtle">{rule.id}</span>
            {rule.enabled ? (
              <Badge tone="forest"><StatusDot /> Enabled</Badge>
            ) : (
              <Badge tone="muted"><StatusDot tone="muted" /> Off</Badge>
            )}
          </div>
          <h4 className="font-display font-semibold">{rule.name}</h4>
          <p className="mt-0.5 text-xs text-ink-muted">{rule.scope}</p>
        </div>
        <button className="shrink-0 inline-flex h-9 px-4 items-center rounded-full border border-line text-sm hover:bg-ink hover:text-cream hover:border-ink transition-colors">
          {rule.enabled ? "Disable" : "Enable"}
        </button>
      </div>
      <div className="mt-4 grid md:grid-cols-2 gap-3 text-sm">
        <div className="rounded-md border border-dashed border-line bg-cream px-3 py-2.5">
          <div className="text-[10px] uppercase tracking-wider text-ink-subtle font-medium">When</div>
          <div className="mt-0.5">{rule.condition}</div>
        </div>
        <div className="rounded-md border border-dashed border-line bg-cream px-3 py-2.5">
          <div className="text-[10px] uppercase tracking-wider text-ink-subtle font-medium">Then</div>
          <div className="mt-0.5">{rule.action}</div>
        </div>
      </div>
      <div className="mt-3 text-xs text-ink-muted">Triggered {rule.triggered} times in the last 30 days</div>
    </div>
  );
}
