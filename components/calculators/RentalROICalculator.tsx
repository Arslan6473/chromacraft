/**
 * components/calculators/RentalROICalculator.tsx
 * Client component: the full interactive Rental ROI / Cash-Flow calculator.
 * All state is local — inputs and outputs update in real-time via useEffect.
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { InputField } from "@/components/ui/InputField";
import { StatCard } from "@/components/ui/StatCard";
import { calculateRentalROI, formatCurrency, formatPct, RentalResults } from "@/lib/calculations";
import { Calculator } from "lucide-react";

/* ── Default input values ──────────────────────────────── */
const DEFAULTS = {
  purchasePrice:   350000,
  downPaymentPct:  20,
  monthlyRent:     2400,
  propertyTax:     4200,
  insurance:       1200,
  maintenance:     2100,
  vacancyRatePct:  5,
  interestRate:    7.25,
  loanTermYears:   30,
};

/* ── Tooltip for Recharts ──────────────────────────────── */
const CustomTooltip = ({ active, payload, label }: {
  active?: boolean; payload?: { value: number }[]; label?: string;
}) => {
  if (active && payload?.length) {
    const val = payload[0].value;
    return (
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs shadow-xl">
        <p className="text-[var(--text-muted)]">{label}</p>
        <p className="font-bold text-[var(--text)]">{formatCurrency(val)}</p>
      </div>
    );
  }
  return null;
};

/* ── Main component ────────────────────────────────────── */
export function RentalROICalculator() {
  const [inputs, setInputs] = useState(DEFAULTS);
  const [results, setResults] = useState<RentalResults | null>(null);

  // Recalculate whenever any input changes
  const recalculate = useCallback(() => {
    try {
      const r = calculateRentalROI(inputs);
      setResults(r);
    } catch {
      setResults(null);
    }
  }, [inputs]);

  useEffect(() => { recalculate(); }, [recalculate]);

  const handleChange = (field: keyof typeof DEFAULTS) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    setInputs(prev => ({ ...prev, [field]: val }));
  };

  // Data for the cash-flow breakdown bar chart
  const chartData = results
    ? [
        { name: "Gross Rent",    value: results.effectiveGrossIncome },
        { name: "Op. Expenses",  value: results.operatingExpenses },
        { name: "Debt Service",  value: results.annualDebtService },
        { name: "Net Cash Flow", value: Math.max(results.annualCashFlow, 0) },
      ]
    : [];

  const CHART_COLORS = ["#6366f1", "#f59e0b", "#ef4444", "#10b981"];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

      {/* ── LEFT: Input Panel ─────────────────────────────── */}
      <div className="xl:col-span-2 space-y-6">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)]/15 text-[var(--accent)]">
              <Calculator size={16} />
            </span>
            <h2 className="text-sm font-semibold text-[var(--text)]">Property Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
            <InputField
              label="Purchase Price"
              prefix="$"
              value={inputs.purchasePrice}
              onChange={handleChange("purchasePrice")}
              min={0}
            />
            <InputField
              label="Down Payment"
              suffix="%"
              value={inputs.downPaymentPct}
              onChange={handleChange("downPaymentPct")}
              min={0} max={100} step={0.5}
              hint="Typical: 20–25% for investment property"
            />
            <InputField
              label="Monthly Rental Income"
              prefix="$"
              value={inputs.monthlyRent}
              onChange={handleChange("monthlyRent")}
              min={0}
            />
            <InputField
              label="Annual Property Tax"
              prefix="$"
              value={inputs.propertyTax}
              onChange={handleChange("propertyTax")}
              min={0}
            />
            <InputField
              label="Annual Insurance"
              prefix="$"
              value={inputs.insurance}
              onChange={handleChange("insurance")}
              min={0}
            />
            <InputField
              label="Annual Maintenance"
              prefix="$"
              value={inputs.maintenance}
              onChange={handleChange("maintenance")}
              min={0}
              hint="Rule of thumb: 1% of property value / yr"
            />
            <InputField
              label="Vacancy Rate"
              suffix="%"
              value={inputs.vacancyRatePct}
              onChange={handleChange("vacancyRatePct")}
              min={0} max={50} step={0.5}
              hint="National avg ≈ 5–8%"
            />
            <InputField
              label="Loan Interest Rate"
              suffix="%"
              value={inputs.interestRate}
              onChange={handleChange("interestRate")}
              min={0} max={20} step={0.05}
            />
            <InputField
              label="Loan Term"
              suffix="yrs"
              value={inputs.loanTermYears}
              onChange={handleChange("loanTermYears")}
              min={5} max={30} step={5}
            />
          </div>
        </div>
      </div>

      {/* ── RIGHT: Results Panel ──────────────────────────── */}
      <div className="xl:col-span-3 space-y-6">

        {/* Primary metrics */}
        {results && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard
                label="Monthly Cash Flow"
                value={formatCurrency(results.monthlyCashFlow)}
                description="After mortgage & expenses"
                variant={results.monthlyCashFlow >= 0 ? "positive" : "negative"}
                delay={0}
              />
              <StatCard
                label="Cash-on-Cash Return"
                value={formatPct(results.cashOnCashReturn)}
                description="Annual return on invested capital"
                variant={results.cashOnCashReturn >= 8 ? "positive" : results.cashOnCashReturn >= 4 ? "accent" : "negative"}
                delay={0.05}
              />
              <StatCard
                label="Cap Rate"
                value={formatPct(results.capRate)}
                description="NOI ÷ Purchase Price"
                variant={results.capRate >= 6 ? "positive" : results.capRate >= 4 ? "accent" : "negative"}
                delay={0.1}
              />
              <StatCard
                label="Net Operating Income"
                value={formatCurrency(results.noi)}
                description="Annual (before debt service)"
                variant="neutral"
                delay={0.15}
              />
            </div>

            {/* Secondary metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard label="Monthly Mortgage"  value={formatCurrency(results.monthlyMortgage)}   variant="neutral" delay={0.2} />
              <StatCard label="Total Cash Invested" value={formatCurrency(results.totalCashInvested)} variant="neutral" delay={0.25} />
              <StatCard label="Gross Rent Multiplier" value={`${results.grossRentMultiplier.toFixed(1)}×`} description="Lower = better deal" variant="neutral" delay={0.3} />
              <StatCard label="Annual Debt Service" value={formatCurrency(results.annualDebtService)} variant="neutral" delay={0.35} />
            </div>

            {/* Bar chart: cash-flow breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.4 }}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <h3 className="text-sm font-semibold text-[var(--text)] mb-4">Annual Cash Flow Breakdown</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} barCategoryGap="30%">
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--surface-2)" }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((_, idx) => (
                      <Cell key={idx} fill={CHART_COLORS[idx]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

