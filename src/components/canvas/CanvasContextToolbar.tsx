
"use client";

import { useState } from "react";
import type { FabricObject } from "fabric";
import {
  ArrowUpToLine,
  ArrowUp,
  ArrowDown,
  ArrowDownToLine,
  Bold,
  Italic,
  Trash2,
  X,
} from "lucide-react";

type TextObject = FabricObject & {
  fontSize?: number;
  fontWeight?: string | number;
  fontStyle?: string;
};

type Props = {
  object: FabricObject;
  x: number;
  y: number;
  onClose: () => void;
  onBringToFront: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onSendToBack: () => void;
  onDelete: () => void;
  onChange: () => void;
};

export default function CanvasContextToolbar({
  object,
  x,
  y,
  onClose,
  onBringToFront,
  onBringForward,
  onSendBackward,
  onSendToBack,
  onDelete,
  onChange,
}: Props) {
  const textObject = object as TextObject;
  const isText = String(object.type).toLowerCase().includes("text");

  const [version, setVersion] = useState(0);

  function updateText(property: "fontWeight" | "fontStyle", value: string) {
    object.set(property, value);
    object.setCoords();
    onChange();
    setVersion((current) => current + 1);
  }

  function updateFontSize(value: string) {
    const size = Number(value);

    if (!Number.isFinite(size) || size < 8 || size > 200) return;

    object.set("fontSize", size);
    object.setCoords();
    onChange();
    setVersion((current) => current + 1);
  }

  const isBold =
    textObject.fontWeight === "bold" ||
    Number(textObject.fontWeight) >= 600;

  const isItalic = textObject.fontStyle === "italic";

  return (
    <div
      key={version}
      onClick={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
      className="absolute z-50 flex max-w-[calc(100%-16px)] flex-wrap items-center gap-1 rounded-xl border border-[#E8E5DC] bg-[#FFFEFA] p-2 shadow-[0_8px_30px_rgba(65,59,47,0.16)]"
      style={{ left: x, top: y }}
    >
      {isText && (
        <>
          <button
            type="button"
            onClick={() =>
              updateText("fontWeight", isBold ? "normal" : "bold")
            }
            title="Bold"
            aria-label="Bold"
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
              isBold
                ? "bg-[#E8ECDF] text-[#536148]"
                : "text-[#65665B] hover:bg-[#F0EEE7]"
            }`}
          >
            <Bold size={16} />
          </button>

          <button
            type="button"
            onClick={() =>
              updateText("fontStyle", isItalic ? "normal" : "italic")
            }
            title="Italic"
            aria-label="Italic"
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
              isItalic
                ? "bg-[#E8ECDF] text-[#536148]"
                : "text-[#65665B] hover:bg-[#F0EEE7]"
            }`}
          >
            <Italic size={16} />
          </button>

          <div className="mx-1 h-6 w-px bg-[#E8E5DC]" />

          <label className="flex items-center gap-1.5 rounded-lg bg-[#F8F7F2] px-2">
            <span className="text-[10px] font-medium text-[#858579]">
              Size
            </span>
            <input
              key={`size-${version}`}
              type="number"
              min={8}
              max={200}
              defaultValue={textObject.fontSize ?? 20}
              onBlur={(event) => updateFontSize(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  updateFontSize(event.currentTarget.value);
                  event.currentTarget.blur();
                }
              }}
              className="w-10 bg-transparent text-xs font-semibold text-[#45483F] outline-none"
            />
          </label>

          <div className="mx-1 h-6 w-px bg-[#E8E5DC]" />
        </>
      )}

      <button
        type="button"
        onClick={onBringToFront}
        title="Bring to front"
        aria-label="Bring to front"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#65665B] transition hover:bg-[#E8ECDF] hover:text-[#536148]"
      >
        <ArrowUpToLine size={16} />
      </button>

      <button
        type="button"
        onClick={onBringForward}
        title="Bring forward"
        aria-label="Bring forward"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#65665B] transition hover:bg-[#E8ECDF] hover:text-[#536148]"
      >
        <ArrowUp size={16} />
      </button>

      <button
        type="button"
        onClick={onSendBackward}
        title="Send backward"
        aria-label="Send backward"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#65665B] transition hover:bg-[#E8ECDF] hover:text-[#536148]"
      >
        <ArrowDown size={16} />
      </button>

      <button
        type="button"
        onClick={onSendToBack}
        title="Send to back"
        aria-label="Send to back"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#65665B] transition hover:bg-[#E8ECDF] hover:text-[#536148]"
      >
        <ArrowDownToLine size={16} />
      </button>

      <div className="mx-1 h-6 w-px bg-[#E8E5DC]" />

      <button
        type="button"
        onClick={onDelete}
        title="Delete object"
        aria-label="Delete object"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#A66F66] transition hover:bg-[#F0DDD9] hover:text-[#984E43]"
      >
        <Trash2 size={16} />
      </button>

      <button
        type="button"
        onClick={onClose}
        title="Close toolbar"
        aria-label="Close toolbar"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#A09E91] transition hover:bg-[#F0EEE7] hover:text-[#65665B]"
      >
        <X size={15} />
      </button>
    </div>
  );
}
