/**
 * app/page.tsx
 * Landing Hub & Dashboard for ChromaCraft (Color & Design Palettes Platform).
 *
 * Showcases the 5 interactive tools, live curated combos preview,
 * comprehensive educational guide, and FAQ section.
 */
import type { Metadata } from "next";
import Link from "next/link";
import {
  Palette,
  SlidersHorizontal,
  Eye,
  Sparkles,
  ArrowRight,
  Lock,
  Code,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Zap,
  RefreshCw,
  BookOpen,
  HelpCircle,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { CURATED_COMBOS } from "@/lib/color-utils";
import { HeroInteractivePalette } from "@/components/HeroInteractivePalette";

export const metadata: Metadata = {
  title: "ChromaCraft – Precision Color & Design Palette Studio",
  description:
    "The modern color studio for developers and designers: interactive palette generator with slot lock controls, multi-stop CSS gradient builder, trending color combos library, and real-time WCAG 2.1 contrast validator.",
  alternates: { canonical: "https://chromacraft.dev" },
  openGraph: {
    title: "ChromaCraft – Precision Color & Design Palette Studio",
    description: "Generate palettes, craft gradients, explore curated color combos, and check WCAG contrast in real time.",
    url: "https://chromacraft.dev",
  },
};

const homeFaqs: AccordionItem[] = [
  {
    question: "What makes ChromaCraft different from traditional color pickers?",
    answer:
      "ChromaCraft was engineered specifically for modern frontend developers and UI/UX designers. Rather than treating colors as isolated hex values, our tools provide holistic design system integration: instant spacebar randomizers with slot freezing, real-time WCAG 2.1 contrast scores, multi-stop CSS gradient builders with GPU composite preview, and direct export to Tailwind CSS v3/v4 theme configs.",
  },
  {
    question: "Are all color tools in ChromaCraft free to use without an account?",
    answer:
      "Yes. All 5 tools and the complete 24+ curated color combos library are 100% free with no sign-ups, paywalls, or feature locks. All mathematical calculations run entirely client-side in your browser for sub-millisecond responsiveness.",
  },
  {
    question: "How do I export palettes into Tailwind CSS?",
    answer:
      "Every tool features a dedicated 'Export' or 'Copy Tailwind' button. This generates a clean JavaScript object formatted for tailwind.config.js under theme.extend.colors that you can immediately paste into your repository.",
  },
  {
    question: "What accessibility standards does the contrast checker evaluate?",
    answer:
      "Our contrast checker computes relative luminance according to the World Wide Web Consortium (W3C) WCAG 2.1 specifications. It grades your color combinations against Level AA (4.5:1 for normal text, 3:1 for large text) and Level AAA (7:1 for normal text, 4.5:1 for large text), plus a 3:1 threshold for UI components and graphic elements.",
  },
];

const appSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ChromaCraft",
  applicationCategory: "DesignApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Professional web tools for colors, palettes, gradients, and WCAG accessibility contrast validation.",
  url: "https://chromacraft.dev",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: homeFaqs.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

const tools = [
  {
    href: "/palette-generator",
    icon: Palette,
    badge: "Spacebar Hotkey",
    title: "Palette Generator & Lock Studio",
    description:
      "Generate harmonious color schemes across 8 modes (SaaS, Analogous, Complementary, Pastel). Lock individual color columns and export directly to Tailwind CSS or CSS variables.",
    features: [
      "Spacebar instant randomizer",
      "Lock individual color slots",
      "One-click HEX, RGB, HSL copy",
      "Export to Tailwind 4 & CSS variables",
    ],
    previewGradient: "from-indigo-600 via-purple-600 to-pink-500",
  },
  {
    href: "/color-combos",
    icon: Layers,
    badge: "32+ Library",
    title: "Trending Color Combos Library",
    description:
      "Handpicked color combinations categorized by SaaS, Dark Mode, Minimalist, Pastel, Cyberpunk, and Nature. Filter, search, and load directly into the Studio.",
    features: [
      "Curated 5-color palettes",
      "Filter by industry and mood",
      "One-click Tailwind & CSS export",
      "Direct 'Open in Studio' launcher",
    ],
    previewGradient: "from-blue-600 via-indigo-600 to-violet-600",
  },
  {
    href: "/gradient-builder",
    icon: SlidersHorizontal,
    badge: "Linear & Radial",
    title: "CSS Gradient Mesh & Linear Builder",
    description:
      "Visual multi-stop gradient creator with interactive 360° angle control, color stop positioning, live UI component simulator, and production-ready CSS/Tailwind code output.",
    features: [
      "Multi-stop timeline (up to 6 stops)",
      "Interactive 360° degree dial",
      "Live mockup UI card preview",
      "Copy standard CSS or Tailwind classes",
    ],
    previewGradient: "from-fuchsia-600 via-rose-500 to-amber-400",
  },
  {
    href: "/contrast-checker",
    icon: Eye,
    badge: "WCAG 2.1 AA/AAA",
    title: "WCAG Contrast & Accessibility Checker",
    description:
      "Verify text readability against World Wide Web Consortium standards with real-time pass/fail matrix, interactive component simulator, and an auto-fix compliance button.",
    features: [
      "Precise (L1 + 0.05)/(L2 + 0.05) formula",
      "Pass/Fail badges for normal & large text",
      "One-click Auto-Fix to pass AA",
      "Real-world typography simulator",
    ],
    previewGradient: "from-emerald-500 via-teal-500 to-cyan-500",
  },
  {
    href: "/color-converter",
    icon: RefreshCw,
    badge: "50-950 Scales",
    title: "Color Code Converter & Shade Generator",
    description:
      "Instant translation between HEX, RGB, HSL, HSV, and CMYK formats. Generate full 11-step Tailwind CSS shade and tint scales (50 to 950) with 1-click copy.",
    features: [
      "Bidirectional multi-format conversion",
      "11-step Tailwind scale (50-950)",
      "Relative luminance calculations",
      "Instant complementary & triadic pairings",
    ],
    previewGradient: "from-amber-500 via-orange-500 to-rose-500",
  },
];

const featuredCombos = CURATED_COMBOS.slice(0, 4);

export default function HomePage() {
  return (
    <>
      <JsonLd data={appSchema} />
      <JsonLd data={faqSchema} />

      <div className="flex-1 bg-zinc-950">
        {/* ── Hero Section ──────────────────────────────────── */}
        <section className="relative overflow-hidden pt-20 pb-16 sm:pb-24 border-b border-zinc-850">
          {/* Subtle background glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30"
          >
            <div className="h-[450px] w-[750px] rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 blur-[130px]" />
          </div>

          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-semibold text-indigo-400 shadow-sm">
              <Sparkles size={13} />
              The Precision Color Studio for Developers &amp; Designers
            </div>

            {/* H1 */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
              Color Systems Built for
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                Modern Craftsmanship
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Generate harmonious palettes with slot locking, explore curated color combinations, craft complex multi-stop CSS gradients, and validate WCAG 2.1 accessibility in real time.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              {[
                "Instant Spacebar Randomizer",
                "32+ Curated Color Combos",
                "Tailwind CSS 4 Export",
                "WCAG 2.1 AA/AAA Matrix",
                "Sub-millisecond Performance",
              ].map((pill) => (
                <span
                  key={pill}
                  className="flex items-center gap-1.5 text-xs text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1 shadow-sm"
                >
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  {pill}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Link
                href="/palette-generator"
                className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-sm px-6 py-3 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10"
              >
                <Palette size={15} />
                <span>Open Palette Studio</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/color-combos"
                className="inline-flex items-center gap-2 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-white font-semibold text-sm px-6 py-3 border border-white/[0.08] transition-all hover:scale-105 active:scale-95 shadow-sm"
              >
                <Layers size={15} />
                <span>Explore Color Combos</span>
              </Link>
            </div>

            {/* Live Interactive Mini-Palette Demo in Hero */}
            <HeroInteractivePalette />
          </div>
        </section>

        {/* ── Featured Curated Combos Section ───────────────── */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-b border-zinc-850">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs uppercase font-mono font-bold tracking-wider text-indigo-400">
                Trending In Design Systems
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                Popular Color Combinations
              </h2>
            </div>
            <Link
              href="/color-combos"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              <span>View all {CURATED_COMBOS.length} curated combos</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredCombos.map((combo) => (
              <Link
                key={combo.id}
                href={`/palette-generator?colors=${combo.colors.map((c) => c.replace("#", "")).join(",")}`}
                className="group rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-4 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="h-14 w-full rounded-xl overflow-hidden flex border border-white/10 mb-3 shadow-inner">
                  {combo.colors.map((hex, i) => (
                    <div
                      key={i}
                      style={{ backgroundColor: hex }}
                      className="flex-1 h-full"
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {combo.name}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {combo.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Interactive Tools Showcase (5 Cards) ─────────────── */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Five Precision Color Utilities
            </h2>
            <p className="text-sm text-zinc-400 mt-2">
              Every tool is engineered with sub-millisecond client-side recalculation, full keyboard support, and instant code export.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map(({ href, icon: Icon, badge, title, description, features, previewGradient }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col justify-between rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 p-6 transition-all duration-200 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1"
              >
                <div className="space-y-4">
                  {/* Card top banner with gradient accent */}
                  <div
                    className={`h-24 w-full rounded-xl bg-gradient-to-tr ${previewGradient} p-4 flex items-start justify-between shadow-lg group-hover:scale-[1.01] transition-transform`}
                  >
                    <div className="p-2 rounded-lg bg-black/40 backdrop-blur-md text-white shadow-md">
                      <Icon size={18} />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20">
                      {badge}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed mt-2">
                      {description}
                    </p>
                  </div>

                  {/* Features list */}
                  <ul className="space-y-2 pt-2 border-t border-zinc-800/80">
                    {features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-xs text-zinc-300">
                        <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Launch CTA link */}
                <div className="pt-6 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                  <span>Launch Tool</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Educational Guide Section ───────────────────────── */}
        <section className="border-t border-zinc-850 bg-zinc-900/40 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="max-w-3xl space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider font-mono">
                <BookOpen size={14} />
                Educational Reference &amp; Guidelines
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Architecting Production-Ready Color Systems
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Color choices directly impact software usability, cognitive load, and legal accessibility compliance. By integrating mathematical color harmony models, developers create interfaces that remain effortless to use across all lighting environments and display devices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                  <Code size={16} />
                  <span>Tailwind &amp; CSS Ready</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Export complete `tailwind.config.js` blocks or CSS `:root` variables with one click, formatted for instant copy-pasting.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                  <ShieldCheck size={16} />
                  <span>WCAG 2.1 Compliant</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Never fail an accessibility audit again. Evaluate exact luminance formulas and auto-adjust text colors to pass Level AA and AAA.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                  <Zap size={16} />
                  <span>No Tracking, 100% Client-Side</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  All color math and conversions run directly in your browser with zero network latency, zero cookies, and zero paywalls.
                </p>
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="pt-8 border-t border-zinc-800/80 space-y-6">
              <div className="flex items-center gap-2">
                <HelpCircle size={16} className="text-indigo-400" />
                <h3 className="text-xl font-bold text-white">
                  Frequently Asked Questions
                </h3>
              </div>
              <Accordion items={homeFaqs} />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
