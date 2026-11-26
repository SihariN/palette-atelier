import CanvasWorkspace from "@/components/canvas/CanvasWorkspace";

export default function CanvasPage() {
  return (
    <div className="mx-auto max-w-[1500px] space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#929083]">
          Creative workspace
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#3F5147]">
          Canvas Editor
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#858579]">
          Bring your ideas to life. Create posters, moodboards and beautiful
          visual compositions using your own colours and creative elements.
        </p>
      </div>

      <CanvasWorkspace />
    </div>
  );
}
