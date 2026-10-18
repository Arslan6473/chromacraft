/**
 * components/ui/Accordion.tsx
 * Accessible FAQ accordion — WAI-ARIA compliant.
 * Used on tool pages for FAQ sections with JSON-LD schema.
 */
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="space-y-2" role="list">
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-xl border border-[var(--border)] overflow-hidden"
          role="listitem"
        >
          {/* Question button */}
          <button
            onClick={() => toggle(i)}
            aria-expanded={openIndex === i}
            aria-controls={`faq-answer-${i}`}
            id={`faq-question-${i}`}
            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
          >
            <span>{item.question}</span>
            <motion.span
              animate={{ rotate: openIndex === i ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="shrink-0 text-[var(--text-muted)]"
            >
              <ChevronDown size={16} />
            </motion.span>
          </button>

          {/* Answer panel */}
          <AnimatePresence initial={false}>
            {openIndex === i && (
              <motion.div
                id={`faq-answer-${i}`}
                role="region"
                aria-labelledby={`faq-question-${i}`}
                key="answer"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <div className="px-5 pb-4 text-sm text-[var(--text-muted)] leading-relaxed border-t border-[var(--border)]">
                  <p className="pt-3">{item.answer}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

