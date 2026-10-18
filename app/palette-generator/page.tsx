/**
 * app/palette-generator/page.tsx
 * Tool 1: Interactive Palette Generator & Lock Studio
 *
 * SEO & AdSense Strategy:
 * - H1, H2, H3 targeting "color palette generator", "palette randomizer", "lock color palette"
 * - 400+ word educational guide on color harmonies and UI palette creation
 * - Accessible FAQ accordion & FAQPage JSON-LD schema
 * - Query parameter support (?colors=hex1,hex2...) to load any palette from the Combos Library
 * - Built-in quick preset selector with 24+ curated aesthetic combos
 */
"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Lock,
  Unlock,
  Share2,
  Download,
  Plus,
  Minus,
  RotateCcw,
  Copy,
  Check,
  Code,
  FileCode,
  FileJson,
  X,
  SlidersHorizontal,
  BookOpen,
  HelpCircle,
  Layers,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ColorCard } from "@/components/ColorCard";
import { CopyButton } from "@/components/CopyButton";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  ColorSlot,
  ColorFormat,
  HarmonyMode,
  generateHarmoniousPalette,
  getRandomHex,
  exportToTailwind,
  exportToCssVariables,
  exportToJson,
  isValidHex,
  normalizeHex,
  CURATED_COMBOS,
} from "@/lib/color-utils";

const INITIAL_COLORS = ["#0F172A", "#3B82F6", "#6366F1", "#10B981", "#F8FAFC"];

/* ── FAQ Data ─────────────────────────────────────────────────────────────── */
const faqs: AccordionItem[] = [
  {
    question: "How does the Palette Generator locking feature work?",
    answer:
      "When you find a color you love, click the Lock icon on its column. When you press Spacebar or click 'Generate', only the unlocked columns will randomize into new harmonious shades while your locked colors remain frozen. This allows you to incrementally sculpt the ideal 5-color palette around a fixed brand anchor.",
  },
  {
    question: "What harmony algorithms are supported in ChromaCraft?",
    answer:
      "ChromaCraft features 8 mathematical harmony modes: Modern SaaS (tech developer palettes), Analogous (adjacent wheel hues), Complementary (opposing wheel hues), Triadic (three equidistant wheel points), Monochromatic (single hue stepped across lightness and saturation), Pastel (high lightness, medium saturation), Vibrant/Neon (high saturation), and Pure Random.",
  },
  {
    question: "Can I export my palette directly to Tailwind CSS or Figma?",
    answer:
      "Yes. Click the 'Export' button in the toolbar to access instant code snippets for Tailwind CSS (theme.extend.colors), CSS custom properties (:root variables), and raw JSON arrays. You can also copy individual hex codes with one click.",
  },
  {
    question: "How do I share a palette with teammates or clients?",
    answer:
      "Click the 'Share' button in the export modal or copy the URL with parameters. Any custom palette can be encoded into a shareable link that loads the exact hex shades for anyone who opens it.",
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

const appSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Interactive Palette Generator & Lock Studio",
  applicationCategory: "DesignApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Generate harmonious color palettes with spacebar shortcuts, column lock controls, and direct export to Tailwind CSS.",
  url: "https://chromacraft.dev/palette-generator",
};

function PaletteStudioInner() {
  const searchParams = useSearchParams();

  // Initialize slots, checking query parameter first
  const [slots, setSlots] = useState<ColorSlot[]>(() => {
    return INITIAL_COLORS.map((hex, i) => ({
      id: `slot-${i}`,
      hex,
      locked: false,
    }));
  });

  // Check query parameter on mount
  useEffect(() => {
    const urlColors = searchParams.get("colors");
    if (urlColors) {
      const parsedHexes = urlColors
        .split(",")
        .map((c) => (c.startsWith("#") ? c : `#${c}`))
        .filter((c) => isValidHex(c))
        .map((c) => normalizeHex(c));

      if (parsedHexes.length >= 2) {
        setSlots(
          parsedHexes.map((hex, i) => ({
            id: `slot-${i}`,
            hex,
            locked: false,
          }))
        );
      }
    }
  }, [searchParams]);

  const [format, setFormat] = useState<ColorFormat>("hex");
  const [harmony, setHarmony] = useState<HarmonyMode>("saas");
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportTab, setExportTab] = useState<"tailwind" | "css" | "json">("tailwind");

  // Generate new harmonious colors for unlocked slots
  const generatePalette = useCallback(() => {
    setSlots((prevSlots) => {
      const lockedAnchor = prevSlots.find((s) => s.locked);
      const newColors = generateHarmoniousPalette(
        prevSlots.length,
        harmony,
        lockedAnchor?.hex
      );

      return prevSlots.map((slot, index) => {
        if (slot.locked) return slot;
        return {
          ...slot,
          hex: newColors[index] || getRandomHex(),
        };
      });
    });
  }, [harmony]);

  // Spacebar hotkey listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable ||
        exportModalOpen
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        generatePalette();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [generatePalette, exportModalOpen]);

  // Toggle lock state
  const handleToggleLock = (id: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, locked: !s.locked } : s))
    );
  };

  // Direct manual color change
  const handleChangeColor = (id: string, newHex: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, hex: newHex } : s))
    );
  };

  // Add color slot (max 8)
  const handleAddSlot = () => {
    if (slots.length >= 8) return;
    setSlots((prev) => [
      ...prev,
      {
        id: `slot-${prev.length}-${Math.random().toString(36).slice(2, 6)}`,
        hex: getRandomHex(),
        locked: false,
      },
    ]);
  };

  // Remove color slot (min 3)
  const handleRemoveSlot = (id: string) => {
    if (slots.length <= 3) return;
    setSlots((prev) => prev.filter((s) => s.id !== id));
  };

  // Lock / Unlock All
  const allLocked = slots.every((s) => s.locked);
  const handleToggleAllLock = () => {
    setSlots((prev) => prev.map((s) => ({ ...s, locked: !allLocked })));
  };

  // Load a curated combo
  const handleLoadCombo = (comboId: string) => {
    const found = CURATED_COMBOS.find((c) => c.id === comboId);
    if (found) {
      setSlots(
        found.colors.map((hex, i) => ({
          id: `slot-${i}`,
          hex,
          locked: false,
        }))
      );
    }
  };

  // Export code previews
  const rawHexList = useMemo(() => slots.map((s) => s.hex), [slots]);
  const exportTailwind = useMemo(() => exportToTailwind(rawHexList), [rawHexList]);
  const exportCss = useMemo(() => exportToCssVariables(rawHexList), [rawHexList]);
  const exportJsonData = useMemo(() => exportToJson(rawHexList), [rawHexList]);

  return (
    <div className="flex flex-col flex-1 min-h-[calc(100vh-4rem)] bg-zinc-950">
      {/* ── Top Studio Toolbar ──────────────────────────────── */}
      <div className="sticky top-16 z-40 border-b border-white/[0.07] bg-zinc-950/85 backdrop-blur-xl px-4 sm:px-6 py-2.5">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3">
          {/* Left: Mode Title & Harmony selector & Quick Combos */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Harmony Selector Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/90 border border-white/[0.08] shadow-sm">
              <span className="text-[11px] font-semibold text-zinc-400">
                Harmony:
              </span>
              <select
                value={harmony}
                onChange={(e) => setHarmony(e.target.value as HarmonyMode)}
                className="text-xs font-semibold bg-transparent text-white focus:outline-none cursor-pointer pr-1"
              >
                <option value="saas" className="bg-zinc-900 text-white">Modern SaaS</option>
                <option value="analogous" className="bg-zinc-900 text-white">Analogous</option>
                <option value="complementary" className="bg-zinc-900 text-white">Complementary</option>
                <option value="triadic" className="bg-zinc-900 text-white">Triadic</option>
                <option value="monochromatic" className="bg-zinc-900 text-white">Monochromatic</option>
                <option value="pastel" className="bg-zinc-900 text-white">Pastel Aesthetic</option>
                <option value="vibrant" className="bg-zinc-900 text-white">Vibrant / Neon</option>
                <option value="random" className="bg-zinc-900 text-white">Pure Random</option>
              </select>
            </div>

            {/* Quick Preset Combos Dropdown */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/90 border border-white/[0.08] shadow-sm">
              <span className="text-[11px] font-semibold text-zinc-400">
                Preset:
              </span>
              <select
                onChange={(e) => handleLoadCombo(e.target.value)}
                defaultValue=""
                className="text-xs font-semibold bg-transparent text-white focus:outline-none cursor-pointer max-w-[140px] truncate"
              >
                <option value="" disabled className="bg-zinc-900 text-zinc-400">
                  Select Combo...
                </option>
                {CURATED_COMBOS.map((c) => (
                  <option key={c.id} value={c.id} className="bg-zinc-900 text-white">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Format toggle: HEX / RGB / HSL */}
            <div className="flex items-center rounded-full bg-zinc-900/90 p-0.5 border border-white/[0.08] shadow-sm">
              {(["hex", "rgb", "hsl"] as ColorFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setFormat(fmt)}
                  className={`text-[11px] font-mono uppercase px-2.5 py-1 rounded-full transition-all ${
                    format === fmt
                      ? "bg-white/[0.14] text-white font-bold shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Slot Controls, Lock All & Generate CTA */}
          <div className="flex items-center gap-2">
            {/* Slot count adjuster */}
            <div className="flex items-center rounded-full bg-zinc-900/90 border border-white/[0.08] p-0.5 text-xs shadow-sm">
              <button
                type="button"
                onClick={() => handleRemoveSlot(slots[slots.length - 1].id)}
                disabled={slots.length <= 3}
                aria-label="Remove color column"
                className="p-1 rounded-full text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Minus size={12} />
              </button>
              <span className="px-2 font-mono text-zinc-300 font-semibold text-[11px]">
                {slots.length}
              </span>
              <button
                type="button"
                onClick={handleAddSlot}
                disabled={slots.length >= 8}
                aria-label="Add color column"
                className="p-1 rounded-full text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Plus size={12} />
              </button>
            </div>

            {/* Lock / Unlock all */}
            <button
              type="button"
              onClick={handleToggleAllLock}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 border border-white/[0.08] text-zinc-300 hover:text-white transition-colors"
            >
              {allLocked ? <Lock size={12} className="text-amber-400" /> : <Unlock size={12} />}
              <span>{allLocked ? "Unlock" : "Lock All"}</span>
            </button>

            {/* Export modal trigger */}
            <button
              type="button"
              onClick={() => setExportModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/[0.08] text-zinc-200 hover:text-white transition-colors"
            >
              <Code size={13} />
              <span>Export</span>
            </button>

            {/* Generate CTA Button */}
            <button
              type="button"
              onClick={generatePalette}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-full bg-white text-zinc-950 hover:bg-zinc-200 shadow-lg shadow-white/5 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Sparkles size={13} className="text-indigo-600" />
              <span>Generate</span>
              <kbd className="hidden md:inline text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-zinc-200 text-zinc-800">
                Space
              </kbd>
            </button>
          </div>
        </div>
      </div>

      {/* ── Multi-Column Palette Studio Layout ─────────────── */}
      <div className="flex-1 flex flex-col sm:flex-row w-full overflow-hidden p-2 sm:p-0 gap-2 sm:gap-0">
        {slots.map((slot) => (
          <div key={slot.id} className="flex-1 min-w-0">
            <ColorCard
              slot={slot}
              format={format}
              onToggleLock={handleToggleLock}
              onChangeColor={handleChangeColor}
              onRemoveSlot={handleRemoveSlot}
              canRemove={slots.length > 3}
            />
          </div>
        ))}
      </div>

      {/* ── Bottom Quick Instructions Bar ───────────────────── */}
      <div className="border-t border-zinc-850 bg-zinc-950/80 px-4 py-2.5 text-center text-xs text-zinc-400 flex flex-wrap items-center justify-center gap-6">
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-750 font-mono text-[10px] text-zinc-300">
            Space
          </kbd>
          Generate fresh scheme
        </span>
        <span className="hidden sm:inline text-zinc-700">•</span>
        <span className="flex items-center gap-1.5">
          <Lock size={12} className="text-amber-400" />
          Click lock to freeze favorite slots
        </span>
        <span className="hidden sm:inline text-zinc-700">•</span>
        <span className="flex items-center gap-1.5">
          <Copy size={12} className="text-zinc-400" />
          Click hex value to copy to clipboard
        </span>
      </div>

      {/* ── Educational Guide & AdSense Content Below Tool ─────── */}
      <section
        aria-labelledby="palette-guide-heading"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-8"
      >
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
              <BookOpen size={16} />
            </div>
            {/* H2 */}
            <h2 id="palette-guide-heading" className="text-xl sm:text-2xl font-bold text-white">
              How to Create Professional Color Palettes with the Lock Studio
            </h2>
          </div>

          <p className="text-sm text-zinc-300 leading-relaxed max-w-4xl">
            Building a production-ready color palette requires balancing brand identity, structural interface clarity, and accessibility standards. Rather than guessing hex codes, the ChromaCraft Palette Studio allows you to incrementally sculpt harmonious 5-to-8 color schemes using mathematical harmonies.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <h3 className="font-bold text-sm text-white">1. Anchor Your Primary Brand Hue</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Start by typing your core logo or product color into the first slot. Click the <strong className="text-zinc-200">Lock icon</strong> to keep it permanently frozen.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <h3 className="font-bold text-sm text-white">2. Select Your Harmony Algorithm</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Choose a mode such as <strong className="text-zinc-200">Modern SaaS</strong> or <strong className="text-zinc-200">Analogous</strong>. Press the Spacebar to generate complementary secondary and background colors that harmonize naturally with your locked anchor.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <h3 className="font-bold text-sm text-white">3. Export to Tailwind or CSS</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Click <strong className="text-zinc-200">Export</strong> to copy ready-made <code className="text-zinc-200 font-mono">tailwind.config.js</code> or CSS variable blocks directly into your codebase.
              </p>
            </div>
          </div>
        </div>

        {/* ── FAQ Section with Accordion ───────────────────────── */}
        <div className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
              <HelpCircle size={16} />
            </div>
            {/* H2 */}
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Frequently Asked Questions About Palette Generation
            </h2>
          </div>
          <Accordion items={faqs} />
        </div>
      </section>

      {/* ── Export Palette Modal ────────────────────────────── */}
      <AnimatePresence>
        {exportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/50">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
                    <Code size={15} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-zinc-100">
                      Export Palette Configuration
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Copy directly into your project codebase
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setExportModalOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Color swatch preview bar */}
              <div className="flex h-8 w-full border-b border-zinc-800">
                {slots.map((s) => (
                  <div
                    key={s.id}
                    style={{ backgroundColor: s.hex }}
                    className="flex-1 h-full"
                    title={s.hex}
                  />
                ))}
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-2 px-6 pt-4 border-b border-zinc-800 text-xs">
                <button
                  type="button"
                  onClick={() => setExportTab("tailwind")}
                  className={`flex items-center gap-1.5 pb-2.5 font-medium border-b-2 transition-colors ${
                    exportTab === "tailwind"
                      ? "border-indigo-500 text-white font-semibold"
                      : "border-transparent text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <FileCode size={14} />
                  Tailwind CSS
                </button>
                <button
                  type="button"
                  onClick={() => setExportTab("css")}
                  className={`flex items-center gap-1.5 pb-2.5 font-medium border-b-2 transition-colors ${
                    exportTab === "css"
                      ? "border-indigo-500 text-white font-semibold"
                      : "border-transparent text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Code size={14} />
                  CSS Variables
                </button>
                <button
                  type="button"
                  onClick={() => setExportTab("json")}
                  className={`flex items-center gap-1.5 pb-2.5 font-medium border-b-2 transition-colors ${
                    exportTab === "json"
                      ? "border-indigo-500 text-white font-semibold"
                      : "border-transparent text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <FileJson size={14} />
                  JSON
                </button>
              </div>

              {/* Code display */}
              <div className="p-6 overflow-y-auto flex-1">
                <div className="relative rounded-xl bg-zinc-950 border border-zinc-800 p-4 font-mono text-xs text-zinc-300">
                  <div className="absolute top-3 right-3">
                    <CopyButton
                      textToCopy={
                        exportTab === "tailwind"
                          ? exportTailwind
                          : exportTab === "css"
                          ? exportCss
                          : exportJsonData
                      }
                      label="Copy Code"
                      variant="solid"
                      size="sm"
                    />
                  </div>
                  <pre className="overflow-x-auto pr-24 leading-relaxed">
                    {exportTab === "tailwind" && exportTailwind}
                    {exportTab === "css" && exportCss}
                    {exportTab === "json" && exportJsonData}
                  </pre>
                </div>
              </div>

              {/* Modal footer */}
              <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950/50 flex items-center justify-between text-xs text-zinc-400">
                <span>{slots.length} colors configured</span>
                <button
                  type="button"
                  onClick={() => setExportModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-colors"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PaletteGeneratorPage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <JsonLd data={appSchema} />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center bg-zinc-950 text-zinc-400 text-xs font-mono">
            Loading Studio...
          </div>
        }
      >
        <PaletteStudioInner />
      </Suspense>
    </>
  );
}
