/**
 * components/ui/Footer.tsx
 * Minimalist site footer with tool links and legal copy.
 */
import Link from "next/link";
import { Building2 } from "lucide-react";

const tools = [
  { href: "/calculators/rental-roi", label: "Rental ROI Calculator" },
  { href: "/calculators/mortgage",   label: "Mortgage Amortization" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--accent)] text-white">
                <Building2 size={14} />
              </span>
              <span className="font-semibold text-sm">PropCalc</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-xs">
              Free, instant real-estate calculators for investors, agents, and homeowners.
              Always accurate. Never paywalled.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
              Tools
            </h3>
            <ul className="space-y-2">
              {tools.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
              Disclaimer
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Estimates are for educational purposes only and do not constitute
              financial, legal, or tax advice. Always consult a licensed professional
              before making investment decisions.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--border)] pt-6 text-center text-xs text-[var(--text-muted)]">
          © {year} PropCalc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

