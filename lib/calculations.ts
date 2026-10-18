/**
 * lib/calculations.ts
 * Pure financial calculation functions — no React dependencies.
 * All formulas are sourced from standard real-estate investment analysis.
 */

/* ─────────────────────────────────────────────────────────
   1. RENTAL ROI / CASH-FLOW CALCULATOR
   ───────────────────────────────────────────────────────── */

export interface RentalInputs {
  purchasePrice: number;      // $
  downPaymentPct: number;     // % (0–100)
  monthlyRent: number;        // $
  propertyTax: number;        // $ / year
  insurance: number;          // $ / year
  maintenance: number;        // $ / year
  vacancyRatePct: number;     // % (0–100)
  interestRate: number;       // % annual
  loanTermYears: number;      // years
}

export interface RentalResults {
  monthlyMortgage: number;    // P&I payment
  effectiveGrossIncome: number; // annual rent after vacancy
  operatingExpenses: number;  // annual (tax + insurance + maintenance)
  noi: number;                // Net Operating Income (annual)
  capRate: number;            // % = NOI / Purchase Price
  annualDebtService: number;  // annual mortgage payments
  annualCashFlow: number;     // NOI − debt service
  monthlyCashFlow: number;    // annualCashFlow / 12
  cashOnCashReturn: number;   // % = annual cash flow / total cash invested
  totalCashInvested: number;  // down payment + closing costs
  grossRentMultiplier: number; // Purchase Price / Annual Gross Rent
}

/**
 * Calculates monthly mortgage payment using the standard amortization formula:
 *   M = P × [r(1+r)^n] / [(1+r)^n − 1]
 */
export function monthlyMortgagePayment(
  principal: number,
  annualRate: number,
  termYears: number
): number {
  if (annualRate === 0) return principal / (termYears * 12);
  const r = annualRate / 100 / 12;         // monthly rate
  const n = termYears * 12;                // total payments
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function calculateRentalROI(inputs: RentalInputs): RentalResults {
  const {
    purchasePrice, downPaymentPct, monthlyRent, propertyTax,
    insurance, maintenance, vacancyRatePct, interestRate, loanTermYears,
  } = inputs;

  // Loan & equity
  const downPaymentAmt  = purchasePrice * (downPaymentPct / 100);
  const loanAmount      = purchasePrice - downPaymentAmt;
  // Assume ~2 % closing costs on purchase price
  const closingCosts    = purchasePrice * 0.02;
  const totalCashInvested = downPaymentAmt + closingCosts;

  // Monthly mortgage (P&I)
  const monthlyMortgage = monthlyMortgagePayment(loanAmount, interestRate, loanTermYears);
  const annualDebtService = monthlyMortgage * 12;

  // Gross rental income adjusted for vacancy
  const annualGrossRent     = monthlyRent * 12;
  const effectiveGrossIncome = annualGrossRent * (1 - vacancyRatePct / 100);

  // Annual operating expenses (excluding mortgage — DSCR / NOI calculation)
  const operatingExpenses = propertyTax + insurance + maintenance;

  // NOI = Effective Gross Income − Operating Expenses
  const noi = effectiveGrossIncome - operatingExpenses;

  // Cap Rate = NOI / Purchase Price × 100
  const capRate = (noi / purchasePrice) * 100;

  // Cash Flow = NOI − Debt Service
  const annualCashFlow  = noi - annualDebtService;
  const monthlyCashFlow = annualCashFlow / 12;

  // Cash-on-Cash Return = Annual Cash Flow / Total Cash Invested × 100
  const cashOnCashReturn = (annualCashFlow / totalCashInvested) * 100;

  // Gross Rent Multiplier (simpler valuation metric)
  const grossRentMultiplier = purchasePrice / annualGrossRent;

  return {
    monthlyMortgage,
    effectiveGrossIncome,
    operatingExpenses,
    noi,
    capRate,
    annualDebtService,
    annualCashFlow,
    monthlyCashFlow,
    cashOnCashReturn,
    totalCashInvested,
    grossRentMultiplier,
  };
}

/* ─────────────────────────────────────────────────────────
   2. MORTGAGE & AMORTIZATION CALCULATOR
   ───────────────────────────────────────────────────────── */

export interface MortgageInputs {
  loanAmount: number;         // $
  annualRate: number;         // %
  termYears: number;          // years
  extraMonthlyPayment: number;// $
  extraYearlyPayment: number; // $
}

export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  extra: number;
  balance: number;
}

export interface MortgageResults {
  baseMonthlyPayment: number;
  totalInterestBase: number;
  totalInterestWithExtra: number;
  interestSaved: number;
  basePayoffMonths: number;
  newPayoffMonths: number;
  monthsSaved: number;
  schedule: AmortizationRow[];
}

export function calculateMortgage(inputs: MortgageInputs): MortgageResults {
  const { loanAmount, annualRate, termYears, extraMonthlyPayment, extraYearlyPayment } = inputs;

  const r = annualRate / 100 / 12;
  const n = termYears * 12;

  // Base monthly P&I
  const baseMonthlyPayment = monthlyMortgagePayment(loanAmount, annualRate, termYears);

  // ── Build full amortization schedule with extra payments ──
  const schedule: AmortizationRow[] = [];
  let balance         = loanAmount;
  let totalInterest   = 0;
  let month           = 0;

  while (balance > 0.01 && month < n) {
    month++;
    const interestCharge = balance * r;
    const principalCharge = Math.min(baseMonthlyPayment - interestCharge, balance);

    // Extra yearly payment applied once per year (e.g. month 12, 24, …)
    const yearlyExtra = month % 12 === 0 ? extraYearlyPayment : 0;
    const extraTotal  = extraMonthlyPayment + yearlyExtra;

    const extraApplied = Math.min(extraTotal, balance - principalCharge);
    const totalPrincipal = principalCharge + extraApplied;

    balance = Math.max(balance - totalPrincipal, 0);
    totalInterest += interestCharge;

    schedule.push({
      month,
      payment: baseMonthlyPayment,
      principal: principalCharge,
      interest: interestCharge,
      extra: extraApplied,
      balance,
    });

    if (balance <= 0) break;
  }

  // Base payoff (no extra payments) — just count standard months
  const basePayoffMonths = n;

  // Standard total interest (no extra)
  const totalInterestBase = baseMonthlyPayment * n - loanAmount;

  return {
    baseMonthlyPayment,
    totalInterestBase,
    totalInterestWithExtra: totalInterest,
    interestSaved: totalInterestBase - totalInterest,
    basePayoffMonths,
    newPayoffMonths: month,
    monthsSaved: basePayoffMonths - month,
    schedule,
  };
}

/* ─────────────────────────────────────────────────────────
   Shared helpers
   ───────────────────────────────────────────────────────── */

/** Format a number as US currency, e.g. $1,234.56 */
export function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

/** Format a decimal as a percentage, e.g. 7.24% */
export function formatPct(n: number, decimals = 2): string {
  return `${n.toFixed(decimals)}%`;
}

/** Format large numbers compactly, e.g. 1.2M */
export function formatCompact(n: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

/** Convert month count → human-readable string */
export function monthsToYearMonth(months: number): string {
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m} mo`;
  if (m === 0) return `${y} yr`;
  return `${y} yr ${m} mo`;
}

