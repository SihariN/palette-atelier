
"use client";

import type { AccessibilityReportData } from "@/lib/accessibility/report-types";

type AccessibilityReportProps = {
  data: AccessibilityReportData;
};

export default function AccessibilityReport({
  data,
}: AccessibilityReportProps) {
  const hasResults = Boolean(data.contrast || data.palette);

  function createReportText() {
    const lines: string[] = [
      "PALETTE ATELIER — ACCESSIBILITY REPORT",
      `Generated: ${new Date().toLocaleString()}`,
      "",
      "========================================",
      "CONTRAST CHECKER",
      "========================================",
    ];

    if (data.contrast) {
      const contrast = data.contrast;

      lines.push(
        `Foreground: ${contrast.foreground}`,
        `Background: ${contrast.background}`,
        `Text size: ${contrast.textSize}`,
        `Contrast ratio: ${contrast.ratio.toFixed(2)}:1`,
        `WCAG AA: ${contrast.passesAA ? "PASS" : "FAIL"}`,
        `WCAG AAA: ${contrast.passesAAA ? "PASS" : "FAIL"}`,
        `Non-text contrast (3:1): ${contrast.nonTextPasses ? "PASS" : "FAIL"}`,
      );
    } else {
      lines.push("No contrast checker results available yet.");
    }

    lines.push(
      "",
      "========================================",
      "PALETTE SCANNER",
      "========================================",
    );

    if (data.palette) {
      const palette = data.palette;

      lines.push(
        `Palette: ${palette.paletteName}`,
        `Total color pairs: ${palette.totalPairs}`,
        `Passing pairs: ${palette.passingCount}`,
        `Pairs needing improvement: ${palette.needsWorkCount}`,
        "",
        "COLOR PAIR DETAILS",
      );

      if (palette.pairs.length === 0) {
        lines.push("No color pairs to evaluate.");
      }

      palette.pairs.forEach((pair, index) => {
        lines.push(
          "",
          `Pair ${index + 1}: ${pair.firstColor} / ${pair.secondColor}`,
          `Contrast ratio: ${pair.ratio.toFixed(2)}:1`,
          `Normal text AA: ${pair.passesAA ? "PASS" : "FAIL"}`,
          `Normal text AAA: ${pair.passesAAA ? "PASS" : "FAIL"}`,
          `Large text AA: ${pair.passesLargeAA ? "PASS" : "FAIL"}`,
          `Large text AAA: ${pair.passesLargeAAA ? "PASS" : "FAIL"}`,
        );
      });
    } else {
      lines.push("No palette scanner results available yet.");
    }

    lines.push(
      "",
      "========================================",
      "END OF REPORT",
      "========================================",
    );

    return lines.join("\n");
  }

  function handleDownload() {
    const blob = new Blob([createReportText()], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "palette-atelier-accessibility-report.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <section
      id="accessibility-report"
      className="space-y-6 rounded-3xl border border-[#EAE7DE] bg-white p-6 shadow-sm sm:p-8"
    >
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }

          #accessibility-report,
          #accessibility-report * {
            visibility: visible !important;
          }

          #accessibility-report {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          #accessibility-report .report-actions {
            display: none !important;
          }

          #accessibility-report {
            color: #222 !important;
            background: white !important;
          }

          #accessibility-report * {
            break-inside: avoid;
          }
        }
      `}</style>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#929083]">
            Your results
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#3F5147]">
            Accessibility Report
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#858579]">
            A summary of your current contrast check and saved palette
            accessibility results.
          </p>
        </div>

        <div className="report-actions flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleDownload}
            disabled={!hasResults}
            className="rounded-full border border-[#DCD9CF] px-4 py-2 text-sm font-medium text-[#3F5147] transition hover:bg-[#F7F5EF] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Download TXT
          </button>

          <button
            type="button"
            onClick={handlePrint}
            disabled={!hasResults}
            className="rounded-full bg-[#3F5147] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#33443A] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Print / Save PDF
          </button>
        </div>
      </div>

      {!hasResults ? (
        <div className="rounded-2xl border border-dashed border-[#DCD9CF] bg-[#FAF9F6] px-5 py-8 text-center">
          <p className="font-medium text-[#3F5147]">
            Your report is waiting for results
          </p>
          <p className="mt-2 text-sm text-[#858579]">
            Use the Contrast Checker or select a palette in the Palette
            Scanner to start building your report.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <section className="space-y-4">
            <h3 className="border-b border-[#EAE7DE] pb-3 text-lg font-semibold text-[#3F5147]">
              Contrast Checker
            </h3>

            {data.contrast ? (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-[#F7F5EF] p-4">
                    <p className="text-xs text-[#858579]">Foreground</p>
                    <p className="mt-1 font-semibold text-[#3F5147]">
                      {data.contrast.foreground}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#F7F5EF] p-4">
                    <p className="text-xs text-[#858579]">Background</p>
                    <p className="mt-1 font-semibold text-[#3F5147]">
                      {data.contrast.background}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#EAE7DE] p-4">
                  <div>
                    <p className="text-sm text-[#858579]">Contrast ratio</p>
                    <p className="text-2xl font-semibold text-[#3F5147]">
                      {data.contrast.ratio.toFixed(2)}:1
                    </p>
                    <p className="mt-1 text-xs capitalize text-[#858579]">
                      {data.contrast.textSize} text
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Status label="AA" passed={data.contrast.passesAA} />
                    <Status label="AAA" passed={data.contrast.passesAAA} />
                    <Status
                      label="Non-text 3:1"
                      passed={data.contrast.nonTextPasses}
                    />
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-[#858579]">
                No contrast checker results available yet.
              </p>
            )}
          </section>

          <section className="space-y-4">
            <h3 className="border-b border-[#EAE7DE] pb-3 text-lg font-semibold text-[#3F5147]">
              Palette Scanner
            </h3>

            {data.palette ? (
              <>
                <div>
                  <p className="text-xs text-[#858579]">Selected palette</p>
                  <p className="mt-1 font-semibold text-[#3F5147]">
                    {data.palette.paletteName}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Summary value={data.palette.totalPairs} label="Total pairs" />
                  <Summary value={data.palette.passingCount} label="Passing" />
                  <Summary value={data.palette.needsWorkCount} label="Needs work" />
                </div>

                {data.palette.pairs.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-[#3F5147]">
                      Color pair details
                    </p>

                    {data.palette.pairs.map((pair, index) => (
                      <div
                        key={`${pair.firstColor}-${pair.secondColor}`}
                        className="rounded-2xl border border-[#EAE7DE] p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span
                              className="h-7 w-7 rounded-full border border-black/10"
                              style={{ backgroundColor: pair.firstColor }}
                            />
                            <span
                              className="h-7 w-7 rounded-full border border-black/10"
                              style={{ backgroundColor: pair.secondColor }}
                            />
                            <div>
                              <p className="text-sm font-medium text-[#3F5147]">
                                Pair {index + 1}
                              </p>
                              <p className="text-xs text-[#858579]">
                                {pair.firstColor} / {pair.secondColor}
                              </p>
                            </div>
                          </div>

                          <p className="text-sm font-semibold text-[#3F5147]">
                            {pair.ratio.toFixed(2)}:1
                          </p>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <Status label="Normal AA" passed={pair.passesAA} />
                          <Status label="Normal AAA" passed={pair.passesAAA} />
                          <Status
                            label="Large AA"
                            passed={pair.passesLargeAA}
                          />
                          <Status
                            label="Large AAA"
                            passed={pair.passesLargeAAA}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#858579]">
                    This palette does not contain any color pairs to evaluate.
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-[#858579]">
                No palette scanner results available yet.
              </p>
            )}
          </section>

          <p className="border-t border-[#EAE7DE] pt-4 text-xs leading-5 text-[#929083]">
            This report reflects the results currently displayed in Palette
            Atelier. WCAG results depend on the selected text size and contrast
            requirements.
          </p>
        </div>
      )}
    </section>
  );
}

function Status({
  label,
  passed,
}: {
  label: string;
  passed: boolean;
}) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        passed
          ? "bg-[#E8F0E9] text-[#3F6A4B]"
          : "bg-[#F8EAE6] text-[#A65345]"
      }`}
    >
      {label}: {passed ? "Pass" : "Fail"}
    </span>
  );
}

function Summary({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl bg-[#F7F5EF] p-3 sm:p-4">
      <p className="text-xl font-semibold text-[#3F5147]">{value}</p>
      <p className="mt-1 text-xs text-[#858579]">{label}</p>
    </div>
  );
}
