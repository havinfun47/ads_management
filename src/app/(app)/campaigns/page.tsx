import { redirect } from "next/navigation";
import { AppTopbar } from "@/components/app-topbar";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, StatusDot } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { getAccessToken } from "@/lib/session";
import {
  cpaFromInsights,
  listAdAccounts,
  listCampaigns,
  MetaAdAccount,
  MetaApiError,
  MetaCampaign,
  purchaseRoasFromInsights,
} from "@/lib/meta";
import { toggleCampaignStatus } from "./actions";
import { AccountSwitcher } from "./account-switcher";

type SearchParams = { account?: string };

export default async function CampaignsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const token = await getAccessToken();
  if (!token) redirect("/login");

  const { account: accountParam } = await searchParams;

  let adAccounts: MetaAdAccount[] = [];
  let loadError: string | null = null;
  try {
    adAccounts = await listAdAccounts(token);
  } catch (e) {
    if (e instanceof MetaApiError && e.status === 401) redirect("/login?error=token_invalid");
    loadError = e instanceof Error ? e.message : "Unknown Meta API error";
  }

  if (adAccounts.length === 0 && !loadError) {
    return (
      <>
        <AppTopbar title="Campaigns" subtitle="No connected ad accounts yet" />
        <main className="flex-1 px-8 py-8">
          <div className="max-w-6xl mx-auto">
            <Card>
              <CardBody>
                <div className="text-center py-10">
                  <p className="font-display font-semibold">Connect an ad account first</p>
                  <p className="mt-1.5 text-sm text-ink-muted">
                    Go to <LinkButton href="/accounts" size="sm" variant="ghost">Accounts</LinkButton> to see what your Meta user has access to.
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        </main>
      </>
    );
  }

  const selected =
    adAccounts.find((a) => a.id === accountParam) ?? adAccounts[0];

  let campaigns: MetaCampaign[] = [];
  if (selected) {
    try {
      campaigns = await listCampaigns(token, selected.id);
    } catch (e) {
      if (e instanceof MetaApiError && e.status === 401) redirect("/login?error=token_invalid");
      loadError = e instanceof Error ? e.message : "Unknown Meta API error";
    }
  }

  return (
    <>
      <AppTopbar
        title="Campaigns"
        subtitle={selected ? `${selected.name} · ${selected.id}` : "—"}
        action={
          adAccounts.length > 1 ? (
            <AccountSwitcher accounts={adAccounts} selectedId={selected?.id} />
          ) : null
        }
      />
      <main className="flex-1 px-8 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {loadError && (
            <Card tone="amber">
              <CardBody>
                <h3 className="font-display font-semibold text-amber-ink">Couldn&rsquo;t load campaigns</h3>
                <p className="mt-1 text-sm text-amber-ink/80 leading-relaxed">{loadError}</p>
              </CardBody>
            </Card>
          )}

          <Card>
            <CardHeader
              title="All campaigns"
              description="Pulled from Meta Marketing API · 7-day insights"
              action={<Badge tone="forest"><StatusDot /> Synced</Badge>}
            />
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left">
                  <tr className="text-xs uppercase tracking-wider text-ink-subtle border-b border-line">
                    <th className="px-5 py-3 font-medium">Campaign</th>
                    <th className="px-5 py-3 font-medium">Objective</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium text-right">Spend (7d)</th>
                    <th className="px-5 py-3 font-medium text-right">CPA</th>
                    <th className="px-5 py-3 font-medium text-right">ROAS</th>
                    <th className="px-5 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-10 text-center text-ink-muted">
                        No campaigns in this ad account.
                      </td>
                    </tr>
                  ) : (
                    campaigns.map((c) => <CampaignRow key={c.id} campaign={c} />)
                  )}
                </tbody>
              </table>
            </div>
            <CardBody className="border-t border-line text-xs text-ink-muted flex justify-between">
              <span>{campaigns.length} of {campaigns.length} campaigns</span>
              <span className="font-mono">{selected?.id}</span>
            </CardBody>
          </Card>
        </div>
      </main>
    </>
  );
}

function CampaignRow({ campaign }: { campaign: MetaCampaign }) {
  const insights = campaign.insights?.data?.[0];
  const spend = insights?.spend ? `$${Number(insights.spend).toFixed(2)}` : "—";
  const cpa = cpaFromInsights(insights);
  const roas = purchaseRoasFromInsights(insights);
  const isActive = campaign.status === "ACTIVE";

  return (
    <tr className="border-b border-line/60 last:border-0 hover:bg-cream/50">
      <td className="px-5 py-4">
        <div className="font-medium truncate max-w-[320px]">{campaign.name}</div>
        <div className="text-[11px] font-mono text-ink-subtle mt-0.5">{campaign.id}</div>
      </td>
      <td className="px-5 py-4 text-ink-muted">{campaign.objective}</td>
      <td className="px-5 py-4">
        {isActive ? (
          <Badge tone="forest"><StatusDot /> Active</Badge>
        ) : (
          <Badge tone="muted"><StatusDot tone="muted" /> {campaign.status}</Badge>
        )}
      </td>
      <td className="px-5 py-4 text-right font-display">{spend}</td>
      <td className="px-5 py-4 text-right text-ink-muted">{cpa ? `$${cpa}` : "—"}</td>
      <td className="px-5 py-4 text-right text-ink-muted">{roas ?? "—"}</td>
      <td className="px-5 py-4 text-right">
        <form action={toggleCampaignStatus} className="inline-flex">
          <input type="hidden" name="campaignId" value={campaign.id} />
          <input type="hidden" name="currentStatus" value={campaign.status} />
          <button
            type="submit"
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              isActive
                ? "bg-cream-muted hover:bg-cream-muted/70 text-ink"
                : "bg-forest text-cream hover:bg-forest/90"
            }`}
          >
            {isActive ? "Pause" : "Activate"}
          </button>
        </form>
      </td>
    </tr>
  );
}

