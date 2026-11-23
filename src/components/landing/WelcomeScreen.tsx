
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Palette, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

const colors = [
  { color: "#A6AE96", label: "Sage" },
  { color: "#D9AAA4", label: "Rose" },
  { color: "#C5B8D7", label: "Lavender" },
  { color: "#EBC7A9", label: "Peach" },
  { color: "#D7C9AE", label: "Sand" },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const [entering, setEntering] = useState(false);

  function enterAtelier() {
    if (entering) return;

    setEntering(true);

    setTimeout(() => {
      router.push("/atelier");
    }, 550);
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{
        opacity: entering ? 0 : 1,
        y: entering ? -12 : 0,
      }}
      transition={{ duration: 0.5 }}
      className="min-h-screen overflow-hidden px-6"
    >
      <header className="mx-auto flex max-w-7xl items-center justify-between py-7">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8ecdf] text-[#78836a]">
            <Palette size={21} />
          </div>

          <span className="text-lg font-semibold tracking-tight">
            Palette Atelier
          </span>
        </div>

        <span className="hidden text-xs tracking-[0.2em] text-[#858479] sm:block">
          A CREATIVE SPACE
        </span>
      </header>

      <section className="studio-grid relative mx-auto mt-8 flex min-h-[690px] max-w-7xl items-center justify-center overflow-hidden rounded-[32px] border border-[#e8e5dc] bg-[#fbfaf6] px-6 py-20 md:mt-5">
        <div className="pointer-events-none absolute left-[-90px] top-[-100px] h-80 w-80 rounded-full bg-[#e8ecdf] opacity-60 blur-3xl" />

        <div className="pointer-events-none absolute bottom-[-100px] right-[-60px] h-96 w-96 rounded-full bg-[#f0e5df] opacity-60 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#e8e5dc] bg-white/80 px-4 py-2 text-xs tracking-wide text-[#77776b]"
          >
            <Sparkles size={14} className="text-[#89947a]" />
            A little space for creative exploration
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="font-editorial text-6xl font-medium leading-[1.05] tracking-tight text-[#353630] sm:text-7xl md:text-8xl"
          >
            Palette
            <br />
            <span className="italic text-[#89947a]">Atelier.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-7 text-sm leading-7 text-[#858479] sm:text-base"
          >
            Your little creative studio.
            <br />
            Explore colors, discover beautiful combinations
            <br className="hidden sm:block" />
            and bring your creative ideas to life.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            onClick={enterAtelier}
            disabled={entering}
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-[#7f896f] px-8 py-4 text-sm font-medium text-white shadow-lg shadow-[#7f896f]/15 transition-all duration-300 hover:-translate-y-1 hover:bg-[#6e795f] disabled:opacity-70"
          >
            {entering ? "Entering..." : "Enter the Atelier"}
            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-20"
          >
            <div className="flex justify-center gap-2 sm:gap-3">
              {colors.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="group"
                >
                  <div
                    className="h-14 w-12 rounded-xl shadow-sm transition-transform duration-300 group-hover:-translate-y-2 sm:h-20 sm:w-16"
                    style={{ backgroundColor: item.color }}
                  />

                  <p className="mt-2 text-[10px] text-[#858479]">
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <span className="absolute bottom-7 left-8 hidden text-[10px] tracking-[0.25em] text-[#aaa69a] md:block">
          EST. FOR CREATIVITY
        </span>

        <span className="absolute bottom-7 right-8 hidden text-[10px] tracking-[0.25em] text-[#aaa69a] md:block">
          EXPLORE · CREATE · INSPIRE
        </span>
      </section>

      <footer className="mx-auto flex max-w-7xl justify-between py-6 text-[11px] text-[#aaa69a]">
        <span>Palette Atelier</span>
        <span>Made for the love of color.</span>
      </footer>
    </motion.main>
  );
}
