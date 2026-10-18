/**
 * app/color-combos/page.tsx
 * Tool 4: Trending Color Combos & Palettes Library
 *
 * SEO & AdSense Strategy:
 * - H1, H2, H3 targeting "color combos", "best color combinations for web design", "trending color palettes"
 * - 450+ word comprehensive educational guide on color theory and the 60-30-10 rule
 * - FAQ section with accessible accordion & FAQPage JSON-LD schema
 * - Dynamic category filtering, search, and direct 1-click loading into the Palette Studio
 */
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Palette,
  Search,
  SlidersHorizontal,
  ExternalLink,
  Copy,
  Check,
  Code,
  FileCode,
  BookOpen,
  HelpCircle,
  Sparkles,
  Layers,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CopyButton } from "@/components/CopyButton";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  CURATED_COMBOS,
  ColorCombo,
  exportToTailwind,
  exportToCssVariables,
  getContrastTextColor,
} from "@/lib/color-utils";

const CATEGORIES = [
  "All",
  "SaaS & Tech",
  "Dark Mode",
  "Minimalist",
  "Pastel & Soft",
  "Retro & Cyberpunk",
  "Nature & Earth",
  "Warm & Sunset",
] as const;

/* ── FAQ Data (Drives both UI and JSON-LD schema) ─────────────────────────── */
const faqs: AccordionItem[] = [
  {
    question: "What is the 60-30-10 color rule in UI and web design?",
    answer:
      "The 60-30-10 rule is a timeless decorating and user interface principle that creates visual harmony. 60% of your interface should be your dominant base color (typically neutral backgrounds such as deep slate or clean off-white), 30% should be your secondary structure color (cards, navigation bars, sidebars, borders), and 10% should be reserved for your vibrant accent color (CTA buttons, status badges, active links). This distribution prevents sensory overload while ensuring interactive elements capture user attention.",
  },
  {
    question: "How do I choose the best color combination for a SaaS web application?",
    answer:
      "For B2B and SaaS platforms, readability, hierarchy, and accessibility are paramount. Start with a neutral dark foundation (#0F172A or #09090B) or clean light canvas (#F8FAFC), choose an authoritative primary brand accent (indigo #6366F1, cobalt #3B82F6, or emerald #10B981), and establish strict semantic utility shades: green for success, amber for warnings, and rose for destructive actions. Ensure your text-to-background contrast ratio meets WCAG 2.1 AA standards (at least 4.5:1).",
  },
  {
    question: "Can I export these color combos directly into Tailwind CSS?",
    answer:
      "Yes. Every color combo card in our library features a dedicated 'Copy Tailwind' button that exports a ready-to-paste `theme.extend.colors` snippet compatible with Tailwind CSS v3 and Tailwind CSS v4. You can also click 'Open in Studio' to lock, customize, or add additional color stops.",
  },
  {
    question: "What is the difference between RGB, HSL, and HEX color spaces?",
    answer:
      "HEX (#RRGGBB) is a base-16 representation of RGB values and is the standard shorthand in web design. RGB (0–255 per channel) is an additive light model used by computer displays. HSL (Hue 0–360°, Saturation 0–100%, Lightness 0–100%) is a cylindrical coordinate model designed to mirror human color perception, making it vastly easier for developers to programmatically generate shades, tints, and accessible contrast steps.",
  },
  {
    question: "How do color combinations affect website conversion rates?",
    answer:
      "While no single color universally increases conversions, color contrast and visual hierarchy directly influence user behavior. When your primary call-to-action button uses a high-contrast accent color that appears nowhere else on the page (adhering to the 10% accent rule), visual friction decreases and click-through rates systematically increase.",
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
  "@type": "CollectionPage",
  name: "Trending Color Combinations & Palettes Library",
  description:
    "Curated collection of aesthetic color combinations, brand palettes, and design system color schemes with instant Tailwind CSS and CSS variables export.",
  url: "https://chromacraft.dev/color-combos",
};

export default function ColorCombosPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter combos based on category and search query
  const filteredCombos = useMemo(() => {
    return CURATED_COMBOS.filter((combo) => {
      const matchesCategory =
        selectedCategory === "All" || combo.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        combo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        combo.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        combo.colors.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <>
      <JsonLd data={faqSchema} />
      <JsonLd data={pageSchema} />

      <div className="flex-1 bg-zinc-950 px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* ── Page Header ────────────────────────────────────── */}
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-800/80 pb-8">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono">
                <Sparkles size={12} />
                Curated Design System Swatches
              </div>
              {/* H1 — High Intent Target */}
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Trending Color Combinations &amp; Palettes
              </h1>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                Explore hand-curated color combinations designed for SaaS interfaces, dark mode apps, minimal branding, and digital products. One-click copy for Tailwind CSS, CSS variables, or customize in the Studio.
              </p>
            </div>

            {/* Quick stats badge */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-right">
                <span className="block text-xl font-bold font-mono text-white">
                  {CURATED_COMBOS.length}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-mono">
                  Curated Combos
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Filter Bar & Search ─────────────────────────────── */}
        <div className="mx-auto max-w-7xl space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search palettes by name, tag, or hex..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <span className="text-xs text-zinc-400 font-mono">
              Showing {filteredCombos.length} of {CURATED_COMBOS.length} combos
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-medium px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20"
                    : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850 border border-zinc-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Palette Grid ─────────────────────────────────────── */}
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredCombos.map((combo) => {
                const tailwindSnippet = exportToTailwind(combo.colors);
                const cssSnippet = exportToCssVariables(combo.colors);
                const studioUrl = `/palette-generator?colors=${combo.colors
                  .map((c) => c.replace("#", ""))
                  .join(",")}`;

                return (
                  <motion.div
                    key={combo.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="group rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700/80 p-5 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="space-y-4">
                      {/* Combo header: name & category */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-sm text-white group-hover:text-indigo-400 transition-colors">
                            {combo.name}
                          </h3>
                          <span className="text-[11px] font-mono text-zinc-400">
                            {combo.category}
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-750">
                          {combo.colors.length} shades
                        </span>
                      </div>

                      {/* 5-Color Swatch Strip */}
                      <div className="h-16 w-full rounded-xl overflow-hidden flex border border-white/10 shadow-inner">
                        {combo.colors.map((hex, i) => (
                          <div
                            key={i}
                            style={{ backgroundColor: hex }}
                            className="group/swatch relative flex-1 h-full cursor-pointer transition-transform hover:scale-105 hover:z-10 flex items-center justify-center"
                            title={`Click to copy ${hex}`}
                          >
                            <span
                              style={{ color: getContrastTextColor(hex) }}
                              className="opacity-0 group-hover/swatch:opacity-100 text-[10px] font-mono font-bold tracking-tight"
                            >
                              {hex.slice(1, 4)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Hex codes row with one-click copy */}
                      <div className="grid grid-cols-5 gap-1 text-center">
                        {combo.colors.map((hex, i) => (
                          <div key={i} className="flex flex-col items-center">
                            <span className="text-[10px] font-mono font-semibold text-zinc-400 truncate w-full">
                              {hex}
                            </span>
                            <CopyButton
                              textToCopy={hex}
                              size="sm"
                              variant="ghost"
                              className="mt-0.5 p-1 !h-6"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-zinc-400 leading-relaxed pt-1 border-t border-zinc-800/60">
                        {combo.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {combo.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="pt-5 mt-4 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <CopyButton
                          textToCopy={tailwindSnippet}
                          label="Tailwind"
                          variant="solid"
                          size="sm"
                        />
                        <CopyButton
                          textToCopy={cssSnippet}
                          label="CSS"
                          variant="solid"
                          size="sm"
                        />
                      </div>

                      {/* Customize in Studio link */}
                      <Link
                        href={studioUrl}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
                      >
                        <span>Open in Studio</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Comprehensive Educational Guide (SEO & AdSense Approved) ── */}
        <section
          aria-labelledby="combos-guide-heading"
          className="mx-auto max-w-7xl rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-10 space-y-8"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
              <BookOpen size={16} />
            </div>
            {/* H2 */}
            <h2 id="combos-guide-heading" className="text-xl sm:text-2xl font-bold text-white">
              The Comprehensive Guide to Harmonious Color Combinations in UI/UX Design
            </h2>
          </div>

          <p className="text-sm text-zinc-300 leading-relaxed max-w-4xl">
            Color is one of the most immediate and influential communication channels in digital product design. When executed correctly, harmonious color combinations guide user intuition, clarify typographic hierarchy, elevate brand perception, and dramatically increase conversion metrics. Below is an engineering and design breakdown of how to systematically curate, implement, and test color combinations for enterprise and consumer web applications.
          </p>

          {/* H3 — The 60-30-10 Rule */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers size={15} className="text-indigo-400" />
              1. The 60-30-10 Rule: Structural Color Distribution
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Borrowed from classical interior architecture, the <strong className="text-zinc-200">60-30-10 rule</strong> is the foundation of clean, fatigue-free software interfaces:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                <span className="text-xs font-mono font-bold text-indigo-400">60% — Dominant Canvas</span>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  The primary background space. For dark mode, use deep carbon tones (<code className="text-zinc-200 font-mono">#0A0A0A</code> or <code className="text-zinc-200 font-mono">#0F172A</code>). For light mode, use soft paper whites (<code className="text-zinc-200 font-mono">#F8FAFC</code>).
                </p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                <span className="text-xs font-mono font-bold text-indigo-400">30% — Secondary Structure</span>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Structural visual anchors: card containers, sidebars, table headers, and borders. These create depth and separate content sections cleanly.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                <span className="text-xs font-mono font-bold text-indigo-400">10% — Radiant Accent</span>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Call-to-action buttons, active navigation indicators, and key metrics. Strict rationing ensures that primary conversion targets command immediate eye focus.
                </p>
              </div>
            </div>
          </div>

          {/* H3 — Selecting Color Harmonies */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Palette size={15} className="text-indigo-400" />
              2. Scientific Color Harmonies: Geometric Relations on the Wheel
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Every curated combination in ChromaCraft is algorithmically anchored to the standard 360° color wheel:
            </p>
            <ul className="space-y-2.5 text-sm text-zinc-400 list-disc list-inside">
              <li>
                <strong className="text-zinc-200">Analogous Harmonies:</strong> Hues situated within 30° of each other on the color wheel (e.g., Indigo, Sky Blue, and Teal). Creates serene, cohesive moods favored by meditation and developer tools.
              </li>
              <li>
                <strong className="text-zinc-200">Complementary Harmonies:</strong> Opposing hues situated exactly 180° apart (e.g., Deep Navy and Warm Amber). Delivers maximum visual tension and instant call-to-action distinction.
              </li>
              <li>
                <strong className="text-zinc-200">Triadic Harmonies:</strong> Three equidistant hues separated by 120° (e.g., Blue, Crimson, and Amber). Offers balanced vibrancy popular in gaming, creative tooling, and consumer apps.
              </li>
            </ul>
          </div>

          {/* H3 — Step-by-Step Implementation */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Code size={15} className="text-indigo-400" />
              3. Step-by-Step Implementation in Modern Frontend Frameworks
            </h3>
            <ol className="space-y-2 text-sm text-zinc-400 list-decimal list-inside leading-relaxed">
              <li>
                <strong className="text-zinc-200">Select a curated combo</strong> from this library that matches your product's emotional tone (e.g., Linear Indigo for B2B SaaS, Scandinavian Oat for luxury editorial).
              </li>
              <li>
                <strong className="text-zinc-200">Click &apos;Tailwind&apos;</strong> to copy the ready-made JSON object directly into your <code className="text-zinc-200 font-mono">tailwind.config.js</code> under <code className="text-zinc-200 font-mono">theme.extend.colors</code>.
              </li>
              <li>
                <strong className="text-zinc-200">Test contrast ratios</strong> using our built-in WCAG Contrast Checker tool before committing to production to verify AA/AAA compliance for text over background shades.
              </li>
              <li>
                <strong className="text-zinc-200">Use semantic tokens</strong> (e.g. <code className="text-zinc-200 font-mono">bg-surface</code>, <code className="text-zinc-200 font-mono">text-primary</code>) rather than hardcoded hex values to support future dark/light theme switching.
              </li>
            </ol>
          </div>
        </section>

        {/* ── FAQ Section with Accordion ───────────────────────── */}
        <section aria-labelledby="combos-faq-heading" className="mx-auto max-w-7xl space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
              <HelpCircle size={16} />
            </div>
            {/* H2 */}
            <h2 id="combos-faq-heading" className="text-xl sm:text-2xl font-bold text-white">
              Frequently Asked Questions About Color Combinations
            </h2>
          </div>
          <Accordion items={faqs} />
        </section>
      </div>
    </>
  );
}

