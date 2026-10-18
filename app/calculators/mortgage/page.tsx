/**
 * app/calculators/mortgage/page.tsx
 * Tool 2: Mortgage & Amortization Payoff Estimator.
 *
 * SEO strategy:
 *  - H1/H2/H3 target "mortgage amortization calculator", "mortgage payoff estimator",
 *    "extra payment savings"
 *  - 350-word educational guide
 *  - FAQ accordion + FAQPage JSON-LD
 */
import type { Metadata } from "next";
import { MortgageCalculator } from "@/components/calculators/MortgageCalculator";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { Calculator, BookOpen, HelpCircle } from "lucide-react";

/* ── SEO Metadata ─────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Mortgage Amortization Calculator – Payoff Estimator with Extra Payments",
  description:
    "Use our free mortgage amortization calculator to see your full payment schedule, total interest paid, and how extra monthly or yearly payments can save you thousands and shorten your loan.",
  keywords: [
    "mortgage amortization calculator",
    "mortgage payoff estimator",
    "extra payment mortgage calculator",
    "how much interest will I pay on my mortgage",
    "mortgage payoff calculator with extra payments",
    "amortization schedule",
    "loan payoff date calculator",
  ],
  alternates: { canonical: "https://propcalc.io/calculators/mortgage" },
  openGraph: {
    title: "Mortgage Amortization & Payoff Calculator | PropCalc",
    description:
      "See your full amortization schedule, total interest, and how extra payments slash years off your mortgage — free and instant.",
    url: "https://propcalc.io/calculators/mortgage",
  },
};

/* ── FAQ data ─────────────────────────────────────────────────────────────── */
const faqs: AccordionItem[] = [
  {
    question: "How is a mortgage payment calculated?",
    answer:
      "The standard mortgage payment formula is: M = P × [r(1+r)^n] ÷ [(1+r)^n − 1], where P is the loan principal, r is the monthly interest rate (annual rate ÷ 12), and n is the total number of payments (term in years × 12). This produces a fixed payment that covers both principal and interest, with the interest portion decreasing and the principal portion increasing over time.",
  },
  {
    question: "What is an amortization schedule?",
    answer:
      "An amortization schedule is a complete table of every loan payment, showing how much goes to interest vs. principal each month, and your remaining loan balance after each payment. In the early years of a mortgage, the majority of each payment covers interest. As the loan matures, more of each payment goes toward reducing the principal balance.",
  },
  {
    question: "How much can I save by making extra payments?",
    answer:
      "Extra payments go 100% toward reducing your principal balance, which reduces the total interest you pay over the life of the loan. On a $320,000 mortgage at 7.25% for 30 years, adding just $200/month in extra payments saves approximately $68,000 in interest and pays off the loan 5 years early. Use our calculator to model your exact scenario.",
  },
  {
    question: "When should I apply extra payments — monthly or annually?",
    answer:
      "Monthly extra payments are slightly more effective because they reduce your balance sooner, resulting in less interest accruing each subsequent month. However, if you receive annual bonuses or tax refunds, a large lump-sum yearly payment is still highly effective and can be easier to manage within a budget. Our calculator models both strategies simultaneously.",
  },
  {
    question: "Does making extra payments change my required monthly payment?",
    answer:
      "No. Extra payments reduce your loan balance and shorten the payoff timeline, but your required minimum monthly payment stays the same throughout the loan term. You pay off the loan sooner, but you are never obligated to continue the extra amount — you can stop at any time.",
  },
  {
    question: "What is the difference between a fixed-rate and adjustable-rate mortgage?",
    answer:
      "A fixed-rate mortgage keeps the same interest rate for the entire loan term, making payments predictable. An adjustable-rate mortgage (ARM) typically starts with a lower fixed rate for an initial period (e.g., 5/1 ARM = fixed for 5 years) and then adjusts annually based on a market index. This calculator models fixed-rate mortgages; for ARM analysis, model multiple scenarios using different rate inputs.",
  },
];

/* ── JSON-LD ─────────────────────────────────────────────────────────────── */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Mortgage Amortization Payoff Calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free mortgage calculator showing full amortization schedule, total interest paid, and interest/time savings from extra principal payments.",
  url: "https://propcalc.io/calculators/mortgage",
};

/* ── Page component ─────────────────────────────────────────────────────── */
export default function MortgagePage() {
  return (
    <>
      <JsonLd data={faqSchema} />
      <JsonLd data={toolSchema} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">

        {/* ── Page header ──────────────────────────────────── */}
        <div className="max-w-3xl">
          <p className="text-xs text-[var(--text-muted)] mb-3">
            Tools / <span className="text-[var(--text)]">Mortgage Calculator</span>
          </p>
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/15 text-[var(--accent)]">
              <Calculator size={20} />
            </span>
            {/* H1 — primary keyword target */}
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text)] leading-tight">
              Mortgage &amp; Amortization Payoff Estimator
            </h1>
          </div>
          <p className="text-[var(--text-muted)] text-sm leading-relaxed">
            See your complete{" "}
            <strong className="text-[var(--text)]">amortization schedule</strong>,{" "}
            <strong className="text-[var(--text)]">total interest paid</strong>, and exactly how much{" "}
            <strong className="text-[var(--text)]">extra payments can save you</strong> — in time and money.
          </p>
        </div>

        {/* ── Interactive Calculator ────────────────────────── */}
        <MortgageCalculator />

        {/* ── Educational Guide ─────────────────────────────── */}
        <section
          aria-labelledby="guide-heading"
          className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8 space-y-6"
        >
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-[var(--accent)]" />
            {/* H2 */}
            <h2 id="guide-heading" className="text-xl font-bold text-[var(--text)]">
              How to Use the Mortgage Amortization Calculator
            </h2>
          </div>

          {/* H3 */}
          <div>
            <h3 className="font-semibold text-[var(--text)] mb-3">Step-by-Step Instructions</h3>
            <ol className="space-y-3 text-sm text-[var(--text-muted)] leading-relaxed list-decimal list-inside">
              <li>
                <strong className="text-[var(--text)]">Enter your loan amount</strong> — the total amount
                borrowed (purchase price minus down payment for a purchase, or your current balance for a
                refinance analysis).
              </li>
              <li>
                <strong className="text-[var(--text)]">Set the annual interest rate</strong> — your loan's
                stated APR. For investment properties this is typically 0.25–0.75% higher than
                primary-residence rates.
              </li>
              <li>
                <strong className="text-[var(--text)]">Choose your loan term</strong> — 30-year mortgages
                produce lower monthly payments; 15-year mortgages save significantly on interest.
              </li>
              <li>
                <strong className="text-[var(--text)]">Add optional extra payments</strong> — enter any
                additional monthly or yearly amount you plan to apply to principal. The calculator
                instantly shows your new payoff date and total interest saved.
              </li>
              <li>
                <strong className="text-[var(--text)]">Review the amortization table</strong> — every row
                shows your payment split: how much goes to interest (red) vs. principal (green) vs.
                extra principal (purple).
              </li>
            </ol>
          </div>

          {/* H3 — Mortgage formula */}
          <div>
            <h3 className="font-semibold text-[var(--text)] mb-3">
              The Mortgage Payment Formula Explained
            </h3>
            <div className="rounded-lg bg-[var(--surface-2)] border border-[var(--border)] p-5 font-mono text-sm text-[var(--accent)] mb-3">
              M = P × [r(1+r)^n] ÷ [(1+r)^n − 1]
            </div>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Where: <strong className="text-[var(--text)]">M</strong> = monthly payment,{" "}
              <strong className="text-[var(--text)]">P</strong> = loan principal,{" "}
              <strong className="text-[var(--text)]">r</strong> = monthly interest rate (annual rate ÷ 12),{" "}
              <strong className="text-[var(--text)]">n</strong> = total payments (years × 12).
              This formula ensures that each payment covers the month's accrued interest plus a portion
              of principal, such that the balance reaches exactly zero at the end of the term.
            </p>
          </div>

          {/* H3 — Real example */}
          <div>
            <h3 className="font-semibold text-[var(--text)] mb-3">
              Real-World Example: \$320,000 Mortgage at 7.25% for 30 Years
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-[var(--text-muted)]">
              <div className="rounded-lg bg-[var(--surface-2)] border border-[var(--border)] p-4">
                <p className="font-semibold text-[var(--text)] mb-2">Without Extra Payments</p>
                <ul className="space-y-1.5">
                  <li>Monthly Payment: <strong className="text-[var(--text)]">~\$2,183</strong></li>
                  <li>Total Interest Paid: <strong className="text-red-400">~\$465,844</strong></li>
                  <li>Payoff: <strong className="text-[var(--text)]">30 years</strong></li>
                  <li>Total Cost: <strong className="text-[var(--text)]">~\$785,844</strong></li>
                </ul>
              </div>
              <div className="rounded-lg bg-[var(--surface-2)] border border-[var(--border)] p-4">
                <p className="font-semibold text-[var(--text)] mb-2">With \$300/month Extra</p>
                <ul className="space-y-1.5">
                  <li>Monthly Payment: <strong className="text-[var(--text)]">~\$2,483</strong></li>
                  <li>Total Interest Paid: <strong className="text-emerald-400">~\$332,000</strong></li>
                  <li>Payoff: <strong className="text-emerald-400">~22 years (8 years sooner)</strong></li>
                  <li>Interest Saved: <strong className="text-emerald-400">~\$133,000</strong></li>
                </ul>
              </div>
            </div>
            <p className="mt-3 text-sm text-[var(--text-muted)]">
              Extra payments are one of the highest-return, risk-free "investments" available to homeowners.
              The effective return equals your mortgage rate — guaranteed and tax-free in many jurisdictions.
            </p>
          </div>
        </section>

        {/* ── FAQ Section ──────────────────────────────────── */}
        <section aria-labelledby="faq-heading">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle size={18} className="text-[var(--accent)]" />
            {/* H2 */}
            <h2 id="faq-heading" className="text-xl font-bold text-[var(--text)]">
              Frequently Asked Questions — Mortgage Calculator
            </h2>
          </div>
          <Accordion items={faqs} />
        </section>

      </div>
    </>
  );
}

