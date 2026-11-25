
"use client";

import { useEffect, useState } from "react";
import {
  X,
  Plus,
  Trash2,
  Check,
  Palette,
  RotateCcw,
} from "lucide-react";

import type { SavedPalette } from "@/lib/palette-storage";

type Props = {
  palette: SavedPalette;
  onSave: (id: string, changes: { name: string; colors: string[] }) => void;
  onClose: () => void;
};

export default function PaletteEditor({
  palette,
  onSave,
  onClose,
}: Props) {
  const [name, setName] = useState(palette.name);
  const [colors, setColors] = useState([...palette.colors]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const selectedColor = colors[selectedIndex] ?? colors[0];

  function updateColor(index: number, value: string) {
    setColors((current) =>
      current.map((color, i) => (i === index ? value.toUpperCase() : color)),
    );
  }

  function addColor() {
    if (colors.length >= 10) return;

    setColors((current) => [...current, "#A7B49B"]);
    setSelectedIndex(colors.length);
  }

  function removeColor(index: number) {
    if (colors.length <= 1) return;

    setColors((current) => current.filter((_, i) => i !== index));

    setSelectedIndex((current) =>
      Math.min(current >= index ? current - 1 : current, colors.length - 2),
    );
  }

  function save() {
    const cleanName = name.trim();

    if (!cleanName || colors.length === 0) return;

    onSave(palette.id, {
      name: cleanName,
      colors,
    });
  }

  const validHex = /^#[0-9A-Fa-f]{6}$/.test(selectedColor ?? "");

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#25251f]/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#e8e5dc] bg-[#fffefa] shadow-2xl">
        <div className="flex items-start justify-between border-b border-[#eeeae2] p-5 sm:p-7">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#89947a]">
              YOUR CREATIVE COLLECTION
            </p>
            <h2 className="mt-2 font-editorial text-3xl text-[#353630]">
              Edit palette
            </h2>
            <p className="mt-1 text-sm text-[#858479]">
              Give your colors a little personal touch.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close editor"
            className="rounded-full p-2 text-[#858479] transition hover:bg-[#f0eee6]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 p-5 sm:p-7">
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[#858479]">
              Palette name
            </label>

            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={50}
              placeholder="Give your palette a name"
              className="w-full rounded-xl border border-[#e8e5dc] bg-white px-4 py-3 text-sm text-[#353630] outline-none transition focus:border-[#89947a]"
            />
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-[#858479]">
                  Your colors
                </label>
                <p className="mt-1 text-xs text-[#aaa69a]">
                  Select a color to edit it.
                </p>
              </div>

              <span className="text-xs text-[#858479]">
                {colors.length}/10 colors
              </span>
            </div>

            <div className="flex min-h-24 overflow-hidden rounded-2xl border border-[#e8e5dc]">
              {colors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  title={`Edit ${color}`}
                  style={{ backgroundColor: color }}
                  className={`relative min-w-0 flex-1 transition ${
                    selectedIndex === index
                      ? "ring-2 ring-inset ring-[#353630]"
                      : "hover:brightness-95"
                  }`}
                >
                  {selectedIndex === index && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="rounded-full bg-white/90 p-1.5 text-[#353630]">
                        <Check size={15} />
                      </span>
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {colors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={`rounded-lg border px-3 py-2 font-mono text-xs transition ${
                    selectedIndex === index
                      ? "border-[#89947a] bg-[#eef0e8] text-[#59634e]"
                      : "border-[#e8e5dc] bg-white text-[#858479]"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {selectedColor && (
            <div className="rounded-2xl border border-[#e8e5dc] bg-white p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="h-14 w-14 shrink-0 rounded-xl border border-black/5"
                  style={{ backgroundColor: selectedColor }}
                />

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#353630]">
                    Color {selectedIndex + 1}
                  </p>
                  <p className="text-xs text-[#858479]">
                    Customize this shade
                  </p>
                </div>

                <input
                  type="color"
                  value={validHex ? selectedColor : "#A7B49B"}
                  onChange={(event) =>
                    updateColor(selectedIndex, event.target.value)
                  }
                  aria-label="Choose color"
                  className="h-11 w-14 cursor-pointer rounded-lg border-0 bg-transparent"
                />
              </div>

              <label className="mb-2 block text-xs font-medium text-[#858479]">
                HEX value
              </label>

              <input
                value={selectedColor}
                onChange={(event) => {
                  const value = event.target.value.toUpperCase();
                  setColors((current) =>
                    current.map((color, index) =>
                      index === selectedIndex ? value : color,
                    ),
                  );
                }}
                placeholder="#A7B49B"
                maxLength={7}
                className={`w-full rounded-xl border bg-[#fffefa] px-4 py-3 font-mono text-sm text-[#353630] outline-none focus:border-[#89947a] ${
                  validHex ? "border-[#e8e5dc]" : "border-[#c58c80]"
                }`}
              />

              {!validHex && (
                <p className="mt-2 text-xs text-[#b36f64]">
                  Enter a valid six-digit HEX color, such as #A7B49B.
                </p>
              )}

              <div className="mt-4 flex justify-between gap-3">
                <button
                  onClick={() => removeColor(selectedIndex)}
                  disabled={colors.length <= 1}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-[#a17d75] transition hover:bg-[#faf0ed] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 size={14} />
                  Remove color
                </button>

                <button
                  onClick={addColor}
                  disabled={colors.length >= 10}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-[#737f66] transition hover:bg-[#eef0e8] disabled:opacity-40"
                >
                  <Plus size={14} />
                  Add color
                </button>
              </div>
            </div>
          )}

          <div className="rounded-xl bg-[#f5f3ed] p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-medium text-[#858479]">
              <Palette size={15} />
              Live palette preview
            </div>

            <div className="flex h-12 overflow-hidden rounded-lg">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className="flex-1"
                  style={{
                    backgroundColor: /^#[0-9A-Fa-f]{6}$/.test(color)
                      ? color
                      : "#E8E5DC",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse justify-between gap-3 border-t border-[#eeeae2] p-5 sm:flex-row sm:items-center sm:px-7">
          <button
            onClick={() => {
              setName(palette.name);
              setColors([...palette.colors]);
              setSelectedIndex(0);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs text-[#858479] transition hover:bg-[#f0eee6]"
          >
            <RotateCcw size={14} />
            Reset changes
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-[#e8e5dc] px-5 py-3 text-xs font-medium text-[#68695e] transition hover:bg-[#f5f3ed] sm:flex-none"
            >
              Cancel
            </button>

            <button
              onClick={save}
              disabled={
                !name.trim() ||
                colors.length === 0 ||
                colors.some((color) => !/^#[0-9A-Fa-f]{6}$/.test(color))
              }
              className="flex-1 rounded-xl bg-[#89947a] px-5 py-3 text-xs font-medium text-white transition hover:bg-[#737f66] disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
