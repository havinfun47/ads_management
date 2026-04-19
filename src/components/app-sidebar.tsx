"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { Icon } from "@/components/nav-icon";
import { nav } from "@/lib/nav";

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-60 shrink-0 border-r border-line bg-surface/50 flex flex-col">
      <div className="h-16 flex items-center px-5 border-b border-line">
        <Logo size="sm" />
      </div>
      <nav className="p-3 flex-1 space-y-0.5">
        {nav.map((item) => {
          const active =
            pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 h-9 rounded-md text-sm transition-colors ${
                active
                  ? "bg-ink text-cream"
                  : "text-ink-muted hover:text-ink hover:bg-ink/5"
              }`}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-line">
        <div className="rounded-lg border border-line bg-cream p-3.5">
          <div className="text-xs font-medium text-forest">Testing mode</div>
          <p className="mt-1 text-xs text-ink-muted leading-relaxed">
            App is awaiting Meta review. Connect only Test Ad Accounts while in this mode.
          </p>
        </div>
      </div>
    </aside>
  );
}
