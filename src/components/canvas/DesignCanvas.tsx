
"use client";

import { useEffect, useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";

type DesignCanvasProps = {
  width?: number;
  height?: number;
  backgroundColor?: string;
};

export default function DesignCanvas({
  width = 720,
  height = 480,
  backgroundColor = "#FFFEFA",
}: DesignCanvasProps) {
  const canvasElementRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);

  useEffect(() => {
    const element = canvasElementRef.current;

    if (!element) return;

    const canvas = new FabricCanvas(element, {
      width,
      height,
      backgroundColor,
      selection: true,
      preserveObjectStacking: true,
      backgroundVpt: false,
    });

    fabricCanvasRef.current = canvas;

    canvas.renderAll();

    return () => {
      fabricCanvasRef.current = null;
      void canvas.dispose();
    };
  }, [width, height, backgroundColor]);

  return (
    <div className="w-full overflow-auto rounded-xl">
      <div
        className="mx-auto w-fit rounded-sm bg-white shadow-[0_8px_35px_rgba(50,45,35,0.10)]"
        style={{ maxWidth: "100%" }}
      >
        <canvas ref={canvasElementRef} />
      </div>
    </div>
  );
}
