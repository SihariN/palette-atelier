
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Heart, Keyboard, Library } from "lucide-react";
import Link from "next/link";

import {
  PaletteColor,
  ColorHarmony,
  generatePalette,
} from "@/lib/colors";

import {
  consumePaletteForStudio,
  savePalette as savePaletteToLibrary,
} from "@/lib/palette-storage";

import PaletteControls from "./PaletteControls";
import ColorCard from "./ColorCard";

export default function PaletteStudio() {
  const hasLoadedInitialPalette = useRef(false);
  const [harmony, setHarmony] = useState<ColorHarmony>("analogous");

  const [colors, setColors] = useState<PaletteColor[]>([
    { id: "initial-1", hex: "#A7B49B", locked: false },
    { id: "initial-2", hex: "#D6C5B2", locked: false },
    { id: "initial-3", hex: "#E6B9A6", locked: false },
    { id: "initial-4", hex: "#8E9B86", locked: false },
    { id: "initial-5", hex: "#E8DCCB", locked: false },
  ]);

  const [isSaved, setIsSaved] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Prevent the effect from consuming the palette twice in development.
    if (hasLoadedInitialPalette.current) return;

    hasLoadedInitialPalette.current = true;

    const savedPalette = consumePaletteForStudio();

    if (savedPalette) {
      // Load the palette selected from My Library.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setColors(
        savedPalette.colors.map((hex) => ({
          id: crypto.randomUUID(),
          hex,
          locked: false,
        })),
      );

      setMessage(`Loaded "${savedPalette.name}" into Palette Studio.`);
    } else {
      setColors(generatePalette("analogous"));
    }
  }, []);

  const generate = useCallback(() => {
    setColors((current) => generatePalette(harmony, current));
    setIsSaved(false);
    setMessage("");
  }, [harmony]);

  function handleHarmonyChange(newHarmony: ColorHarmony) {
    setHarmony(newHarmony);
    setColors((current) => generatePalette(newHarmony, current));
    setIsSaved(false);
    setMessage("");
  }

  function toggleLock(index: number) {
    setColors((current) =>
      current.map((color, i) =>
        i === index ? { ...color, locked: !color.locked } : color,
      ),
    );
  }

  function changeColor(index: number, hex: string) {
    setColors((current) =>
      current.map((color, i) =>
        i === index ? { ...color, hex } : color,
      ),
    );

    setIsSaved(false);
    setMessage("");
  }

  function savePalette() {
    if (isSaved || colors.length === 0) return;

    const now = new Date().toISOString();

    savePaletteToLibrary({
      id: crypto.randomUUID(),
      name: `My ${harmony} palette`,
      colors: colors.map((color) => color.hex),
      source: "studio",
      createdAt: now,
      updatedAt: now,
    });

    setIsSaved(true);
    setMessage("Your palette has been saved to My Library!");
  }

  // Space shortcut.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target;

      if (
        event.code === "Space" &&
        !(target instanceof HTMLInputElement) &&
        !(target instanceof HTMLButtonElement) &&
        !(target instanceof HTMLTextAreaElement)
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

      <div className="flex flex-col gap-3 rounded-2xl border border-[#e8e5dc] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#353630]">Color harmony</p>
          <p className="mt-1 text-xs text-[#858479]">
            Choose a relationship between your colors.
          </p>
        </div>

        <PaletteControls harmony={harmony} onChange={handleHarmonyChange} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={colors.map((color) => color.hex).join("-")}
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

      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#e8e5dc] bg-[#fffefa] p-5 sm:flex-row">
        <div className="flex items-center gap-2 text-sm text-[#858479]">
          <Keyboard size={16} />
          <span>
            Press{" "}
            <kbd className="rounded border border-[#e8e5dc] bg-white px-2 py-1 font-mono text-xs">
              Space
            </kbd>{" "}
            to generate
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/atelier/library"
            className="inline-flex items-center gap-2 rounded-xl border border-[#e8e5dc] bg-white px-4 py-3 text-sm text-[#68695e] transition hover:bg-[#f5f3ed]"
          >
            <Library size={16} />
            My Library
          </Link>

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
            {isSaved ? "Saved to My Library" : "Save palette"}
          </button>
        </div>
      </div>

      {message && (
        <p className="rounded-xl border border-[#d9e5d5] bg-[#f2f7ef] px-4 py-3 text-sm text-[#587451]">
          {message}
        </p>
      )}
    </div>
  );
}
