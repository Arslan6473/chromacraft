/**
 * components/ui/StatCard.tsx
 * A metric display card used on results panels.
 * Supports trend indicators (positive/negative) and custom accent colors.
 */
"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  /** Optional explanatory sub-text */
  description?: string;
  /** Controls the color ring: "positive" | "negative" | "neutral" | "accent" */
  variant?: "positive" | "negative" | "neutral" | "accent";
  /** Delay for staggered entrance animation */
  delay?: number;
}

const variantStyles: Record<string, { ring: string; text: string; bg: string }> = {
  positive: { ring: "border-[var(--success)]/30", text: "text-[var(--success)]", bg: "bg-[var(--success)]/10" },
  negative: { ring: "border-[var(--error)]/30",   text: "text-[var(--error)]",   bg: "bg-[var(--error)]/10"   },
  neutral:  { ring: "border-[var(--border)]",       text: "text-[var(--text)]",    bg: "bg-[var(--surface-2)]"  },
  accent:   { ring: "border-[var(--accent)]/30",   text: "text-[var(--accent)]",  bg: "bg-[var(--accent)]/10"  },
};

const TrendIcon = ({ variant }: { variant: string }) => {
  if (variant === "positive") return <TrendingUp size={13} className="text-[var(--success)]" />;
  if (variant === "negative") return <TrendingDown size={13} className="text-[var(--error)]" />;
  return <Minus size={13} className="text-[var(--text-muted)]" />;
};

export function StatCard({ label, value, description, variant = "neutral", delay = 0 }: StatCardProps) {
  const styles = variantStyles[variant];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      className={`rounded-xl border ${styles.ring} ${styles.bg} p-4 flex flex-col gap-2`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">{label}</p>
        <TrendIcon variant={variant} />
      </div>
      <p className={`text-2xl font-bold tracking-tight ${styles.text}`}>{value}</p>
      {description && (
        <p className="text-[11px] text-[var(--text-muted)] leading-snug">{description}</p>
      )}
    </motion.div>
  );
}

