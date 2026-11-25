
"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  PaletteColor,
  ColorHarmony,
  generatePalette,
} from "@/lib/colors";
import PaletteControls from "./PaletteControls";
import ColorCard from "./ColorCard";
import {
  Sparkles,
  Heart,
  Keyboard,
} from "lucide-react";

export default function PaletteStudio() {
  const [harmony, setHarmony] = useState<ColorHarmony>("analogous");
  const [colors, setColors] = useState<PaletteColor[]>(() =>
    generatePalette("analogous"),
  );
  const [favorites, setFavorites] = useState<PaletteColor[][]>([]);
  const [isSaved, setIsSaved] = useState(false);

  // Generate palette
  const generate = useCallback(() => {
    setColors((current) => generatePalette(harmony, current));
    setIsSaved(false);
  }, [harmony]);


  // Change harmony and immediately generate
  function handleHarmonyChange(newHarmony: ColorHarmony) {
    setHarmony(newHarmony);
    setColors((current) => generatePalette(newHarmony, current));
    setIsSaved(false);
  }

  // Lock/unlock
  function toggleLock(index: number) {
    setColors((current) =>
      current.map((color, i) =>
        i === index ? { ...color, locked: !color.locked } : color,
      ),
    );
  }

  // Edit a color
  function changeColor(index: number, hex: string) {
    setColors((current) =>
      current.map((color, i) => (i === index ? { ...color, hex } : color)),
    );
    setIsSaved(false);
  }

  // Save favorite
  function savePalette() {
    if (isSaved) return;

    setFavorites((current) => [...current, colors]);
    setIsSaved(true);
  }

  // Space shortcut
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.code === "Space" &&
        !(event.target instanceof HTMLInputElement) &&
        !(event.target instanceof HTMLButtonElement)
      ) {
        event.preventDefault();
        generate();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [generate]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[#89947a]">
            COLOR WORKSHOP
          </p>
          <h1 className="font-editorial text-4xl text-[#353630] sm:text-5xl">
            Palette Studio
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-6 text-[#858479]">
            Discover combinations, explore color harmony, and find the perfect
            palette for your next creative idea.
          </p>
        </div>

        <button
          onClick={generate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#89947a] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#737f66] active:scale-[0.98]"
        >
          <Sparkles size={16} />
          Generate palette
        </button>
      </div>

      {/* Harmony controls */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#e8e5dc] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#353630]">Color harmony</p>
          <p className="mt-1 text-xs text-[#858479]">
            Choose a relationship between your colors.
          </p>
        </div>
        <PaletteControls harmony={harmony} onChange={handleHarmonyChange} />
      </div>

      {/* Color cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={colors.map((c) => c.hex).join("-")}
          initial={{ opacity: 0.5, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
        >
          {colors.map((color, index) => (
            <ColorCard
              key={color.id}
              color={color}
              index={index}
              onToggleLock={toggleLock}
              onChangeColor={changeColor}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Bottom actions */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#e8e5dc] bg-[#fffefa] p-5 sm:flex-row">
        <div className="flex items-center gap-2 text-sm text-[#858479]">
          <Keyboard size={16} />
          <span>
            Press <kbd className="rounded border border-[#e8e5dc] bg-white px-2 py-1 font-mono text-xs">Space</kbd>{" "}
            to generate
          </span>
        </div>

        <button
          onClick={savePalette}
          disabled={isSaved || colors.length === 0}
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition ${
            isSaved
              ? "bg-[#e8ecdf] text-[#737f66]"
              : "bg-[#353630] text-white hover:bg-[#50514a]"
          }`}
        >
          <Heart size={16} fill={isSaved ? "currentColor" : "none"} />
          {isSaved ? "Saved to favorites" : "Save palette"}
        </button>
      </div>

      {/* Favorites preview */}
      {favorites.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-editorial text-2xl text-[#353630]">
              Your saved palettes
            </h2>
            <span className="text-xs text-[#858479]">
              {favorites.length} saved
            </span>
          </div>

          <div className="space-y-3">
            {favorites.map((palette, paletteIndex) => (
              <div
                key={paletteIndex}
                className="flex overflow-hidden rounded-xl border border-[#e8e5dc] bg-white"
              >
                {palette.map((color) => (
                  <div
                    key={color.id}
                    className="group relative h-20 flex-1"
                    style={{ backgroundColor: color.hex }}
                    title={color.hex}
                  >
                    <span className="absolute inset-x-0 bottom-0 translate-y-full bg-black/60 py-1 text-center font-mono text-[10px] text-white transition group-hover:translate-y-0">
                      {color.hex}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
