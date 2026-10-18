/**
 * components/ui/InputField.tsx
 * Accessible, styled form input with optional prefix/suffix adornments.
 * Supports currency ($) and percentage (%) display patterns.
 *
 * Note: We use `inputPrefix` / `inputSuffix` to avoid conflicting with
 * the native `prefix` property on HTMLInputElement.
 */
"use client";

import { forwardRef } from "react";

// Omit `prefix` from native attributes to avoid the TS type conflict
interface InputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  label: string;
  /** Short helper displayed below the label */
  hint?: string;
  /** Error message to display */
  error?: string;
  /** Icon/text rendered inside the left side of the input (e.g. "$") */
  prefix?: React.ReactNode;
  /** Icon/text rendered inside the right side of the input (e.g. "%") */
  suffix?: React.ReactNode;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, hint, error, prefix, suffix, id, className = "", ...rest }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1">
        {/* Label */}
        <label
          htmlFor={inputId}
          className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide"
        >
          {label}
        </label>

        {/* Hint */}
        {hint && (
          <p className="text-[11px] text-[var(--text-muted)] -mt-0.5">{hint}</p>
        )}

        {/* Input wrapper */}
        <div className="relative flex items-center">
          {prefix && (
            <span className="absolute left-3 text-[var(--text-muted)] text-sm select-none pointer-events-none">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            type="number"
            className={`
              w-full rounded-lg border bg-[var(--surface-2)] text-[var(--text)] text-sm
              placeholder:text-[var(--text-muted)] transition-colors
              focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/40
              ${error ? "border-[var(--error)]" : "border-[var(--border)] hover:border-[var(--border-hover)]"}
              ${prefix ? "pl-7" : "pl-3"}
              ${suffix ? "pr-10" : "pr-3"}
              py-2.5
              ${className}
            `}
            {...rest}
          />
          {suffix && (
            <span className="absolute right-3 text-[var(--text-muted)] text-sm select-none pointer-events-none">
              {suffix}
            </span>
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="text-[11px] text-[var(--error)] mt-0.5">{error}</p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";
