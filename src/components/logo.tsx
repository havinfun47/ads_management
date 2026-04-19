import Link from "next/link";

type Size = "sm" | "md" | "lg";

const sizes: Record<Size, { wrap: string; mark: string; text: string }> = {
  sm: { wrap: "gap-2", mark: "size-6", text: "text-sm" },
  md: { wrap: "gap-2.5", mark: "size-8", text: "text-base" },
  lg: { wrap: "gap-3", mark: "size-10", text: "text-lg" },
};

export function Logo({ size = "md", href = "/" }: { size?: Size; href?: string | null }) {
  const s = sizes[size];
  const content = (
    <span className={`inline-flex items-center ${s.wrap}`}>
      <span
        aria-hidden
        className={`${s.mark} grid place-items-center rounded-[10px] bg-ink text-cream font-display font-bold`}
      >
        <svg viewBox="0 0 24 24" className="size-[55%]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 18 L10 12 L14 15 L20 6" />
          <circle cx="20" cy="6" r="1.6" fill="currentColor" stroke="none" />
        </svg>
      </span>
      <span className={`font-display font-bold tracking-tight ${s.text}`}>
        Scale <span className="text-forest">Scientist</span>
      </span>
    </span>
  );
  return href ? <Link href={href} className="inline-flex">{content}</Link> : content;
}
