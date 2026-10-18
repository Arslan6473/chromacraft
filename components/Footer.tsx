/**
 * components/Footer.tsx
 * Dark minimalist footer with keyboard shortcuts, tools index, and design system links.
 */
"use client";

import Link from "next/link";
import { Sparkles, Palette, SlidersHorizontal, Eye, Command } from "lucide-react";

const tools = [
  { href: "/palette-generator", label: "Palette Generator & Lock Studio", desc: "Randomize & lock 5-slot color schemes" },
  { href: "/color-combos", label: "Trending Color Combos Library", desc: "32+ Curated palettes with 1-click Tailwind export" },
  { href: "/gradient-builder", label: "CSS Gradient Mesh & Linear Builder", desc: "Multi-stop CSS gradients with live preview" },
  { href: "/contrast-checker", label: "WCAG 2.1 Contrast & Accessibility", desc: "Real-time AA/AAA validator for text and UI" },
  { href: "/color-converter", label: "Universal Color Converter & Shades", desc: "HEX, RGB, HSL, CMYK & 11-step Tailwind scale" },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-850 bg-zinc-950 mt-auto text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-pink-500 p-[1px]">
                <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-zinc-950">
                  <Sparkles size={13} className="text-indigo-400" />
                </div>
              </div>
              <span className="font-bold text-zinc-100 text-sm tracking-tight">ChromaCraft</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              The precision color studio designed for developers, UI/UX designers, and design system engineers.
              Instant conversion across HEX, RGB, HSL, and Tailwind CSS.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-zinc-400">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All algorithms run client-side in sub-millisecond time.</span>
            </div>
          </div>

          {/* Tools list */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Interactive Tools
            </h4>
            <ul className="space-y-2">
              {tools.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-xs text-zinc-400 hover:text-zinc-100 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <Command size={12} className="text-indigo-400" />
              Keyboard Shortcuts
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Randomize Scheme</span>
                <kbd className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-750 font-mono text-[11px] text-zinc-300">
                  Space
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Copy Color Code</span>
                <kbd className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-750 font-mono text-[11px] text-zinc-300">
                  Click Hex
                </kbd>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-zinc-400">Toggle Lock</span>
                <kbd className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-750 font-mono text-[11px] text-zinc-300">
                  Lock Icon
                </kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div>
            © 2026 ChromaCraft. Engineered for modern web craftsmanship.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-zinc-300">WCAG 2.1 Compliant</span>
            <span>•</span>
            <span className="hover:text-zinc-300">Tailwind CSS 4 Ready</span>
            <span>•</span>
            <span className="hover:text-zinc-300">Zero Tracking</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

