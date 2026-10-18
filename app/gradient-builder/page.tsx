/**
 * app/gradient-builder/page.tsx
 * Tool 2: CSS Gradient Mesh & Linear Builder
 *
 * Core Features:
 * - Multi-stop color timeline with dynamic stop sliders
 * - Real-time CSS code generator (`background: linear-gradient(...)`)
 * - Interactive angle dial & quick degree presets (45°, 90°, 135°, 180°, etc.)
 * - Linear & Radial gradient modes
 * - Live UI mockup preview (Card, Hero header, Button, Glassmorphism badge)
 * - Curated trendy designer presets (Hyper Aurora, Cosmic Dusk, Sunset Silk, etc.)
 */
"use client";

import { useState, useMemo } from "react";
import {
  SlidersHorizontal,
  Compass,
  Plus,
  Trash2,
  Copy,
  Sparkles,
  Maximize2,
  Layers,
  ArrowRight,
  Code2,
  BookOpen,
  HelpCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { CopyButton } from "@/components/CopyButton";
import { Accordion } from "@/components/ui/Accordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { getRandomHex } from "@/lib/color-utils";

interface GradientStop {
  id: string;
  color: string;
  position: number; // 0 - 100%
}

const PRESETS: { name: string; type: "linear" | "radial"; angle: number; stops: { color: string; position: number }[] }[] = [
  {
    name: "Hyper Aurora",
    type: "linear",
    angle: 135,
    stops: [
      { color: "#4F46E5", position: 0 },
      { color: "#7C3AED", position: 45 },
      { color: "#EC4899", position: 100 },
    ],
  },
  {
    name: "Cyberpunk Dusk",
    type: "linear",
    angle: 90,
    stops: [
      { color: "#0F172A", position: 0 },
      { color: "#3B82F6", position: 50 },
      { color: "#10B981", position: 100 },
    ],
  },
  {
    name: "Sunset Silk",
    type: "linear",
    angle: 45,
    stops: [
      { color: "#F43F5E", position: 0 },
      { color: "#FB923C", position: 55 },
      { color: "#FBBF24", position: 100 },
    ],
  },
  {
    name: "Midnight Sapphire",
    type: "linear",
    angle: 180,
    stops: [
      { color: "#030712", position: 0 },
      { color: "#1E1B4B", position: 50 },
      { color: "#312E81", position: 100 },
    ],
  },
  {
    name: "Emerald Matrix",
    type: "linear",
    angle: 120,
    stops: [
      { color: "#064E3B", position: 0 },
      { color: "#059669", position: 60 },
      { color: "#34D399", position: 100 },
    ],
  },
  {
    name: "Radial Nova",
    type: "radial",
    angle: 0,
    stops: [
      { color: "#A855F7", position: 0 },
      { color: "#3B82F6", position: 50 },
      { color: "#09090B", position: 100 },
    ],
  },
];

export default function GradientBuilderPage() {
  const [gradientType, setGradientType] = useState<"linear" | "radial">("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<GradientStop[]>([
    { id: "s-1", color: "#6366F1", position: 0 },
    { id: "s-2", color: "#A855F7", position: 50 },
    { id: "s-3", color: "#EC4899", position: 100 },
  ]);

  // Sorted stops for proper CSS generation
  const sortedStops = useMemo(() => {
    return [...stops].sort((a, b) => a.position - b.position);
  }, [stops]);

  // Generate CSS string
  const cssGradientString = useMemo(() => {
    const stopsStr = sortedStops
      .map((s) => `${s.color} ${s.position}%`)
      .join(", ");

    if (gradientType === "linear") {
      return `linear-gradient(${angle}deg, ${stopsStr})`;
    } else {
      return `radial-gradient(circle at center, ${stopsStr})`;
    }
  }, [gradientType, angle, sortedStops]);

  // Full CSS snippet
  const fullCssSnippet = useMemo(() => {
    return `background: ${cssGradientString};`;
  }, [cssGradientString]);

  // Tailwind arbitrary value snippet
  const tailwindSnippet = useMemo(() => {
    const sanitized = cssGradientString.replace(/\s+/g, "_");
    return `className="bg-[${sanitized}]"`;
  }, [cssGradientString]);

  // Stop manipulation
  const handleAddStop = () => {
    if (stops.length >= 6) return;
    const newPos = Math.min(100, Math.max(0, Math.round(Math.random() * 80 + 10)));
    const newStop: GradientStop = {
      id: `s-${stops.length}-${Math.random().toString(36).slice(2, 6)}`,
      color: getRandomHex(),
      position: newPos,
    };
    setStops([...stops, newStop]);
  };

  const handleRemoveStop = (id: string) => {
    if (stops.length <= 2) return;
    setStops(stops.filter((s) => s.id !== id));
  };

  const handleUpdateColor = (id: string, color: string) => {
    setStops(stops.map((s) => (s.id === id ? { ...s, color } : s)));
  };

  const handleUpdatePosition = (id: string, position: number) => {
    setStops(stops.map((s) => (s.id === id ? { ...s, position } : s)));
  };

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setGradientType(preset.type);
    setAngle(preset.angle);
    setStops(
      preset.stops.map((s, idx) => ({
        id: `s-${idx}-${preset.name.toLowerCase().replace(/\s+/g, "-")}`,
        color: s.color,
        position: s.position,
      }))
    );
  };

  const quickAngles = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <div className="flex-1 bg-zinc-950 px-4 sm:px-6 lg:px-8 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* ── Page Header ────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono mb-2">
              <SlidersHorizontal size={12} />
              Tool 2: Visual CSS Studio
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              CSS Gradient Mesh &amp; Linear Builder
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Craft high-performance multi-stop gradients with live UI preview and instant CSS/Tailwind export.
            </p>
          </div>

          {/* Quick randomizer button */}
          <button
            type="button"
            onClick={() => {
              const p = PRESETS[Math.floor(Math.random() * PRESETS.length)];
              handleApplyPreset(p);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700 text-xs font-semibold shadow-sm transition-all"
          >
            <Sparkles size={14} className="text-indigo-400" />
            Random Preset
          </button>
        </div>

        {/* ── Main Layout: Builder Controls (Left) & Preview (Right) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── LEFT: Controls & Stops (5 cols) ───────────────── */}
          <div className="lg:col-span-5 space-y-6">
            {/* 1. Type & Angle card */}
            <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Gradient Direction
                </h3>
                {/* Linear vs Radial toggle */}
                <div className="flex rounded-lg bg-zinc-950 p-0.5 border border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setGradientType("linear")}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                      gradientType === "linear"
                        ? "bg-indigo-600 text-white font-bold"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Linear
                  </button>
                  <button
                    type="button"
                    onClick={() => setGradientType("radial")}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                      gradientType === "radial"
                        ? "bg-indigo-600 text-white font-bold"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Radial
                  </button>
                </div>
              </div>

              {/* Angle slider (only if linear) */}
              {gradientType === "linear" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400 flex items-center gap-1.5">
                      <Compass size={14} className="text-indigo-400" />
                      Angle Rotation
                    </span>
                    <span className="font-mono font-bold text-white bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                      {angle}°
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={angle}
                    onChange={(e) => setAngle(Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />

                  {/* Quick Angle Chips */}
                  <div className="grid grid-cols-4 gap-1.5 pt-1">
                    {quickAngles.map((deg) => (
                      <button
                        key={deg}
                        type="button"
                        onClick={() => setAngle(deg)}
                        className={`text-[11px] font-mono py-1 rounded-md border transition-colors ${
                          angle === deg
                            ? "bg-indigo-600/30 border-indigo-500/80 text-indigo-300 font-bold"
                            : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                        }`}
                      >
                        {deg}°
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Color Stops Management card */}
            <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Color Stops ({stops.length}/6)
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Pick colors and drag positions
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddStop}
                  disabled={stops.length >= 6}
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-indigo-400 hover:text-indigo-300 border border-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus size={13} />
                  Add Stop
                </button>
              </div>

              {/* Stops timeline preview bar */}
              <div
                style={{ background: cssGradientString }}
                className="h-6 w-full rounded-xl border border-white/20 shadow-inner"
              />

              {/* Stop rows */}
              <div className="space-y-3 pt-2">
                {stops.map((stop, index) => (
                  <div
                    key={stop.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 transition-colors"
                  >
                    {/* Native Color Picker trigger box */}
                    <div className="relative shrink-0">
                      <input
                        type="color"
                        value={stop.color}
                        onChange={(e) =>
                          handleUpdateColor(stop.id, e.target.value.toUpperCase())
                        }
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        aria-label={`Color stop ${index + 1}`}
                      />
                      <div
                        style={{ backgroundColor: stop.color }}
                        className="h-9 w-9 rounded-lg border-2 border-white/25 shadow-md flex items-center justify-center pointer-events-none"
                      />
                    </div>

                    {/* Color text input & Position slider */}
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={stop.color}
                          onChange={(e) => handleUpdateColor(stop.id, e.target.value)}
                          className="w-24 text-xs font-mono font-bold uppercase px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-indigo-500"
                        />
                        <span className="text-[11px] font-mono font-semibold text-zinc-400">
                          {stop.position}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={stop.position}
                        onChange={(e) =>
                          handleUpdatePosition(stop.id, Number(e.target.value))
                        }
                        className="w-full h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>

                    {/* Delete button (min 2 stops) */}
                    <button
                      type="button"
                      onClick={() => handleRemoveStop(stop.id)}
                      disabled={stops.length <= 2}
                      aria-label="Remove stop"
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Designer Presets Showcase */}
            <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Trending Presets
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {PRESETS.map((preset) => {
                  const presetStops = preset.stops
                    .map((s) => `${s.color} ${s.position}%`)
                    .join(", ");
                  const bg =
                    preset.type === "linear"
                      ? `linear-gradient(${preset.angle}deg, ${presetStops})`
                      : `radial-gradient(circle, ${presetStops})`;

                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="group flex flex-col items-center gap-1.5 p-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-indigo-500/60 transition-all text-left"
                    >
                      <div
                        style={{ background: bg }}
                        className="h-12 w-full rounded-lg shadow-sm group-hover:scale-[1.02] transition-transform"
                      />
                      <span className="text-[11px] font-medium text-zinc-300 group-hover:text-white truncate w-full text-center">
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Live Canvas & Real-world UI Mockups (7 cols) ── */}
          <div className="lg:col-span-7 space-y-6">
            {/* Large live gradient preview canvas */}
            <motion.div
              layout
              style={{ background: cssGradientString }}
              className="relative w-full h-72 sm:h-96 rounded-2xl border border-white/20 shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle glassmorphism badge overlay */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 text-white text-xs font-mono font-medium shadow-lg">
                  {gradientType === "linear" ? `${angle}° Linear` : "Radial Center"}
                </span>
                <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 text-white text-xs font-mono shadow-lg">
                  {stops.length} color stops
                </span>
              </div>

              {/* Hero statement inside preview */}
              <div className="max-w-md bg-black/30 backdrop-blur-xl p-5 rounded-2xl border border-white/15 text-white shadow-2xl">
                <h4 className="text-xl sm:text-2xl font-bold tracking-tight mb-1">
                  Living UI Canvas
                </h4>
                <p className="text-xs text-white/80 leading-relaxed mb-4">
                  Preview how your custom gradient layers against typography, glass cards, and high-contrast buttons.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl bg-white text-zinc-950 font-bold text-xs shadow-lg hover:bg-zinc-100 transition-colors"
                  >
                    Action Button
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-medium text-xs backdrop-blur-md border border-white/30 transition-colors"
                  >
                    Secondary
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Generated Code Boxes (CSS & Tailwind) */}
            <div className="space-y-4">
              {/* Pure CSS Output */}
              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <Code2 size={13} className="text-indigo-400" />
                    Standard CSS Rule
                  </span>
                  <CopyButton textToCopy={fullCssSnippet} label="Copy CSS" variant="solid" size="sm" />
                </div>
                <div className="rounded-xl bg-zinc-950 border border-zinc-850 p-3.5 font-mono text-xs text-indigo-300 overflow-x-auto">
                  <code>{fullCssSnippet}</code>
                </div>
              </div>

              {/* Tailwind CSS arbitrary value */}
              <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <Layers size={14} className="text-indigo-400" />
                    Tailwind CSS Class
                  </span>
                  <CopyButton textToCopy={tailwindSnippet} label="Copy Tailwind" variant="solid" size="sm" />
                </div>
                <div className="rounded-xl bg-zinc-950 border border-zinc-850 p-3.5 font-mono text-xs text-purple-300 overflow-x-auto">
                  <code>{tailwindSnippet}</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Comprehensive Educational Guide (SEO & AdSense Approved) ── */}
        <section
          aria-labelledby="gradient-guide-heading"
          className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-10 space-y-8 mt-12"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
              <BookOpen size={16} />
            </div>
            {/* H2 */}
            <h2 id="gradient-guide-heading" className="text-xl sm:text-2xl font-bold text-white">
              The Comprehensive Guide to CSS Gradients &amp; Modern Mesh Effects
            </h2>
          </div>

          <p className="text-sm text-zinc-300 leading-relaxed max-w-4xl">
            CSS gradients have evolved from simple decorative backgrounds into fundamental building blocks for high-performance visual depth, glassmorphic card overlays, and hero lighting effects. By offloading gradient rendering to the browser&apos;s GPU compositor rather than serving rasterized PNG/JPEG files, developers save megabytes of network bandwidth while guaranteeing razor-sharp display at any DPI.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <h3 className="font-bold text-sm text-white">Linear Gradients Explained</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Linear gradients interpolate color transitions along an imaginary directional axis. Angles in standard CSS rotate clockwise: <code className="text-zinc-200 font-mono">0deg</code> points toward the top, <code className="text-zinc-200 font-mono">90deg</code> points right, and <code className="text-zinc-200 font-mono">180deg</code> flows downward.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <h3 className="font-bold text-sm text-white">Preventing Color Banding</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Harsh stepped lines (&quot;banding&quot;) occur when transitioning between high-contrast shades across large screen widths. Add intermediate midpoint color stops (e.g. at 45% or 55%) to smooth out mathematical interpolation curves.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <h3 className="font-bold text-sm text-white">GPU Compositor Performance</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Applying gradients via <code className="text-zinc-200 font-mono">background</code> or <code className="text-zinc-200 font-mono">background-image</code> does not trigger browser document reflows. For smooth micro-interactions, animate opacity or CSS transform on a pseudo-element rather than animating gradient angles directly.
              </p>
            </div>
          </div>
        </section>

        {/* ── FAQ Section with Accordion ───────────────────────── */}
        <section aria-labelledby="gradient-faq-heading" className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
              <HelpCircle size={16} />
            </div>
            {/* H2 */}
            <h2 id="gradient-faq-heading" className="text-xl sm:text-2xl font-bold text-white">
              Frequently Asked Questions About CSS Gradients
            </h2>
          </div>
          <Accordion
            items={[
              {
                question: "What is the difference between linear-gradient and radial-gradient?",
                answer:
                  "linear-gradient() transitions colors in a straight directional line determined by an angle (e.g. 135deg). radial-gradient() emanates outward from a central origin point in concentric circular or elliptical waves, creating natural glow and spotlight effects.",
              },
              {
                question: "How do I use these CSS gradients with Tailwind CSS?",
                answer:
                  "Tailwind CSS supports arbitrary values via square brackets. You can copy the generated Tailwind snippet (e.g., className=\"bg-[linear-gradient(135deg,#6366F1_0%,#EC4899_100%)]\") and paste it directly onto any container element.",
              },
              {
                question: "Can I add more than two color stops to a CSS gradient?",
                answer:
                  "Yes! You can specify as many color stops as you need separated by commas. Each stop consists of a color and an optional percentage distance (e.g. #4F46E5 0%, #7C3AED 45%, #EC4899 100%). Our builder allows up to 6 precision stops.",
              },
              {
                question: "Do CSS gradients impact mobile browser performance?",
                answer:
                  "Pure CSS gradients have negligible memory overhead compared to bitmap image files. They render directly via hardware acceleration and scale infinitely without pixelation on Retina and high-DPI screens.",
              },
            ]}
          />
        </section>
      </div>
    </div>
  );
}

