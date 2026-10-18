/**
 * app/layout.tsx
 * Root layout with Inter font, dark theme styling, global metadata, Navbar, and Footer.
 */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chromacraft.dev"),
  title: {
    default: "ChromaCraft – Color & Design Palette Studio",
    template: "%s | ChromaCraft",
  },
  description:
    "Production-grade color tools for developers and designers: interactive palette generator with slot locking, multi-stop CSS gradient mesh builder, and WCAG 2.1 accessibility contrast checker.",
  keywords: [
    "color palette generator",
    "palette lock studio",
    "css gradient generator",
    "gradient mesh builder",
    "wcag contrast checker",
    "color accessibility checker",
    "tailwind color palette",
    "hex rgb hsl converter",
    "design system color tools",
  ],
  authors: [{ name: "ChromaCraft" }],
  creator: "ChromaCraft",
  openGraph: {
    type: "website",
    siteName: "ChromaCraft",
    title: "ChromaCraft – Precision Color Tools for Modern Builders",
    description:
      "Interactive palette randomizer with lock controls, multi-stop CSS gradient builder, and WCAG 2.1 contrast validator.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChromaCraft – Color & Design Palette Studio",
    description: "Generate palettes, build gradients, and check WCAG contrast in real time.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full dark`}>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
