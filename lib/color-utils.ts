/**
 * lib/color-utils.ts
 * High-performance color conversion, accessibility calculations,
 * and harmonious palette generation algorithms.
 */

export interface RGB {
  r: number; // 0 - 255
  g: number; // 0 - 255
  b: number; // 0 - 255
}

export interface HSL {
  h: number; // 0 - 360
  s: number; // 0 - 100
  l: number; // 0 - 100
}

export type ColorFormat = "hex" | "rgb" | "hsl";

export interface ColorSlot {
  id: string;
  hex: string;
  locked: boolean;
}

export type HarmonyMode =
  | "random"
  | "analogous"
  | "complementary"
  | "triadic"
  | "monochromatic"
  | "pastel"
  | "saas"
  | "vibrant";

/* ─────────────────────────────────────────────────────────
   1. COLOR CONVERSION ALGORITHMS
   ───────────────────────────────────────────────────────── */

/**
 * Validates a 3, 6, or 8-character hex code.
 */
export function isValidHex(hex: string): boolean {
  return /^#?([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/.test(hex.trim());
}

/**
 * Normalizes hex to 6-digit #RRGGBB format.
 */
export function normalizeHex(hex: string): string {
  let clean = hex.trim().replace(/^#/, "");
  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (clean.length === 8) {
    clean = clean.substring(0, 6);
  }
  return `#${clean.toUpperCase()}`;
}

/**
 * Converts a hex string to RGB object.
 * Algorithm: parses hexadecimal pairs into base-10 integers.
 */
export function hexToRgb(hex: string): RGB {
  const norm = normalizeHex(hex).replace("#", "");
  const num = parseInt(norm, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Converts RGB components to a standard 6-character hex string.
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  const toHex = (c: number) => clamp(c).toString(16).padStart(2, "0").toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Converts RGB to HSL.
 * Algorithm:
 * 1. Normalize R, G, B to [0, 1].
 * 2. Find min and max channels.
 * 3. Lightness = (max + min) / 2.
 * 4. Saturation is ratio of channel delta to total range.
 * 5. Hue calculated based on which channel was dominant.
 */
export function rgbToHsl(r: number, g: number, b: number): HSL {
  const normR = r / 255;
  const normG = g / 255;
  const normB = b / 255;

  const max = Math.max(normR, normG, normB);
  const min = Math.min(normR, normG, normB);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case normR:
        h = ((normG - normB) / delta + (normG < normB ? 6 : 0)) * 60;
        break;
      case normG:
        h = ((normB - normR) / delta + 2) * 60;
        break;
      case normB:
        h = ((normR - normG) / delta + 4) * 60;
        break;
    }
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Converts HSL to RGB.
 * Algorithm: standard chromatic conversion mapping cylinder coordinates
 * to cubic sRGB space.
 */
export function hslToRgb(h: number, s: number, l: number): RGB {
  const normH = (h % 360 + 360) % 360;
  const normS = Math.max(0, Math.min(100, s)) / 100;
  const normL = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * normL - 1)) * normS;
  const x = c * (1 - Math.abs(((normH / 60) % 2) - 1));
  const m = normL - c / 2;

  let rPrime = 0;
  let gPrime = 0;
  let bPrime = 0;

  if (normH < 60) {
    rPrime = c;
    gPrime = x;
    bPrime = 0;
  } else if (normH < 120) {
    rPrime = x;
    gPrime = c;
    bPrime = 0;
  } else if (normH < 180) {
    rPrime = 0;
    gPrime = c;
    bPrime = x;
  } else if (normH < 240) {
    rPrime = 0;
    gPrime = x;
    bPrime = c;
  } else if (normH < 300) {
    rPrime = x;
    gPrime = 0;
    bPrime = c;
  } else {
    rPrime = c;
    gPrime = 0;
    bPrime = x;
  }

  return {
    r: Math.round((rPrime + m) * 255),
    g: Math.round((gPrime + m) * 255),
    b: Math.round((bPrime + m) * 255),
  };
}

/**
 * Converts HSL directly to a normalized Hex string.
 */
export function hslToHex(h: number, s: number, l: number): string {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

/**
 * Converts a hex code to the specified output format string.
 */
export function formatColor(hex: string, format: ColorFormat): string {
  if (!isValidHex(hex)) return hex;
  const normalized = normalizeHex(hex);
  if (format === "hex") return normalized;

  const rgb = hexToRgb(normalized);
  if (format === "rgb") {
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  }

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

/* ─────────────────────────────────────────────────────────
   2. ACCESSIBILITY & WCAG 2.1 CONTRAST FORMULAS
   ───────────────────────────────────────────────────────── */

/**
 * Calculates relative luminance following WCAG 2.1 specs.
 * Formula:
 * For each channel c in [R, G, B]:
 *   if (c/255 <= 0.04045) -> c/255 / 12.92
 *   else -> ((c/255 + 0.055) / 1.055) ^ 2.4
 * Luminance L = 0.2126 * R_lin + 0.7152 * G_lin + 0.0722 * B_lin
 */
export function getRelativeLuminance(rgb: RGB): number {
  const transform = (val: number) => {
    const s = val / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };

  const r = transform(rgb.r);
  const g = transform(rgb.g);
  const b = transform(rgb.b);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculates contrast ratio between two hex colors.
 * Formula: (L1 + 0.05) / (L2 + 0.05) where L1 is the lighter luminance.
 * Output: number between 1.0 and 21.0
 */
export function getContrastRatio(fgHex: string, bgHex: string): number {
  if (!isValidHex(fgHex) || !isValidHex(bgHex)) return 1.0;
  const lum1 = getRelativeLuminance(hexToRgb(fgHex));
  const lum2 = getRelativeLuminance(hexToRgb(bgHex));

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  const ratio = (brightest + 0.05) / (darkest + 0.05);
  return Math.round(ratio * 100) / 100;
}

export interface WCAGCompliance {
  ratio: number;
  scoreGrade: "Very Poor" | "Poor" | "Good" | "Excellent";
  aaNormalText: boolean;  // >= 4.5:1
  aaLargeText: boolean;   // >= 3.0:1 (18pt or 14pt bold)
  aaaNormalText: boolean; // >= 7.0:1
  aaaLargeText: boolean;  // >= 4.5:1
  uiComponents: boolean;  // >= 3.0:1
}

/**
 * Evaluates WCAG 2.1 compliance levels for a contrast ratio.
 */
export function checkWCAGCompliance(ratio: number): WCAGCompliance {
  let scoreGrade: WCAGCompliance["scoreGrade"] = "Very Poor";
  if (ratio >= 7.0) scoreGrade = "Excellent";
  else if (ratio >= 4.5) scoreGrade = "Good";
  else if (ratio >= 3.0) scoreGrade = "Poor";

  return {
    ratio,
    scoreGrade,
    aaNormalText: ratio >= 4.5,
    aaLargeText: ratio >= 3.0,
    aaaNormalText: ratio >= 7.0,
    aaaLargeText: ratio >= 4.5,
    uiComponents: ratio >= 3.0,
  };
}

/**
 * Determines whether black or white text has higher contrast against a background.
 * Returns either '#FFFFFF' or '#09090B'.
 */
export function getContrastTextColor(bgHex: string): string {
  if (!isValidHex(bgHex)) return "#FFFFFF";
  const rgb = hexToRgb(bgHex);
  const lum = getRelativeLuminance(rgb);
  // 0.179 is the approximate luminance threshold where contrast with white equals contrast with black
  return lum > 0.179 ? "#09090B" : "#FFFFFF";
}

/* ─────────────────────────────────────────────────────────
   3. HARMONIOUS PALETTE GENERATION
   ───────────────────────────────────────────────────────── */

/**
 * Generates a completely random hex color.
 */
export function getRandomHex(): string {
  const hex = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0");
  return `#${hex.toUpperCase()}`;
}

/**
 * Generates a palette of `count` colors based on a specific harmony algorithm.
 */
export function generateHarmoniousPalette(
  count: number = 5,
  mode: HarmonyMode = "random",
  baseColorHex?: string
): string[] {
  const baseHex = baseColorHex && isValidHex(baseColorHex) ? baseColorHex : getRandomHex();
  const baseRgb = hexToRgb(baseHex);
  const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);

  const colors: string[] = [];

  switch (mode) {
    case "analogous": {
      // Adjacent hues on the color wheel (e.g. step of 20°-30°)
      const step = 28;
      const startHue = (baseHsl.h - Math.floor(count / 2) * step + 360) % 360;
      for (let i = 0; i < count; i++) {
        const h = (startHue + i * step) % 360;
        const s = Math.max(35, Math.min(85, baseHsl.s + (i % 2 === 0 ? 5 : -5)));
        const l = Math.max(25, Math.min(75, baseHsl.l + (i - Math.floor(count / 2)) * 6));
        colors.push(hslToHex(h, s, l));
      }
      break;
    }

    case "complementary": {
      // Base hue and its opposite (+180°), with subtle variation
      const oppositeHue = (baseHsl.h + 180) % 360;
      for (let i = 0; i < count; i++) {
        const useOpposite = i >= Math.ceil(count / 2);
        const targetHue = useOpposite ? oppositeHue : baseHsl.h;
        const h = (targetHue + (i % 2 === 0 ? 0 : 15)) % 360;
        const s = Math.max(40, Math.min(90, baseHsl.s + (i * 4)));
        const l = Math.max(20, Math.min(80, 25 + (i * (50 / count))));
        colors.push(hslToHex(h, s, l));
      }
      break;
    }

    case "triadic": {
      // 3 equidistant points (0°, 120°, 240°)
      const hues = [baseHsl.h, (baseHsl.h + 120) % 360, (baseHsl.h + 240) % 360];
      for (let i = 0; i < count; i++) {
        const h = hues[i % 3];
        const s = Math.max(45, Math.min(85, baseHsl.s + (i * 3)));
        const l = Math.max(25, Math.min(80, 30 + ((i % 3) * 18)));
        colors.push(hslToHex(h, s, l));
      }
      break;
    }

    case "monochromatic": {
      // Same hue, stepped saturation and lightness
      for (let i = 0; i < count; i++) {
        const s = Math.max(20, Math.min(95, 30 + i * 12));
        const l = Math.max(15, Math.min(90, 18 + i * (68 / (count - 1 || 1))));
        colors.push(hslToHex(baseHsl.h, s, l));
      }
      break;
    }

    case "pastel": {
      // High lightness (75-90%), medium-low saturation (35-60%)
      const step = 360 / count;
      for (let i = 0; i < count; i++) {
        const h = (baseHsl.h + i * step + Math.random() * 15) % 360;
        const s = 45 + Math.floor(Math.random() * 20);
        const l = 78 + Math.floor(Math.random() * 12);
        colors.push(hslToHex(h, s, l));
      }
      break;
    }

    case "saas": {
      // Modern SaaS palette: Deep Slate, Accent Indigo/Blue, Success Emerald, Vibrant Coral, Light Neutral
      const saasPalettes = [
        ["#0F172A", "#3B82F6", "#6366F1", "#10B981", "#F8FAFC"],
        ["#18181B", "#6366F1", "#A855F7", "#EC4899", "#FAFAFA"],
        ["#09090B", "#14B8A6", "#06B6D4", "#3B82F6", "#F4F4F5"],
        ["#111827", "#F59E0B", "#EF4444", "#8B5CF6", "#F9FAFB"],
        ["#0A0A0A", "#22C55E", "#3B82F6", "#E11D48", "#FFFFFF"],
      ];
      const chosen = saasPalettes[Math.floor(Math.random() * saasPalettes.length)];
      return chosen.slice(0, count);
    }

    case "vibrant": {
      // High saturation (80-100%), mid lightness (45-60%)
      const step = 360 / count;
      for (let i = 0; i < count; i++) {
        const h = (baseHsl.h + i * step) % 360;
        const s = 85 + Math.floor(Math.random() * 15);
        const l = 50 + Math.floor(Math.random() * 10);
        colors.push(hslToHex(h, s, l));
      }
      break;
    }

    case "random":
    default: {
      for (let i = 0; i < count; i++) {
        colors.push(getRandomHex());
      }
      break;
    }
  }

  return colors;
}

/* ─────────────────────────────────────────────────────────
   4. EXPORT GENERATION UTILITIES
   ───────────────────────────────────────────────────────── */

/**
 * Generates a Tailwind CSS configuration object snippet for colors.
 */
export function exportToTailwind(colors: string[]): string {
  const entries = colors
    .map((c, i) => `        'palette-${i + 1}': '${c.toLowerCase()}',`)
    .join("\n");

  return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
${entries}
      },
    },
  },
};`;
}

/**
 * Generates CSS custom properties (:root variables).
 */
export function exportToCssVariables(colors: string[]): string {
  const vars = colors
    .map((c, i) => `  --color-${i + 1}: ${c.toLowerCase()};`)
    .join("\n");

  return `:root {\n${vars}\n}`;
}

/**
 * Generates JSON array output.
 */
export function exportToJson(colors: string[]): string {
  const data = colors.map((c, i) => {
    const rgb = hexToRgb(c);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return {
      index: i + 1,
      hex: c,
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    };
  });
  return JSON.stringify(data, null, 2);
}

/* ─────────────────────────────────────────────────────────
   5. EXTENDED COLOR MODELS (CMYK, HSV) & SHADE GENERATOR
   ───────────────────────────────────────────────────────── */

export interface CMYK {
  c: number; // 0 - 100%
  m: number; // 0 - 100%
  y: number; // 0 - 100%
  k: number; // 0 - 100%
}

export interface HSV {
  h: number; // 0 - 360
  s: number; // 0 - 100%
  v: number; // 0 - 100%
}

export function rgbToCmyk(r: number, g: number, b: number): CMYK {
  const normR = r / 255;
  const normG = g / 255;
  const normB = b / 255;

  const k = 1 - Math.max(normR, normG, normB);
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  const c = ((1 - normR - k) / (1 - k)) * 100;
  const m = ((1 - normG - k) / (1 - k)) * 100;
  const y = ((1 - normB - k) / (1 - k)) * 100;

  return {
    c: Math.round(c),
    m: Math.round(m),
    y: Math.round(y),
    k: Math.round(k * 100),
  };
}

export function rgbToHsv(r: number, g: number, b: number): HSV {
  const normR = r / 255;
  const normG = g / 255;
  const normB = b / 255;

  const max = Math.max(normR, normG, normB);
  const min = Math.min(normR, normG, normB);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === normR) {
      h = ((normG - normB) / delta + (normG < normB ? 6 : 0)) * 60;
    } else if (max === normG) {
      h = ((normB - normR) / delta + 2) * 60;
    } else {
      h = ((normR - normG) / delta + 4) * 60;
    }
  }

  const s = max === 0 ? 0 : (delta / max) * 100;
  const v = max * 100;

  return {
    h: Math.round(h),
    s: Math.round(s),
    v: Math.round(v),
  };
}

/**
 * Generates a full 11-step Tailwind CSS-like shade and tint scale (50 - 950)
 * given any base hex color.
 */
export function generateTailwindShades(baseHex: string): { step: number; hex: string }[] {
  if (!isValidHex(baseHex)) return [];
  const rgb = hexToRgb(baseHex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const steps = [
    { step: 50, l: 96, sOffset: -15 },
    { step: 100, l: 91, sOffset: -10 },
    { step: 200, l: 82, sOffset: -5 },
    { step: 300, l: 71, sOffset: 0 },
    { step: 400, l: 60, sOffset: 5 },
    { step: 500, l: Math.max(45, Math.min(55, hsl.l)), sOffset: 0 }, // base center
    { step: 600, l: 42, sOffset: 5 },
    { step: 700, l: 33, sOffset: 5 },
    { step: 800, l: 24, sOffset: 0 },
    { step: 900, l: 15, sOffset: -5 },
    { step: 950, l: 9, sOffset: -10 },
  ];

  return steps.map(({ step, l, sOffset }) => {
    const s = Math.max(10, Math.min(100, hsl.s + sOffset));
    return {
      step,
      hex: hslToHex(hsl.h, s, l),
    };
  });
}

/* ─────────────────────────────────────────────────────────
   6. CURATED COLOR COMBOS DATABASE (32+ Built-in Combos)
   ───────────────────────────────────────────────────────── */

export interface ColorCombo {
  id: string;
  name: string;
  category: "SaaS & Tech" | "Dark Mode" | "Minimalist" | "Pastel & Soft" | "Retro & Cyberpunk" | "Nature & Earth" | "Warm & Sunset";
  tags: string[];
  colors: string[];
  description: string;
}

export const CURATED_COMBOS: ColorCombo[] = [
  {
    id: "combo-1",
    name: "Linear Indigo",
    category: "SaaS & Tech",
    tags: ["tech", "developer", "clean", "saas"],
    colors: ["#0F172A", "#1E293B", "#6366F1", "#38BDF8", "#F8FAFC"],
    description: "The signature developer aesthetic inspired by modern productivity interfaces.",
  },
  {
    id: "combo-2",
    name: "Vercel Obsidian",
    category: "Dark Mode",
    tags: ["dark", "minimal", "monochrome", "modern"],
    colors: ["#000000", "#111111", "#333333", "#888888", "#FFFFFF"],
    description: "Ultra-clean high contrast dark palette with crisp greys and pure white typography.",
  },
  {
    id: "combo-3",
    name: "Hyper Aurora",
    category: "Retro & Cyberpunk",
    tags: ["neon", "vibrant", "gradient", "cyberpunk"],
    colors: ["#0B0F19", "#4F46E5", "#7C3AED", "#EC4899", "#F43F5E"],
    description: "Vibrant violet and neon magenta designed for glowing hero sections.",
  },
  {
    id: "combo-4",
    name: "Supabase Emerald",
    category: "SaaS & Tech",
    tags: ["database", "green", "terminal", "saas"],
    colors: ["#0D1117", "#161B22", "#10B981", "#34D399", "#ECFDF5"],
    description: "Developer console aesthetic powered by electric mint and deep graphite.",
  },
  {
    id: "combo-5",
    name: "Tokyo Cyberpunk",
    category: "Retro & Cyberpunk",
    tags: ["neon", "japanese", "synthwave", "dark"],
    colors: ["#090D16", "#FF007F", "#00F0FF", "#FFE600", "#F0F6FC"],
    description: "High-octane synthwave palette with electric cyan and magenta punches.",
  },
  {
    id: "combo-6",
    name: "Scandinavian Oat",
    category: "Minimalist",
    tags: ["nordic", "neutral", "beige", "luxury"],
    colors: ["#292524", "#78716C", "#D6D3D1", "#E7E5E4", "#F5F5F4"],
    description: "Warm neutral stone and linen tones suited for premium editorial and architectural UI.",
  },
  {
    id: "combo-7",
    name: "Matcha Botanical",
    category: "Nature & Earth",
    tags: ["organic", "tea", "earth", "calm"],
    colors: ["#1B2E1E", "#3E6B48", "#82A77D", "#C7D9B7", "#F4F7F2"],
    description: "Serene botanical greens balanced with soft matcha foam accents.",
  },
  {
    id: "combo-8",
    name: "Velvet Sunset",
    category: "Warm & Sunset",
    tags: ["sunset", "dusk", "warm", "gradient"],
    colors: ["#1C1024", "#5B21B6", "#BE185D", "#F97316", "#FDE047"],
    description: "Dusk sky transition ranging from deep twilight violet to golden hour amber.",
  },
  {
    id: "combo-9",
    name: "Cotton Candy Cloud",
    category: "Pastel & Soft",
    tags: ["pastel", "playful", "soft", "light"],
    colors: ["#FCE7F3", "#DDD6FE", "#BAE6FD", "#BBF7D0", "#FEF08A"],
    description: "Gentle confectionary pastels for whimsical consumer apps and illustrations.",
  },
  {
    id: "combo-10",
    name: "Nord Frost",
    category: "Dark Mode",
    tags: ["arctic", "nord", "ice", "cool"],
    colors: ["#2E3440", "#3B4252", "#88C0D0", "#81A1C1", "#ECEFF4"],
    description: "The beloved arctic color palette built around polar night blues and glacial accents.",
  },
  {
    id: "combo-11",
    name: "Monokai Pro",
    category: "SaaS & Tech",
    tags: ["code", "ide", "syntax", "dark"],
    colors: ["#221F22", "#FF6188", "#FC9867", "#FFD866", "#A9DC76"],
    description: "The classic programmer syntax palette celebrated for high code legibility.",
  },
  {
    id: "combo-12",
    name: "Terracotta Clay",
    category: "Nature & Earth",
    tags: ["earth", "ceramic", "warm", "boho"],
    colors: ["#422006", "#9A3412", "#EA580C", "#FDBA74", "#FFEDD5"],
    description: "Rich fired earthenware tones evoking sunbaked pottery and desert canyons.",
  },
  {
    id: "combo-13",
    name: "Lavender Mist",
    category: "Pastel & Soft",
    tags: ["purple", "lavender", "wellness", "soft"],
    colors: ["#2E1065", "#7C3AED", "#C4B5FD", "#EDE9FE", "#FAF5FF"],
    description: "Calming lilac and violet hues ideal for meditation and wellness brands.",
  },
  {
    id: "combo-14",
    name: "Swiss Precision",
    category: "Minimalist",
    tags: ["helvetica", "red", "bauhaus", "minimal"],
    colors: ["#18181B", "#DC2626", "#71717A", "#E4E4E7", "#FAFAFA"],
    description: "International typographic style with stark carbon, crisp paper, and Swiss red.",
  },
  {
    id: "combo-15",
    name: "Deep Oceanic",
    category: "Nature & Earth",
    tags: ["sea", "navy", "cyan", "deep"],
    colors: ["#022C43", "#053F5C", "#429EBD", "#9FE7F5", "#F7FBFD"],
    description: "Abyssal marine navy ascending through azure waves to crisp seafoam.",
  },
  {
    id: "combo-16",
    name: "Solarized Dark",
    category: "Dark Mode",
    tags: ["solarized", "console", "linux", "contrast"],
    colors: ["#002B36", "#073642", "#2AA198", "#268BD2", "#FDF6E3"],
    description: "Scientifically calibrated color scheme designed to reduce optical eye strain.",
  },
  {
    id: "combo-17",
    name: "Desert Peach",
    category: "Warm & Sunset",
    tags: ["peach", "apricot", "warm", "summer"],
    colors: ["#7C2D12", "#C2410C", "#FB923C", "#FED7AA", "#FFF7ED"],
    description: "Sun-drenched apricot and warm terracotta suitable for e-commerce and lifestyle.",
  },
  {
    id: "combo-18",
    name: "Synthwave Highway",
    category: "Retro & Cyberpunk",
    tags: ["80s", "retro", "grid", "vaporwave"],
    colors: ["#1A0B2E", "#7B2CBF", "#E0AAFF", "#FF70A6", "#FF9770"],
    description: "Nostalgic 1980s neon highway palette with dreamlike twilight saturation.",
  },
  {
    id: "combo-19",
    name: "OLED Pitch Black",
    category: "Dark Mode",
    tags: ["oled", "battery", "pitch", "contrast"],
    colors: ["#000000", "#121212", "#1E1E1E", "#38BDF8", "#F1F5F9"],
    description: "True black #000000 foundation tailored for OLED displays and battery savings.",
  },
  {
    id: "combo-20",
    name: "Sage & Linen",
    category: "Minimalist",
    tags: ["sage", "neutral", "botanical", "editorial"],
    colors: ["#2C3531", "#116466", "#D1E8E2", "#ECE5C8", "#FAF9F6"],
    description: "Understated earthy sage paired with warm parchment and unbleached linen.",
  },
  {
    id: "combo-21",
    name: "Stripe Electric",
    category: "SaaS & Tech",
    tags: ["fintech", "payment", "electric", "saas"],
    colors: ["#0A2540", "#635BFF", "#00D4FF", "#0048E5", "#F6F9FC"],
    description: "The global fintech benchmark: commanding deep navy and radiant cobalt.",
  },
  {
    id: "combo-22",
    name: "Rose Quartz & Cream",
    category: "Pastel & Soft",
    tags: ["rose", "blush", "skincare", "luxury"],
    colors: ["#881337", "#FB7185", "#FECDD3", "#FFF1F2", "#FAFAFA"],
    description: "Delicate dusty rose and ivory crafted for modern skincare and cosmetic portfolios.",
  },
  {
    id: "combo-23",
    name: "Canyon Red Rock",
    category: "Nature & Earth",
    tags: ["sedona", "canyon", "red", "stone"],
    colors: ["#451A03", "#78350F", "#B45309", "#F59E0B", "#FEF3C7"],
    description: "Sunlit sandstone mesas and canyon striations reflecting afternoon golden light.",
  },
  {
    id: "combo-24",
    name: "Cyber Emerald",
    category: "Retro & Cyberpunk",
    tags: ["matrix", "green", "terminal", "cyber"],
    colors: ["#022C22", "#065F46", "#10B981", "#6EE7B7", "#F0FDF4"],
    description: "Phosphor CRT monitor greens given modern high-DPI vibrancy and polish.",
  },
];

