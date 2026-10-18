/**
 * components/Navbar.tsx
 * Ultra-sleek, Linear/Vercel-inspired floating navigation bar.
 * Designed with zero text-wrapping, crisp typography, and micro-interactions.
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Palette,
  Sparkles,
  SlidersHorizontal,
  Eye,
  Menu,
  X,
  Layers,
  RefreshCw,
  ArrowRight,
  Command,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  {
    href: "/palette-generator",
    label: "Palettes",
    icon: Palette,
  },
  {
    href: "/color-combos",
    label: "Combos",
    icon: Layers,
    count: "32",
  },
  {
    href: "/gradient-builder",
    label: "Gradients",
    icon: SlidersHorizontal,
  },
  {
    href: "/contrast-checker",
    label: "Contrast",
    icon: Eye,
  },
  {
    href: "/color-converter",
    label: "Converter",
    icon: RefreshCw,
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.07] bg-zinc-950/80 backdrop-blur-2xl transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* ── Left: Brand & Wordmark ───────────────────────── */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 group focus:outline-none"
            onClick={() => setMobileOpen(false)}
          >
            {/* Logo Icon with subtle gradient and glow */}
            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-zinc-950">
                <Sparkles size={14} className="text-indigo-400 group-hover:rotate-12 transition-transform duration-200" />
              </div>
            </div>

            {/* Brand Title */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white group-hover:text-zinc-200 transition-colors">
                ChromaCraft
              </span>
              <span className="text-[10px] font-mono uppercase font-semibold px-1.5 py-0.5 rounded-full bg-white/[0.06] text-zinc-400 border border-white/[0.08]">
                v2.0
              </span>
            </div>
          </Link>

          {/* ── Center: Sleek Linear-style Pill Navigation (Desktop) ── */}
          <nav className="hidden lg:flex items-center p-1 rounded-full bg-zinc-900/70 border border-white/[0.08] shadow-inner backdrop-blur-xl">
            {navLinks.map(({ href, label, icon: Icon, count }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all duration-150 ${
                    active
                      ? "text-white font-semibold bg-white/[0.12] shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon
                    size={13}
                    className={`shrink-0 ${
                      active ? "text-indigo-400" : "text-zinc-500"
                    }`}
                  />
                  <span>{label}</span>

                  {/* Optional sleek subtle badge */}
                  {count && (
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded-full bg-indigo-500/15 text-indigo-300 font-bold border border-indigo-500/25">
                      {count}
                    </span>
                  )}

                  {/* Active bottom glow accent */}
                  {active && (
                    <motion.div
                      layoutId="nav-active-indicator"
                      className="absolute inset-0 rounded-full border border-white/[0.15] pointer-events-none"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── Right: Quick Hotkey Pill & Primary Studio Action ── */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            {/* Hotkey hint pill */}
            <span className="hidden xl:inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 bg-zinc-900/60 border border-white/[0.06] px-2.5 py-1 rounded-full">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-300 font-bold border border-white/[0.08]">
                Space
              </kbd>
              <span>rolls palette</span>
            </span>

            {/* Primary Action Button */}
            <Link
              href="/palette-generator"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-semibold shadow-md shadow-white/5 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
            >
              <Palette size={13} />
              <span>Studio</span>
              <ArrowRight size={12} className="opacity-70" />
            </Link>
          </div>

          {/* ── Mobile Hamburger Toggle ──────────────────────── */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/palette-generator"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-zinc-950 text-xs font-semibold whitespace-nowrap"
            >
              <Palette size={13} />
              <span>Studio</span>
            </Link>
            <button
              type="button"
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 border border-white/[0.06] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Dropdown Menu ─────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-white/[0.08] bg-zinc-950/95 backdrop-blur-2xl px-4 py-4 space-y-1 overflow-hidden shadow-2xl"
          >
            {navLinks.map(({ href, label, icon: Icon, count }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    active
                      ? "bg-white/[0.1] text-white font-semibold"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={active ? "text-indigo-400" : "text-zinc-500"} />
                    <span className="text-sm">{label}</span>
                  </div>
                  {count && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 font-bold border border-indigo-500/25">
                      {count} Combos
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-3 mt-2 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400 px-2">
              <span className="flex items-center gap-1.5">
                <Command size={12} className="text-indigo-400" />
                Hotkeys active across all tools
              </span>
              <kbd className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 font-mono">
                Space
              </kbd>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
