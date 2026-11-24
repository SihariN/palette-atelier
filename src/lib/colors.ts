
export type ColorHarmony =
  | "random"
  | "monochromatic"
  | "analogous"
  | "complementary"
  | "triadic";

export type PaletteColor = {
  id: string;
  hex: string;
  locked: boolean;
};

export const HARMONY_OPTIONS: {
  value: ColorHarmony;
  label: string;
}[] = [
  { value: "random", label: "Random" },
  { value: "monochromatic", label: "Monochromatic" },
  { value: "analogous", label: "Analogous" },
  { value: "complementary", label: "Complementary" },
  { value: "triadic", label: "Triadic" },
];

// HEX → RGB
export function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");

  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

// RGB → HSL
export function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));

    if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }

    h *= 60;

    if (h < 0) h += 360;
  }

  return { h, s: s * 100, l: l * 100 };
}

// HSL → RGB
export function hslToRgb(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

// RGB → HEX
export function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map((value) => value.toString(16).padStart(2, "0"))
      .join("")
  ).toUpperCase();
}

// HSL → HEX
export function hslToHex(h: number, s: number, l: number) {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

// Generate a random number within a range
function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// Generate one random HEX color
export function randomHex() {
  const h = randomBetween(0, 360);
  const s = randomBetween(45, 85);
  const l = randomBetween(35, 75);

  return hslToHex(h, s, l);
}

// Generate a palette based on harmony
export function generatePalette(
  harmony: ColorHarmony,
  lockedColors: PaletteColor[] = [],
): PaletteColor[] {
  const baseHue = randomBetween(0, 360);
  const baseSaturation = randomBetween(50, 80);
  const baseLightness = randomBetween(35, 70);

  const hueOffsets: Record<ColorHarmony, number[]> = {
    random: [0, 0, 0, 0, 0],
    monochromatic: [0, 0, 0, 0, 0],
    analogous: [-40, -20, 0, 20, 40],
    complementary: [0, 0, 180, 180, 180],
    triadic: [0, 120, 120, 240, 240],
  };

  const generated = hueOffsets[harmony].map((offset, index) => {
    let hue = (baseHue + offset + 360) % 360;

    let saturation = baseSaturation + randomBetween(-12, 12);
    let lightness = baseLightness + randomBetween(-15, 15);

    if (harmony === "random") {
      hue = randomBetween(0, 360);
      saturation = randomBetween(45, 85);
      lightness = randomBetween(35, 75);
    }

    if (harmony === "monochromatic") {
      saturation = baseSaturation;
      lightness = [30, 42, 54, 66, 78][index];
    }

    return {
      id: crypto.randomUUID(),
      hex: hslToHex(
        hue,
        Math.max(20, Math.min(95, saturation)),
        Math.max(15, Math.min(90, lightness)),
      ),
      locked: false,
    };
  });

  // Keep locked colors in their original positions.
  return generated.map((color, index) => {
    if (lockedColors[index]?.locked) {
      return lockedColors[index];
    }

    return color;
  });
}
