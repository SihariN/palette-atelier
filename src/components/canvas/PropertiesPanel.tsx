
"use client";

import { useState } from "react";
import type { FabricObject } from "fabric";
import {
  Trash2,
  Type,
  Shapes,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

type PropertiesPanelProps = {
  selectedObject: FabricObject | null;
  onChange: () => void;
  onDelete: () => void;
};

type TextProperties = {
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  fontStyle?: string;
  textAlign?: string;
  charSpacing?: number;
  lineHeight?: number;
};

const DEFAULT_COLOR = "#89947A";

const FONT_OPTIONS = [
  { label: "DM Sans", value: "DM Sans" },
  { label: "Cormorant Garamond", value: "Cormorant Garamond" },
  { label: "Arial", value: "Arial" },
  { label: "Georgia", value: "Georgia" },
  { label: "Times New Roman", value: "Times New Roman" },
  { label: "Verdana", value: "Verdana" },
  { label: "Courier New", value: "Courier New" },
];

function isTextObject(object: FabricObject): boolean {
  return object.type.includes("text");
}

function getColor(value: unknown, fallback = DEFAULT_COLOR): string {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value)
    ? value
    : fallback;
}

export default function PropertiesPanel({
  selectedObject,
  onChange,
  onDelete,
}: PropertiesPanelProps) {
  const [textProperties, setTextProperties] = useState({
    text: "",
    fontFamily: "DM Sans",
    fontSize: 32,
    fontWeight: "normal",
    fontStyle: "normal",
    textAlign: "left",
    charSpacing: 0,
    lineHeight: 1.16,
  });

  const [fill, setFill] = useState(DEFAULT_COLOR);
  const [stroke, setStroke] = useState("#353630");
  const [strokeWidth, setStrokeWidth] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [cornerRadius, setCornerRadius] = useState(0);

  // Synchronize properties when the selected canvas object changes.
  const [previousObject, setPreviousObject] =
    useState<FabricObject | null>(selectedObject);

  if (selectedObject !== previousObject) {
    setPreviousObject(selectedObject);

    if (selectedObject) {
      const object = selectedObject as FabricObject & TextProperties;

      if (isTextObject(selectedObject)) {
        setTextProperties({
          text: object.text ?? "",
          fontFamily: object.fontFamily ?? "DM Sans",
          fontSize: object.fontSize ?? 32,
          fontWeight: String(object.fontWeight ?? "normal"),
          fontStyle: object.fontStyle ?? "normal",
          textAlign: object.textAlign ?? "left",
          charSpacing: object.charSpacing ?? 0,
          lineHeight: object.lineHeight ?? 1.16,
        });
      }

      setFill(getColor(selectedObject.fill));
      setStroke(getColor(selectedObject.stroke, "#353630"));
      setStrokeWidth(selectedObject.strokeWidth ?? 0);
      setOpacity(selectedObject.opacity ?? 1);

      if (selectedObject.type === "rect") {
        const rect = selectedObject as FabricObject & { rx?: number };
        setCornerRadius(rect.rx ?? 0);
      } else {
        setCornerRadius(0);
      }
    }
  }

  const updateObject = (properties: Record<string, unknown>) => {
    if (!selectedObject) return;

    selectedObject.set(properties);
    selectedObject.setCoords();
    onChange();
  };

  const updateText = (
    property: keyof typeof textProperties,
    value: string | number
  ) => {
    if (!selectedObject) return;

    setTextProperties((current) => ({
      ...current,
      [property]: value,
    }));

    selectedObject.set({ [property]: value });

    const textObject = selectedObject as FabricObject & {
      initDimensions?: () => void;
    };

    textObject.initDimensions?.();
    selectedObject.setCoords();
    onChange();
  };

  const applyTextPreset = (
    preset: "heading" | "subtitle" | "body" | "decorative"
  ) => {
    const presets = {
      heading: {
        fontFamily: "Cormorant Garamond",
        fontSize: 64,
        fontWeight: "bold",
        fontStyle: "normal",
        charSpacing: 0,
        lineHeight: 1.05,
      },
      subtitle: {
        fontFamily: "DM Sans",
        fontSize: 30,
        fontWeight: "normal",
        fontStyle: "normal",
        charSpacing: 30,
        lineHeight: 1.2,
      },
      body: {
        fontFamily: "DM Sans",
        fontSize: 20,
        fontWeight: "normal",
        fontStyle: "normal",
        charSpacing: 0,
        lineHeight: 1.4,
      },
      decorative: {
        fontFamily: "Cormorant Garamond",
        fontSize: 48,
        fontWeight: "normal",
        fontStyle: "italic",
        charSpacing: 20,
        lineHeight: 1.2,
      },
    };

    const presetValues = presets[preset];

    setTextProperties((current) => ({
      ...current,
      ...presetValues,
    }));

    if (!selectedObject) return;

    selectedObject.set(presetValues);

    const textObject = selectedObject as FabricObject & {
      initDimensions?: () => void;
    };

    textObject.initDimensions?.();
    selectedObject.setCoords();
    onChange();
  };

  if (!selectedObject) {
    return (
      <section className="rounded-2xl border border-[#e8e5dc] bg-[#fffefa] p-5">
        <div className="flex items-center gap-2">
          <Shapes size={16} className="text-[#89947A]" />
          <h3 className="text-sm font-semibold text-[#3F5147]">
            Properties
          </h3>
        </div>

        <div className="py-8 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#efede6]">
            <Shapes size={19} className="text-[#929083]" />
          </div>

          <p className="mt-3 text-sm font-medium text-[#55564D]">
            Nothing selected
          </p>

          <p className="mt-1 text-xs leading-5 text-[#929083]">
            Select an element on your canvas to edit its properties.
          </p>
        </div>
      </section>
    );
  }

  const textObject = isTextObject(selectedObject);
  const rectangleObject = selectedObject.type === "rect";
  const imageObject = selectedObject.type === "image";
  const shapeObject = !textObject && !imageObject;

  return (
    <section className="rounded-2xl border border-[#e8e5dc] bg-[#fffefa] p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {textObject ? (
            <Type size={16} className="text-[#89947A]" />
          ) : (
            <Shapes size={16} className="text-[#89947A]" />
          )}

          <h3 className="text-sm font-semibold text-[#3F5147]">
            Properties
          </h3>
        </div>

        <button
          type="button"
          onClick={onDelete}
          title="Delete selected element"
          className="rounded-lg p-2 text-[#a66f68] transition hover:bg-[#f8eae7]"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <p className="mt-2 text-xs capitalize text-[#929083]">
        {selectedObject.type.replace("-", " ")}
      </p>

      <div className="mt-5 space-y-5">
        {textObject && (
          <>
            <div>
              <label className="mb-2 block text-xs font-medium text-[#55564D]">
                Text content
              </label>

              <textarea
                value={textProperties.text}
                onChange={(event) =>
                  updateText("text", event.target.value)
                }
                rows={3}
                className="w-full resize-none rounded-xl border border-[#e8e5dc] bg-[#f7f5f0] px-3 py-2 text-sm text-[#353630] outline-none focus:border-[#89947A]"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-[#55564D]">
                Text presets
              </label>

              <div className="grid grid-cols-2 gap-2">
                {(
                  ["heading", "subtitle", "body", "decorative"] as const
                ).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => applyTextPreset(preset)}
                    className="rounded-xl border border-[#e8e5dc] px-2 py-2 text-xs capitalize text-[#55564D] transition hover:border-[#89947A] hover:bg-[#e8ecdf]"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-[#55564D]">
                Font family
              </label>

              <select
                value={textProperties.fontFamily}
                onChange={(event) =>
                  updateText("fontFamily", event.target.value)
                }
                className="w-full rounded-xl border border-[#e8e5dc] bg-[#f7f5f0] px-3 py-2 text-sm outline-none focus:border-[#89947A]"
              >
                {FONT_OPTIONS.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-[#55564D]">
                Font size
              </label>

              <input
                type="number"
                min={8}
                max={160}
                value={textProperties.fontSize}
                onChange={(event) =>
                  updateText(
                    "fontSize",
                    Math.max(8, Math.min(160, Number(event.target.value)))
                  )
                }
                className="w-full rounded-xl border border-[#e8e5dc] bg-[#f7f5f0] px-3 py-2 text-sm outline-none focus:border-[#89947A]"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-[#55564D]">
                Font weight
              </label>

              <select
                value={textProperties.fontWeight}
                onChange={(event) =>
                  updateText("fontWeight", event.target.value)
                }
                className="w-full rounded-xl border border-[#e8e5dc] bg-[#f7f5f0] px-3 py-2 text-sm outline-none focus:border-[#89947A]"
              >
                <option value="normal">Regular</option>
                <option value="500">Medium</option>
                <option value="600">Semi-bold</option>
                <option value="bold">Bold</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  updateText(
                    "fontStyle",
                    textProperties.fontStyle === "italic" ? "normal" : "italic"
                  )
                }
                className={`rounded-xl border px-3 py-2 text-sm italic transition ${
                  textProperties.fontStyle === "italic"
                    ? "border-[#89947A] bg-[#e8ecdf] text-[#3F5147]"
                    : "border-[#e8e5dc] text-[#55564D] hover:bg-[#f7f5f0]"
                }`}
              >
                Italic
              </button>

              <button
                type="button"
                onClick={() =>
                  updateText(
                    "fontWeight",
                    textProperties.fontWeight === "bold" ? "normal" : "bold"
                  )
                }
                className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                  textProperties.fontWeight === "bold"
                    ? "border-[#89947A] bg-[#e8ecdf] text-[#3F5147]"
                    : "border-[#e8e5dc] text-[#55564D] hover:bg-[#f7f5f0]"
                }`}
              >
                Bold
              </button>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-[#55564D]">
                Alignment
              </label>

              <div className="flex gap-2">
                {[
                  { value: "left", icon: AlignLeft },
                  { value: "center", icon: AlignCenter },
                  { value: "right", icon: AlignRight },
                ].map(({ value, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => updateText("textAlign", value)}
                    title={`${value} alignment`}
                    className={`flex flex-1 items-center justify-center rounded-xl border py-2 transition ${
                      textProperties.textAlign === value
                        ? "border-[#89947A] bg-[#e8ecdf] text-[#3F5147]"
                        : "border-[#e8e5dc] text-[#858579] hover:bg-[#f7f5f0]"
                    }`}
                  >
                    <Icon size={17} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-[#55564D]">
                Letter spacing: {textProperties.charSpacing}
              </label>

              <input
                type="range"
                min={0}
                max={500}
                step={10}
                value={textProperties.charSpacing}
                onChange={(event) =>
                  updateText("charSpacing", Number(event.target.value))
                }
                className="w-full accent-[#89947A]"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-[#55564D]">
                Line spacing: {textProperties.lineHeight.toFixed(2)}
              </label>

              <input
                type="range"
                min={0.8}
                max={2.5}
                step={0.05}
                value={textProperties.lineHeight}
                onChange={(event) =>
                  updateText("lineHeight", Number(event.target.value))
                }
                className="w-full accent-[#89947A]"
              />
            </div>
          </>
        )}

        {shapeObject && (
          <>
            <div>
              <label className="mb-2 block text-xs font-medium text-[#55564D]">
                Fill color
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-[#e8e5dc] bg-[#f7f5f0] p-2">
                <input
                  type="color"
                  value={fill}
                  onChange={(event) => {
                    setFill(event.target.value);
                    updateObject({ fill: event.target.value });
                  }}
                  className="h-8 w-10 cursor-pointer rounded-lg border-0 bg-transparent"
                />

                <span className="text-xs uppercase text-[#858579]">
                  {fill}
                </span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-[#55564D]">
                Stroke color
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-[#e8e5dc] bg-[#f7f5f0] p-2">
                <input
                  type="color"
                  value={stroke}
                  onChange={(event) => {
                    setStroke(event.target.value);
                    updateObject({ stroke: event.target.value });
                  }}
                  className="h-8 w-10 cursor-pointer rounded-lg border-0 bg-transparent"
                />

                <span className="text-xs uppercase text-[#858579]">
                  {stroke}
                </span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-[#55564D]">
                Stroke width: {strokeWidth}
              </label>

              <input
                type="range"
                min={0}
                max={20}
                value={strokeWidth}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  setStrokeWidth(value);
                  updateObject({ strokeWidth: value });
                }}
                className="w-full accent-[#89947A]"
              />
            </div>
          </>
        )}

        {rectangleObject && (
          <div>
            <label className="mb-2 block text-xs font-medium text-[#55564D]">
              Corner radius: {cornerRadius}
            </label>

            <input
              type="range"
              min={0}
              max={60}
              value={cornerRadius}
              onChange={(event) => {
                const value = Number(event.target.value);
                setCornerRadius(value);
                updateObject({ rx: value, ry: value });
              }}
              className="w-full accent-[#89947A]"
            />
          </div>
        )}

        <div>
          <label className="mb-2 block text-xs font-medium text-[#55564D]">
            {textObject
              ? "Text color"
              : `Opacity: ${Math.round(opacity * 100)}%`}
          </label>

          {textObject && (
            <div className="flex items-center gap-3 rounded-xl border border-[#e8e5dc] bg-[#f7f5f0] p-2">
              <input
                type="color"
                value={fill}
                onChange={(event) => {
                  setFill(event.target.value);
                  updateObject({ fill: event.target.value });
                }}
                className="h-8 w-10 cursor-pointer rounded-lg border-0 bg-transparent"
              />

              <span className="text-xs uppercase text-[#858579]">
                {fill}
              </span>
            </div>
          )}

          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={opacity}
            onChange={(event) => {
              const value = Number(event.target.value);
              setOpacity(value);
              updateObject({ opacity: value });
            }}
            className="w-full accent-[#89947A]"
          />

          {textObject && (
            <p className="mt-1 text-right text-[10px] text-[#929083]">
              Opacity: {Math.round(opacity * 100)}%
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
