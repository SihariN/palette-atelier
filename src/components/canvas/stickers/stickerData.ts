
export type StickerCategory =
  | "Botanical"
  | "Abstract"
  | "Stars & Sparkles"
  | "Decorative"
  | "Labels";

export type StickerItem = {
  id: string;
  name: string;
  category: StickerCategory;
  svg: string;
  keywords: string[];
};

export const STICKER_CATEGORIES: StickerCategory[] = [
  "Botanical",
  "Abstract",
  "Stars & Sparkles",
  "Decorative",
  "Labels",
];

const createSvg = (content: string) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
${content}
</svg>
`;

export const STICKERS: StickerItem[] = [
  // ─────────────────────────────
  // BOTANICAL
  // ─────────────────────────────
  {
    id: "leaf-01",
    name: "Leaf",
    category: "Botanical",
    keywords: ["leaf", "plant", "nature", "green"],
    svg: createSvg(`
      <path d="M100 20C65 20 25 40 25 78c0 15 12 24 27 22C83 88 100 55 100 20Z" fill="#89947A"/>
      <path d="M25 100C45 75 65 55 90 35" fill="none" stroke="#536148" stroke-width="4" stroke-linecap="round"/>
      <path d="M48 75 40 54M62 60 65 42M48 75 70 82" fill="none" stroke="#E8ECDF" stroke-width="3" stroke-linecap="round"/>
    `),
  },
  {
    id: "flower-01",
    name: "Flower",
    category: "Botanical",
    keywords: ["flower", "petal", "floral", "bloom"],
    svg: createSvg(`
      <g fill="#D5AAA3">
        <ellipse cx="60" cy="35" rx="16" ry="24"/>
        <ellipse cx="60" cy="85" rx="16" ry="24"/>
        <ellipse cx="35" cy="60" rx="24" ry="16"/>
        <ellipse cx="85" cy="60" rx="24" ry="16"/>
        <ellipse cx="42" cy="42" rx="17" ry="22" transform="rotate(-45 42 42)"/>
        <ellipse cx="78" cy="42" rx="17" ry="22" transform="rotate(45 78 42)"/>
        <ellipse cx="42" cy="78" rx="17" ry="22" transform="rotate(45 42 78)"/>
        <ellipse cx="78" cy="78" rx="17" ry="22" transform="rotate(-45 78 78)"/>
      </g>
      <circle cx="60" cy="60" r="17" fill="#EBC8A9"/>
      <circle cx="60" cy="60" r="8" fill="#FFF5E8"/>
    `),
  },
  {
    id: "branch-01",
    name: "Olive Branch",
    category: "Botanical",
    keywords: ["branch", "olive", "leaves", "botanical"],
    svg: createSvg(`
      <path d="M20 100Q55 65 100 20" stroke="#536148" stroke-width="4" fill="none" stroke-linecap="round"/>
      <g fill="#89947A">
        <ellipse cx="30" cy="80" rx="9" ry="20" transform="rotate(-45 30 80)"/>
        <ellipse cx="42" cy="64" rx="9" ry="20" transform="rotate(35 42 64)"/>
        <ellipse cx="52" cy="51" rx="9" ry="20" transform="rotate(-45 52 51)"/>
        <ellipse cx="66" cy="40" rx="9" ry="20" transform="rotate(35 66 40)"/>
        <ellipse cx="78" cy="30" rx="9" ry="20" transform="rotate(-45 78 30)"/>
        <ellipse cx="83" cy="21" rx="8" ry="17" transform="rotate(35 83 21)"/>
      </g>
    `),
  },
  {
    id: "tulip-01",
    name: "Tulip",
    category: "Botanical",
    keywords: ["tulip", "flower", "spring", "floral"],
    svg: createSvg(`
      <path d="M60 55V108" stroke="#536148" stroke-width="5" stroke-linecap="round"/>
      <path d="M60 86Q28 62 25 91Q40 109 60 98" fill="#89947A"/>
      <path d="M60 86Q92 62 95 91Q80 109 60 98" fill="#A9B49A"/>
      <path d="M35 60Q35 18 60 38Q85 18 85 60Q85 79 60 79Q35 79 35 60Z" fill="#D5AAA3"/>
      <path d="M60 38V78" stroke="#B9857E" stroke-width="2"/>
    `),
  },
  {
    id: "mushroom-01",
    name: "Mushroom",
    category: "Botanical",
    keywords: ["mushroom", "fungi", "forest", "nature"],
    svg: createSvg(`
      <path d="M45 65H75L79 103Q60 111 41 103Z" fill="#EBC8A9"/>
      <path d="M15 63Q15 20 60 18Q105 20 105 63Z" fill="#D5AAA3"/>
      <path d="M15 63Q60 76 105 63" fill="none" stroke="#B9857E" stroke-width="3"/>
      <g fill="#FFF5E8">
        <circle cx="43" cy="42" r="5"/>
        <circle cx="72" cy="32" r="6"/>
        <circle cx="83" cy="51" r="4"/>
      </g>
    `),
  },
  {
    id: "cactus-01",
    name: "Cactus",
    category: "Botanical",
    keywords: ["cactus", "plant", "succulent", "desert"],
    svg: createSvg(`
      <rect x="44" y="25" width="32" height="80" rx="16" fill="#89947A"/>
      <path d="M44 55H32Q24 55 24 45V38" fill="none" stroke="#89947A" stroke-width="13" stroke-linecap="round"/>
      <path d="M76 70H88Q96 70 96 60V52" fill="none" stroke="#89947A" stroke-width="13" stroke-linecap="round"/>
      <g stroke="#E8ECDF" stroke-width="2" stroke-linecap="round">
        <path d="M54 42V48M66 59V65M55 81V87M67 94V100"/>
      </g>
      <path d="M33 106H87" stroke="#D5AAA3" stroke-width="4" stroke-linecap="round"/>
    `),
  },
  {
    id: "branch-02",
    name: "Fern",
    category: "Botanical",
    keywords: ["fern", "plant", "leaf", "green"],
    svg: createSvg(`
      <path d="M60 108Q52 55 60 12" fill="none" stroke="#536148" stroke-width="3"/>
      <g fill="#89947A">
        <ellipse cx="47" cy="85" rx="8" ry="18" transform="rotate(-55 47 85)"/>
        <ellipse cx="73" cy="85" rx="8" ry="18" transform="rotate(55 73 85)"/>
        <ellipse cx="45" cy="66" rx="8" ry="18" transform="rotate(-55 45 66)"/>
        <ellipse cx="75" cy="66" rx="8" ry="18" transform="rotate(55 75 66)"/>
        <ellipse cx="48" cy="46" rx="7" ry="16" transform="rotate(-55 48 46)"/>
        <ellipse cx="72" cy="46" rx="7" ry="16" transform="rotate(55 72 46)"/>
        <ellipse cx="56" cy="27" rx="6" ry="13" transform="rotate(-35 56 27)"/>
        <ellipse cx="64" cy="27" rx="6" ry="13" transform="rotate(35 64 27)"/>
      </g>
    `),
  },
  {
    id: "daisy-01",
    name: "Daisy",
    category: "Botanical",
    keywords: ["daisy", "flower", "petal", "spring"],
    svg: createSvg(`
      <g fill="#FFF5E8">
        <ellipse cx="60" cy="29" rx="11" ry="22"/>
        <ellipse cx="60" cy="91" rx="11" ry="22"/>
        <ellipse cx="29" cy="60" rx="22" ry="11"/>
        <ellipse cx="91" cy="60" rx="22" ry="11"/>
        <ellipse cx="38" cy="38" rx="11" ry="22" transform="rotate(-45 38 38)"/>
        <ellipse cx="82" cy="38" rx="11" ry="22" transform="rotate(45 82 38)"/>
        <ellipse cx="38" cy="82" rx="11" ry="22" transform="rotate(45 38 82)"/>
        <ellipse cx="82" cy="82" rx="11" ry="22" transform="rotate(-45 82 82)"/>
      </g>
      <circle cx="60" cy="60" r="16" fill="#EBC8A9"/>
    `),
  },
  {
    id: "palm-01",
    name: "Palm Leaf",
    category: "Botanical",
    keywords: ["palm", "tropical", "leaf", "plant"],
    svg: createSvg(`
      <path d="M60 108Q57 50 60 12" stroke="#536148" stroke-width="4" fill="none"/>
      <g fill="#89947A" stroke="#536148" stroke-width="1.5">
        <path d="M60 18Q28 5 12 20Q34 19 60 37Z"/>
        <path d="M60 18Q91 5 108 20Q83 19 60 37Z"/>
        <path d="M60 37Q24 30 10 50Q34 42 60 53Z"/>
        <path d="M60 37Q96 30 110 50Q86 42 60 53Z"/>
        <path d="M60 55Q31 55 18 76Q40 66 60 72Z"/>
        <path d="M60 55Q89 55 102 76Q80 66 60 72Z"/>
      </g>
    `),
  },

  // ─────────────────────────────
  // ABSTRACT
  // ─────────────────────────────
  {
    id: "blob-01",
    name: "Organic Blob",
    category: "Abstract",
    keywords: ["blob", "organic", "shape", "abstract"],
    svg: createSvg(`
      <path d="M65 12C85 15 107 32 105 54C104 75 88 106 65 108C37 111 12 88 15 60C17 35 39 8 65 12Z" fill="#C5B8D7"/>
    `),
  },
  {
    id: "arch-01",
    name: "Arch",
    category: "Abstract",
    keywords: ["arch", "architecture", "shape", "abstract"],
    svg: createSvg(`
      <path d="M25 105V55A35 35 0 0 1 95 55V105Z" fill="#EBC8A9"/>
    `),
  },
  {
    id: "sun-01",
    name: "Sun",
    category: "Abstract",
    keywords: ["sun", "sunshine", "circle", "summer"],
    svg: createSvg(`
      <g stroke="#D5AAA3" stroke-width="5" stroke-linecap="round">
        <path d="M60 10V22M60 98V110M10 60H22M98 60H110M25 25L34 34M86 86L95 95M95 25L86 34M34 86L25 95"/>
      </g>
      <circle cx="60" cy="60" r="30" fill="#EBC8A9"/>
    `),
  },
  {
    id: "arc-01",
    name: "Rainbow Arch",
    category: "Abstract",
    keywords: ["rainbow", "arch", "curve", "abstract"],
    svg: createSvg(`
      <path d="M20 100V60A40 40 0 0 1 100 60V100" fill="none" stroke="#D5AAA3" stroke-width="12"/>
      <path d="M36 100V60A24 24 0 0 1 84 60V100" fill="none" stroke="#EBC8A9" stroke-width="10"/>
      <path d="M51 100V60A9 9 0 0 1 69 60V100" fill="none" stroke="#89947A" stroke-width="8"/>
    `),
  },
  {
    id: "checker-01",
    name: "Checkerboard",
    category: "Abstract",
    keywords: ["checker", "pattern", "grid", "abstract"],
    svg: createSvg(`
      <g fill="#C5B8D7">
        <rect x="15" y="15" width="30" height="30" rx="3"/>
        <rect x="75" y="15" width="30" height="30" rx="3"/>
        <rect x="45" y="45" width="30" height="30" rx="3"/>
        <rect x="15" y="75" width="30" height="30" rx="3"/>
        <rect x="75" y="75" width="30" height="30" rx="3"/>
      </g>
      <g fill="#EBC8A9">
        <rect x="45" y="15" width="30" height="30" rx="3"/>
        <rect x="15" y="45" width="30" height="30" rx="3"/>
        <rect x="75" y="45" width="30" height="30" rx="3"/>
        <rect x="45" y="75" width="30" height="30" rx="3"/>
      </g>
    `),
  },
  {
    id: "circle-01",
    name: "Outlined Circle",
    category: "Abstract",
    keywords: ["circle", "outline", "ring", "shape"],
    svg: createSvg(`
      <circle cx="60" cy="60" r="43" fill="none" stroke="#89947A" stroke-width="9"/>
      <circle cx="60" cy="60" r="29" fill="none" stroke="#D5AAA3" stroke-width="2"/>
    `),
  },
  {
    id: "wave-02",
    name: "Abstract Wave",
    category: "Abstract",
    keywords: ["wave", "abstract", "curve", "shape"],
    svg: createSvg(`
      <path d="M10 60Q35 15 60 60T110 60" fill="none" stroke="#C5B8D7" stroke-width="13" stroke-linecap="round"/>
      <path d="M10 85Q35 40 60 85T110 85" fill="none" stroke="#D5AAA3" stroke-width="7" stroke-linecap="round"/>
    `),
  },
  {
    id: "diamond-01",
    name: "Diamond",
    category: "Abstract",
    keywords: ["diamond", "geometric", "shape", "abstract"],
    svg: createSvg(`
      <path d="M60 10 108 60 60 110 12 60Z" fill="#C5B8D7"/>
      <path d="M60 10 60 110M12 60H108" stroke="#A99ABD" stroke-width="2"/>
    `),
  },

  // ─────────────────────────────
  // STARS & SPARKLES
  // ─────────────────────────────
  {
    id: "sparkle-01",
    name: "Sparkle",
    category: "Stars & Sparkles",
    keywords: ["sparkle", "shine", "star", "glitter"],
    svg: createSvg(`
      <path d="M60 8C66 38 82 54 112 60C82 66 66 82 60 112C54 82 38 66 8 60C38 54 54 38 60 8Z" fill="#EBC8A9"/>
    `),
  },
  {
    id: "star-01",
    name: "Star",
    category: "Stars & Sparkles",
    keywords: ["star", "five point", "night", "shine"],
    svg: createSvg(`
      <path d="M60 10 74 43 110 46 83 70 90 108 60 88 30 108 37 70 10 46 46 43Z" fill="#89947A"/>
    `),
  },
  {
    id: "sparkles-02",
    name: "Tiny Sparkles",
    category: "Stars & Sparkles",
    keywords: ["sparkles", "small stars", "decoration"],
    svg: createSvg(`
      <g fill="#D5AAA3">
        <path d="M32 10C36 28 44 36 62 40C44 44 36 52 32 70C28 52 20 44 2 40C20 36 28 28 32 10Z"/>
        <path d="M85 50C89 66 95 72 110 76C95 80 89 86 85 102C81 86 75 80 60 76C75 72 81 66 85 50Z"/>
      </g>
    `),
  },
  {
    id: "moon-01",
    name: "Crescent Moon",
    category: "Stars & Sparkles",
    keywords: ["moon", "crescent", "night", "space"],
    svg: createSvg(`
      <path d="M85 18A48 48 0 1 0 102 91A42 42 0 0 1 85 18Z" fill="#C5B8D7"/>
      <circle cx="90" cy="35" r="3" fill="#89947A"/>
    `),
  },
  {
    id: "constellation-01",
    name: "Constellation",
    category: "Stars & Sparkles",
    keywords: ["stars", "constellation", "night", "space"],
    svg: createSvg(`
      <path d="M22 30 55 58 90 22 82 91 34 100Z" fill="none" stroke="#C5B8D7" stroke-width="2" stroke-dasharray="4 4"/>
      <g fill="#EBC8A9">
        <path d="M22 17 27 28 39 30 27 34 22 46 18 34 6 30 18 28Z"/>
        <path d="M90 7 95 18 107 20 95 24 90 36 86 24 74 20 86 18Z"/>
        <path d="M82 78 86 88 97 90 86 94 82 105 78 94 67 90 78 88Z"/>
      </g>
      <circle cx="55" cy="58" r="5" fill="#89947A"/>
    `),
  },
  {
    id: "shooting-star-01",
    name: "Shooting Star",
    category: "Stars & Sparkles",
    keywords: ["shooting star", "comet", "night", "shine"],
    svg: createSvg(`
      <path d="M17 91Q40 65 70 44" fill="none" stroke="#C5B8D7" stroke-width="9" stroke-linecap="round"/>
      <path d="M60 42 71 10 82 38 110 47 82 58 71 85 60 58 32 47Z" fill="#EBC8A9"/>
    `),
  },
  {
    id: "twinkle-01",
    name: "Twinkle",
    category: "Stars & Sparkles",
    keywords: ["twinkle", "sparkle", "star", "shine"],
    svg: createSvg(`
      <path d="M60 10Q64 54 110 60Q64 66 60 110Q56 66 10 60Q56 54 60 10Z" fill="#89947A"/>
      <circle cx="94" cy="20" r="6" fill="#D5AAA3"/>
      <circle cx="22" cy="95" r="5" fill="#EBC8A9"/>
    `),
  },
  {
    id: "star-outline-01",
    name: "Outline Star",
    category: "Stars & Sparkles",
    keywords: ["star", "outline", "night", "shape"],
    svg: createSvg(`
      <path d="M60 10 74 43 110 46 83 70 90 108 60 88 30 108 37 70 10 46 46 43Z" fill="none" stroke="#D5AAA3" stroke-width="6" stroke-linejoin="round"/>
    `),
  },

  // ─────────────────────────────
  // DECORATIVE
  // ─────────────────────────────
  {
    id: "heart-01",
    name: "Heart",
    category: "Decorative",
    keywords: ["heart", "love", "romance"],
    svg: createSvg(`
      <path d="M60 105 15 60C-5 25 35 5 60 35C85 5 125 25 105 60Z" fill="#D5AAA3"/>
    `),
  },
  {
    id: "wave-01",
    name: "Wave",
    category: "Decorative",
    keywords: ["wave", "water", "flow", "line"],
    svg: createSvg(`
      <path d="M10 45C30 20 50 70 70 45S110 70 110 45M10 75C30 50 50 100 70 75S110 100 110 75" fill="none" stroke="#89947A" stroke-width="7" stroke-linecap="round"/>
    `),
  },
  {
    id: "bow-01",
    name: "Bow",
    category: "Decorative",
    keywords: ["bow", "ribbon", "cute", "gift"],
    svg: createSvg(`
      <path d="M55 55 15 25C5 65 25 80 55 65ZM65 55 105 25C115 65 95 80 65 65Z" fill="#D5AAA3"/>
      <circle cx="60" cy="60" r="12" fill="#EBC8A9"/>
      <path d="M50 68 35 108 58 98 65 110 70 68Z" fill="#D5AAA3"/>
    `),
  },
  {
    id: "ribbon-01",
    name: "Ribbon",
    category: "Decorative",
    keywords: ["ribbon", "banner", "decoration", "bow"],
    svg: createSvg(`
      <path d="M18 30H102V82H18Z" fill="#D5AAA3"/>
      <path d="M18 82 7 108 40 93 50 108 50 82Z" fill="#B9857E"/>
      <path d="M102 82 113 108 80 93 70 108 70 82Z" fill="#B9857E"/>
      <path d="M18 30H102" stroke="#F0DDD9" stroke-width="3"/>
    `),
  },
  {
    id: "butterfly-01",
    name: "Butterfly",
    category: "Decorative",
    keywords: ["butterfly", "wings", "nature", "cute"],
    svg: createSvg(`
      <path d="M58 56Q10 5 13 48Q17 82 57 67Q20 75 32 105Q51 110 60 70Z" fill="#C5B8D7"/>
      <path d="M62 56Q110 5 107 48Q103 82 63 67Q100 75 88 105Q69 110 60 70Z" fill="#D5AAA3"/>
      <path d="M60 39V92" stroke="#536148" stroke-width="5" stroke-linecap="round"/>
      <path d="M60 40Q45 15 37 20M60 40Q75 15 83 20" fill="none" stroke="#536148" stroke-width="2" stroke-linecap="round"/>
    `),
  },
  {
    id: "cloud-01",
    name: "Cloud",
    category: "Decorative",
    keywords: ["cloud", "sky", "weather", "cute"],
    svg: createSvg(`
      <path d="M27 82Q10 82 10 65Q10 48 30 48Q34 20 59 20Q84 20 88 48Q110 44 110 65Q110 82 92 82Z" fill="#C5B8D7"/>
      <path d="M30 88H90" stroke="#A99ABD" stroke-width="3" stroke-linecap="round"/>
    `),
  },
  {
    id: "sunflower-01",
    name: "Sunflower",
    category: "Decorative",
    keywords: ["sunflower", "flower", "summer", "yellow"],
    svg: createSvg(`
      <g fill="#EBC8A9">
        <ellipse cx="60" cy="23" rx="10" ry="20"/>
        <ellipse cx="60" cy="97" rx="10" ry="20"/>
        <ellipse cx="23" cy="60" rx="20" ry="10"/>
        <ellipse cx="97" cy="60" rx="20" ry="10"/>
        <ellipse cx="34" cy="34" rx="10" ry="20" transform="rotate(-45 34 34)"/>
        <ellipse cx="86" cy="34" rx="10" ry="20" transform="rotate(45 86 34)"/>
        <ellipse cx="34" cy="86" rx="10" ry="20" transform="rotate(45 34 86)"/>
        <ellipse cx="86" cy="86" rx="10" ry="20" transform="rotate(-45 86 86)"/>
      </g>
      <circle cx="60" cy="60" r="19" fill="#89947A"/>
    `),
  },
  {
    id: "flower-outline-01",
    name: "Flower Outline",
    category: "Decorative",
    keywords: ["flower", "outline", "floral", "line art"],
    svg: createSvg(`
      <g fill="none" stroke="#D5AAA3" stroke-width="5">
        <ellipse cx="60" cy="32" rx="13" ry="22"/>
        <ellipse cx="60" cy="88" rx="13" ry="22"/>
        <ellipse cx="32" cy="60" rx="22" ry="13"/>
        <ellipse cx="88" cy="60" rx="22" ry="13"/>
        <circle cx="60" cy="60" r="12"/>
      </g>
    `),
  },
  {
    id: "rainbow-01",
    name: "Rainbow",
    category: "Decorative",
    keywords: ["rainbow", "color", "sky", "cute"],
    svg: createSvg(`
      <path d="M15 90A45 45 0 0 1 105 90" fill="none" stroke="#D5AAA3" stroke-width="12" stroke-linecap="round"/>
      <path d="M29 90A31 31 0 0 1 91 90" fill="none" stroke="#EBC8A9" stroke-width="10" stroke-linecap="round"/>
      <path d="M43 90A17 17 0 0 1 77 90" fill="none" stroke="#89947A" stroke-width="9" stroke-linecap="round"/>
    `),
  },

  // ─────────────────────────────
  // LABELS
  // ─────────────────────────────
  {
    id: "label-01",
    name: "Round Label",
    category: "Labels",
    keywords: ["label", "badge", "circle", "stamp"],
    svg: createSvg(`
      <circle cx="60" cy="60" r="52" fill="#E8ECDF" stroke="#89947A" stroke-width="3" stroke-dasharray="5 4"/>
      <circle cx="60" cy="60" r="42" fill="none" stroke="#89947A" stroke-width="1.5"/>
    `),
  },
  {
    id: "label-02",
    name: "Organic Label",
    category: "Labels",
    keywords: ["label", "badge", "organic", "natural"],
    svg: createSvg(`
      <path d="M20 35Q10 15 35 15H85Q110 15 105 35L105 85Q110 105 85 105H35Q10 105 20 85Z" fill="#F0DDD9" stroke="#D5AAA3" stroke-width="3"/>
    `),
  },
  {
    id: "label-03",
    name: "Ticket Label",
    category: "Labels",
    keywords: ["ticket", "label", "badge", "coupon"],
    svg: createSvg(`
      <path d="M15 30H105V48Q90 60 105 72V90H15V72Q30 60 15 48Z" fill="#E8ECDF" stroke="#89947A" stroke-width="3"/>
      <path d="M60 30V90" stroke="#89947A" stroke-width="2" stroke-dasharray="4 4"/>
    `),
  },
  {
    id: "label-04",
    name: "Oval Label",
    category: "Labels",
    keywords: ["oval", "label", "badge", "stamp"],
    svg: createSvg(`
      <ellipse cx="60" cy="60" rx="49" ry="32" fill="#C5B8D7" stroke="#A99ABD" stroke-width="3"/>
      <ellipse cx="60" cy="60" rx="39" ry="23" fill="none" stroke="#FFF5E8" stroke-width="2"/>
    `),
  },
  {
    id: "label-05",
    name: "Scalloped Badge",
    category: "Labels",
    keywords: ["scalloped", "badge", "label", "seal"],
    svg: createSvg(`
      <path d="M60 9Q70 18 82 13Q87 25 100 27Q96 40 108 49Q99 60 108 71Q96 80 100 93Q87 95 82 107Q70 102 60 111Q50 102 38 107Q33 95 20 93Q24 80 12 71Q21 60 12 49Q24 40 20 27Q33 25 38 13Q50 18 60 9Z" fill="#F0DDD9" stroke="#D5AAA3" stroke-width="3"/>
      <circle cx="60" cy="60" r="38" fill="none" stroke="#D5AAA3" stroke-width="1.5" stroke-dasharray="3 3"/>
    `),
  },
  {
    id: "label-06",
    name: "Tag",
    category: "Labels",
    keywords: ["tag", "label", "price tag", "gift"],
    svg: createSvg(`
      <path d="M18 18H76L105 60 76 102H18Z" fill="#EBC8A9"/>
      <circle cx="33" cy="60" r="6" fill="#FFFEFA"/>
      <path d="M49 42H72M49 60H77M49 78H72" stroke="#B9857E" stroke-width="3" stroke-linecap="round"/>
    `),
  },
  {
    id: "label-07",
    name: "Star Badge",
    category: "Labels",
    keywords: ["star", "badge", "label", "award"],
    svg: createSvg(`
      <path d="M60 8 73 42 110 45 82 70 90 108 60 87 30 108 38 70 10 45 47 42Z" fill="#E8ECDF" stroke="#89947A" stroke-width="3"/>
      <circle cx="60" cy="60" r="20" fill="none" stroke="#89947A" stroke-width="2"/>
    `),
  },
];
