
"use client";

import { Check, Copy, BookmarkPlus, Palette } from "lucide-react";
import { useState } from "react";
import type { ExtractedColor } from "@/lib/image-extraction";

type ExtractedPaletteProps = {
  colors: ExtractedColor[];
  onSave: () => void;
};

export default function ExtractedPalette({
  colors,
  onSave,
}: ExtractedPaletteProps) {
  const [copied, setCopied] = useState<string | null>(null);

  async function copyColor(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      window.setTimeout(() => setCopied(null), 1500);
    } catch {
      setCopied(null);
    }
  }

  if (colors.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
        <Palette className="mx-auto mb-3 text-[#B39A88]" size={28} />
        <p className="text-sm text-[var(--muted)]">
          Your extracted colors will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {colors.map((color, index) => (
          <button
            key={`${color.hex}-${index}`}
            onClick={() => copyColor(color.hex)}
            className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-left transition hover:-translate-y-1 hover:shadow-md"
            title={`Copy ${color.hex}`}
          >
            <div
              className="relative h-32 sm:h-40"
              style={{ backgroundColor: color.hex }}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                <span className="rounded-full bg-white/90 p-2 text-[#544C47]">
                  {copied === color.hex ? (
                    <Check size={16} />
                  ) : (
                    <Copy size={16} />
                  )}
                </span>
              </div>
            </div>

            <div className="p-3">
              <p className="font-mono text-xs font-medium text-[var(--foreground)]">
                {color.hex}
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Color {index + 1}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--muted)]">
          {copied ? `${copied} copied!` : "Click any color to copy its HEX code."}
        </p>

        <button
          onClick={onSave}
          className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm font-medium text-[var(--foreground)] transition hover:bg-[#F5EFE8]"
        >
          <BookmarkPlus size={16} />
          Save palette
        </button>
      </div>
    </div>
  );
}
