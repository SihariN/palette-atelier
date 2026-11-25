
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Palette,
  Heart,
  Image as ImageIcon,
  Pencil,
  Trash2,
  Copy,
  Check,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

import PaletteEditor from "./PaletteEditor";

import {
  deletePalette,
  getSavedPalettes,
  setPaletteForStudio,
  subscribeToPaletteChanges,
  updatePalette,
  type SavedPalette,
} from "@/lib/palette-storage";

import { useRouter } from "next/navigation";

type Filter = "all" | "studio" | "image-extractor";

export default function PaletteLibrary() {
  const router = useRouter();
  const [palettes, setPalettes] = useState<SavedPalette[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [copied, setCopied] = useState<string | null>(null);
  const [editingPalette, setEditingPalette] = useState<SavedPalette | null>(null);
  const [deletingPalette, setDeletingPalette] = useState<SavedPalette | null>(null);

  const refresh = useCallback(() => {
    setPalettes(getSavedPalettes());
  }, []);

    useEffect(() => {
    // Load saved palettes after the component mounts in the browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();

    return subscribeToPaletteChanges(refresh);
    }, [refresh]);

  const filteredPalettes = useMemo(() => {
    return palettes.filter((palette) => {
      const matchesSearch = palette.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" || palette.source === filter;

      return matchesSearch && matchesFilter;
    });
  }, [palettes, search, filter]);

  async function copyColor(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      window.setTimeout(() => setCopied(null), 1400);
    } catch {
      setCopied(null);
    }
  }

  function saveChanges(
    id: string,
    changes: { name: string; colors: string[] },
  ) {
    updatePalette(id, changes);
    refresh();
    setEditingPalette(null);
  }

  function removePalette() {
    if (!deletingPalette) return;

    deletePalette(deletingPalette.id);
    refresh();
    setDeletingPalette(null);
  }

function openInStudio(palette: SavedPalette) {
  setPaletteForStudio(palette);
  router.push("/atelier/palette-studio");
}

  return (
    <>
      <div className="space-y-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[#89947a]">
              YOUR CREATIVE COLLECTION
            </p>

            <h1 className="font-editorial text-4xl text-[#353630] sm:text-5xl">
              My Library
            </h1>

            <p className="mt-2 max-w-lg text-sm leading-6 text-[#858479]">
              A little home for all the colors you&apos;e discovered and created.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[#e8e5dc] bg-white px-4 py-3 text-sm text-[#858479]">
            <Palette size={17} />
            <span>{palettes.length} saved palettes</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-[#e8e5dc] bg-white p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa69a]"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Find a palette..."
              className="w-full rounded-xl border border-[#e8e5dc] bg-[#fffefa] py-3 pl-10 pr-4 text-sm text-[#353630] outline-none transition placeholder:text-[#aaa69a] focus:border-[#89947a]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { value: "all", label: "All palettes" },
              { value: "studio", label: "Created" },
              { value: "image-extractor", label: "From images" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value as Filter)}
                className={`rounded-xl px-4 py-2.5 text-xs font-medium transition ${
                  filter === option.value
                    ? "bg-[#89947a] text-white"
                    : "bg-[#f5f3ed] text-[#858479] hover:bg-[#ece9df]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {filteredPalettes.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredPalettes.map((palette) => (
              <article
                key={palette.id}
                className="group overflow-hidden rounded-2xl border border-[#e8e5dc] bg-white transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-36 overflow-hidden">
                  {palette.colors.map((color, index) => (
                    <button
                      key={`${palette.id}-${index}`}
                      onClick={() => copyColor(color)}
                      title={`Copy ${color}`}
                      style={{ backgroundColor: color }}
                      className="group/swatch relative min-w-0 flex-1"
                    >
                      <span className="absolute inset-x-0 bottom-2 flex justify-center opacity-0 transition group-hover/swatch:opacity-100">
                        <span className="rounded-md bg-white/90 p-1.5 text-[#353630]">
                          {copied === color ? (
                            <Check size={13} />
                          ) : (
                            <Copy size={13} />
                          )}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>

                <div className="space-y-4 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="truncate font-editorial text-xl text-[#353630]">
                        {palette.name}
                      </h2>

                      <div className="mt-1 flex items-center gap-1.5 text-xs text-[#929083]">
                        {palette.source === "studio" ? (
                            <Heart size={13} aria-hidden="true" />
                        ) : (
                            <ImageIcon size={13} aria-hidden="true" />
                        )}
                        <span>
                            {palette.source === "studio"
                            ? "Created in Palette Studio"
                            : "Extracted from an image"}
                        </span>
                      </div>
                    </div>

                    <span className="shrink-0 rounded-full bg-[#f3f1e9] px-2.5 py-1 text-[10px] text-[#858479]">
                      {palette.colors.length} colors
                    </span>
                  </div>

                  <p className="text-xs text-[#aaa69a]">
                    Saved {new Date(palette.createdAt).toLocaleDateString()}
                  </p>

                  <div className="flex flex-wrap gap-2 border-t border-[#eeeae2] pt-3">
                    <button
                      onClick={() => openInStudio(palette)}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#89947a] px-3 py-2.5 text-xs font-medium text-white transition hover:bg-[#737f66]"
                    >
                      <Sparkles size={14} />
                      Use in Studio
                      <ArrowUpRight size={13} />
                    </button>

                    <button
                      onClick={() => setEditingPalette(palette)}
                      title="Edit palette"
                      className="rounded-lg border border-[#e8e5dc] p-2.5 text-[#858479] transition hover:bg-[#f5f3ed]"
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      onClick={() => setDeletingPalette(palette)}
                      title="Delete palette"
                      className="rounded-lg border border-[#e8e5dc] p-2.5 text-[#a17d75] transition hover:bg-[#faf0ed]"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-[#dedacf] bg-[#fffefa] px-6 py-16 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f0eee6] text-[#89947a]">
              <Palette size={27} />
            </div>

            <h2 className="font-editorial text-2xl text-[#353630]">
              {search || filter !== "all"
                ? "No palettes found"
                : "Your collection starts here"}
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#858479]">
              {search || filter !== "all"
                ? "Try another search or choose a different filter."
                : "Create a palette in the studio or discover beautiful colors from an image. They&apos;ll appear here."}
            </p>

            {!search && filter === "all" && (
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/atelier/palette-studio"
                  className="rounded-xl bg-[#89947a] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#737f66]"
                >
                  Explore Palette Studio
                </Link>

                <Link
                  href="/atelier/image-extractor"
                  className="rounded-xl border border-[#e8e5dc] bg-white px-5 py-3 text-sm font-medium text-[#68695e] transition hover:bg-[#f5f3ed]"
                >
                  Extract from an image
                </Link>
              </div>
            )}
          </div>
        )}

        <div className="rounded-2xl bg-[#f6f1eb] p-5">
          <h3 className="font-editorial text-lg text-[#65574c]">
            A little note
          </h3>

          <p className="mt-1 text-sm leading-6 text-[#8c7c6d]">
            Your palettes are stored in this browser for now. They&apos;ll be ready
            whenever you return using the same browser and device.
          </p>
        </div>
      </div>

      {editingPalette && (
        <PaletteEditor
          palette={editingPalette}
          onSave={saveChanges}
          onClose={() => setEditingPalette(null)}
        />
      )}

      {deletingPalette && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#25251f]/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-[#e8e5dc] bg-[#fffefa] p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#faf0ed] text-[#a17d75]">
              <Trash2 size={21} />
            </div>

            <h2 className="font-editorial text-2xl text-[#353630]">
              Remove this palette?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#858479]">
              Are you sure you want to delete{" "}
              <strong className="text-[#353630]">
                {deletingPalette.name}
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeletingPalette(null)}
                className="flex-1 rounded-xl border border-[#e8e5dc] px-4 py-3 text-xs font-medium text-[#68695e] hover:bg-[#f5f3ed]"
              >
                Keep palette
              </button>

              <button
                onClick={removePalette}
                className="flex-1 rounded-xl bg-[#a9786f] px-4 py-3 text-xs font-medium text-white transition hover:bg-[#91665e]"
              >
                Delete palette
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
