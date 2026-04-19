import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "ink" | "amber";
}) {
  const tones = {
    default: "bg-surface border-line",
    ink: "bg-ink text-cream border-ink",
    amber: "bg-amber-soft border-amber/40",
  };
  return (
    <div className={`rounded-lg border ${tones[tone]} ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  description,
  action,
  className = "",
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-start justify-between gap-4 p-5 border-b border-line ${className}`}>
      <div className="min-w-0">
        <h3 className="font-display font-semibold text-base tracking-tight">{title}</h3>
        {description ? (
          <p className="text-sm text-ink-muted mt-1 leading-relaxed">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function CardBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}
