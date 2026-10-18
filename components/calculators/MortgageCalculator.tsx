/**
 * components/calculators/MortgageCalculator.tsx
 * Client component: Mortgage & Amortization Payoff Estimator.
 * Shows summary stats + full amortization table (virtualized display).
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { InputField } from "@/components/ui/InputField";
import { StatCard } from "@/components/ui/StatCard";
import { calculateMortgage, formatCurrency, monthsToYearMonth, MortgageResults } from "@/lib/calculations";
import { Calculator, ChevronDown, ChevronUp } from "lucide-react";

const DEFAULTS = {
  loanAmount:          320000,
  annualRate:          7.25,
  termYears:           30,
  extraMonthlyPayment: 0,
  extraYearlyPayment:  0,
};

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string;
}) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs shadow-xl min-w-[140px]">
        <p className="text-[var(--text-muted)] mb-1">Month {label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }} className="font-medium">
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function MortgageCalculator() {
  const [inputs, setInputs]     = useState(DEFAULTS);
  const [results, setResults]   = useState<MortgageResults | null>(null);
  const [showAll, setShowAll]   = useState(false);

  const recalculate = useCallback(() => {
    try {
      setResults(calculateMortgage(inputs));
    } catch {
      setResults(null);
    }
  }, [inputs]);

  useEffect(() => { recalculate(); }, [recalculate]);

  const handleChange = (field: keyof typeof DEFAULTS) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    setInputs(prev => ({ ...prev, [field]: val }));
  };

  // Sample every 12th row for the chart (yearly points) to keep it smooth
  const chartData = results
    ? results.schedule
        .filter((_, i) => i % 12 === 11 || i === 0)
        .map(row => ({
          month:    row.month,
          Balance:  Math.round(row.balance),
          Interest: Math.round(row.interest),
          Principal: Math.round(row.principal),
        }))
    : [];

  // Show first 36 rows by default, all rows if expanded
  const displayedRows = results
    ? showAll ? results.schedule : results.schedule.slice(0, 36)
    : [];

  const hasExtra = inputs.extraMonthlyPayment > 0 || inputs.extraYearlyPayment > 0;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

      {/* ── LEFT: Inputs ─────────────────────────────────── */}
      <div className="xl:col-span-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)]/15 text-[var(--accent)]">
              <Calculator size={16} />
            </span>
            <h2 className="text-sm font-semibold text-[var(--text)]">Loan Details</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
            <InputField
              label="Loan Amount"
              prefix="$"
              value={inputs.loanAmount}
              onChange={handleChange("loanAmount")}
              min={0}
            />
            <InputField
              label="Annual Interest Rate"
              suffix="%"
              value={inputs.annualRate}
              onChange={handleChange("annualRate")}
              min={0} max={30} step={0.05}
            />
            <InputField
              label="Loan Term"
              suffix="yrs"
              value={inputs.termYears}
              onChange={handleChange("termYears")}
              min={1} max={40}
            />
            <div className="col-span-full pt-2">
              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-3">
                Extra Payments (optional)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
                <InputField
                  label="Extra Monthly Payment"
                  prefix="$"
                  value={inputs.extraMonthlyPayment}
                  onChange={handleChange("extraMonthlyPayment")}
                  min={0}
                  hint="Applied each month to principal"
                />
                <InputField
                  label="Extra Yearly Payment"
                  prefix="$"
                  value={inputs.extraYearlyPayment}
                  onChange={handleChange("extraYearlyPayment")}
                  min={0}
                  hint="Applied at the end of each year"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Results ───────────────────────────────── */}
      <div className="xl:col-span-3 space-y-6">
        {results && (
          <>
            {/* Summary stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard
                label="Monthly Payment"
                value={formatCurrency(results.baseMonthlyPayment)}
                variant="accent"
                delay={0}
              />
              <StatCard
                label="Total Interest"
                value={formatCurrency(results.totalInterestWithExtra)}
                variant="negative"
                delay={0.05}
              />
              {hasExtra ? (
                <StatCard
                  label="Interest Saved"
                  value={formatCurrency(results.interestSaved)}
                  description="Vs. no extra payments"
                  variant="positive"
                  delay={0.1}
                />
              ) : (
                <StatCard
                  label="Total Cost"
                  value={formatCurrency(inputs.loanAmount + results.totalInterestBase)}
                  variant="neutral"
                  delay={0.1}
                />
              )}
              <StatCard
                label={hasExtra ? "New Payoff" : "Payoff"}
                value={monthsToYearMonth(results.newPayoffMonths)}
                description={hasExtra ? `${monthsToYearMonth(results.monthsSaved)} sooner` : undefined}
                variant={hasExtra ? "positive" : "neutral"}
                delay={0.15}
              />
            </div>

            {/* Area chart — balance over time */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <h3 className="text-sm font-semibold text-[var(--text)] mb-4">
                Loan Balance Over Time
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                    axisLine={false} tickLine={false}
                    tickFormatter={(v: number) => `Yr ${Math.round(v / 12)}`}
                  />
                  <YAxis
                    tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                    axisLine={false} tickLine={false}
                    tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: "11px", color: "var(--text-muted)" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="Balance"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#balGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Amortization table */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.3 }}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-[var(--border)]">
                <h3 className="text-sm font-semibold text-[var(--text)]">Amortization Schedule</h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Showing {displayedRows.length} of {results.schedule.length} payments
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--surface-2)]">
                      {["Mo", "Payment", "Principal", "Interest", "Extra", "Balance"].map(h => (
                        <th key={h} className="px-4 py-2.5 text-left font-medium text-[var(--text-muted)]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {displayedRows.map((row, i) => (
                      <tr
                        key={row.month}
                        className={`border-b border-[var(--border)]/50 hover:bg-[var(--surface-2)] transition-colors ${
                          i % 12 === 11 ? "bg-[var(--surface-2)]/40" : ""  // highlight year-end rows
                        }`}
                      >
                        <td className="px-4 py-2 text-[var(--text-muted)]">{row.month}</td>
                        <td className="px-4 py-2">{formatCurrency(row.payment)}</td>
                        <td className="px-4 py-2 text-[var(--success)]">{formatCurrency(row.principal)}</td>
                        <td className="px-4 py-2 text-[var(--error)]">{formatCurrency(row.interest)}</td>
                        <td className="px-4 py-2 text-[var(--accent)]">
                          {row.extra > 0 ? formatCurrency(row.extra) : "—"}
                        </td>
                        <td className="px-4 py-2 font-medium">{formatCurrency(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Show more / less toggle */}
              {results.schedule.length > 36 && (
                <button
                  onClick={() => setShowAll(prev => !prev)}
                  className="w-full flex items-center justify-center gap-1.5 py-3 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors border-t border-[var(--border)]"
                >
                  {showAll ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  {showAll ? "Show less" : `Show all ${results.schedule.length} payments`}
                </button>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

