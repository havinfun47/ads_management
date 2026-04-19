import { AppTopbar } from "@/components/app-topbar";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Badge, StatusDot } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";

export default function AccountsPage() {
  return (
    <>
      <AppTopbar
        title="Ad accounts"
        subtitle="Connect the Meta ad accounts you want Scale Scientist to manage."
        action={<LinkButton href="/api/auth/facebook" size="sm">+ Connect account</LinkButton>}
      />
      <main className="flex-1 px-8 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <Card>
            <CardHeader
              title="Connected accounts"
              description="Scoped to the ad accounts you explicitly granted access to during Facebook Login."
            />
            <CardBody>
              <div className="divide-y divide-line -my-3">
                <AccountRow
                  name="Scale Scientist · Test Account"
                  id="act_1234567890"
                  status="testing"
                  currency="USD"
                  spend="$0.00"
                />
              </div>
            </CardBody>
          </Card>

          <Card tone="amber">
            <CardBody className="flex items-start gap-4">
              <div className="size-10 rounded-md bg-amber/20 text-amber-ink grid place-items-center shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5"><path d="M12 2 2 22h20z" /><path d="M12 9v5M12 18h.01" /></svg>
              </div>
              <div>
                <h3 className="font-display font-semibold text-amber-ink">Use Test Ad Accounts only while in review</h3>
                <p className="mt-1 text-sm text-amber-ink/80 leading-relaxed">
                  Until your Meta App Review is approved, connect only Test Ad Accounts. Connecting a real account before approval risks account flags.
                </p>
                <a href="https://developers.facebook.com/docs/marketing-api/overview#test-ad-accounts" className="inline-block mt-3 text-xs font-medium text-amber-ink underline">
                  How to create a Test Ad Account →
                </a>
              </div>
            </CardBody>
          </Card>
        </div>
      </main>
    </>
  );
}

function AccountRow({ name, id, status, currency, spend }: { name: string; id: string; status: "testing" | "live"; currency: string; spend: string }) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-4 min-w-0">
        <div className="size-10 rounded-lg bg-forest-soft text-forest grid place-items-center font-display font-bold">
          SS
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{name}</span>
            {status === "testing" ? (
              <Badge tone="amber"><StatusDot tone="amber" /> Test</Badge>
            ) : (
              <Badge tone="forest"><StatusDot /> Live</Badge>
            )}
          </div>
          <div className="mt-0.5 text-xs text-ink-muted font-mono">{id} · {currency}</div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right hidden md:block">
          <div className="text-xs text-ink-muted">7-day spend</div>
          <div className="font-display font-semibold">{spend}</div>
        </div>
        <LinkButton href="/campaigns" size="sm" variant="secondary">View campaigns</LinkButton>
      </div>
    </div>
  );
}
