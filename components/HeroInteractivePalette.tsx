/**
 * components/HeroInteractivePalette.tsx
 * Interactive live palette preview widget embedded directly in the homepage hero.
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Copy, Check, ArrowRight, Lock, Unlock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getRandomHex, getContrastTextColor } from "@/lib/color-utils";

const DEFAULT_HERO_COLORS = ["#0F172A", "#3B82F6", "#6366F1", "#10B981", "#F8FAFC"];

export function HeroInteractivePalette() {
  const [colors, setColors] = useState(DEFAULT_HERO_COLORS);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const rollNewColors = () => {
    setColors(colors.map(() => getRandomHex()));
  };

  const copyHex = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedHex(hex);
      setTimeout(() => setCopiedHex(null), 1500);
    } catch {
      // ignore
    }
  };

  const studioUrl = `/palette-generator?colors=${colors.map((c) => c.replace("#", "")).join(",")}`;

  return (
    <div className="w-full max-w-2xl mx-auto pt-6">
      <div className="p-2 sm:p-2.5 rounded-2xl bg-zinc-900/90 border border-white/[0.08] shadow-2xl backdrop-blur-xl">
        {/* Swatch row */}
        <div className="h-20 sm:h-24 w-full rounded-xl overflow-hidden flex shadow-inner border border-white/10">
          {colors.map((hex, i) => {
            const isCopied = copiedHex === hex;
            const textClr = getContrastTextColor(hex);
            return (
              <motion.div
                key={i}
                layout
                style={{ backgroundColor: hex }}
                onClick={() => copyHex(hex)}
                className="group relative flex-1 h-full cursor-pointer transition-transform hover:scale-105 hover:z-20 flex flex-col items-center justify-center select-none"
                title="Click to copy HEX"
              >
                <span
                  style={{ color: textClr }}
                  className="font-mono text-[10px] sm:text-xs font-bold tracking-tight opacity-90 group-hover:opacity-100"
                >
                  {isCopied ? "Copied!" : hex}
                </span>

                <AnimatePresence>
                  {isCopied && (
                    <motion.span
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      className="absolute -top-7 px-2 py-0.5 rounded bg-zinc-950 text-emerald-400 font-mono text-[10px] font-bold border border-zinc-700 shadow-xl"
                    >
                      Copied!
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Quick controls beneath swatch */}
        <div className="flex items-center justify-between px-2 pt-2.5 text-xs text-zinc-400">
          <button
            type="button"
            onClick={rollNewColors}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-white/[0.06] text-xs font-medium transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles size={12} className="text-indigo-400" />
            <span>Roll Colors</span>
          </button>

          <span className="hidden sm:inline text-[11px] font-mono text-zinc-500">
            Click any swatch to copy
          </span>

          <Link
            href={studioUrl}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
          >
            <span>Edit in Studio</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}

