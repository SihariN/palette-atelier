
export type PaletteSource = "studio" | "image-extractor";

export type SavedPalette = {
  id: string;
  name: string;
  colors: string[];
  source: PaletteSource;
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = "palette_atelier_library";
const LEGACY_EXTRACTED_KEY = "palette_atelier_extracted";
const ACTIVE_PALETTE_KEY = "palette_atelier_active_palette";

const PALETTE_EVENT = "palette-atelier-library-updated";

function isValidPalette(value: unknown): value is SavedPalette {
  if (!value || typeof value !== "object") return false;

  const palette = value as Partial<SavedPalette>;

  return (
    typeof palette.id === "string" &&
    typeof palette.name === "string" &&
    Array.isArray(palette.colors) &&
    palette.colors.every((color) => typeof color === "string") &&
    (palette.source === "studio" || palette.source === "image-extractor") &&
    typeof palette.createdAt === "string" &&
    typeof palette.updatedAt === "string"
  );
}

function readStoredPalettes(): SavedPalette[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isValidPalette);
  } catch {
    return [];
  }
}

function writeStoredPalettes(palettes: SavedPalette[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(palettes));

  window.dispatchEvent(new Event(PALETTE_EVENT));
}

function migrateLegacyPalettes(): SavedPalette[] {
  const current = readStoredPalettes();

  try {
    const raw = localStorage.getItem(LEGACY_EXTRACTED_KEY);
    if (!raw) return current;

    const legacy: unknown = JSON.parse(raw);
    if (!Array.isArray(legacy)) return current;

    const migrated: SavedPalette[] = legacy
      .filter(
        (item): item is {
          id: string;
          name: string;
          colors: string[];
          createdAt: string;
        } =>
          !!item &&
          typeof item === "object" &&
          typeof item.id === "string" &&
          typeof item.name === "string" &&
          Array.isArray(item.colors) &&
          item.colors.every(
            (color: unknown) => typeof color === "string",
          ) &&
          typeof item.createdAt === "string",
      )
      .map((item) => ({
        id: item.id,
        name: item.name,
        colors: item.colors,
        source: "image-extractor",
        createdAt: item.createdAt,
        updatedAt: item.createdAt,
      }));

    if (migrated.length === 0) return current;

    const existingIds = new Set(current.map((palette) => palette.id));

    const newPalettes = migrated.filter(
      (palette) => !existingIds.has(palette.id),
    );

    const combined = [...current, ...newPalettes];

    if (newPalettes.length > 0) {
      writeStoredPalettes(combined);
    }

    // Migration succeeded. Remove the old source so deleted palettes
    // cannot be imported again.
    localStorage.removeItem(LEGACY_EXTRACTED_KEY);

    return combined;
  } catch (error) {
    console.error("Palette migration failed:", error);
    return current;
  }
}

export function getSavedPalettes(): SavedPalette[] {
  return migrateLegacyPalettes();
}

export function savePalette(palette: SavedPalette): void {
  const current = readStoredPalettes();
  writeStoredPalettes([palette, ...current]);
}

export function updatePalette(
  id: string,
  changes: Partial<Pick<SavedPalette, "name" | "colors">>,
): void {
  const current = readStoredPalettes();

  const updated = current.map((palette) =>
    palette.id === id
      ? {
          ...palette,
          ...changes,
          updatedAt: new Date().toISOString(),
        }
      : palette,
  );

  writeStoredPalettes(updated);
}

export function deletePalette(id: string): void {
  const current = readStoredPalettes();
  writeStoredPalettes(current.filter((palette) => palette.id !== id));
}

export function setPaletteForStudio(palette: SavedPalette): void {
  localStorage.setItem(ACTIVE_PALETTE_KEY, JSON.stringify(palette));
}

export function consumePaletteForStudio(): SavedPalette | null {
  try {
    const raw = localStorage.getItem(ACTIVE_PALETTE_KEY);
    if (!raw) return null;

    localStorage.removeItem(ACTIVE_PALETTE_KEY);

    const parsed: unknown = JSON.parse(raw);
    return isValidPalette(parsed) ? parsed : null;
  } catch {
    localStorage.removeItem(ACTIVE_PALETTE_KEY);
    return null;
  }
}

export function subscribeToPaletteChanges(callback: () => void) {
  window.addEventListener(PALETTE_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(PALETTE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
