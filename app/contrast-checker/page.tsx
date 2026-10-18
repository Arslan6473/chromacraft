/**
 * app/contrast-checker/page.tsx
 * Tool 3: WCAG Contrast & Accessibility Checker
 *
 * Core Features:
 * - Real-time contrast ratio calculation following WCAG 2.1 specs
 * - Pass/Fail matrix for AA and AAA compliance (normal text, large text, UI components)
 * - Live interactive UI preview showing headings, paragraphs, buttons, and badges
 * - Instant swap button (Foreground <-> Background)
 * - Auto-fix / Enhance button to suggest compliant color adjustments
 * - Pre-curated accessible color combinations
 */
"use client";

import { useState, useMemo } from "react";
import {
  Eye,
  CheckCircle2,
  XCircle,
  ArrowLeftRight,
  Sparkles,
  ShieldCheck,
  Type,
  Maximize,
  Copy,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";
import { CopyButton } from "@/components/CopyButton";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getContrastRatio,
  checkWCAGCompliance,
  isValidHex,
  normalizeHex,
  hexToRgb,
  rgbToHsl,
  hslToHex,
  getRelativeLuminance,
} from "@/lib/color-utils";

const contrastFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the mathematical formula for WCAG contrast ratio?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Contrast ratio is defined as (L1 + 0.05) / (L2 + 0.05), where L1 is the relative luminance of the lighter color and L2 is the relative luminance of the darker color.",
      },
    },
    {
      "@type": "Question",
      name: "What constitutes 'Large Text' under WCAG guidelines?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Under WCAG 2.1, Large Text is formally defined as 18 point (24 CSS pixels) regular font weight, or 14 point (18.5 CSS pixels) bold font weight.",
      },
    },
    {
      "@type": "Question",
      name: "Is WCAG Level AA compliance legally required for commercial websites?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, in many jurisdictions including the United States (ADA Title III) and European Union (EAA 2025), commercial websites are expected to meet WCAG 2.1 Level AA.",
      },
    },
  ],
};

const contrastAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "WCAG Contrast & Accessibility Checker",
  applicationCategory: "DesignApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Real-time WCAG 2.1 contrast ratio calculator with AA and AAA pass/fail validation, live typography simulator, and auto-adjust compliance tool.",
  url: "https://chromacraft.dev/contrast-checker",
};

const PAIR_PRESETS = [
  { name: "Clean Vercel", fg: "#EDEDED", bg: "#0A0A0A" },
  { name: "Indigo Velvet", fg: "#FFFFFF", bg: "#4338CA" },
  { name: "Emerald Forest", fg: "#ECFDF5", bg: "#064E3B" },
  { name: "Slate Minimal", fg: "#F8FAFC", bg: "#0F172A" },
  { name: "Amber Terminal", fg: "#FDE68A", bg: "#1C1917" },
  { name: "High Contrast Classic", fg: "#000000", bg: "#FFFFFF" },
];

export default function ContrastCheckerPage() {
  const [fgHex, setFgHex] = useState("#FFFFFF");
  const [bgHex, setBgHex] = useState("#0F172A");

  // Validate hexes or fallback to default
  const safeFg = isValidHex(fgHex) ? normalizeHex(fgHex) : "#FFFFFF";
  const safeBg = isValidHex(bgHex) ? normalizeHex(bgHex) : "#000000";

  // Calculate contrast ratio & WCAG compliance
  const ratio = useMemo(() => getContrastRatio(safeFg, safeBg), [safeFg, safeBg]);
  const compliance = useMemo(() => checkWCAGCompliance(ratio), [ratio]);

  // Swap foreground and background
  const handleSwap = () => {
    setFgHex(bgHex);
    setBgHex(fgHex);
  };

  // Auto-Fix / Enhance: adjust foreground lightness until ratio >= 4.5:1
  const handleAutoFix = () => {
    const bgRgb = hexToRgb(safeBg);
    const bgLum = getRelativeLuminance(bgRgb);

    // If background is dark, brighten FG; if background is light, darken FG
    const targetLightness = bgLum < 0.2 ? 96 : 4;
    const fgRgb = hexToRgb(safeFg);
    const fgHsl = rgbToHsl(fgRgb.r, fgRgb.g, fgRgb.b);

    const fixed = hslToHex(fgHsl.h, fgHsl.s, targetLightness);
    setFgHex(fixed);
  };

  return (
    <>
      <JsonLd data={contrastFaqSchema} />
      <JsonLd data={contrastAppSchema} />
      <div className="flex-1 bg-zinc-950 px-4 sm:px-6 lg:px-8 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* ── Page Header ────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono mb-2">
              <Eye size={12} />
              Tool 3: WCAG 2.1 Accessibility Validator
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Color Contrast &amp; Accessibility Checker
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Verify color contrast ratios against WCAG AA and AAA standards for normal text, large text, and interactive elements.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {PAIR_PRESETS.slice(0, 3).map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => {
                  setFgHex(p.fg);
                  setBgHex(p.bg);
                }}
                className="text-xs px-3 py-1.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 text-zinc-300 border border-zinc-750 transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* ── Main Inputs & Score Banner ─────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── LEFT: Inputs & Ratio Score (5 cols) ───────────── */}
          <div className="lg:col-span-5 space-y-6">
            {/* Color Inputs card */}
            <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 space-y-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Color Inputs
              </h3>

              {/* Foreground Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400 flex items-center justify-between">
                  <span>Foreground (Text / Icon)</span>
                  <span className="font-mono text-zinc-500">{safeFg}</span>
                </label>
                <div className="flex items-center gap-3 p-2 rounded-xl bg-zinc-950 border border-zinc-800">
                  <div className="relative shrink-0">
                    <input
                      type="color"
                      value={safeFg}
                      onChange={(e) => setFgHex(e.target.value.toUpperCase())}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      aria-label="Foreground color picker"
                    />
                    <div
                      style={{ backgroundColor: safeFg }}
                      className="h-10 w-10 rounded-lg border-2 border-white/20 shadow-sm pointer-events-none"
                    />
                  </div>
                  <input
                    type="text"
                    value={fgHex}
                    onChange={(e) => setFgHex(e.target.value)}
                    className="flex-1 bg-transparent font-mono font-bold text-sm text-white focus:outline-none uppercase"
                    placeholder="#FFFFFF"
                  />
                  <CopyButton textToCopy={safeFg} size="sm" variant="ghost" />
                </div>
              </div>

              {/* Swap Button Divider */}
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-all hover:scale-105 active:scale-95 shadow-sm"
                >
                  <ArrowLeftRight size={13} />
                  Swap Colors
                </button>
              </div>

              {/* Background Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400 flex items-center justify-between">
                  <span>Background (Canvas / Surface)</span>
                  <span className="font-mono text-zinc-500">{safeBg}</span>
                </label>
                <div className="flex items-center gap-3 p-2 rounded-xl bg-zinc-950 border border-zinc-800">
                  <div className="relative shrink-0">
                    <input
                      type="color"
                      value={safeBg}
                      onChange={(e) => setBgHex(e.target.value.toUpperCase())}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      aria-label="Background color picker"
                    />
                    <div
                      style={{ backgroundColor: safeBg }}
                      className="h-10 w-10 rounded-lg border-2 border-white/20 shadow-sm pointer-events-none"
                    />
                  </div>
                  <input
                    type="text"
                    value={bgHex}
                    onChange={(e) => setBgHex(e.target.value)}
                    className="flex-1 bg-transparent font-mono font-bold text-sm text-white focus:outline-none uppercase"
                    placeholder="#000000"
                  />
                  <CopyButton textToCopy={safeBg} size="sm" variant="ghost" />
                </div>
              </div>
            </div>

            {/* Score & Gauge Card */}
            <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono uppercase text-zinc-400">
                    Calculated Ratio
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-extrabold font-mono text-white tracking-tight">
                      {ratio.toFixed(2)} : 1
                    </span>
                  </div>
                </div>

                {/* Score Grade Badge */}
                <span
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                    compliance.scoreGrade === "Excellent"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : compliance.scoreGrade === "Good"
                      ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                      : compliance.scoreGrade === "Poor"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                  }`}
                >
                  {compliance.scoreGrade}
                </span>
              </div>

              {/* Progress gauge bar */}
              <div className="space-y-1">
                <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden flex">
                  <div
                    style={{ width: `${Math.min(100, (ratio / 21) * 100)}%` }}
                    className={`h-full transition-all duration-300 rounded-full ${
                      ratio >= 7
                        ? "bg-emerald-500"
                        : ratio >= 4.5
                        ? "bg-indigo-500"
                        : ratio >= 3
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-zinc-500 pt-1">
                  <span>1.0 (Fail)</span>
                  <span>4.5 (AA)</span>
                  <span>7.0 (AAA)</span>
                  <span>21.0 (Max)</span>
                </div>
              </div>

              {/* Auto Fix / Enhance CTA if not passing AA */}
              {!compliance.aaNormalText && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleAutoFix}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
                  >
                    <Sparkles size={14} />
                    Auto-Adjust for WCAG AA Compliance
                  </button>
                </div>
              )}
            </div>

            {/* WCAG Compliance Matrix Badges */}
            <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                WCAG 2.1 Criteria Breakdown
              </h3>

              <div className="space-y-2.5">
                {[
                  {
                    label: "WCAG AA Normal Text",
                    req: "Requires 4.5 : 1",
                    passed: compliance.aaNormalText,
                  },
                  {
                    label: "WCAG AA Large Text (18pt+ / 14pt bold)",
                    req: "Requires 3.0 : 1",
                    passed: compliance.aaLargeText,
                  },
                  {
                    label: "WCAG AAA Normal Text",
                    req: "Requires 7.0 : 1",
                    passed: compliance.aaaNormalText,
                  },
                  {
                    label: "WCAG AAA Large Text",
                    req: "Requires 4.5 : 1",
                    passed: compliance.aaaLargeText,
                  },
                  {
                    label: "UI Components & Graphic Elements",
                    req: "Requires 3.0 : 1",
                    passed: compliance.uiComponents,
                  },
                ].map(({ label, req, passed }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800/80"
                  >
                    <div className="pr-2">
                      <span className="block text-xs font-semibold text-zinc-200">
                        {label}
                      </span>
                      <span className="text-[11px] text-zinc-500 font-mono">
                        {req}
                      </span>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${
                        passed
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                      }`}
                    >
                      {passed ? (
                        <>
                          <CheckCircle2 size={13} />
                          Pass
                        </>
                      ) : (
                        <>
                          <XCircle size={13} />
                          Fail
                        </>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Real-World UI Mockup Preview (7 cols) ── */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <Type size={14} className="text-indigo-400" />
                  Live Typography &amp; Component Simulator
                </span>
                <span className="text-xs font-mono text-zinc-500">
                  Real Rendering
                </span>
              </div>

              {/* The dynamic preview box */}
              <motion.div
                layout
                style={{ backgroundColor: safeBg, color: safeFg }}
                className="w-full rounded-2xl p-8 sm:p-10 border border-white/10 shadow-2xl space-y-6 transition-colors duration-200"
              >
                {/* Large Title */}
                <div>
                  <span className="text-xs uppercase font-mono font-bold tracking-widest opacity-80">
                    Display Typography
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1">
                    Design Systems Built for All Eyes
                  </h2>
                </div>

                {/* Body paragraph */}
                <p className="text-sm sm:text-base leading-relaxed opacity-90 max-w-xl">
                  Accessible color contrast ensures that your product is usable for individuals with visual impairments, color blindness, and aging eyes — as well as users viewing screens outdoors in direct sunlight.
                </p>

                {/* Small text / caption */}
                <p className="text-xs opacity-75 font-mono">
                  Small metadata caption (12px) rendered directly in the active foreground color.
                </p>

                {/* Interactive Mock Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  {/* Button filled with foreground color */}
                  <button
                    type="button"
                    style={{ backgroundColor: safeFg, color: safeBg }}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-transform active:scale-95"
                  >
                    Primary Action
                  </button>

                  {/* Outline button */}
                  <button
                    type="button"
                    style={{ borderColor: safeFg, color: safeFg }}
                    className="px-5 py-2.5 rounded-xl font-medium text-xs border transition-colors hover:bg-white/10"
                  >
                    Secondary Action
                  </button>

                  {/* Badge */}
                  <span
                    style={{ borderColor: safeFg }}
                    className="px-3 py-1 rounded-full text-[11px] font-mono uppercase font-bold border opacity-85"
                  >
                    Verified AA
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Educational WCAG Specs Guide Card */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-3 text-xs text-zinc-400 leading-relaxed">
              <h4 className="font-bold text-zinc-200 text-sm flex items-center gap-2">
                <Info size={15} className="text-indigo-400" />
                Understanding the WCAG 2.1 Contrast Standards
              </h4>
              <p>
                The World Wide Web Consortium (W3C) establishes these contrast ratios based on human eye perception and sRGB color space luminance calculations:
              </p>
              <ul className="space-y-2 list-disc list-inside text-zinc-400 pt-1">
                <li>
                  <strong className="text-zinc-200">Level AA (Minimum):</strong> Requires at least 4.5:1 for body copy and 3:1 for large text (18pt / 24px or 14pt / 18.5px bold). This is the standard legal requirement for most enterprise websites under ADA Title III and EN 301 549.
                </li>
                <li>
                  <strong className="text-zinc-200">Level AAA (Enhanced):</strong> Requires at least 7:1 for normal body text and 4.5:1 for large text. Recommended for public sector, government, and healthcare web applications.
                </li>
              </ul>
            </div>

            {/* ── FAQ Section with Accordion ───────────────────────── */}
            <section aria-labelledby="contrast-faq-heading" className="space-y-4 pt-4">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-indigo-400" />
                <h3 id="contrast-faq-heading" className="text-base font-bold text-white">
                  Accessibility FAQs &amp; Legal Guidelines
                </h3>
              </div>
              <Accordion
                items={[
                  {
                    question: "What is the mathematical formula for WCAG contrast ratio?",
                    answer:
                      "Contrast ratio is defined as (L1 + 0.05) / (L2 + 0.05), where L1 is the relative luminance of the lighter color and L2 is the relative luminance of the darker color. The 0.05 offset prevents division by zero and compensates for ambient display flare. Ratios range from 1:1 (zero contrast) to 21:1 (pure black on pure white).",
                  },
                  {
                    question: "What constitutes 'Large Text' under WCAG guidelines?",
                    answer:
                      "Under WCAG 2.1, 'Large Text' is formally defined as 18 point (24 CSS pixels) regular font weight, or 14 point (approximately 18.5 CSS pixels) bold font weight. Because larger glyphs are easier for the human retina to discern, the minimum contrast requirement drops from 4.5:1 down to 3:1.",
                  },
                  {
                    question: "Is WCAG Level AA compliance legally required for commercial websites?",
                    answer:
                      "In numerous jurisdictions including the United States (under the Americans with Disabilities Act / ADA Title III judicial precedents) and the European Union (European Accessibility Act 2025), commercial websites are increasingly required to meet WCAG 2.1 Level AA to avoid costly accessibility lawsuits.",
                  },
                  {
                    question: "How does the 'Auto-Adjust' feature work?",
                    answer:
                      "Our Auto-Adjust algorithm calculates the background's relative luminance and iteratively increases or decreases the foreground lightness channel in perceptual HSL space until the ratio passes the 4.5:1 threshold, preserving the original hue whenever possible.",
                  },
                ]}
              />
            </section>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}


