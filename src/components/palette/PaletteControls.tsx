
"use client";

import { ColorHarmony, HARMONY_OPTIONS } from "@/lib/colors";

type Props = {
  harmony: ColorHarmony;
  onChange: (harmony: ColorHarmony) => void;
};

export default function PaletteControls({ harmony, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {HARMONY_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`rounded-full px-4 py-2 text-sm transition-all duration-200 ${
            harmony === option.value
              ? "bg-[#89947a] text-white shadow-sm"
              : "border border-[#e8e5dc] bg-white text-[#858479] hover:border-[#89947a] hover:text-[#353630]"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
