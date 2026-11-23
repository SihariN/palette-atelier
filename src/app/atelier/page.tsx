
import Link from "next/link";
import {
  ArrowUpRight,
  Image,
  Palette,
  PanelsTopLeft,
  Accessibility,
  Plus,
  Sparkles,
} from "lucide-react";

const tools = [
  {
    title: "Palette Studio",
    description: "Discover beautiful color combinations and create your own palettes.",
    href: "/atelier/palette-studio",
    icon: Palette,
    accent: "bg-[#e8ecdf] text-[#78836a]",
    tag: "COLOR EXPLORATION",
  },
  {
    title: "Image Extractor",
    description: "Find the colors hidden inside your favorite photographs.",
    href: "/atelier/image-extractor",
    icon: Image,
    accent: "bg-[#f2e3de] text-[#b7837d]",
    tag: "IMAGE TO COLOR",
  },
  {
    title: "Moodboard Creator",
    description: "Bring images, colors and ideas together in one place.",
    href: "/atelier/moodboards",
    icon: PanelsTopLeft,
    accent: "bg-[#ebe5f1] text-[#9584aa]",
    tag: "VISUAL INSPIRATION",
  },
  {
    title: "Accessibility Checker",
    description: "Explore color contrast and create more accessible designs.",
    href: "/atelier/accessibility",
    icon: Accessibility,
    accent: "bg-[#f5e9dc] text-[#b68d69]",
    tag: "DESIGN INCLUSIVELY",
  },
];

export default function AtelierHome() {
  return (
    <div className="space-y-10">
      <section>
        <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-[#89947a]">
          <Sparkles size={15} />
          WELCOME TO YOUR CREATIVE SPACE
        </div>

        <h1 className="font-editorial mt-4 text-5xl font-medium text-[#353630] sm:text-6xl">
          A little inspiration,
          <br />
          <span className="italic text-[#89947a]">
            a lot of possibilities.
          </span>
        </h1>

        <p className="mt-5 max-w-xl text-sm leading-7 text-[#858479]">
          Explore colors, collect inspiration and create something
          beautiful. Your creative journey starts here.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3 overflow-hidden rounded-2xl sm:gap-4">
        {["#A6AE96", "#D9AAA4", "#C5B8D7", "#EBC7A9", "#D7C9AE", "#B7C4BC", "#D9C6BD", "#AAB1C4"].map(
          (color, index) => (
            <div
              key={index}
              className="h-16 rounded-xl sm:h-20"
              style={{ backgroundColor: color }}
            />
          )
        )}
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#353630]">
              Explore your studio
            </h2>
            <p className="mt-1 text-xs text-[#99968b]">
              Choose a space to begin creating.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {tools.map((tool) => {
            const Icon = tool.icon;

            return (
              <Link
                href={tool.href}
                key={tool.title}
                className="group rounded-2xl border border-[#e8e5dc] bg-[#fffefa] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#353630]/5"
              >
                <div className="flex items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tool.accent}`}>
                    <Icon size={22} strokeWidth={1.7} />
                  </div>

                  <ArrowUpRight
                    size={18}
                    className="text-[#aaa69a] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                </div>

                <p className="mt-7 text-[10px] font-semibold tracking-[0.16em] text-[#aaa69a]">
                  {tool.tag}
                </p>

                <h3 className="mt-2 text-base font-semibold text-[#353630]">
                  {tool.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#858479]">
                  {tool.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col justify-between gap-4 rounded-2xl bg-[#e8ecdf] p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <p className="text-xs font-medium tracking-wide text-[#78836a]">
            YOUR NEXT CREATIVE IDEA
          </p>
          <h2 className="font-editorial mt-2 text-3xl text-[#353630]">
            Start with a color.
          </h2>
          <p className="mt-2 text-sm text-[#777b6c]">
            Every beautiful creation begins somewhere.
          </p>
        </div>

        <Link
          href="/atelier/palette-studio"
          className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-[#7f896f] px-6 py-3 text-xs font-medium text-white transition-colors hover:bg-[#6e795f] sm:self-auto"
        >
          Create a palette
          <Plus size={15} />
        </Link>
      </section>
    </div>
  );
}
