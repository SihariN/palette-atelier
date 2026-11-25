
"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Copy,
  Lightbulb,
  Sparkles,
} from "lucide-react";

import {
  normalizeHex,
  contrastRatio,
  formatContrastRatio,
} from "@/lib/accessibility/contrast";

import {
  suggestAccessibleColor,
  type ContrastTarget,
} from "@/lib/accessibility/color-improvement";

const TARGET_OPTIONS: {
  value: ContrastTarget;
  label: string;
  description: string;
}[] = [
  {
    value: "normal-AA",
    label: "Normal text — AA",
    description: "4.5:1 minimum",
  },
  {
    value: "normal-AAA",
    label: "Normal text — AAA",
    description: "7:1 minimum",
  },
  {
    value: "large-AA",
    label: "Large text — AA",
    description: "3:1 minimum",
  },
  {
    value: "large-AAA",
    label: "Large text — AAA",
    description: "4.5:1 minimum",
  },
];

function isValidHex(value: string) {
  return /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
}

export default function ColorImprover() {
  const [foreground, setForeground] = useState("#AAAAAA");
  const [background, setBackground] = useState("#FFFFFF");
  const [target, setTarget] = useState<ContrastTarget>("normal-AA");
  const [copied, setCopied] = useState(false);

  const valid = isValidHex(foreground) && isValidHex(background);

  const result = useMemo(() => {
    if (!valid) return null;

    const normalizedForeground = normalizeHex(foreground);
    const normalizedBackground = normalizeHex(background);

    const currentRatio = contrastRatio(
      normalizedForeground,
      normalizedBackground,
    );

    const suggestion = suggestAccessibleColor(
      normalizedForeground,
      normalizedBackground,
      target,
    );

    return {
      currentRatio,
      suggestion,
      foreground: normalizedForeground,
      background: normalizedBackground,
    };
  }, [foreground, background, target, valid]);

  const copySuggestion = async () => {
    if (!result?.suggestion) return;

    try {
      await navigator.clipboard.writeText(result.suggestion.hex);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5EFE6] text-[#A27B56]">
          <Lightbulb size={19} />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[#3F5147]">
            Colour Improver
          </h2>
          <p className="mt-1 text-sm text-[#929083]">
            Find a more accessible version of your colour.
          </p>
        </div>
      </div>

      {/* Inputs */}
      <div className="rounded-2xl border border-[#EAE7DE] bg-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="improver-foreground"
              className="mb-2 block text-sm font-medium text-[#45483F]"
            >
              Original foreground
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-[#E8E5DC] p-3">
              <input
                type="color"
                value={isValidHex(foreground) ? normalizeHex(foreground) : "#000000"}
                onChange={(event) =>
                  setForeground(event.target.value.toUpperCase())
                }
                aria-label="Choose foreground colour"
                className="h-10 w-10 cursor-pointer rounded-lg border-0 bg-transparent"
              />

              <input
                id="improver-foreground"
                value={foreground}
                onChange={(event) => setForeground(event.target.value)}
                maxLength={7}
                spellCheck={false}
                className="w-full min-w-0 bg-transparent font-mono text-sm uppercase text-[#45483F] outline-none"
                placeholder="#AAAAAA"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="improver-background"
              className="mb-2 block text-sm font-medium text-[#45483F]"
            >
              Background
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-[#E8E5DC] p-3">
              <input
                type="color"
                value={isValidHex(background) ? normalizeHex(background) : "#FFFFFF"}
                onChange={(event) =>
                  setBackground(event.target.value.toUpperCase())
                }
                aria-label="Choose background colour"
                className="h-10 w-10 cursor-pointer rounded-lg border-0 bg-transparent"
              />

              <input
                id="improver-background"
                value={background}
                onChange={(event) => setBackground(event.target.value)}
                maxLength={7}
                spellCheck={false}
                className="w-full min-w-0 bg-transparent font-mono text-sm uppercase text-[#45483F] outline-none"
                placeholder="#FFFFFF"
              />
            </div>
          </div>
        </div>

        {!valid && (
          <p className="mt-3 text-xs text-[#B65F52]">
            Enter valid HEX colours using 3 or 6 hexadecimal digits.
          </p>
        )}

        <div className="mt-5">
          <label
            htmlFor="improver-target"
            className="mb-2 block text-sm font-medium text-[#45483F]"
          >
            Accessibility target
          </label>

          <select
            id="improver-target"
            value={target}
            onChange={(event) =>
              setTarget(event.target.value as ContrastTarget)
            }
            className="w-full rounded-xl border border-[#E8E5DC] bg-[#FAF9F5] px-4 py-3 text-sm text-[#45483F] outline-none focus:border-[#9AAA91]"
          >
            {TARGET_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} — {option.description}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Suggestions */}
      {result && (
        <div className="rounded-2xl border border-[#EAE7DE] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-2">
            <Sparkles size={17} className="text-[#A27B56]" />
            <h3 className="font-semibold text-[#3F5147]">
              Your colour suggestion
            </h3>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#EAE7DE] p-4">
              <p className="mb-3 text-xs font-medium text-[#929083]">
                Original colour
              </p>

              <div
                className="flex h-24 items-end rounded-lg p-3"
                style={{
                  backgroundColor: result.background,
                  color: result.foreground,
                }}
              >
                <span className="text-sm font-semibold">
                  Preview text
                </span>
              </div>

              <p className="mt-3 font-mono text-sm text-[#45483F]">
                {result.foreground}
              </p>

              <p className="mt-1 text-xs text-[#929083]">
                {formatContrastRatio(result.currentRatio)}
              </p>
            </div>

            {result.suggestion ? (
              <div className="rounded-xl border border-[#D9E6D8] bg-[#F8FAF6] p-4">
                <p className="mb-3 text-xs font-medium text-[#718A75]">
                  Suggested colour
                </p>

                <div
                  className="flex h-24 items-end rounded-lg p-3"
                  style={{
                    backgroundColor: result.background,
                    color: result.suggestion.hex,
                  }}
                >
                  <span className="text-sm font-semibold">
                    Preview text
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <p className="font-mono text-sm text-[#45483F]">
                    {result.suggestion.hex}
                  </p>

                  <button
                    onClick={copySuggestion}
                    className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-medium text-[#55775B] transition hover:bg-[#EDF4EA]"
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>

                <p className="mt-2 text-xs text-[#718A75]">
                {formatContrastRatio(result.suggestion.ratio)} ·{" "}
                {result.suggestion.distance === 0
                    ? "Already accessible"
                    : result.suggestion.direction === "darker"
                    ? "Darkened"
                    : "Lightened"}
                </p>

              </div>
            ) : (
              <div className="flex flex-col justify-center rounded-xl bg-[#FBF4F1] p-5">
                <p className="text-sm font-semibold text-[#A65F50]">
                  No suitable foreground found.
                </p>
                <p className="mt-2 text-xs leading-5 text-[#929083]">
                  Neither black nor white can achieve this target against
                  the selected background. Try adjusting the background colour.
                </p>
              </div>
            )}
          </div>

          {result.suggestion && (
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#F4F5EF] p-4">
              <Check
                size={16}
                className="mt-0.5 shrink-0 text-[#718A75]"
              />
                <p className="text-xs leading-5 text-[#687466]">
                {result.suggestion.distance === 0
                    ? "Your original colour already meets the selected accessibility target. No adjustment was necessary."
                    : "The suggested colour meets your selected contrast target. The background remains unchanged, and the foreground has been adjusted towards the closest suitable darker or lighter colour."}
                </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
