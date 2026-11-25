
export type ContrastReportData = {
  foreground: string;
  background: string;
  textSize: "normal" | "large";
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
  nonTextPasses: boolean;
};

export type PalettePairReport = {
  firstColor: string;
  secondColor: string;
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
  passesLargeAA: boolean;
  passesLargeAAA: boolean;
};

export type PaletteReportData = {
  paletteName: string;
  totalPairs: number;
  passingCount: number;
  needsWorkCount: number;
  pairs: PalettePairReport[];
};

export type AccessibilityReportData = {
  contrast: ContrastReportData | null;
  palette: PaletteReportData | null;
};
