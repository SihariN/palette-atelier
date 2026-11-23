
import { Sparkles } from "lucide-react";

export default function FeaturePlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e8ecdf] text-[#89947a]">
        <Sparkles size={27} />
      </div>

      <p className="mt-7 text-[10px] font-semibold tracking-[0.2em] text-[#89947a]">
        PALETTE ATELIER
      </p>

      <h1 className="font-editorial mt-3 text-5xl font-medium text-[#353630]">
        {title}
      </h1>

      <p className="mt-4 max-w-md text-sm leading-7 text-[#858479]">
        {description}
      </p>

      <span className="mt-8 rounded-full border border-[#e8e5dc] bg-[#fffefa] px-5 py-2 text-xs text-[#858479]">
        Coming soon to your creative studio
      </span>
    </div>
  );
}
