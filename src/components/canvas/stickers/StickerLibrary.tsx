
"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Sparkles,
  X,
  Plus,
  Check,
  Flower2,
  Shapes,
  Star,
  Heart,
  Tag,
} from "lucide-react";
import type { ReactNode } from "react";

import {
  STICKERS,
  STICKER_CATEGORIES,
  type StickerCategory,
  type StickerItem,
} from "./stickerData";

type StickerLibraryProps = {
  onStickerSelect?: (sticker: StickerItem) => void;
};

const CATEGORY_ICONS: Record<StickerCategory, ReactNode> = {
  Botanical: <Flower2 size={13} />,
  Abstract: <Shapes size={13} />,
  "Stars & Sparkles": <Star size={13} />,
  Decorative: <Heart size={13} />,
  Labels: <Tag size={13} />,
};

export default function StickerLibrary({
  onStickerSelect,
}: StickerLibraryProps) {
  const [activeCategory, setActiveCategory] =
    useState<StickerCategory | "All">("All");

  const [searchQuery, setSearchQuery] = useState("");
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(
    null
  );

  // Briefly display feedback after selecting a sticker.
  useEffect(() => {
    if (!recentlyAddedId) return;

    const timeout = window.setTimeout(() => {
      setRecentlyAddedId(null);
    }, 1100);

    return () => window.clearTimeout(timeout);
  }, [recentlyAddedId]);

  const filteredStickers = useMemo(() => {
    return STICKERS.filter((sticker) => {
      const matchesCategory =
        activeCategory === "All" ||
        sticker.category === activeCategory;

      const query = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !query ||
        sticker.name.toLowerCase().includes(query) ||
        sticker.category.toLowerCase().includes(query) ||
        sticker.keywords.some((keyword) =>
          keyword.toLowerCase().includes(query)
        );

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const getCategoryCount = (category: StickerCategory | "All") => {
    if (category === "All") return STICKERS.length;

    return STICKERS.filter(
      (sticker) => sticker.category === category
    ).length;
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategory("All");
  };

  const handleStickerClick = (sticker: StickerItem) => {
    setRecentlyAddedId(sticker.id);
    onStickerSelect?.(sticker);
  };

  return (
    <div className="flex max-h-[540px] min-h-[360px] flex-col overflow-hidden rounded-2xl border border-[#E8E5DC] bg-[#FFFEFA] soft-shadow">
      {/* Header */}
      <div className="border-b border-[#E8E5DC] px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0DDD9] text-[#9D756E]">
              <Sparkles size={17} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#353630]">
                Sticker Library
              </h3>

              <p className="mt-0.5 text-[10px] text-[#929083]">
                Little details, big personality
              </p>
            </div>
          </div>

          <span className="rounded-full bg-[#E8ECDF] px-2.5 py-1 text-[10px] font-semibold text-[#657257]">
            {STICKERS.length} assets
          </span>
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#929083]"
          />

          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Find a sticker..."
            aria-label="Search stickers"
            className="w-full rounded-xl border border-[#E8E5DC] bg-[#F7F5F0] py-2.5 pl-9 pr-9 text-xs text-[#353630] outline-none transition placeholder:text-[#A09F94] focus:border-[#89947A] focus:bg-white focus:ring-2 focus:ring-[#89947A]/15"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-[#929083] transition hover:bg-[#E8E5DC] hover:text-[#353630]"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="border-b border-[#E8E5DC] px-3 py-3">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveCategory("All")}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-[10px] font-medium transition-all ${
              activeCategory === "All"
                ? "bg-[#89947A] text-white shadow-sm"
                : "bg-[#F0EEE8] text-[#77786E] hover:bg-[#E8E5DC]"
            }`}
          >
            All
            <span className="opacity-75">
              {getCategoryCount("All")}
            </span>
          </button>

          {STICKER_CATEGORIES.map((category) => {
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-[10px] font-medium transition-all ${
                  isActive
                    ? "bg-[#89947A] text-white shadow-sm"
                    : "bg-[#F0EEE8] text-[#77786E] hover:bg-[#E8E5DC]"
                }`}
              >
                {CATEGORY_ICONS[category]}
                {category}
                <span className="opacity-75">
                  {getCategoryCount(category)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sticker Grid */}
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#55564F]">
              {activeCategory === "All"
                ? "Explore stickers"
                : activeCategory}
            </p>

            <p className="mt-0.5 text-[10px] text-[#A09F94]">
              {filteredStickers.length} results
            </p>
          </div>

          {(searchQuery || activeCategory !== "All") && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-[10px] font-medium text-[#89947A] transition hover:text-[#536148] hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {filteredStickers.length > 0 ? (
            <motion.div
              key={`${activeCategory}-${searchQuery}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="grid grid-cols-3 gap-2"
            >
              {filteredStickers.map((sticker) => {
                const wasRecentlyAdded =
                  recentlyAddedId === sticker.id;

                return (
                  <motion.button
                    key={sticker.id}
                    type="button"
                    onClick={() => handleStickerClick(sticker)}
                    title={`Add ${sticker.name} to canvas`}
                    aria-label={`Add ${sticker.name} to canvas`}
                    whileTap={{ scale: 0.94 }}
                    className={`group relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-xl border p-2 transition-all ${
                      wasRecentlyAdded
                        ? "border-[#AAB69B] bg-[#E8ECDF] shadow-sm"
                        : "border-[#E8E5DC]/60 bg-[#F7F5F0] hover:-translate-y-0.5 hover:border-[#C8D0BB] hover:bg-[#E8ECDF]/60 hover:shadow-sm"
                    }`}
                  >
                    {/* Selection feedback */}
                    <AnimatePresence>
                      {wasRecentlyAdded ? (
                        <motion.div
                          key="added"
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.7 }}
                          className="absolute right-1.5 top-1.5 z-10 flex h-5 items-center gap-1 rounded-full bg-[#89947A] px-1.5 text-white shadow-sm"
                        >
                          <Check size={11} strokeWidth={2.5} />
                          <span className="text-[8px] font-semibold">
                            Added
                          </span>
                        </motion.div>
                      ) : (
                        <div className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-[#89947A] opacity-0 shadow-sm transition-all group-hover:opacity-100">
                          <Plus size={12} />
                        </div>
                      )}
                    </AnimatePresence>

                    <div
                      className={`flex h-full w-full items-center justify-center p-1 transition-transform duration-200 ${
                        wasRecentlyAdded
                          ? "scale-110"
                          : "group-hover:scale-110"
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: sticker.svg,
                      }}
                    />

                    <span
                      className={`mt-1.5 max-w-full truncate text-[10px] font-medium transition-colors ${
                        wasRecentlyAdded
                          ? "text-[#536148]"
                          : "text-[#77786E] group-hover:text-[#536148]"
                      }`}
                    >
                      {sticker.name}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex min-h-[190px] flex-col items-center justify-center text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0EEE8] text-[#A4A397]">
                <Search size={18} />
              </div>

              <p className="mt-3 text-sm font-medium text-[#55564F]">
                No stickers found
              </p>

              <p className="mt-1 max-w-[180px] text-xs leading-5 text-[#929083]">
                We couldn&apos;t find anything matching your search.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-3 rounded-full bg-[#E8ECDF] px-3 py-1.5 text-[10px] font-semibold text-[#657257] transition hover:bg-[#DCE3D3]"
              >
                Reset library
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="border-t border-[#E8E5DC] bg-[#F7F5F0]/70 px-3 py-2.5">
        <p className="text-center text-[10px] text-[#929083]">
          Select any sticker to add it to your canvas ✨
        </p>
      </div>
    </div>
  );
}
