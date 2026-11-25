
"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  Upload,
  ImagePlus,
  Sparkles,
  RefreshCw,
  Trash2,
  Palette,
} from "lucide-react";

import ImagePreview from "./ImagePreview";
import ExtractedPalette from "./ExtractedPalette";

import {
  analyzeImage,
  type ExtractedColor,
} from "@/lib/image-extraction";

import { savePalette as savePaletteToLibrary } from "@/lib/palette-storage";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ImageExtractor() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [colors, setColors] = useState<ExtractedColor[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isImageReady, setIsImageReady] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Clean up temporary image URLs when the component unmounts
  // or when the image URL changes.
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  // Remove the current image and reset the workspace.
  const clearImage = useCallback(() => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }

    setImageUrl(null);
    setFileName("");
    setColors([]);
    setError("");
    setSuccess("");
    setIsImageReady(false);
    setIsExtracting(false);

    imageRef.current = null;

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [imageUrl]);

  // Validate and load a selected image.
  const processFile = useCallback(
    (file: File) => {
      setError("");
      setSuccess("");
      setColors([]);
      setIsImageReady(false);
      imageRef.current = null;

      if (!ALLOWED_TYPES.includes(file.type)) {
        setError("Please upload a JPG, PNG, or WebP image.");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(
          "Your image is too large. Please choose an image under 10 MB.",
        );
        return;
      }

      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }

      const newUrl = URL.createObjectURL(file);

      setImageUrl(newUrl);
      setFileName(file.name);

      const img = new Image();

      img.onload = () => {
        imageRef.current = img;
        setIsImageReady(true);
      };

      img.onerror = () => {
        setError("We couldn&apos;t read this image. Please try another one.");
        setImageUrl(null);
        setIsImageReady(false);
        imageRef.current = null;
        URL.revokeObjectURL(newUrl);
      };

      img.src = newUrl;
    },
    [imageUrl],
  );

  // Handle image selection through the file picker.
  const handleFileInput = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      processFile(file);
    }
  };

  // Handle drag-and-drop uploads.
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      processFile(file);
    }
  };

  // Extract dominant colors using the Median Cut algorithm.
  const extractColors = useCallback(() => {
    const img = imageRef.current;
    const canvas = canvasRef.current;

    if (!img || !canvas || !isImageReady) {
      setError("Please upload an image first.");
      return;
    }

    setIsExtracting(true);
    setError("");
    setSuccess("");

    try {
      // Scale the image down to limit pixel processing.
      const maxDimension = 300;

      const scale = Math.min(
        1,
        maxDimension / Math.max(img.naturalWidth, img.naturalHeight),
      );

      canvas.width = Math.max(
        1,
        Math.round(img.naturalWidth * scale),
      );

      canvas.height = Math.max(
        1,
        Math.round(img.naturalHeight * scale),
      );

      const context = canvas.getContext("2d", {
        willReadFrequently: true,
      });

      if (!context) {
        throw new Error("Unable to create a canvas context.");
      }

      context.clearRect(0, 0, canvas.width, canvas.height);

      context.drawImage(
        img,
        0,
        0,
        canvas.width,
        canvas.height,
      );

      const extracted = analyzeImage(canvas, 5);

      if (extracted.length === 0) {
        throw new Error(
          "We couldn&apos;t find any visible colors in this image.",
        );
      }

      setColors(extracted);
    } catch (err) {
      console.error("Color extraction failed:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while extracting colors.",
      );
    } finally {
      setIsExtracting(false);
    }
  }, [isImageReady]);

  // Save the extracted palette to the shared library.
const savePalette = () => {
  if (colors.length === 0) return;

  try {
    const now = new Date().toISOString();

    savePaletteToLibrary({
      id: crypto.randomUUID(),
      name: fileName.replace(/\.[^/.]+$/, "") || "Extracted palette",
      colors: colors.map((color) => color.hex),
      source: "image-extractor",
      createdAt: now,
      updatedAt: now,
    });

    setSuccess("Palette saved to My Library!");
    setError("");
  } catch (err) {
    console.error("Could not save extracted palette:", err);
    setError("Couldn&apos;t save your palette. Please try again.");
    setSuccess("");
  }
};

  return (
    <div className="space-y-8">
      {/* Hidden canvas used for pixel analysis */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Keep the file input mounted at all times */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Upload area */}
      {!imageUrl && (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-3xl border-2 border-dashed p-10 text-center transition sm:p-16 ${
            isDragging
              ? "border-[#A48D79] bg-[#F1EAE1]"
              : "border-[var(--border)] bg-[var(--surface)] hover:border-[#C0A58F] hover:bg-[#FAF7F3]"
          }`}
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0E7DD] text-[#9B826E]">
            <ImagePlus size={28} />
          </div>

          <h3 className="font-editorial text-2xl text-[var(--foreground)]">
            Bring an image into your studio
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--muted)]">
            Drop an image here or browse your files. We&apos;ll discover
            the colors hiding inside it.
          </p>

          <button
            type="button"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#8F8274] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#786B5F]"
          >
            <Upload size={16} />
            Choose an image
          </button>

          <p className="mt-4 text-xs text-[var(--muted)]">
            JPG, PNG, or WebP · Maximum 10 MB
          </p>
        </div>
      )}

      {/* Image workspace */}
      {imageUrl && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <ImagePreview
              imageUrl={imageUrl}
              fileName={fileName}
              onRemove={clearImage}
            />

            <button
              onClick={extractColors}
              disabled={isExtracting || !isImageReady}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#8F8274] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[#786B5F] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isExtracting ? (
                <>
                  <RefreshCw size={17} className="animate-spin" />
                  Discovering colors...
                </>
              ) : colors.length > 0 ? (
                <>
                  <RefreshCw size={17} />
                  Extract again
                </>
              ) : (
                <>
                  <Sparkles size={17} />
                  Extract my colors
                </>
              )}
            </button>

            <button
              onClick={clearImage}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-[var(--border)] px-5 py-3 text-sm text-[var(--muted)] transition hover:bg-[#F5EFE8] hover:text-[var(--foreground)]"
            >
              <Trash2 size={15} />
              Choose another image
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette size={18} className="text-[#A18B7D]" />

              <h3 className="font-editorial text-2xl text-[var(--foreground)]">
                Your discovered palette
              </h3>
            </div>

            <ExtractedPalette
              colors={colors}
              onSave={savePalette}
            />
          </div>
        </div>
      )}

      {/* Error messages */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Success messages */}
      {success && (
        <div className="rounded-xl border border-[#D9E5D5] bg-[#F2F7EF] px-4 py-3 text-sm text-[#587451]">
          {success}
        </div>
      )}

      {/* Tips */}
      <div className="rounded-2xl bg-[#F6F1EB] p-5">
        <h4 className="font-editorial text-lg text-[#65574C]">
          A little tip for lovely palettes
        </h4>

        <p className="mt-1 text-sm leading-6 text-[#8C7C6D]">
          Images with clear colors, interesting lighting, and varied tones
          tend to produce the most interesting palettes. Try photographs
          of interiors, flowers, outfits, landscapes, or illustrations.
        </p>
      </div>
    </div>
  );
}
