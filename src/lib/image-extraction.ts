
export type ExtractedColor = {
  hex: string;
  rgb: [number, number, number];
  population: number;
};

type PixelColor = [number, number, number];

type ColorBox = {
  colors: PixelColor[];
};

function rgbToHex([r, g, b]: PixelColor): string {
  return (
    "#" +
    [r, g, b]
      .map((value) => Math.round(value).toString(16).padStart(2, "0"))
      .join("")
  ).toUpperCase();
}

function getChannelRange(colors: PixelColor[], channel: number): number {
  let min = 255;
  let max = 0;

  for (const color of colors) {
    min = Math.min(min, color[channel]);
    max = Math.max(max, color[channel]);
  }

  return max - min;
}

function getWidestChannel(colors: PixelColor[]): number {
  const ranges = [
    getChannelRange(colors, 0),
    getChannelRange(colors, 1),
    getChannelRange(colors, 2),
  ];

  return ranges.indexOf(Math.max(...ranges));
}

function splitBox(box: ColorBox): [ColorBox, ColorBox] | null {
  if (box.colors.length < 2) return null;

  const channel = getWidestChannel(box.colors);

  const sorted = [...box.colors].sort(
    (a, b) => a[channel] - b[channel],
  );

  const median = Math.floor(sorted.length / 2);

  return [
    { colors: sorted.slice(0, median) },
    { colors: sorted.slice(median) },
  ];
}

function averageBox(box: ColorBox): ExtractedColor {
  let r = 0;
  let g = 0;
  let b = 0;

  for (const color of box.colors) {
    r += color[0];
    g += color[1];
    b += color[2];
  }

  const count = box.colors.length || 1;

  const rgb: PixelColor = [
    Math.round(r / count),
    Math.round(g / count),
    Math.round(b / count),
  ];

  return {
    hex: rgbToHex(rgb),
    rgb,
    population: count,
  };
}

export function extractDominantColors(
  imageData: ImageData,
  colorCount = 5,
): ExtractedColor[] {
  const pixels: PixelColor[] = [];
  const data = imageData.data;

  // Sample pixels instead of processing every single pixel.
  const pixelCount = data.length / 4;
  const step = Math.max(1, Math.floor(pixelCount / 12000));

  for (let i = 0; i < data.length; i += 4 * step) {
    const alpha = data[i + 3];

    // Ignore nearly transparent pixels.
    if (alpha < 128) continue;

    pixels.push([data[i], data[i + 1], data[i + 2]]);
  }

  if (pixels.length === 0) {
    return [];
  }

  const boxes: ColorBox[] = [{ colors: pixels }];

  // Repeatedly split the most color-diverse box.
  while (boxes.length < colorCount) {
    let bestIndex = -1;
    let bestScore = -1;

    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i];

      if (box.colors.length < 2) continue;

      const channel = getWidestChannel(box.colors);
      const range = getChannelRange(box.colors, channel);

      // Larger and more varied boxes get split first.
      const score = range * box.colors.length;

      if (score > bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }

    if (bestIndex === -1) break;

    const split = splitBox(boxes[bestIndex]);

    if (!split) break;

    boxes.splice(bestIndex, 1, split[0], split[1]);
  }

  return boxes
    .map(averageBox)
    .sort((a, b) => b.population - a.population);
}

export function analyzeImage(
  canvas: HTMLCanvasElement,
  colorCount = 5,
): ExtractedColor[] {
  const context = canvas.getContext("2d", {
    willReadFrequently: true,
  });

  if (!context) {
    throw new Error("Unable to read image pixels.");
  }

  const imageData = context.getImageData(
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return extractDominantColors(imageData, colorCount);
}
