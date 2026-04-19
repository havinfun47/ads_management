import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-cream hover:bg-forest-deep active:scale-[0.98] shadow-[0_1px_0_rgba(255,255,255,0.08)_inset,0_2px_6px_rgba(28,28,26,0.15)]",
  secondary:
    "bg-cream text-ink border border-line hover:border-ink/40 hover:bg-surface",
  ghost: "text-ink hover:bg-ink/5",
  danger: "bg-ink text-cream hover:bg-[#7a1d1d]",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3.5 text-sm",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

type ButtonProps = CommonProps & Omit<ComponentProps<"button">, keyof CommonProps>;
type LinkishProps = CommonProps & { href: string } & Omit<ComponentProps<typeof Link>, keyof CommonProps | "href">;

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({
  variant = "primary",
  size = "md",
  className = "",
  children,
  href,
  ...props
}: LinkishProps) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </Link>
  );
}
