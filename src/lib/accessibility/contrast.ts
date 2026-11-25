
/**
 * Palette Atelier — Colour Contrast Engine
 *
 * Implements the WCAG relative luminance and contrast ratio
 * calculations using the sRGB colour space.
 */

export type RGB = {
  r: number;
  g: number;
  b: number;
};

/**
 * Normalizes a HEX colour.
 *
 * Supports:
 *   #FFF
 *   FFF
 *   #FFFFFF
 *   FFFFFF
 *
 * Returns a six-character HEX value with a leading #.
 */
export function normalizeHex(hex: string): string {
  const cleaned = hex.trim().replace(/^#/, "");

  if (/^[0-9a-fA-F]{3}$/.test(cleaned)) {
    const expanded = cleaned
      .split("")
      .map((character) => character + character)
      .join("");

    return `#${expanded.toUpperCase()}`;
  }

  if (/^[0-9a-fA-F]{6}$/.test(cleaned)) {
    return `#${cleaned.toUpperCase()}`;
  }

  throw new Error(`Invalid HEX colour: ${hex}`);
}

/**
 * Converts a HEX colour into RGB values.
 *
 * Each channel is an integer between 0 and 255.
 */
export function hexToRgb(hex: string): RGB {
  const normalized = normalizeHex(hex);
  const value = normalized.slice(1);

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

/**
 * Converts an sRGB channel into a linear RGB value.
 *
 * The input is normalized to a range of 0–1.
 */
function linearizeChannel(channel: number): number {
  const normalized = channel / 255;

  if (normalized <= 0.04045) {
    return normalized / 12.92;
  }

  return Math.pow(
    (normalized + 0.055) / 1.055,
    2.4,
  );
}

/**
 * Calculates the relative luminance of an RGB colour.
 *
 * Returns a value between 0 (black) and 1 (white).
 */
export function relativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);

  const red = linearizeChannel(rgb.r);
  const green = linearizeChannel(rgb.g);
  const blue = linearizeChannel(rgb.b);

  return (
    0.2126 * red +
    0.7152 * green +
    0.0722 * blue
  );
}

/**
 * Calculates the WCAG contrast ratio between two colours.
 *
 * The order of the arguments does not affect the result.
 *
 * Returns a value between 1 and 21.
 */
export function contrastRatio(
  foreground: string,
  background: string,
): number {
  const foregroundLuminance =
    relativeLuminance(foreground);

  const backgroundLuminance =
    relativeLuminance(background);

  const lighter = Math.max(
    foregroundLuminance,
    backgroundLuminance,
  );

  const darker = Math.min(
    foregroundLuminance,
    backgroundLuminance,
  );

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Formats a contrast ratio for display.
 *
 * Example: 7.12345 becomes "7.12:1".
 */
export function formatContrastRatio(ratio: number): string {
  return `${ratio.toFixed(2)}:1`;
}
