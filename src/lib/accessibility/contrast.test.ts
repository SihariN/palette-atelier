
import { describe, expect, it } from "vitest";

import {
  normalizeHex,
  hexToRgb,
  relativeLuminance,
  contrastRatio,
  formatContrastRatio,
} from "./contrast";

describe("normalizeHex", () => {
  it("normalizes six-character HEX values", () => {
    expect(normalizeHex("#aabbcc")).toBe("#AABBCC");
  });

  it("expands three-character HEX values", () => {
    expect(normalizeHex("#ABC")).toBe("#AABBCC");
  });

  it("accepts HEX values without #", () => {
    expect(normalizeHex("ffffff")).toBe("#FFFFFF");
  });

  it("rejects invalid HEX values", () => {
    expect(() => normalizeHex("#XYZ123")).toThrow();
  });
});

describe("hexToRgb", () => {
  it("converts HEX into RGB values", () => {
    expect(hexToRgb("#FF8040")).toEqual({
      r: 255,
      g: 128,
      b: 64,
    });
  });
});

describe("relativeLuminance", () => {
  it("returns zero for black", () => {
    expect(relativeLuminance("#000000")).toBe(0);
  });

  it("returns one for white", () => {
    expect(relativeLuminance("#FFFFFF")).toBeCloseTo(1, 5);
  });
});

describe("contrastRatio", () => {
  it("returns 21 for black and white", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 5);
  });

  it("returns 1 for identical colours", () => {
    expect(contrastRatio("#FFFFFF", "#FFFFFF")).toBeCloseTo(1, 5);
  });

  it("is independent of colour argument order", () => {
    const first = contrastRatio("#000000", "#FFFFFF");
    const second = contrastRatio("#FFFFFF", "#000000");

    expect(first).toBeCloseTo(second, 5);
  });

  it("calculates the expected ratio for grey against white", () => {
    expect(contrastRatio("#767676", "#FFFFFF")).toBeCloseTo(4.54, 1);
  });
});

describe("formatContrastRatio", () => {
  it("formats a ratio to two decimal places", () => {
    expect(formatContrastRatio(7.12345)).toBe("7.12:1");
  });
});
