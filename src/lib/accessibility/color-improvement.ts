
import {
  contrastRatio,
  hexToRgb,
  type RGB,
} from "./contrast";

export type ContrastTarget =
  | "normal-AA"
  | "normal-AAA"
  | "large-AA"
  | "large-AAA";

export type ColorSuggestion = {
  hex: string;
  ratio: number;
  direction: "darker" | "lighter";
  distance: number;
};

const TARGET_RATIOS: Record<ContrastTarget, number> = {
  "normal-AA": 4.5,
  "normal-AAA": 7,
  "large-AA": 3,
  "large-AAA": 4.5,
};

function rgbToHex(rgb: RGB): string {
  const toChannel = (value: number) =>
    Math.round(Math.max(0, Math.min(255, value)))
      .toString(16)
      .padStart(2, "0");

  return `#${toChannel(rgb.r)}${toChannel(rgb.g)}${toChannel(rgb.b)}`.toUpperCase();
}

function blend(
  start: RGB,
  end: RGB,
  amount: number,
): RGB {
  return {
    r: start.r + (end.r - start.r) * amount,
    g: start.g + (end.g - start.g) * amount,
    b: start.b + (end.b - start.b) * amount,
  };
}

function colorDistance(first: RGB, second: RGB): number {
  return Math.sqrt(
    Math.pow(first.r - second.r, 2) +
    Math.pow(first.g - second.g, 2) +
    Math.pow(first.b - second.b, 2),
  );
}

function findCandidate(
  original: RGB,
  background: string,
  endpoint: RGB,
  requiredRatio: number,
  direction: "darker" | "lighter",
): ColorSuggestion | null {
  const endpointHex = rgbToHex(endpoint);

  if (contrastRatio(endpointHex, background) < requiredRatio) {
    return null;
  }

  let low = 0;
  let high = 1;

  // Find the smallest adjustment that reaches the target.
  for (let iteration = 0; iteration < 28; iteration++) {
    const middle = (low + high) / 2;
    const candidate = blend(original, endpoint, middle);
    const candidateHex = rgbToHex(candidate);

    if (contrastRatio(candidateHex, background) >= requiredRatio) {
      high = middle;
    } else {
      low = middle;
    }
  }

  const result = blend(original, endpoint, high);
  const hex = rgbToHex(result);

  return {
    hex,
    ratio: contrastRatio(hex, background),
    direction,
    distance: colorDistance(original, result),
  };
}

export function suggestAccessibleColor(
  foreground: string,
  background: string,
  target: ContrastTarget,
): ColorSuggestion | null {
  const requiredRatio = TARGET_RATIOS[target];

  const original = hexToRgb(foreground);
  const currentRatio = contrastRatio(foreground, background);

  if (currentRatio >= requiredRatio) {
    return {
      hex: rgbToHex(original),
      ratio: currentRatio,
      direction: "darker",
      distance: 0,
    };
  }

  const darker = findCandidate(
    original,
    background,
    { r: 0, g: 0, b: 0 },
    requiredRatio,
    "darker",
  );

  const lighter = findCandidate(
    original,
    background,
    { r: 255, g: 255, b: 255 },
    requiredRatio,
    "lighter",
  );

  if (!darker && !lighter) {
    return null;
  }

  if (!darker) return lighter;
  if (!lighter) return darker;

  return darker.distance < lighter.distance
    ? darker
    : lighter;
}
