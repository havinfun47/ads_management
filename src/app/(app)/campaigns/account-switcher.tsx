"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { MetaAdAccount } from "@/lib/meta";

export function AccountSwitcher({
  accounts,
  selectedId,
}: {
  accounts: MetaAdAccount[];
  selectedId?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className="flex gap-2 items-center">
      <label htmlFor="account" className="text-xs text-ink-muted">
        Account
      </label>
      <select
        id="account"
        defaultValue={selectedId}
        className="text-sm border border-line rounded-md px-2 py-1.5 bg-surface"
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("account", e.target.value);
          router.push(`/campaigns?${params.toString()}`);
        }}
      >
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name} · {a.id}
          </option>
        ))}
      </select>
    </div>
  );
}
