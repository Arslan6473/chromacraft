/**
 * app/calculators/rental-roi/page.tsx
 * Tool 1: Rental Property ROI & Cash-Flow Calculator.
 *
 * SEO strategy:
 *  - H1/H2/H3 target "rental property return calculator", "cap rate estimator", "cash flow"
 *  - 350-word educational guide below the tool
 *  - FAQ accordion + FAQPage JSON-LD
 *  - Canonical URL, OpenGraph, structured data
 */
import type { Metadata } from "next";
import { RentalROICalculator } from "@/components/calculators/RentalROICalculator";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { TrendingUp, BookOpen, HelpCircle } from "lucide-react";

/* ── SEO Metadata ─────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Rental Property ROI Calculator – Cash Flow & Cap Rate Estimator",
  description:
    "Calculate your rental property return on investment (ROI), cap rate, net operating income (NOI), and monthly cash flow in seconds. Free rental property calculator for investors.",
  keywords: [
    "rental property ROI calculator",
    "cap rate estimator",
    "cash flow calculator rental property",
    "investment property calculator",
    "cash on cash return calculator",
    "NOI calculator",
    "rental yield calculator",
  ],
  alternates: { canonical: "https://propcalc.io/calculators/rental-roi" },
  openGraph: {
    title: "Rental Property ROI & Cap Rate Calculator | PropCalc",
    description: "Instantly compute cash-on-cash return, cap rate, NOI, and monthly cash flow for any rental property.",
    url: "https://propcalc.io/calculators/rental-roi",
  },
};

/* ── FAQ data (drives both the accordion UI and the JSON-LD schema) ───────── */
const faqs: AccordionItem[] = [
  {
    question: "What is Cash-on-Cash Return and what is a good rate?",
    answer:
      "Cash-on-Cash (CoC) Return measures the annual pre-tax cash flow you receive relative to the total cash you invested (down payment + closing costs). Formula: CoC = Annual Cash Flow ÷ Total Cash Invested × 100. Most investors target a CoC return of 6–12%. Markets with strong appreciation may accept lower CoC (4–6%), while cash-flow-focused markets should aim above 8%.",
  },
  {
    question: "How is Cap Rate calculated and what does it tell me?",
    answer:
      "Cap Rate (Capitalization Rate) = Net Operating Income ÷ Property Value × 100. It measures a property's income-generating potential independent of financing. A higher cap rate generally means more income relative to price but may reflect higher risk or a less desirable location. Typical cap rates range from 4% (prime urban markets) to 10%+ (rural or high-risk areas).",
  },
  {
    question: "What is Net Operating Income (NOI)?",
    answer:
      "NOI = Effective Gross Income − Operating Expenses. Effective Gross Income is your annual rent adjusted for vacancy losses. Operating Expenses include property taxes, insurance, and maintenance — but NOT the mortgage payment. NOI is the core income metric lenders and appraisers use to value income-producing properties.",
  },
  {
    question: "Why does the calculator include a vacancy rate?",
    answer:
      "Even well-managed properties experience periods without a tenant due to turnover, repairs, or local market conditions. The national average vacancy rate is 5–8%. Including it gives you a realistic, conservative income projection rather than an optimistic best-case scenario.",
  },
  {
    question: "What closing costs does the calculator assume?",
    answer:
      "The calculator uses a 2% closing cost estimate (of purchase price) as a conservative default. Actual closing costs vary by state and lender, typically ranging from 1.5% to 4% for investment properties. You can adjust your actual down payment percentage to reflect a different total cash invested.",
  },
  {
    question: "What is the Gross Rent Multiplier (GRM)?",
    answer:
      "GRM = Purchase Price ÷ Annual Gross Rent. It's a quick, rough valuation shortcut — the lower the number, the better the deal relative to rent. A GRM under 12 is often considered favorable. GRM doesn't account for expenses or financing, so use it alongside NOI and Cap Rate for a complete picture.",
  },
];

/* ── FAQ JSON-LD schema ───────────────────────────────────────────────────── */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

/* ── SoftwareApplication schema for this tool ─────────────────────────────── */
const toolSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Rental Property ROI Calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free rental property calculator that computes cash-on-cash return, cap rate, NOI, and monthly cash flow based on your property inputs.",
  url: "https://propcalc.io/calculators/rental-roi",
};

/* ── Page component ────────────────────────────────────────────────────────── */
export default function RentalROIPage() {
  return (
    <>
      {/* Structured data */}
      <JsonLd data={faqSchema} />
      <JsonLd data={toolSchema} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">

        {/* ── Page header ──────────────────────────────────── */}
        <div className="max-w-3xl">
          {/* Breadcrumb */}
          <p className="text-xs text-[var(--text-muted)] mb-3">
            Tools / <span className="text-[var(--text)]">Rental ROI Calculator</span>
          </p>

          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/15 text-[var(--accent)]">
              <TrendingUp size={20} />
            </span>
            {/* H1 — primary keyword target */}
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text)] leading-tight">
              Rental Property Return (ROI) &amp; Cash Flow Calculator
            </h1>
          </div>

          <p className="text-[var(--text-muted)] text-sm leading-relaxed">
            Enter your property details to instantly calculate{" "}
            <strong className="text-[var(--text)]">cash-on-cash return</strong>,{" "}
            <strong className="text-[var(--text)]">cap rate</strong>,{" "}
            <strong className="text-[var(--text)]">net operating income</strong>, and{" "}
            <strong className="text-[var(--text)]">monthly cash flow</strong>.
            Results update in real-time as you type.
          </p>
        </div>

        {/* ── Interactive Calculator ────────────────────────── */}
        <RentalROICalculator />

        {/* ── Educational Guide ─────────────────────────────── */}
        <section
          aria-labelledby="guide-heading"
          className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8 space-y-6"
        >
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-[var(--accent)]" />
            {/* H2 */}
            <h2 id="guide-heading" className="text-xl font-bold text-[var(--text)]">
              How to Use the Rental Property ROI Calculator
            </h2>
          </div>

          {/* H3 — Step-by-step instructions */}
          <div>
            <h3 className="font-semibold text-[var(--text)] mb-3">
              Step-by-Step Instructions
            </h3>
            <ol className="space-y-3 text-sm text-[var(--text-muted)] leading-relaxed list-decimal list-inside">
              <li>
                <strong className="text-[var(--text)]">Enter the purchase price</strong> — the full
                acquisition cost of the investment property.
              </li>
              <li>
                <strong className="text-[var(--text)]">Set your down payment percentage</strong> — typically
                20–25% for an investment property mortgage. The calculator automatically computes the
                loan amount and adds an estimated 2% closing cost to your total cash invested.
              </li>
              <li>
                <strong className="text-[var(--text)]">Enter monthly rental income</strong> — your expected
                gross rent before vacancy losses.
              </li>
              <li>
                <strong className="text-[var(--text)]">Fill in annual operating expenses</strong> —
                property tax, landlord insurance, and maintenance. A common rule of thumb is 1% of
                purchase price per year for maintenance.
              </li>
              <li>
                <strong className="text-[var(--text)]">Set the vacancy rate</strong> — the national average
                is 5–8%. Higher vacancy rates apply to B/C-class markets or single-family homes.
              </li>
              <li>
                <strong className="text-[var(--text)]">Enter your loan details</strong> — interest rate and
                term. Rates for investment properties are typically 0.25–0.75% higher than primary
                residence rates.
              </li>
            </ol>
          </div>

          {/* H3 — Formulas explained */}
          <div>
            <h3 className="font-semibold text-[var(--text)] mb-3">
              Financial Formulas Used in This Calculator
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-[var(--text-muted)]">
              <div className="rounded-lg bg-[var(--surface-2)] border border-[var(--border)] p-4">
                <p className="font-semibold text-[var(--text)] mb-1">Cash-on-Cash Return</p>
                <code className="block text-xs text-[var(--accent)] mb-2 font-mono">
                  CoC = Annual Cash Flow ÷ Total Cash Invested × 100
                </code>
                <p>Measures your annual return as a percentage of what you actually put in — the most investor-relevant metric for leveraged real estate.</p>
              </div>
              <div className="rounded-lg bg-[var(--surface-2)] border border-[var(--border)] p-4">
                <p className="font-semibold text-[var(--text)] mb-1">Cap Rate</p>
                <code className="block text-xs text-[var(--accent)] mb-2 font-mono">
                  Cap Rate = NOI ÷ Purchase Price × 100
                </code>
                <p>A financing-agnostic valuation metric used to compare properties across different financing structures.</p>
              </div>
              <div className="rounded-lg bg-[var(--surface-2)] border border-[var(--border)] p-4">
                <p className="font-semibold text-[var(--text)] mb-1">Net Operating Income</p>
                <code className="block text-xs text-[var(--accent)] mb-2 font-mono">
                  NOI = Effective Gross Income − Operating Expenses
                </code>
                <p>The property's income before debt service (mortgage). This is what lenders use to qualify investment loans.</p>
              </div>
              <div className="rounded-lg bg-[var(--surface-2)] border border-[var(--border)] p-4">
                <p className="font-semibold text-[var(--text)] mb-1">Monthly Cash Flow</p>
                <code className="block text-xs text-[var(--accent)] mb-2 font-mono">
                  Cash Flow = (NOI − Annual Debt Service) ÷ 12
                </code>
                <p>Positive cash flow means the property pays for itself and generates surplus income. Negative cash flow requires you to subsidize it monthly.</p>
              </div>
            </div>
          </div>

          {/* H3 — Real-world example */}
          <div>
            <h3 className="font-semibold text-[var(--text)] mb-3">
              Real-World Example: Analyzing a \$350,000 Rental Property
            </h3>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Consider a single-family home purchased at <strong className="text-[var(--text)]">\$350,000</strong> with a 20% down payment
              (\$70,000) and 7.25% interest over 30 years. At <strong className="text-[var(--text)]">\$2,400/month rent</strong>, a 5% vacancy
              rate, and \$7,500 in annual operating expenses, you would generate approximately:
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-[var(--text-muted)] list-disc list-inside">
              <li><strong className="text-[var(--text)]">NOI:</strong> ~\$20,880/year</li>
              <li><strong className="text-[var(--text)]">Cap Rate:</strong> ~5.97%</li>
              <li><strong className="text-[var(--text)]">Monthly Cash Flow:</strong> approximately −\$79 (slightly negative before tax benefits)</li>
              <li><strong className="text-[var(--text)]">Cash-on-Cash Return:</strong> ~−1.0% (leverage-adjusted)</li>
            </ul>
            <p className="mt-3 text-sm text-[var(--text-muted)]">
              This illustrates why today's rate environment demands careful analysis — a property that
              looks attractive on cap rate alone may produce negative cash flow when financed at higher rates.
              Use this calculator to model different scenarios before committing.
            </p>
          </div>
        </section>

        {/* ── FAQ Section ──────────────────────────────────── */}
        <section aria-labelledby="faq-heading">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle size={18} className="text-[var(--accent)]" />
            {/* H2 */}
            <h2 id="faq-heading" className="text-xl font-bold text-[var(--text)]">
              Frequently Asked Questions — Rental ROI Calculator
            </h2>
          </div>
          <Accordion items={faqs} />
        </section>

      </div>
    </>
  );
}

