
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Palette,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import {
  getSavedPalettes,
  subscribeToPaletteChanges,
  type SavedPalette,
} from "@/lib/palette-storage";

import {
  normalizeHex,
  formatContrastRatio,
} from "@/lib/accessibility/contrast";

import {
  evaluateTextContrast,
} from "@/lib/accessibility/wcag";

import type { PaletteReportData } from "@/lib/accessibility/report-types";

type FilterType = "all" | "passing" | "needs-work";

type PalettePair = {
  id: string;
  firstColor: string;
  secondColor: string;
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
  passesLargeAA: boolean;
  passesLargeAAA: boolean;
};

function createPairs(colors: string[]): PalettePair[] {
  const pairs: PalettePair[] = [];

  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      try {
        const firstColor = normalizeHex(colors[i]);
        const secondColor = normalizeHex(colors[j]);

        const normal = evaluateTextContrast(
          firstColor,
          secondColor,
          "normal",
        );

        const large = evaluateTextContrast(
          firstColor,
          secondColor,
          "large",
        );

        pairs.push({
          id: `${i}-${j}`,
          firstColor,
          secondColor,
          ratio: normal.ratio,
          passesAA: normal.passesAA,
          passesAAA: normal.passesAAA,
          passesLargeAA: large.passesAA,
          passesLargeAAA: large.passesAAA,
        });
      } catch {
        // Ignore invalid colour values rather than stopping the entire scan.
      }
    }
  }

  return pairs;
}

function StatusLabel({
  passes,
  label,
}: {
  passes: boolean;
  label: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        passes
          ? "bg-[#EDF4EA] text-[#55775B]"
          : "bg-[#F9EEEA] text-[#B16A59]"
      }`}
    >
      {passes ? <Check size={12} /> : <X size={12} />}
      {label}
    </span>
  );
}

function PairCard({ pair }: { pair: PalettePair }) {
  return (
    <div className="rounded-xl border border-[#EAE7DE] bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex overflow-hidden rounded-lg border border-[#EAE7DE]">
            <div
              className="h-9 w-9"
              style={{ backgroundColor: pair.firstColor }}
              title={pair.firstColor}
            />
            <div
              className="h-9 w-9"
              style={{ backgroundColor: pair.secondColor }}
              title={pair.secondColor}
            />
          </div>

          <div>
            <p className="font-mono text-xs text-[#45483F]">
              {pair.firstColor}
            </p>
            <p className="font-mono text-xs text-[#929083]">
              {pair.secondColor}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-lg font-semibold text-[#3F5147]">
            {formatContrastRatio(pair.ratio)}
          </p>
          <p className="text-[10px] text-[#929083]">
            Contrast ratio
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex flex-wrap gap-2">
          <StatusLabel passes={pair.passesAA} label="Normal AA" />
          <StatusLabel passes={pair.passesAAA} label="Normal AAA" />
        </div>

        <div className="flex flex-wrap gap-2">
          <StatusLabel passes={pair.passesLargeAA} label="Large AA" />
          <StatusLabel passes={pair.passesLargeAAA} label="Large AAA" />
        </div>
      </div>
    </div>
  );
}

type PaletteScannerProps = {
  onResultChange?: (result: PaletteReportData | null) => void;
};

export default function PaletteScanner({
  onResultChange,
}: PaletteScannerProps) {
  const [palettes, setPalettes] = useState<SavedPalette[]>([]);
  const [selectedPaletteId, setSelectedPaletteId] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    const refreshPalettes = () => {
      const updatedPalettes = getSavedPalettes();

      setPalettes(updatedPalettes);

      setSelectedPaletteId((currentId) => {
        const stillExists = updatedPalettes.some(
          (palette) => palette.id === currentId,
        );

        if (stillExists) return currentId;

        return updatedPalettes[0]?.id ?? "";
      });
    };

    refreshPalettes();

    return subscribeToPaletteChanges(refreshPalettes);
  }, []);

  const selectedPalette = useMemo(
    () =>
      palettes.find(
        (palette) => palette.id === selectedPaletteId,
      ) ?? null,
    [palettes, selectedPaletteId],
  );

  const pairs = useMemo(
    () => selectedPalette
      ? createPairs(selectedPalette.colors)
      : [],
    [selectedPalette],
  );

  const filteredPairs = useMemo(() => {
    if (filter === "passing") {
      return pairs.filter((pair) => pair.passesAA);
    }

    if (filter === "needs-work") {
      return pairs.filter((pair) => !pair.passesAA);
    }

    return pairs;
  }, [pairs, filter]);

  const passingCount = pairs.filter((pair) => pair.passesAA).length;
  const needsWorkCount = pairs.length - passingCount;

  useEffect(() => {
  if (!selectedPalette) {
    onResultChange?.(null);
    return;
  }

  onResultChange?.({
    paletteName: selectedPalette.name,
    totalPairs: pairs.length,
    passingCount,
    needsWorkCount,
    pairs: pairs.map((pair) => ({
      firstColor: pair.firstColor,
      secondColor: pair.secondColor,
      ratio: pair.ratio,
      passesAA: pair.passesAA,
      passesAAA: pair.passesAAA,
      passesLargeAA: pair.passesLargeAA,
      passesLargeAAA: pair.passesLargeAAA,
    })),
  });
}, [selectedPalette, pairs, passingCount, needsWorkCount, onResultChange]);

  const refresh = () => {
    const updatedPalettes = getSavedPalettes();
    setPalettes(updatedPalettes);

    if (!updatedPalettes.some(
      (palette) => palette.id === selectedPaletteId,
    )) {
      setSelectedPaletteId(updatedPalettes[0]?.id ?? "");
    }
  };

  return (
    <section className="space-y-6">
      {/* Scanner introduction */}
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EDF1E9] text-[#718A75]">
            <Search size={17} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#3F5147]">
              Palette Scanner
            </h2>
            <p className="text-sm text-[#929083]">
              Check the accessibility of your saved colour palettes.
            </p>
          </div>
        </div>
      </div>

      {/* Palette selector */}
      <div className="rounded-2xl border border-[#EAE7DE] bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-3 flex items-center justify-between">
          <label
            htmlFor="palette-scan-select"
            className="text-sm font-semibold text-[#45483F]"
          >
            Choose a palette
          </label>

          <button
            onClick={refresh}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#718A75] transition hover:bg-[#F3F4EF]"
          >
            <RefreshCw size={13} />
            Refresh
          </button>
        </div>

        {palettes.length === 0 ? (
          <div className="rounded-xl bg-[#F6F5EF] p-6 text-center">
            <Palette
              size={25}
              className="mx-auto text-[#929083]"
            />

            <p className="mt-3 text-sm font-semibold text-[#45483F]">
              Your library is waiting for some colour.
            </p>

            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-[#929083]">
              Save a palette from Palette Studio or Image Extractor
              and it will appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="relative">
              <select
                id="palette-scan-select"
                value={selectedPaletteId}
                onChange={(event) =>
                  setSelectedPaletteId(event.target.value)
                }
                className="w-full appearance-none rounded-xl border border-[#E8E5DC] bg-[#FAF9F5] px-4 py-3 pr-10 text-sm text-[#45483F] outline-none transition focus:border-[#9AAA91]"
              >
                {palettes.map((palette) => (
                  <option key={palette.id} value={palette.id}>
                    {palette.name}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#929083]"
              />
            </div>

            {selectedPalette && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {selectedPalette.colors.map((color, index) => (
                  <div
                    key={`${selectedPalette.id}-${index}`}
                    className="flex items-center gap-2 rounded-full border border-[#EAE7DE] py-1 pl-1 pr-3"
                  >
                    <span
                      className="h-6 w-6 rounded-full border border-black/5"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-mono text-[11px] text-[#77776C]">
                      {color}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Scan results */}
      {selectedPalette && (
        <>
          {pairs.length === 0 ? (
            <div className="rounded-2xl border border-[#EAE7DE] bg-white p-6 text-sm text-[#929083]">
              This palette needs at least two valid colours to perform a scan.
            </div>
          ) : (
            <>
              {/* Summary */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#EAE7DE] bg-white p-4">
                  <p className="text-xs text-[#929083]">
                    Colour combinations
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[#3F5147]">
                    {pairs.length}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#D9E6D8] bg-[#F4F7F1] p-4">
                  <p className="text-xs text-[#718A75]">
                    Pass normal text AA
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[#55775B]">
                    {passingCount}
                  </p>
                </div>

                <div className="rounded-2xl border border-[#EBD9D4] bg-[#FBF4F1] p-4">
                  <p className="text-xs text-[#B16A59]">
                    Need improvement
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[#A65F50]">
                    {needsWorkCount}
                  </p>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-semibold text-[#3F5147]">
                  Combination results
                </h3>

                <div className="flex flex-wrap gap-2">
                  {([
                    ["all", "All"],
                    ["passing", "Passing"],
                    ["needs-work", "Needs work"],
                  ] as const).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => setFilter(value)}
                      aria-pressed={filter === value}
                      className={`rounded-full px-3 py-2 text-xs font-medium transition ${
                        filter === value
                          ? "bg-[#718A75] text-white"
                          : "bg-[#F1F0EA] text-[#77776C] hover:bg-[#E8E7DF]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pair cards */}
              {filteredPairs.length > 0 ? (
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                  {filteredPairs.map((pair) => (
                    <PairCard key={pair.id} pair={pair} />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-[#DEDCD2] p-8 text-center">
                  <Check
                    size={23}
                    className="mx-auto text-[#718A75]"
                  />
                  <p className="mt-3 text-sm font-medium text-[#45483F]">
                    {filter === "passing"
                      ? "No combinations pass normal-text AA yet."
                      : "Lovely! All combinations pass normal-text AA."}
                  </p>
                  <p className="mt-1 text-xs text-[#929083]">
                    Try another filter to explore the results.
                  </p>
                </div>
              )}
            </>
          )}
        </>
      )}

      <p className="text-xs leading-5 text-[#929083]">
        Note: These results evaluate every unique colour pair as a possible
        foreground/background combination. Actual accessibility depends on
        how each colour is used in your design. WCAG contrast requirements
        do not apply identically to every decorative colour pairing.
      </p>
    </section>
  );
}
