
import { contrastRatio } from "./contrast";

export type TextSize = "normal" | "large";

export type WCAGLevel = "AA" | "AAA";

export type ContrastStandard = {
  level: WCAGLevel;
  requiredRatio: number;
  passes: boolean;
};

export type ContrastEvaluation = {
  ratio: number;
  textSize: TextSize;
  standards: ContrastStandard[];
  passesAA: boolean;
  passesAAA: boolean;
};

export type NonTextEvaluation = {
  ratio: number;
  requiredRatio: number;
  passes: boolean;
};

/**
 * WCAG 2.2 contrast requirements for text.
 *
 * Normal text:
 * AA  = 4.5:1
 * AAA = 7:1
 *
 * Large text:
 * AA  = 3:1
 * AAA = 4.5:1
 */
const TEXT_THRESHOLDS = {
  normal: {
    AA: 4.5,
    AAA: 7,
  },
  large: {
    AA: 3,
    AAA: 4.5,
  },
} as const;

/**
 * Evaluates a foreground/background colour combination
 * against WCAG text contrast requirements.
 */
export function evaluateTextContrast(
  foreground: string,
  background: string,
  textSize: TextSize = "normal",
): ContrastEvaluation {
  const ratio = contrastRatio(foreground, background);

  const thresholds = TEXT_THRESHOLDS[textSize];

  const passesAA = ratio >= thresholds.AA;
  const passesAAA = ratio >= thresholds.AAA;

  return {
    ratio,
    textSize,
    standards: [
      {
        level: "AA",
        requiredRatio: thresholds.AA,
        passes: passesAA,
      },
      {
        level: "AAA",
        requiredRatio: thresholds.AAA,
        passes: passesAAA,
      },
    ],
    passesAA,
    passesAAA,
  };
}

/**
 * Evaluates non-text graphical objects and UI components.
 *
 * WCAG 2.2 Success Criterion 1.4.11 requires
 * at least 3:1 contrast against adjacent colours
 * for applicable visual information.
 */
export function evaluateNonTextContrast(
  foreground: string,
  background: string,
): NonTextEvaluation {
  const ratio = contrastRatio(foreground, background);

  const requiredRatio = 3;

  return {
    ratio,
    requiredRatio,
    passes: ratio >= requiredRatio,
  };
}

/**
 * Returns a human-readable accessibility verdict.
 */
export function getContrastVerdict(
  evaluation: ContrastEvaluation,
): string {
  if (evaluation.passesAAA) {
    return "Excellent contrast — meets WCAG AAA";
  }

  if (evaluation.passesAA) {
    return "Good contrast — meets WCAG AA";
  }

  return "Insufficient contrast — does not meet WCAG AA";
}
