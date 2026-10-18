/**
 * components/ColorCard.tsx
 * Interactive color column/card for the Palette Generator Studio.
 * Features:
 * - Dynamic contrast adaptation for text & controls
 * - Lock/unlock toggle with animated micro-interaction
 * - One-click copy with "Copied!" tooltip
 * - Native color picker integration for precision tweaking
 */
"use client";

import { useState, useRef } from "react";
import { Lock, Unlock, Copy, Check, Sliders, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ColorSlot,
  ColorFormat,
  formatColor,
  getContrastTextColor,
  getRelativeLuminance,
  hexToRgb,
  isValidHex,
  normalizeHex,
} from "@/lib/color-utils";

interface ColorCardProps {
  slot: ColorSlot;
  format: ColorFormat;
  onToggleLock: (id: string) => void;
  onChangeColor: (id: string, newHex: string) => void;
  onRemoveSlot?: (id: string) => void;
  canRemove?: boolean;
}

export function ColorCard({
  slot,
  format,
  onToggleLock,
  onChangeColor,
  onRemoveSlot,
  canRemove = false,
}: ColorCardProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editInput, setEditInput] = useState(slot.hex);
  const colorPickerRef = useRef<HTMLInputElement>(null);

  const formattedValue = formatColor(slot.hex, format);
  const textColor = getContrastTextColor(slot.hex);
  const isDark = textColor === "#FFFFFF";
  const rgb = hexToRgb(slot.hex);
  const lum = Math.round(getRelativeLuminance(rgb) * 100);

  // Background styling for buttons to guarantee readability on any color shade
  const controlBg = isDark
    ? "bg-black/25 hover:bg-black/45 text-white/90 hover:text-white border-white/15"
    : "bg-white/40 hover:bg-white/65 text-black/90 hover:text-black border-black/15";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = formattedValue;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidHex(editInput)) {
      onChangeColor(slot.id, normalizeHex(editInput));
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
      style={{ backgroundColor: slot.hex }}
      className="group relative flex flex-col justify-between p-4 sm:p-6 transition-colors duration-200 select-none min-h-[180px] sm:min-h-[480px] rounded-xl sm:rounded-none overflow-hidden border border-white/10 sm:border-none shadow-inner"
    >
      {/* Top action row: Lock, Native Picker, Remove */}
      <div className="flex items-center justify-between w-full z-10">
        <div className="flex items-center gap-1.5">
          {/* Lock Button */}
          <button
            type="button"
            onClick={() => onToggleLock(slot.id)}
            aria-label={slot.locked ? "Unlock color slot" : "Lock color slot"}
            className={`p-2 rounded-lg border backdrop-blur-md transition-all duration-150 cursor-pointer active:scale-95 ${controlBg} ${
              slot.locked ? "ring-2 ring-indigo-400/80" : "opacity-80 group-hover:opacity-100"
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {slot.locked ? (
                <motion.span
                  key="locked"
                  initial={{ scale: 0.7, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0.7 }}
                  className="flex items-center text-amber-400"
                >
                  <Lock size={15} strokeWidth={2.4} />
                </motion.span>
              ) : (
                <motion.span
                  key="unlocked"
                  initial={{ scale: 0.7 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.7 }}
                  className="flex items-center"
                >
                  <Unlock size={15} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Color Picker trigger */}
          <button
            type="button"
            onClick={() => colorPickerRef.current?.click()}
            aria-label="Pick custom color"
            className={`p-2 rounded-lg border backdrop-blur-md transition-all duration-150 cursor-pointer opacity-70 group-hover:opacity-100 active:scale-95 ${controlBg}`}
          >
            <Sliders size={15} />
          </button>
          <input
            ref={colorPickerRef}
            type="color"
            value={slot.hex}
            onChange={(e) => onChangeColor(slot.id, e.target.value.toUpperCase())}
            className="sr-only"
            tabIndex={-1}
            aria-label="Color input"
          />
        </div>

        {/* Delete Slot (if allowed) */}
        {canRemove && onRemoveSlot && (
          <button
            type="button"
            onClick={() => onRemoveSlot(slot.id)}
            aria-label="Remove color column"
            className={`p-2 rounded-lg border backdrop-blur-md transition-all duration-150 cursor-pointer opacity-0 group-hover:opacity-100 active:scale-95 ${controlBg}`}
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Middle indicator / lock status badge */}
      <div className="flex flex-col items-center justify-center my-auto py-4 z-10">
        {slot.locked && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold tracking-wider border backdrop-blur-md mb-2 ${controlBg}`}
          >
            Locked
          </motion.div>
        )}
      </div>

      {/* Bottom info section: Color value, copy action & luminance */}
      <div className="flex flex-col gap-2 z-10">
        {/* Copy trigger card */}
        <div className="relative">
          {isEditing ? (
            <form onSubmit={handleSaveEdit} className="flex items-center gap-1">
              <input
                type="text"
                value={editInput}
                onChange={(e) => setEditInput(e.target.value)}
                onBlur={() => setIsEditing(false)}
                autoFocus
                className="w-full text-sm font-mono uppercase font-bold px-2 py-1.5 rounded-lg bg-black/60 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </form>
          ) : (
            <button
              type="button"
              onClick={handleCopy}
              className={`w-full flex items-center justify-between p-3 rounded-xl border backdrop-blur-md transition-all duration-150 cursor-pointer active:scale-98 ${controlBg}`}
            >
              <div className="text-left overflow-hidden">
                <span className="block text-base sm:text-lg font-mono font-bold tracking-tight truncate">
                  {formattedValue}
                </span>
                <span className="text-[10px] uppercase font-mono opacity-70">
                  Lum: {lum}%
                </span>
              </div>

              <div className="shrink-0 ml-2">
                <AnimatePresence mode="wait" initial={false}>
                  {copied ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="flex items-center text-emerald-400"
                    >
                      <Check size={16} strokeWidth={2.5} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="opacity-70 group-hover:opacity-100"
                    >
                      <Copy size={16} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </button>
          )}

          {/* "Copied!" Floating Tooltip */}
          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                animate={{ opacity: 1, y: -36, scale: 1 }}
                exit={{ opacity: 0, y: -44, scale: 0.9 }}
                transition={{ duration: 0.18 }}
                className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-50 px-3 py-1 rounded-md bg-zinc-950 border border-zinc-700 text-emerald-400 font-mono text-xs font-bold shadow-2xl flex items-center gap-1.5"
              >
                <Check size={12} strokeWidth={2.5} />
                Copied {formattedValue}!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick edit button link */}
        <button
          type="button"
          onClick={() => {
            setEditInput(slot.hex);
            setIsEditing(true);
          }}
          className={`text-[10px] text-center font-mono py-1 rounded transition-opacity opacity-0 group-hover:opacity-80 hover:!opacity-100 ${
            isDark ? "text-white/80 hover:text-white" : "text-black/80 hover:text-black"
          }`}
        >
          Click to type hex
        </button>
      </div>
    </motion.div>
  );
}

