import type { ReactNode } from "react";

type Tone = "default" | "forest" | "amber" | "muted" | "danger";

const tones: Record<Tone, string> = {
  default: "bg-cream-muted text-ink border-line",
  forest: "bg-forest-soft text-forest border-forest/20",
  amber: "bg-amber-soft text-amber-ink border-amber/40",
  muted: "bg-cream-muted text-ink-muted border-line",
  danger: "bg-[#fdecec] text-[#7a1d1d] border-[#f4c5c5]",
};

export function Badge({ children, tone = "default" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function StatusDot({ tone = "forest" }: { tone?: "forest" | "amber" | "muted" | "danger" }) {
  const colors = {
    forest: "bg-forest",
    amber: "bg-amber",
    muted: "bg-ink-subtle",
    danger: "bg-[#c44]",
  };
  return <span className={`size-1.5 rounded-full ${colors[tone]} inline-block`} />;
}
