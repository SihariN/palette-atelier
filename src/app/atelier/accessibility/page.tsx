
"use client";

import { useCallback, useState } from "react";

import ContrastChecker from "@/components/accessibility/ContrastChecker";
import PaletteScanner from "@/components/accessibility/PaletteScanner";
import ColorImprover from "@/components/accessibility/ColorImprover";

import type {
  AccessibilityReportData,
  ContrastReportData,
  PaletteReportData,
} from "@/lib/accessibility/report-types";
import AccessibilityReport from "@/components/accessibility/AccessibilityReport";

export default function AccessibilityPage() {
  const [reportData, setReportData] = useState<AccessibilityReportData>({
    contrast: null,
    palette: null,
  });

  const handleContrastChange = useCallback(
    (result: ContrastReportData | null) => {
      setReportData((current) => ({
        ...current,
        contrast: result,
      }));
    },
    [],
  );

  const handlePaletteChange = useCallback(
    (result: PaletteReportData | null) => {
      setReportData((current) => ({
        ...current,
        palette: result,
      }));
    },
    [],
  );

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#929083]">
          Design tools / Accessibility
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#3F5147]">
          Accessibility Checker
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#858579]">
          Make every colour choice count. Explore contrast combinations,
          preview your designs, and check whether your colours meet
          accessibility standards.
        </p>
      </div>

      <ContrastChecker onResultChange={handleContrastChange} />

      <div className="border-t border-[#EAE7DE] pt-8">
        <PaletteScanner onResultChange={handlePaletteChange} />
      </div>

      <div className="border-t border-[#EAE7DE] pt-8">
        <ColorImprover />
        <div className="border-t border-[#EAE7DE] pt-8">
          <AccessibilityReport data={reportData} />
        </div>
      </div>
    </div>
  );
}



