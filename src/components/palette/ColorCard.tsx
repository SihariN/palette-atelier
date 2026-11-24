
"use client";

import { PaletteColor } from "@/lib/colors";
import { Lock, LockOpen, Copy, Check } from "lucide-react";
import { useState } from "react";

type Props = {
  color: PaletteColor;
  index: number;
  onToggleLock: (index: number) => void;
  onChangeColor: (index: number, hex: string) => void;
};

export default function ColorCard({
  color,
  index,
  onToggleLock,
  onChangeColor,
}: Props) {
  const [copied, setCopied] = useState(false);

  async function copyHex() {
    try {
      await navigator.clipboard.writeText(color.hex);
      setCopied(true);

      setTimeout(() => setCopied(false), 1200);
    } catch {
      // Clipboard unavailable
    }
  }

  return (
    <div className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#e8e5dc] bg-white transition-all hover:-translate-y-1 hover:shadow-lg">
      <div
        className="relative h-52 sm:h-64"
        style={{ backgroundColor: color.hex }}
      >
        {/* Color picker */}
        <input
          type="color"
          value={color.hex}
          onChange={(e) => onChangeColor(index, e.target.value.toUpperCase())}
          title="Edit color"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />

        {/* Lock control */}
        <button
          onClick={() => onToggleLock(index)}
          title={color.locked ? "Unlock color" : "Lock color"}
          className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 text-[#353630] shadow-sm backdrop-blur transition hover:scale-105"
        >
          {color.locked ? <Lock size={16} /> : <LockOpen size={16} />}
        </button>
      </div>

      <div className="p-3 sm:p-4">
        <button
          onClick={copyHex}
          className="flex w-full items-center justify-between gap-2 rounded-lg px-1 py-2 text-left transition hover:bg-[#efede6]"
        >
          <span className="font-mono text-sm font-medium tracking-wide text-[#353630]">
            {color.hex}
          </span>
          {copied ? (
            <Check size={16} className="text-[#89947a]" />
          ) : (
            <Copy
              size={15}
              className="text-[#858479] opacity-0 transition group-hover:opacity-100"
            />
          )}
        </button>
        <p className="px-1 text-xs text-[#858479]">
          Color {index + 1} {color.locked && "· Locked"}
        </p>
      </div>
    </div>
  );
}
