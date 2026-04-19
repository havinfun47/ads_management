import { AppTopbar } from "@/components/app-topbar";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, StatusDot } from "@/components/ui/badge";
import { LinkButton, Button } from "@/components/ui/button";

type Campaign = {
  id: string;
  name: string;
  objective: string;
  status: "active" | "paused";
  spend: string;
  cpa: string;
  roas: string;
};

const demo: Campaign[] = [
  { id: "23851234567890001", name: "Prospecting — Broad | Sept launch", objective: "OUTCOME_SALES", status: "active", spend: "$0.00", cpa: "—", roas: "—" },
  { id: "23851234567890002", name: "Retargeting — ATC 7d", objective: "OUTCOME_SALES", status: "active", spend: "$0.00", cpa: "—", roas: "—" },
  { id: "23851234567890003", name: "Traffic — Blog funnel", objective: "OUTCOME_TRAFFIC", status: "paused", spend: "$0.00", cpa: "—", roas: "—" },
];

export default function CampaignsPage() {
  return (
    <>
      <AppTopbar
        title="Campaigns"
        subtitle="Scale Scientist · Test Account"
        action={
          <div className="flex gap-2">
            <LinkButton href="#" size="sm" variant="secondary">Filters</LinkButton>
            <LinkButton href="#" size="sm">+ New campaign</LinkButton>
          </div>
        }
      />
      <main className="flex-1 px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardHeader
              title="All campaigns"
              description="Pulled from Meta Marketing API · cached 60s"
              action={<Badge tone="forest"><StatusDot /> Synced</Badge>}
            />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left">
                  <tr className="text-xs uppercase tracking-wider text-ink-subtle border-b border-line">
                    <th className="px-5 py-3 font-medium">Campaign</th>
                    <th className="px-5 py-3 font-medium">Objective</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium text-right">Spend</th>
                    <th className="px-5 py-3 font-medium text-right">CPA</th>
                    <th className="px-5 py-3 font-medium text-right">ROAS</th>
                    <th className="px-5 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {demo.map((c) => (
                    <tr key={c.id} className="border-b border-line/60 last:border-0 hover:bg-cream/50">
                      <td className="px-5 py-4">
                        <div className="font-medium truncate max-w-[320px]">{c.name}</div>
                        <div className="text-[11px] font-mono text-ink-subtle mt-0.5">{c.id}</div>
                      </td>
                      <td className="px-5 py-4 text-ink-muted">{c.objective}</td>
                      <td className="px-5 py-4">
                        {c.status === "active" ? (
                          <Badge tone="forest"><StatusDot /> Active</Badge>
                        ) : (
                          <Badge tone="muted"><StatusDot tone="muted" /> Paused</Badge>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right font-display">{c.spend}</td>
                      <td className="px-5 py-4 text-right text-ink-muted">{c.cpa}</td>
                      <td className="px-5 py-4 text-right text-ink-muted">{c.roas}</td>
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex gap-2">
                          {c.status === "active" ? (
                            <Button size="sm" variant="ghost">Pause</Button>
                          ) : (
                            <Button size="sm" variant="secondary">Activate</Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <CardBody className="border-t border-line text-xs text-ink-muted flex justify-between">
              <span>3 of 3 campaigns</span>
              <span className="font-mono">act_1234567890</span>
            </CardBody>
          </Card>
        </div>
      </main>
    </>
  );
}
