
import { describe, expect, it } from "vitest";

import { contrastRatio } from "./contrast";
import { suggestAccessibleColor } from "./color-improvement";

describe("suggestAccessibleColor", () => {

  it("prefers darker when darker and lighter suggestions are equally close", () => {
  const result = suggestAccessibleColor(
    "#777777",
    "#777777",
    "normal-AA",
  );

  expect(result).not.toBeNull();
  expect(result?.direction).toBe("darker");
  expect(
    contrastRatio(result!.hex, "#777777"),
  ).toBeGreaterThanOrEqual(4.5);
});

  it("returns the original colour when it already passes", () => {
    const result = suggestAccessibleColor(
      "#000000",
      "#FFFFFF",
      "normal-AA",
    );

    expect(result).not.toBeNull();
    expect(result?.hex).toBe("#000000");
    expect(result?.distance).toBe(0);
  });

  it("suggests a colour that meets normal AA", () => {
    const result = suggestAccessibleColor(
      "#AAAAAA",
      "#FFFFFF",
      "normal-AA",
    );

    expect(result).not.toBeNull();
    expect(
      contrastRatio(result!.hex, "#FFFFFF"),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it("suggests a colour that meets normal AAA", () => {
    const result = suggestAccessibleColor(
      "#888888",
      "#FFFFFF",
      "normal-AAA",
    );

    expect(result).not.toBeNull();
    expect(
      contrastRatio(result!.hex, "#FFFFFF"),
    ).toBeGreaterThanOrEqual(7);
  });

    it("can suggest a lighter colour for a dark background", () => {
    const result = suggestAccessibleColor(
        "#666666",
        "#000000",
        "normal-AA",
    );

    expect(result).not.toBeNull();
    expect(result?.direction).toBe("lighter");
    expect(
        contrastRatio(result!.hex, "#000000"),
    ).toBeGreaterThanOrEqual(4.5);
    });

  it("returns null when neither black nor white can reach the target", () => {
    const result = suggestAccessibleColor(
      "#777777",
      "#777777",
      "normal-AAA",
    );

    expect(result).toBeNull();
  });

  it("returns a colour that meets large AA", () => {
    const result = suggestAccessibleColor(
      "#AAAAAA",
      "#FFFFFF",
      "large-AA",
    );

    expect(result).not.toBeNull();
    expect(
      contrastRatio(result!.hex, "#FFFFFF"),
    ).toBeGreaterThanOrEqual(3);
  });
});
