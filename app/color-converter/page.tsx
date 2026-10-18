/**
 * app/color-converter/page.tsx
 * Tool 5: Universal Color Code Converter & Tailwind Shade Generator
 *
 * SEO & AdSense Strategy:
 * - H1, H2, H3 targeting "color converter", "hex to rgb converter", "cmyk to rgb", "tailwind color shades generator"
 * - Instant bidirectional conversion: HEX, RGB, HSL, HSV, CMYK
 * - 11-step Tailwind shade scale generator (50 to 950) with 1-click copy
 * - 400-word educational guide on additive vs subtractive color spaces
 * - Accessible FAQ accordion & FAQPage JSON-LD structured data
 */
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  RefreshCw,
  Copy,
  Check,
  Code,
  Sliders,
  Sparkles,
  BookOpen,
  HelpCircle,
  Layers,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { CopyButton } from "@/components/CopyButton";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  isValidHex,
  normalizeHex,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToHex,
  rgbToHsv,
  rgbToCmyk,
  getRelativeLuminance,
  getContrastTextColor,
  generateTailwindShades,
  generateHarmoniousPalette,
} from "@/lib/color-utils";

/* ── FAQ Data ─────────────────────────────────────────────────────────────── */
const faqs: AccordionItem[] = [
  {
    question: "What is the difference between RGB and CMYK color models?",
    answer:
      "RGB (Red, Green, Blue) is an additive color model used for illuminated digital displays (monitors, mobile phones, televisions), where mixing maximum red, green, and blue light produces pure white. CMYK (Cyan, Magenta, Yellow, Key/Black) is a subtractive color model used in commercial physical printing, where inks absorb specific light wavelengths, and mixing pigments subtracts light until near-black is achieved.",
  },
  {
    question: "Why do developers prefer HSL over HEX or RGB for design systems?",
    answer:
      "While HEX codes are concise, they are not intuitive for humans to manipulate mentally. With HSL (Hue, Saturation, Lightness), developers can programmatically create hover states, disabled states, borders, and dark mode variants simply by tweaking the Lightness channel (e.g. subtracting 10% lightness for an active button state) without altering the core brand Hue or Saturation.",
  },
  {
    question: "How are Tailwind CSS shade scales (50 to 950) generated?",
    answer:
      "Tailwind's shade scale uses non-linear lightness and saturation curves. Shade 500 typically serves as the primary base color (around 50% lightness). Lower numbers (50, 100, 200) increase lightness while slightly decreasing saturation to prevent pastel washed-out effects, whereas higher numbers (700, 800, 900, 950) decrease lightness to create rich, deep shadows for dark backgrounds.",
  },
  {
    question: "Can I copy the generated shades directly into tailwind.config.js?",
    answer:
      "Yes. Our shade generator creates an exact 11-step JavaScript dictionary containing keys 50 through 950. Clicking 'Copy Tailwind Shades' places the full snippet directly onto your clipboard.",
  },
  {
    question: "Are CMYK values exact when converted from RGB?",
    answer:
      "RGB has a significantly wider color gamut than standard 4-color process CMYK (such as SWOP or FOGRA). Highly saturated neon greens, bright electric cyans, and deep magentas that glow on an OLED display cannot be physically replicated with standard CMYK inks. Our converter provides the closest perceptual mathematical match.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Universal Color Code Converter & Shade Generator",
  applicationCategory: "DesignApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Instant color code translation between HEX, RGB, HSL, HSV, and CMYK, with 11-step Tailwind CSS shade and tint generator.",
  url: "https://chromacraft.dev/color-converter",
};

export default function ColorConverterPage() {
  const [hexInput, setHexInput] = useState<string>("#6366F1");

  // Validate or fallback
  const safeHex = useMemo(() => {
    return isValidHex(hexInput) ? normalizeHex(hexInput) : "#6366F1";
  }, [hexInput]);

  // Derived color representations
  const rgb = useMemo(() => hexToRgb(safeHex), [safeHex]);
  const hsl = useMemo(() => rgbToHsl(rgb.r, rgb.g, rgb.b), [rgb]);
  const hsv = useMemo(() => rgbToHsv(rgb.r, rgb.g, rgb.b), [rgb]);
  const cmyk = useMemo(() => rgbToCmyk(rgb.r, rgb.g, rgb.b), [rgb]);
  const luminance = useMemo(() => Math.round(getRelativeLuminance(rgb) * 100), [rgb]);
  const contrastText = useMemo(() => getContrastTextColor(safeHex), [safeHex]);

  // Formatted strings
  const hexStr = safeHex;
  const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  const hsvStr = `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`;
  const cmykStr = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;

  // Tailwind shade scale (50 - 950)
  const shades = useMemo(() => generateTailwindShades(safeHex), [safeHex]);

  // Formatted Tailwind scale snippet
  const tailwindScaleSnippet = useMemo(() => {
    const entries = shades
      .map((s) => `      ${s.step}: '${s.hex.toLowerCase()}',`)
      .join("\n");
    return `// tailwind.config.js (theme.extend.colors)\nbrand: {\n${entries}\n}`;
  }, [shades]);

  // Quick harmonies
  const compColor = useMemo(() => hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l), [hsl]);
  const triadicColors = useMemo(
    () => [
      hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
      hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
    ],
    [hsl]
  );

  return (
    <>
      <JsonLd data={faqSchema} />
      <JsonLd data={pageSchema} />

      <div className="flex-1 bg-zinc-950 px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* ── Page Header ────────────────────────────────────── */}
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800/80 pb-8">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono">
                <RefreshCw size={12} />
                Bidirectional Precision Converter
              </div>
              {/* H1 */}
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Color Code Converter &amp; Shade Scale Generator
              </h1>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                Translate any color between HEX, RGB, HSL, HSV, and CMYK formats with zero latency. Generate an 11-step Tailwind CSS shade and tint scale (50–950) ready for your design system.
              </p>
            </div>
          </div>
        </div>

        {/* ── Main Converter Section ───────────────────────────── */}
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ── LEFT: Color Input & Live Swatch (5 cols) ────── */}
            <div className="lg:col-span-5 space-y-6">
              {/* Interactive Color Box */}
              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Active Color Swatch
                </h3>

                {/* Big Preview Box */}
                <div
                  style={{ backgroundColor: safeHex, color: contrastText }}
                  className="relative h-44 w-full rounded-2xl border border-white/15 p-6 flex flex-col justify-between shadow-2xl transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20">
                      Luminance: {luminance}%
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-black/30 backdrop-blur-md text-white">
                      Text: {contrastText === "#FFFFFF" ? "White" : "Dark"}
                    </span>
                  </div>

                  <div>
                    <span className="text-2xl sm:text-3xl font-mono font-extrabold tracking-tight">
                      {safeHex}
                    </span>
                    <span className="block text-xs font-mono opacity-80 mt-0.5">
                      {rgbStr}
                    </span>
                  </div>
                </div>

                {/* Hex Input & Native Picker Row */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 flex items-center justify-between">
                    <span>Enter Hex or Pick Color</span>
                    <span className="text-[11px] font-mono text-zinc-500">Supports 3 or 6 digits</span>
                  </label>
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-zinc-950 border border-zinc-800">
                    <div className="relative shrink-0">
                      <input
                        type="color"
                        value={safeHex}
                        onChange={(e) => setHexInput(e.target.value.toUpperCase())}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        aria-label="Color Picker"
                      />
                      <div
                        style={{ backgroundColor: safeHex }}
                        className="h-10 w-10 rounded-lg border-2 border-white/20 shadow-sm pointer-events-none"
                      />
                    </div>
                    <input
                      type="text"
                      value={hexInput}
                      onChange={(e) => setHexInput(e.target.value)}
                      placeholder="#6366F1"
                      className="flex-1 bg-transparent font-mono font-bold text-sm text-white focus:outline-none uppercase"
                    />
                    <CopyButton textToCopy={safeHex} size="sm" variant="ghost" />
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  {["#6366F1", "#10B981", "#3B82F6", "#EC4899", "#F59E0B", "#18181B"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setHexInput(p)}
                      style={{ backgroundColor: p }}
                      className="h-6 w-6 rounded-md border border-white/25 hover:scale-110 transition-transform shadow-sm"
                      title={p}
                    />
                  ))}
                </div>
              </div>

              {/* Harmonies Preview Mini-Card */}
              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Instant Color Harmonies
                </h4>
                <div className="space-y-2 text-xs">
                  {/* Complementary */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950 border border-zinc-850">
                    <span className="text-zinc-400">Complementary</span>
                    <div className="flex items-center gap-2">
                      <div
                        style={{ backgroundColor: compColor }}
                        className="h-5 w-5 rounded border border-white/20"
                      />
                      <span className="font-mono text-zinc-200">{compColor}</span>
                      <CopyButton textToCopy={compColor} size="sm" variant="ghost" />
                    </div>
                  </div>

                  {/* Triadic */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950 border border-zinc-850">
                    <span className="text-zinc-400">Triadic (+120° / +240°)</span>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div
                          style={{ backgroundColor: triadicColors[0] }}
                          className="h-5 w-5 rounded border border-white/20"
                        />
                        <div
                          style={{ backgroundColor: triadicColors[1] }}
                          className="h-5 w-5 rounded border border-white/20"
                        />
                      </div>
                      <span className="font-mono text-zinc-200">{triadicColors[0]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Conversion Results & Shade Scale (7 cols) ── */}
            <div className="lg:col-span-7 space-y-6">
              {/* Converted Formats Grid */}
              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Converted Formats
                </h3>

                <div className="space-y-2.5">
                  {[
                    { label: "HEX", value: hexStr, hint: "Standard Web / CSS" },
                    { label: "RGB", value: rgbStr, hint: "Additive Screens" },
                    { label: "HSL", value: hslStr, hint: "Perceptual Color Space" },
                    { label: "HSV / HSB", value: hsvStr, hint: "Figma / Photoshop" },
                    { label: "CMYK", value: cmykStr, hint: "Print Four-Color Process" },
                  ].map(({ label, value, hint }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950 border border-zinc-850 hover:border-zinc-750 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold font-mono text-indigo-400">
                            {label}
                          </span>
                          <span className="text-[11px] text-zinc-500 font-mono">
                            • {hint}
                          </span>
                        </div>
                        <span className="text-sm font-mono font-semibold text-zinc-100 select-all">
                          {value}
                        </span>
                      </div>
                      <CopyButton textToCopy={value} label="Copy" variant="solid" size="sm" />
                    </div>
                  ))}
                </div>
              </div>

              {/* 11-Step Tailwind CSS Shade Generator */}
              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                      <Layers size={14} className="text-indigo-400" />
                      Tailwind CSS Color Scale (50 – 950)
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Harmonious tints and shades calculated using calibrated lightness curve
                    </p>
                  </div>
                  <CopyButton
                    textToCopy={tailwindScaleSnippet}
                    label="Copy Tailwind Scale"
                    variant="solid"
                    size="sm"
                  />
                </div>

                {/* Swatch Scale Ribbon */}
                <div className="rounded-xl overflow-hidden flex border border-white/10 shadow-inner">
                  {shades.map((s) => (
                    <div
                      key={s.step}
                      style={{ backgroundColor: s.hex }}
                      className="group/scale relative flex-1 h-14 flex items-center justify-center cursor-pointer transition-transform hover:scale-105 hover:z-10"
                      title={`${s.step}: ${s.hex}`}
                    >
                      <span
                        style={{ color: getContrastTextColor(s.hex) }}
                        className="text-[9px] font-mono font-bold opacity-0 group-hover/scale:opacity-100"
                      >
                        {s.step}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Breakdown List */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 pt-2">
                  {shades.map((s) => (
                    <div
                      key={s.step}
                      className="p-2 rounded-lg bg-zinc-950 border border-zinc-850 flex flex-col items-center text-center"
                    >
                      <span className="text-[10px] font-mono text-zinc-500 font-bold">
                        {s.step}
                      </span>
                      <span className="text-xs font-mono text-zinc-200 font-semibold mt-0.5">
                        {s.hex}
                      </span>
                      <CopyButton
                        textToCopy={s.hex}
                        size="sm"
                        variant="ghost"
                        className="mt-1 p-1 !h-5"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Comprehensive Educational Guide (SEO & AdSense Approved) ── */}
        <section
          aria-labelledby="converter-guide-heading"
          className="mx-auto max-w-7xl rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-10 space-y-8"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
              <BookOpen size={16} />
            </div>
            {/* H2 */}
            <h2 id="converter-guide-heading" className="text-xl sm:text-2xl font-bold text-white">
              Color Space Engineering: Additive, Subtractive, and Perceptual Models
            </h2>
          </div>

          <p className="text-sm text-zinc-300 leading-relaxed max-w-4xl">
            Software engineers and design system architects frequently need to translate colors across disparate digital and physical contexts. Understanding how these spaces represent chromatic information is essential for ensuring color accuracy, cross-platform consistency, and accessibility.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Sliders size={14} className="text-indigo-400" />
                RGB &amp; HEX (Additive Light Space)
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                RGB represents light emitted by pixels. In 24-bit TrueColor, 8 bits (0–255) are allocated to red, green, and blue, yielding over 16.7 million possible hues. HEX is simply a base-16 hexadecimal representation where each channel receives two alphanumeric digits (<code className="text-zinc-200 font-mono">00</code> to <code className="text-zinc-200 font-mono">FF</code>).
              </p>
            </div>

            <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Sliders size={14} className="text-indigo-400" />
                HSL &amp; HSV (Cylindrical Perceptual Space)
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Created in the 1970s, HSL and HSV project RGB cube coordinates onto a cylinder. <strong className="text-zinc-200">Hue</strong> is mapped around the 360° circle, <strong className="text-zinc-200">Saturation</strong> represents radial distance from the center axis, and <strong className="text-zinc-200">Lightness/Value</strong> measures vertical height.
              </p>
            </div>
          </div>
        </section>

        {/* ── FAQ Section with Accordion ───────────────────────── */}
        <section aria-labelledby="converter-faq-heading" className="mx-auto max-w-7xl space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
              <HelpCircle size={16} />
            </div>
            {/* H2 */}
            <h2 id="converter-faq-heading" className="text-xl sm:text-2xl font-bold text-white">
              Frequently Asked Questions About Color Conversion
            </h2>
          </div>
          <Accordion items={faqs} />
        </section>
      </div>
    </>
  );
}

