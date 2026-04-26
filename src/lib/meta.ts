import { env } from "./env";

const BASE = `https://graph.facebook.com/${env.graphApiVersion}`;

export class MetaApiError extends Error {
  constructor(public status: number, public body: string, public path: string) {
    super(`Meta Graph API ${status} on ${path}`);
  }
}

type Params = Record<string, string | number | undefined>;

async function graph<T>(
  method: "GET" | "POST",
  path: string,
  accessToken: string,
  params?: Params
): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("access_token", accessToken);

  const init: RequestInit = { method, cache: "no-store" };
  if (method === "GET" && params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }
  } else if (method === "POST" && params) {
    const body = new URLSearchParams();
    body.set("access_token", accessToken);
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) body.set(k, String(v));
    }
    init.body = body;
    url.search = "";
  }

  const res = await fetch(url, init);
  if (!res.ok) {
    const text = await res.text();
    throw new MetaApiError(res.status, text, path);
  }
  return res.json() as Promise<T>;
}

export type MetaUser = { id: string; name: string; email?: string };

export type MetaBusiness = { id: string; name: string };

export type MetaAdAccount = {
  id: string;            // "act_123..."
  account_id: string;    // "123..."
  name: string;
  currency: string;
  account_status: number;
  amount_spent?: string; // smallest currency unit (cents)
  business?: { id: string; name: string };
};

export type MetaInsightAction = { action_type: string; value: string };
export type MetaInsightRoas = { action_type?: string; value: string };
export type MetaCampaignInsights = {
  spend?: string;
  cpm?: string;
  cpp?: string;
  impressions?: string;
  actions?: MetaInsightAction[];
  purchase_roas?: MetaInsightRoas[];
};

export type MetaCampaign = {
  id: string;
  name: string;
  objective: string;
  status: "ACTIVE" | "PAUSED" | "DELETED" | "ARCHIVED" | string;
  effective_status?: string;
  daily_budget?: string;
  lifetime_budget?: string;
  insights?: { data?: MetaCampaignInsights[] };
};

export type MetaPage = { id: string; name: string; category?: string; access_token?: string };

export async function getMe(accessToken: string): Promise<MetaUser> {
  return graph<MetaUser>("GET", "/me", accessToken, { fields: "id,name,email" });
}

export async function listAdAccounts(accessToken: string): Promise<MetaAdAccount[]> {
  const res = await graph<{ data?: MetaAdAccount[] }>("GET", "/me/adaccounts", accessToken, {
    fields: "id,account_id,name,currency,account_status,amount_spent,business{id,name}",
    limit: 100,
  });
  return res.data ?? [];
}

export async function listBusinesses(accessToken: string): Promise<MetaBusiness[]> {
  const res = await graph<{ data?: MetaBusiness[] }>("GET", "/me/businesses", accessToken, {
    fields: "id,name",
    limit: 50,
  });
  return res.data ?? [];
}

export async function listPages(accessToken: string): Promise<MetaPage[]> {
  const res = await graph<{ data?: MetaPage[] }>("GET", "/me/accounts", accessToken, {
    fields: "id,name,category",
    limit: 100,
  });
  return res.data ?? [];
}

export async function listCampaigns(
  accessToken: string,
  adAccountId: string
): Promise<MetaCampaign[]> {
  const res = await graph<{ data?: MetaCampaign[] }>(
    "GET",
    `/${adAccountId}/campaigns`,
    accessToken,
    {
      fields:
        "id,name,objective,status,effective_status,daily_budget,lifetime_budget,insights.date_preset(last_7d){spend,cpm,impressions,actions,purchase_roas}",
      limit: 100,
    }
  );
  return res.data ?? [];
}

export async function setCampaignStatus(
  accessToken: string,
  campaignId: string,
  status: "ACTIVE" | "PAUSED"
): Promise<{ success: boolean }> {
  return graph<{ success: boolean }>("POST", `/${campaignId}`, accessToken, { status });
}

export async function exchangeForLongLivedToken(shortLived: string): Promise<{
  access_token: string;
  token_type?: string;
  expires_in?: number;
}> {
  const url = new URL(`${BASE}/oauth/access_token`);
  url.searchParams.set("grant_type", "fb_exchange_token");
  url.searchParams.set("client_id", env.facebookAppId);
  url.searchParams.set("client_secret", env.facebookAppSecret);
  url.searchParams.set("fb_exchange_token", shortLived);
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new MetaApiError(res.status, await res.text(), "/oauth/access_token");
  return res.json();
}

export function adAccountStatusLabel(status: number): string {
  switch (status) {
    case 1: return "Active";
    case 2: return "Disabled";
    case 3: return "Unsettled";
    case 7: return "Pending review";
    case 8: return "Pending settlement";
    case 9: return "In grace period";
    case 100: return "Pending closure";
    case 101: return "Closed";
    default: return `Status ${status}`;
  }
}

export function purchaseRoasFromInsights(insights?: MetaCampaignInsights): string | null {
  const r = insights?.purchase_roas?.[0]?.value;
  if (!r) return null;
  return Number(r).toFixed(2);
}

export function purchasesFromInsights(insights?: MetaCampaignInsights): number {
  const purchases = insights?.actions?.find(
    (a) => a.action_type === "purchase" || a.action_type === "offsite_conversion.fb_pixel_purchase"
  );
  return purchases ? Number(purchases.value) : 0;
}

export function cpaFromInsights(insights?: MetaCampaignInsights): string | null {
  const spend = Number(insights?.spend ?? 0);
  const purchases = purchasesFromInsights(insights);
  if (!spend || !purchases) return null;
  return (spend / purchases).toFixed(2);
}
