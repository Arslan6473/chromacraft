/**
 * components/CopyButton.tsx
 * Reusable animated copy-to-clipboard button with micro-interaction.
 */
"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "solid" | "glass";
  showTooltip?: boolean;
}

export function CopyButton({
  textToCopy,
  label,
  className = "",
  size = "md",
  variant = "ghost",
  showTooltip = true,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = textToCopy;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs gap-1.5",
    md: "px-3 py-1.5 text-xs gap-2",
    lg: "px-4 py-2 text-sm gap-2.5",
  };

  const variantClasses = {
    ghost: "bg-transparent hover:bg-white/10 text-zinc-300 hover:text-white border border-transparent hover:border-zinc-700/60",
    solid: "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700/60 shadow-sm",
    glass: "bg-black/30 backdrop-blur-md hover:bg-black/50 text-white border border-white/15 shadow-sm",
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleCopy}
        aria-label={label || "Copy to clipboard"}
        className={`inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 cursor-pointer active:scale-95 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="check"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-emerald-400 flex items-center gap-1.5"
            >
              <Check size={size === "sm" ? 12 : 14} strokeWidth={2.5} />
              {label ? "Copied!" : null}
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-1.5"
            >
              <Copy size={size === "sm" ? 12 : 14} />
              {label || null}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Floating subtle tooltip if no label */}
      {showTooltip && !label && (
        <AnimatePresence>
          {copied && (
            <motion.span
              initial={{ opacity: 0, y: 4, scale: 0.9 }}
              animate={{ opacity: 1, y: -24, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-50 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-emerald-400 text-[10px] font-semibold whitespace-nowrap shadow-xl"
            >
              Copied!
            </motion.span>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

