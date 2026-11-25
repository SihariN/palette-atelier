
import { describe, expect, it } from "vitest";

import {
  evaluateTextContrast,
  evaluateNonTextContrast,
  getContrastVerdict,
} from "./wcag";

describe("evaluateTextContrast", () => {
  it("passes AA and AAA for black text on white", () => {
    const result = evaluateTextContrast("#000000", "#FFFFFF");

    expect(result.passesAA).toBe(true);
    expect(result.passesAAA).toBe(true);
  });

  it("passes AA but fails AAA for #767676 on white", () => {
    const result = evaluateTextContrast("#767676", "#FFFFFF");

    expect(result.passesAA).toBe(true);
    expect(result.passesAAA).toBe(false);
  });

  it("fails normal text when contrast is insufficient", () => {
    const result = evaluateTextContrast("#AAAAAA", "#FFFFFF");

    expect(result.passesAA).toBe(false);
    expect(result.passesAAA).toBe(false);
  });

  it("uses lower thresholds for large text", () => {
    const normal = evaluateTextContrast(
      "#767676",
      "#FFFFFF",
      "normal",
    );

    const large = evaluateTextContrast(
      "#767676",
      "#FFFFFF",
      "large",
    );

    expect(normal.passesAAA).toBe(false);
    expect(large.passesAAA).toBe(true);
  });
});

describe("evaluateNonTextContrast", () => {
  it("passes when contrast reaches 3:1", () => {
    const result = evaluateNonTextContrast("#949494", "#FFFFFF");

    expect(result.passes).toBe(true);
  });

  it("fails when contrast is below 3:1", () => {
    const result = evaluateNonTextContrast("#AAAAAA", "#FFFFFF");

    expect(result.passes).toBe(false);
  });
});

describe("getContrastVerdict", () => {
  it("returns the AAA verdict when AAA passes", () => {
    const result = evaluateTextContrast("#000000", "#FFFFFF");

    expect(getContrastVerdict(result)).toContain("AAA");
  });

  it("returns the AA verdict when only AA passes", () => {
    const result = evaluateTextContrast("#767676", "#FFFFFF");

    expect(getContrastVerdict(result)).toContain("WCAG AA");
  });

  it("returns the insufficient contrast verdict when AA fails", () => {
    const result = evaluateTextContrast("#AAAAAA", "#FFFFFF");

    expect(getContrastVerdict(result)).toContain("Insufficient");
  });
});
