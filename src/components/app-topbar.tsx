import Link from "next/link";

export function AppTopbar({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <header className="h-16 border-b border-line bg-cream/80 backdrop-blur-md sticky top-0 z-30">
      <div className="h-full px-8 flex items-center justify-between gap-6">
        <div className="min-w-0">
          <h1 className="font-display font-semibold text-lg tracking-tight truncate">{title}</h1>
          {subtitle ? (
            <p className="text-xs text-ink-muted truncate">{subtitle}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          {action}
          <Link
            href="/login"
            className="size-9 grid place-items-center rounded-full bg-forest text-cream font-display font-bold text-sm hover:bg-forest-deep transition-colors"
            aria-label="Account"
          >
            G
          </Link>
        </div>
      </div>
    </header>
  );
}
