import { redirect } from "next/navigation";
import { AppTopbar } from "@/components/app-topbar";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, StatusDot } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { getAccessToken } from "@/lib/session";
import {
  adAccountStatusLabel,
  listAdAccounts,
  listBusinesses,
  listPages,
  MetaAdAccount,
  MetaApiError,
  MetaBusiness,
  MetaPage,
} from "@/lib/meta";

export default async function AccountsPage() {
  const token = await getAccessToken();
  if (!token) redirect("/login");

  let adAccounts: MetaAdAccount[] = [];
  let businesses: MetaBusiness[] = [];
  let pages: MetaPage[] = [];
  let loadError: string | null = null;

  try {
    [adAccounts, businesses, pages] = await Promise.all([
      listAdAccounts(token),
      listBusinesses(token),
      listPages(token),
    ]);
  } catch (e) {
    if (e instanceof MetaApiError && e.status === 401) redirect("/login?error=token_invalid");
    loadError = e instanceof Error ? e.message : "Unknown Meta API error";
  }

  return (
    <>
      <AppTopbar
        title="Ad accounts"
        subtitle={`${adAccounts.length} connected · ${businesses.length} business portfolio${businesses.length === 1 ? "" : "s"} · ${pages.length} page${pages.length === 1 ? "" : "s"}`}
        action={<LinkButton href="/api/auth/facebook" size="sm" variant="secondary">Reconnect</LinkButton>}
      />
      <main className="flex-1 px-8 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {loadError && (
            <Card tone="amber">
              <CardBody>
                <h3 className="font-display font-semibold text-amber-ink">Couldn&rsquo;t load Meta data</h3>
                <p className="mt-1 text-sm text-amber-ink/80 leading-relaxed">{loadError}</p>
              </CardBody>
            </Card>
          )}

          <Card>
            <CardHeader
              title="Connected ad accounts"
              description="Pulled from /me/adaccounts. Scoped to accounts your Meta user has access to."
              action={<Badge tone="forest"><StatusDot /> Live</Badge>}
            />
            <CardBody>
              {adAccounts.length === 0 ? (
                <EmptyState
                  title="No ad accounts visible"
                  body="Make sure your Scale Scientist app is added to your Business Portfolio under Business Settings → Accounts → Apps."
                />
              ) : (
                <div className="divide-y divide-line -my-3">
                  {adAccounts.map((acct) => (
                    <AccountRow key={acct.id} account={acct} />
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {businesses.length > 0 && (
            <Card>
              <CardHeader
                title="Business portfolios"
                description="Pulled from /me/businesses (business_management permission)."
              />
              <CardBody>
                <div className="divide-y divide-line -my-3">
                  {businesses.map((biz) => (
                    <div key={biz.id} className="flex items-center justify-between py-3">
                      <div>
                        <div className="font-medium">{biz.name}</div>
                        <div className="text-xs font-mono text-ink-muted mt-0.5">{biz.id}</div>
                      </div>
                      <Badge tone="muted">Business Portfolio</Badge>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {pages.length > 0 && (
            <Card>
              <CardHeader
                title="Facebook Pages"
                description="Pulled from /me/accounts (pages_show_list permission)."
              />
              <CardBody>
                <div className="divide-y divide-line -my-3">
                  {pages.map((p) => (
                    <div key={p.id} className="flex items-center justify-between py-3">
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-ink-muted mt-0.5">
                          {p.category ?? "Page"} · <span className="font-mono">{p.id}</span>
                        </div>
                      </div>
                      <Badge tone="muted">Page</Badge>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </main>
    </>
  );
}

function AccountRow({ account }: { account: MetaAdAccount }) {
  const isActive = account.account_status === 1;
  const spendDollars = account.amount_spent
    ? (Number(account.amount_spent) / 100).toLocaleString("en-US", { style: "currency", currency: account.currency || "USD" })
    : "—";
  const initials = account.name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "AD";

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-4 min-w-0">
        <div className="size-10 rounded-lg bg-forest-soft text-forest grid place-items-center font-display font-bold">
          {initials}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{account.name}</span>
            {isActive ? (
              <Badge tone="forest"><StatusDot /> {adAccountStatusLabel(account.account_status)}</Badge>
            ) : (
              <Badge tone="amber"><StatusDot tone="amber" /> {adAccountStatusLabel(account.account_status)}</Badge>
            )}
          </div>
          <div className="mt-0.5 text-xs text-ink-muted font-mono">
            {account.id} · {account.currency}
            {account.business?.name ? ` · ${account.business.name}` : ""}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right hidden md:block">
          <div className="text-xs text-ink-muted">Lifetime spend</div>
          <div className="font-display font-semibold">{spendDollars}</div>
        </div>
        <LinkButton href={`/campaigns?account=${account.id}`} size="sm" variant="secondary">
          View campaigns
        </LinkButton>
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
