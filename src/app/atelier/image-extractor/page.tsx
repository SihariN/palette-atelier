
import ImageExtractor from "@/components/extractor/ImageExtractor";

export default function ImageExtractorPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#A18B7D]">
          Palette Atelier · Image Lab
        </p>

        <h1 className="font-editorial text-4xl text-[var(--foreground)] sm:text-5xl">
          Colors hiding in your images
        </h1>

        <p className="max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
          Find the colors you love in photographs, inspiration images, and
          little moments. Upload an image and let us turn it into a palette
          of your own.
        </p>
      </div>

      <ImageExtractor />
    </div>
  );
}
