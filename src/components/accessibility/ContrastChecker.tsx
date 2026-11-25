
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Check,
  Copy,
  RotateCcw,
  X,
} from "lucide-react";

import {
  normalizeHex,
  formatContrastRatio,
} from "@/lib/accessibility/contrast";

import {
  evaluateTextContrast,
  evaluateNonTextContrast,
  getContrastVerdict,
  type TextSize,
} from "@/lib/accessibility/wcag";

import type { ContrastReportData } from "@/lib/accessibility/report-types";

const INITIAL_FOREGROUND = "#3F5147";
const INITIAL_BACKGROUND = "#F7F5EF";

type ColorFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function ColorField({ label, value, onChange }: ColorFieldProps) {
  const isValid = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);

  const pickerValue = isValid
    ? normalizeHex(value)
    : "#000000";

  return (
    <div className="flex-1">
      <label className="mb-2 block text-sm font-medium text-[#45483F]">
        {label}
      </label>

      <div className="flex items-center gap-3 rounded-xl border border-[#E8E5DC] bg-white p-3">
        <input
          type="color"
          value={pickerValue}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          aria-label={`${label} colour picker`}
          className="h-10 w-10 cursor-pointer rounded-lg border-0 bg-transparent"
        />

        <div className="min-w-0 flex-1">
          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            aria-label={`${label} HEX value`}
            spellCheck={false}
            maxLength={7}
            className="w-full bg-transparent font-mono text-sm uppercase text-[#45483F] outline-none"
            placeholder="#FFFFFF"
          />
          <p className="mt-1 text-xs text-[#929083]">
            HEX colour
          </p>
        </div>

        {isValid ? (
          <Check size={17} className="text-[#718A75]" />
        ) : (
          <AlertCircle size={17} className="text-[#C47B69]" />
        )}
      </div>

      {!isValid && (
        <p className="mt-1.5 text-xs text-[#B65F52]">
          Enter a valid 3 or 6 digit HEX colour.
        </p>
      )}
    </div>
  );
}

type ResultBadgeProps = {
  passes: boolean;
  label: string;
};

function ResultBadge({ passes, label }: ResultBadgeProps) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl border p-3 ${
        passes
          ? "border-[#D9E6D8] bg-[#F1F6EF]"
          : "border-[#EBD9D4] bg-[#FBF2EF]"
      }`}
    >
      <span className="text-sm font-medium text-[#45483F]">
        {label}
      </span>

      <span
        className={`flex items-center gap-1.5 text-xs font-semibold ${
          passes ? "text-[#55775B]" : "text-[#B65F52]"
        }`}
      >
        {passes ? <Check size={14} /> : <X size={14} />}
        {passes ? "Pass" : "Fail"}
      </span>
    </div>
  );
}

type ContrastCheckerProps = {
  onResultChange?: (result: ContrastReportData | null) => void;
};

export default function ContrastChecker({
  onResultChange,
}: ContrastCheckerProps) {
  const [foreground, setForeground] = useState(INITIAL_FOREGROUND);
  const [background, setBackground] = useState(INITIAL_BACKGROUND);
  const [textSize, setTextSize] = useState<TextSize>("normal");
  const [copied, setCopied] = useState(false);

  const isValid =
    /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(foreground) &&
    /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(background);

  const results = useMemo(() => {
    if (!isValid) return null;

    const normalizedForeground = normalizeHex(foreground);
    const normalizedBackground = normalizeHex(background);

    return {
      text: evaluateTextContrast(
        normalizedForeground,
        normalizedBackground,
        textSize,
      ),
      nonText: evaluateNonTextContrast(
        normalizedForeground,
        normalizedBackground,
      ),
    };
  }, [foreground, background, textSize, isValid]);


  useEffect(() => {
    if (!results || !isValid) {
      onResultChange?.(null);
      return;
    }

    onResultChange?.({
      foreground: normalizeHex(foreground),
      background: normalizeHex(background),
      textSize,
      ratio: results.text.ratio,
      passesAA: results.text.passesAA,
      passesAAA: results.text.passesAAA,
      nonTextPasses: results.nonText.passes,
    });
  }, [results, foreground, background, textSize, isValid, onResultChange]);


  const resetColors = () => {
    setForeground(INITIAL_FOREGROUND);
    setBackground(INITIAL_BACKGROUND);
    setTextSize("normal");
  };

  const copyColors = async () => {
    try {
      const text = `Foreground: ${normalizeHex(foreground)}\nBackground: ${normalizeHex(background)}\nContrast ratio: ${formatContrastRatio(results!.text.ratio)}`;

      await navigator.clipboard.writeText(text);
      setCopied(true);

      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Colour controls */}
      <section className="rounded-2xl border border-[#EAE7DE] bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#3F5147]">
              Colour combination
            </h2>
            <p className="mt-1 text-sm text-[#929083]">
              Choose the colours you want to evaluate.
            </p>
          </div>

          <button
            onClick={resetColors}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-[#718A75] transition hover:bg-[#F3F4EF]"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <ColorField
            label="Text / Foreground"
            value={foreground}
            onChange={setForeground}
          />

          <ColorField
            label="Background"
            value={background}
            onChange={setBackground}
          />
        </div>
      </section>

      {/* Live preview */}
      <section className="overflow-hidden rounded-2xl border border-[#EAE7DE] bg-white shadow-sm">
        <div className="border-b border-[#EAE7DE] px-5 py-4 sm:px-6">
          <h2 className="font-semibold text-[#3F5147]">
            Live preview
          </h2>
          <p className="mt-1 text-sm text-[#929083]">
            See how your colour combination looks in practice.
          </p>
        </div>

        <div
          className="p-7 transition-colors sm:p-10"
          style={{
            backgroundColor: isValid
              ? normalizeHex(background)
              : "#F7F5EF",
            color: isValid
              ? normalizeHex(foreground)
              : "#3F5147",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">
            Palette Atelier
          </p>

          <h3 className="mt-4 text-3xl font-semibold tracking-tight">
            Design with clarity.
          </h3>

          <p className="mt-3 max-w-lg text-sm leading-7">
            Beautiful design should be accessible to everyone.
            Explore how your chosen colours work together.
          </p>

          <button
            className="mt-6 rounded-full border border-current px-5 py-2 text-sm font-medium"
          >
            Explore palette
          </button>
        </div>
      </section>

      {/* Contrast results */}
      <section className="rounded-2xl border border-[#EAE7DE] bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[#3F5147]">
              Contrast results
            </h2>
            <p className="mt-1 text-sm text-[#929083]">
              Based on WCAG 2.2 contrast requirements.
            </p>
          </div>

          {results && (
            <button
              onClick={copyColors}
              className="flex items-center gap-2 rounded-lg border border-[#EAE7DE] px-3 py-2 text-xs font-medium text-[#718A75] transition hover:bg-[#F6F6F1]"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy results"}
            </button>
          )}
        </div>

        {!results ? (
          <div className="rounded-xl bg-[#FBF5F1] p-5 text-sm text-[#A65F50]">
            Please enter valid HEX values for both colours to see the results.
          </div>
        ) : (
          <div className="space-y-5">
            <div className="rounded-2xl bg-[#F5F5F0] p-5">
              <p className="text-sm text-[#929083]">
                Contrast ratio
              </p>

              <p className="mt-2 text-4xl font-semibold tracking-tight text-[#3F5147]">
                {formatContrastRatio(results.text.ratio)}
              </p>

              <p className="mt-2 text-sm text-[#718A75]">
                {getContrastVerdict(results.text)}
              </p>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-[#45483F]">
                Text contrast
              </p>

              <div className="mb-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setTextSize("normal")}
                  aria-pressed={textSize === "normal"}
                  className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                    textSize === "normal"
                      ? "bg-[#718A75] text-white"
                      : "bg-[#F3F2EC] text-[#77776C] hover:bg-[#EAE9E1]"
                  }`}
                >
                  Normal text
                </button>

                <button
                  onClick={() => setTextSize("large")}
                  aria-pressed={textSize === "large"}
                  className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                    textSize === "large"
                      ? "bg-[#718A75] text-white"
                      : "bg-[#F3F2EC] text-[#77776C] hover:bg-[#EAE9E1]"
                  }`}
                >
                  Large text
                </button>
              </div>

              <div className="space-y-2">
                <ResultBadge
                  passes={results.text.passesAA}
                  label={`${textSize === "normal" ? "Normal" : "Large"} text — WCAG AA`}
                />

                <ResultBadge
                  passes={results.text.passesAAA}
                  label={`${textSize === "normal" ? "Normal" : "Large"} text — WCAG AAA`}
                />
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-[#45483F]">
                Non-text contrast
              </p>

              <ResultBadge
                passes={results.nonText.passes}
                label="UI components and graphical objects — 3:1"
              />

              <p className="mt-2 text-xs leading-5 text-[#929083]">
                This check evaluates the 3:1 contrast requirement for
                applicable interface components and meaningful graphical objects.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
