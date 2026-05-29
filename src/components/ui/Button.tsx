import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-f1-red)] text-[var(--text)] hover:bg-[var(--color-f1-red-pressed)]",
  secondary:
    "border border-[var(--border)] bg-[var(--color-charcoal-700)] text-[var(--text)] hover:bg-[var(--color-charcoal-650)]",
  ghost: "text-[var(--text-muted)] hover:text-[var(--text)]",
};

export function Button({
  variant = "primary",
  className,
  children,
  ...rest
}: Props) {
  return (
    <button className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}
