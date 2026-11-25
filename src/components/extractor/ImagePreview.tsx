
"use client";

import { ImageIcon, X } from "lucide-react";

type ImagePreviewProps = {
  imageUrl: string;
  fileName: string;
  onRemove: () => void;
};

export default function ImagePreview({
  imageUrl,
  fileName,
  onRemove,
}: ImagePreviewProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <div className="relative flex min-h-[280px] items-center justify-center bg-[#F5F1EA] p-4">
        <img
          src={imageUrl}
          alt="Uploaded inspiration"
          className="max-h-[420px] max-w-full rounded-xl object-contain"
        />

        <button
          onClick={onRemove}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#554C47] shadow-sm transition hover:bg-white"
          aria-label="Remove image"
        >
          <X size={17} />
        </button>
      </div>

      <div className="flex items-center gap-3 border-t border-[var(--border)] px-4 py-3">
        <ImageIcon size={18} className="text-[#A18B7D]" />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-[var(--foreground)]">
            {fileName}
          </p>
          <p className="text-xs text-[var(--muted)]">Ready to explore colors</p>
        </div>
      </div>
    </div>
  );
}
