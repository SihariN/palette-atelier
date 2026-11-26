
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Canvas as FabricCanvas, FabricObject } from "fabric";
import {
  Circle,
  MousePointer2,
  RectangleHorizontal,
  Type,
  Trash2,
  Layers3,
  Sparkles,
  Plus,
  Eye,
  EyeOff,
  ImagePlus,
  Heading1,
  Heading2,
  AlignLeft,
  ArrowUpToLine,
  ArrowUp,
  ArrowDown,
  ArrowDownToLine,
} from "lucide-react";
import PropertiesPanel from "./PropertiesPanel";
import CanvasContextToolbar from "./CanvasContextToolbar";
import StickerLibrary from "./stickers/StickerLibrary";
import type { StickerItem } from "./stickers/stickerData";

const CANVAS_WIDTH = 760;
const CANVAS_HEIGHT = 540;
const CANVAS_BACKGROUND = "#FFFEFA";

type LayerItem = {
  id: string;
  object: FabricObject;
  name: string;
  type: string;
  visible: boolean;
};

type TextPreset = "heading" | "subtitle" | "body";

type ContextMenuState = {
  object: FabricObject;
  x: number;
  y: number;
};

function ToolButton({
  onClick,
  children,
  disabled = false,
}: {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#65665B] transition hover:bg-[#E8ECDF] hover:text-[#536148] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function LayerAction({
  onClick,
  title,
  disabled = false,
  children,
}: {
  onClick: () => void;
  title: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#858579] transition hover:bg-white hover:text-[#536148] disabled:cursor-not-allowed disabled:opacity-25"
    >
      {children}
    </button>
  );
}

function getLayerType(object: FabricObject) {
  const type = String(object.type).toLowerCase();

  if (type.includes("text")) return "Text";
  if (type === "rect") return "Rectangle";
  if (type === "circle") return "Circle";
  if (object.get("isSticker")) return "Sticker";
  if (type === "image") return "Image";

  return "Element";
}

function getLayerIcon(type: string) {
  switch (type) {
    case "Text":
      return <Type size={15} />;
    case "Rectangle":
      return <RectangleHorizontal size={15} />;
    case "Circle":
      return <Circle size={15} />;
    case "Image":
      return <ImagePlus size={15} />;
    case "Sticker":
      return <Sparkles size={15} />;
    default:
      return <Sparkles size={15} />;
  }
}

export default function CanvasWorkspace() {
  const elementRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRef = useRef<FabricCanvas | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

  const layerMetadata = useRef(
    new Map<FabricObject, { id: string; name: string }>()
  );

  const layerCounter = useRef(0);
  const typeCounters = useRef<Record<string, number>>({});

  const [ready, setReady] = useState(false);
  const [hasSelection, setHasSelection] = useState(false);
  const [layers, setLayers] = useState<LayerItem[]>([]);
  const [selectedObject, setSelectedObject] =
    useState<FabricObject | null>(null);
  const [contextMenu, setContextMenu] =
    useState<ContextMenuState | null>(null);

  const registerLayer = useCallback((object: FabricObject) => {
    if (layerMetadata.current.has(object)) return;

    const type = getLayerType(object);
    const nextNumber = (typeCounters.current[type] ?? 0) + 1;

    typeCounters.current[type] = nextNumber;
    layerCounter.current += 1;

    layerMetadata.current.set(object, {
      id: `layer-${layerCounter.current}`,
      name: `${type} ${nextNumber}`,
    });
  }, []);

  const syncLayers = useCallback(
    (canvas: FabricCanvas) => {
      const nextLayers = [...canvas.getObjects()]
        .reverse()
        .map((object) => {
          registerLayer(object);

          const metadata = layerMetadata.current.get(object)!;

          return {
            id: metadata.id,
            object,
            name: metadata.name,
            type: getLayerType(object),
            visible: object.visible !== false,
          };
        });

      setLayers(nextLayers);
    },
    [registerLayer]
  );

  // Initialize Fabric canvas and right-click interaction.
  useEffect(() => {
    let cancelled = false;
    let instance: FabricCanvas | null = null;

    let upperCanvas: HTMLCanvasElement | null = null;
    let handleContextMenu: ((event: MouseEvent) => void) | null = null;

    async function initializeCanvas() {
      const element = elementRef.current;
      if (!element) return;

      const { Canvas } = await import("fabric");

      if (cancelled) return;

      instance = new Canvas(element, {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        backgroundColor: CANVAS_BACKGROUND,
        selection: true,
        preserveObjectStacking: true,
      });

      canvasRef.current = instance;

      const updateSelection = () => {
        const activeObject = instance?.getActiveObject() ?? null;

        setSelectedObject(activeObject);
        setHasSelection(activeObject !== null);

        if (instance) syncLayers(instance);
      };

      instance.on("selection:created", updateSelection);
      instance.on("selection:updated", updateSelection);
      instance.on("selection:cleared", updateSelection);

      instance.on("object:added", () => {
        if (instance) syncLayers(instance);
      });

      instance.on("object:removed", (event) => {
        if (event.target) {
          layerMetadata.current.delete(event.target);
        }

        if (instance) syncLayers(instance);
      });

      // Attach the native right-click listener to Fabric's upper canvas.
      upperCanvas = instance.upperCanvasEl;

      handleContextMenu = (event: MouseEvent) => {
        event.preventDefault();

        if (!instance) return;

        // Fabric 7 returns target information.
        // The actual Fabric object is stored in its target property.
        const targetInfo = instance.findTarget(event);
        const target = targetInfo?.target ?? null;

        if (!target) {
          setContextMenu(null);
          return;
        }

        // Select the actual object that was right-clicked.
        instance.setActiveObject(target);
        instance.requestRenderAll();

        const bounds =
          canvasContainerRef.current?.getBoundingClientRect();

        if (!bounds) return;

        const toolbarWidth = 420;
        const toolbarHeight = 60;

        const x = Math.max(
          8,
          Math.min(
            event.clientX - bounds.left + 12,
            bounds.width - toolbarWidth - 8
          )
        );

        const y = Math.max(
          8,
          Math.min(
            event.clientY - bounds.top + 12,
            bounds.height - toolbarHeight - 8
          )
        );

        setContextMenu({
          object: target,
          x,
          y,
        });
      };

      upperCanvas.addEventListener("contextmenu", handleContextMenu);

      syncLayers(instance);
      setReady(true);
    }

    initializeCanvas().catch((error) => {
      console.error("Unable to initialize the canvas:", error);
    });

    return () => {
      cancelled = true;
      canvasRef.current = null;

      if (upperCanvas && handleContextMenu) {
        upperCanvas.removeEventListener(
          "contextmenu",
          handleContextMenu
        );
      }

      if (instance) {
        void instance.dispose();
      }
    };
  }, [syncLayers]);

  // Add text in the centre of the canvas.
  async function handleAddText(preset: TextPreset = "body") {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { IText } = await import("fabric");

    const settings = {
      heading: {
        text: "Your Heading",
        fontFamily: "Cormorant Garamond",
        fontSize: 64,
        fontWeight: "bold" as const,
        fontStyle: "normal" as const,
        charSpacing: 0,
        lineHeight: 1.05,
        fill: "#353630",
      },
      subtitle: {
        text: "Your Subtitle",
        fontFamily: "DM Sans",
        fontSize: 30,
        fontWeight: "normal" as const,
        fontStyle: "normal" as const,
        charSpacing: 30,
        lineHeight: 1.2,
        fill: "#536148",
      },
      body: {
        text: "Start writing here...",
        fontFamily: "DM Sans",
        fontSize: 20,
        fontWeight: "normal" as const,
        fontStyle: "normal" as const,
        charSpacing: 0,
        lineHeight: 1.4,
        fill: "#55564D",
      },
    }[preset];

    const text = new IText(settings.text, {
      ...settings,
      left: CANVAS_WIDTH / 2,
      top: CANVAS_HEIGHT / 2,
      originX: "center",
      originY: "center",
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.requestRenderAll();
  }

  // Add rectangle in the centre of the canvas.
  async function handleAddRectangle() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { Rect } = await import("fabric");

    const rectangle = new Rect({
      left: CANVAS_WIDTH / 2,
      top: CANVAS_HEIGHT / 2,
      originX: "center",
      originY: "center",
      width: 180,
      height: 120,
      fill: "#E8ECDF",
      stroke: "#89947A",
      strokeWidth: 1,
      rx: 12,
      ry: 12,
    });

    canvas.add(rectangle);
    canvas.setActiveObject(rectangle);
    canvas.requestRenderAll();
  }

  // Add circle in the centre of the canvas.
  async function handleAddCircle() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { Circle } = await import("fabric");

    const circle = new Circle({
      left: CANVAS_WIDTH / 2,
      top: CANVAS_HEIGHT / 2,
      originX: "center",
      originY: "center",
      radius: 65,
      fill: "#F0DDD9",
      stroke: "#D5AAA3",
      strokeWidth: 1,
    });

    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.requestRenderAll();
  }

  function openImagePicker() {
    imageInputRef.current?.click();
  }

  // Add a vector sticker to the centre of the canvas.
  async function handleStickerSelect(sticker: StickerItem) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let objectUrl: string | null = null;

    try {
      const { FabricImage } = await import("fabric");

      // Give the SVG explicit dimensions so the browser can determine
      // its intrinsic size reliably.
      const svgWithDimensions = sticker.svg.replace(
        "<svg ",
        '<svg width="120" height="120" '
      );

      const svgBlob = new Blob([svgWithDimensions], {
        type: "image/svg+xml;charset=utf-8",
      });

      objectUrl = URL.createObjectURL(svgBlob);

      const image = await FabricImage.fromURL(objectUrl);
      image.set("isSticker", true);

      const maxSize = 140;

      const scale = Math.min(
        maxSize / image.width!,
        maxSize / image.height!,
        1
      );

      image.set({
        left: CANVAS_WIDTH / 2,
        top: CANVAS_HEIGHT / 2,
        originX: "center",
        originY: "center",
        scaleX: scale,
        scaleY: scale,
        cornerStyle: "circle",
        transparentCorners: false,
      });

      canvas.add(image);
      canvas.setActiveObject(image);
      canvas.requestRenderAll();

      // Rename the layer to the sticker's actual name.
      const metadata = layerMetadata.current.get(image);

      if (metadata) {
        metadata.name = sticker.name;
      }

      syncLayers(canvas);
    } catch (error) {
      console.error("Unable to add sticker:", error);
      alert("Something went wrong while adding the sticker.");
    } finally {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    }
  }

  // Upload and centre an image.
  async function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PNG, JPG or WebP image.");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const imageUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result);
          } else {
            reject(new Error("Unable to read the image."));
          }
        };

        reader.onerror = () => reject(new Error("Image upload failed."));
        reader.readAsDataURL(file);
      });

      const { FabricImage } = await import("fabric");
      const image = await FabricImage.fromURL(imageUrl);

      const scale = Math.min(
        CANVAS_WIDTH / image.width!,
        CANVAS_HEIGHT / image.height!,
        1
      );

      image.set({
        left: (CANVAS_WIDTH - image.width! * scale) / 2,
        top: (CANVAS_HEIGHT - image.height! * scale) / 2,
        scaleX: scale,
        scaleY: scale,
        cornerStyle: "circle",
        transparentCorners: false,
      });

      canvas.add(image);
      canvas.setActiveObject(image);
      canvas.requestRenderAll();
    } catch (error) {
      console.error("Unable to upload image:", error);
      alert("Something went wrong while uploading the image.");
    }
  }

  function selectLayer(object: FabricObject) {
    const canvas = canvasRef.current;
    if (!canvas || object.visible === false) return;

    canvas.setActiveObject(object);
    canvas.requestRenderAll();
  }

  function renameLayer(object: FabricObject, name: string) {
    const metadata = layerMetadata.current.get(object);
    if (!metadata) return;

    metadata.name = name;

    const canvas = canvasRef.current;
    if (canvas) syncLayers(canvas);
  }

  function toggleLayerVisibility(object: FabricObject) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const nextVisible = object.visible === false;

    if (!nextVisible && canvas.getActiveObject() === object) {
      canvas.discardActiveObject();
    }

    object.set("visible", nextVisible);
    canvas.requestRenderAll();
    syncLayers(canvas);
  }

  function deleteLayer(object: FabricObject) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (canvas.getActiveObject() === object) {
      canvas.discardActiveObject();
    }

    if (contextMenu?.object === object) {
      setContextMenu(null);
    }

    canvas.remove(object);
    canvas.requestRenderAll();
    syncLayers(canvas);
  }

  // Move a layer to the front.
  function bringToFront(object: FabricObject) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.bringObjectToFront(object);
    canvas.requestRenderAll();
    syncLayers(canvas);
  }

  // Move a layer one position forward.
  function bringForward(object: FabricObject) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.bringObjectForward(object);
    canvas.requestRenderAll();
    syncLayers(canvas);
  }

  // Move a layer one position backward.
  function sendBackward(object: FabricObject) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.sendObjectBackwards(object);
    canvas.requestRenderAll();
    syncLayers(canvas);
  }

  // Move a layer behind every other object.
  function sendToBack(object: FabricObject) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.sendObjectToBack(object);
    canvas.requestRenderAll();
    syncLayers(canvas);
  }

  function handleDelete() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const selectedObjects = canvas.getActiveObjects();
    if (selectedObjects.length === 0) return;

    selectedObjects.forEach((object) => canvas.remove(object));

    canvas.discardActiveObject();
    canvas.requestRenderAll();

    setHasSelection(false);
    setSelectedObject(null);
    setContextMenu(null);
    syncLayers(canvas);
  }

  function handleClear() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.discardActiveObject();
    canvas.remove(...canvas.getObjects());
    canvas.backgroundColor = CANVAS_BACKGROUND;
    canvas.requestRenderAll();

    setHasSelection(false);
    setSelectedObject(null);
    setContextMenu(null);
    setLayers([]);
  }

  return (
    <div
      className="space-y-5"
      onClick={() => setContextMenu(null)}
    >
      <input
        ref={imageInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E8E5DC] bg-[#FFFEFA] p-3 soft-shadow">
        <div className="flex flex-wrap items-center gap-1">
          <ToolButton
            onClick={() => {
              const instance = canvasRef.current;
              if (!instance) return;

              instance.selection = true;
              instance.defaultCursor = "default";
              instance.hoverCursor = "move";
              instance.requestRenderAll();
            }}
          >
            <MousePointer2 size={17} />
            Select
          </ToolButton>

          <div className="mx-1 h-6 w-px bg-[#E8E5DC]" />

          <ToolButton onClick={() => handleAddText("heading")}>
            <Heading1 size={17} />
            Heading
          </ToolButton>

          <ToolButton onClick={() => handleAddText("subtitle")}>
            <Heading2 size={17} />
            Subtitle
          </ToolButton>

          <ToolButton onClick={() => handleAddText("body")}>
            <AlignLeft size={17} />
            Body
          </ToolButton>

          <div className="mx-1 h-6 w-px bg-[#E8E5DC]" />

          <ToolButton onClick={handleAddRectangle}>
            <RectangleHorizontal size={17} />
            Rectangle
          </ToolButton>

          <ToolButton onClick={handleAddCircle}>
            <Circle size={17} />
            Circle
          </ToolButton>

          <ToolButton onClick={openImagePicker}>
            <ImagePlus size={17} />
            Image
          </ToolButton>
        </div>

        <div className="flex items-center gap-1">
          <ToolButton onClick={handleDelete} disabled={!hasSelection}>
            <Trash2 size={17} />
            Delete
          </ToolButton>

          <ToolButton onClick={handleClear} disabled={layers.length === 0}>
            <Trash2 size={17} />
            Clear
          </ToolButton>
        </div>
      </div>

      {/* Workspace */}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0 overflow-hidden rounded-2xl border border-[#E8E5DC] bg-[#F0EEE7] soft-shadow">
          <div className="flex items-center justify-between border-b border-[#E4E1D8] bg-[#FFFEFA] px-5 py-3">
            <div>
              <p className="text-sm font-semibold text-[#45483F]">
                Untitled Design
              </p>
              <p className="mt-0.5 text-xs text-[#929083]">
                {CANVAS_WIDTH} × {CANVAS_HEIGHT} px
              </p>
            </div>

            <span className="rounded-full bg-[#E8ECDF] px-3 py-1 text-xs font-medium text-[#657257]">
              {ready ? "Canvas ready" : "Loading canvas..."}
            </span>
          </div>

          <div className="studio-grid overflow-auto p-5 sm:p-8">
            <div
              ref={canvasContainerRef}
              className="relative mx-auto w-fit rounded-sm bg-white shadow-[0_8px_35px_rgba(65,59,47,0.12)]"
            >
              <canvas ref={elementRef} />

              {contextMenu && (
                <CanvasContextToolbar
                  object={contextMenu.object}
                  x={contextMenu.x}
                  y={contextMenu.y}
                  onClose={() => setContextMenu(null)}
                  onBringToFront={() => bringToFront(contextMenu.object)}
                  onBringForward={() => bringForward(contextMenu.object)}
                  onSendBackward={() => sendBackward(contextMenu.object)}
                  onSendToBack={() => sendToBack(contextMenu.object)}
                  onDelete={() => {
                    const canvas = canvasRef.current;
                    if (!canvas) return;

                    canvas.remove(contextMenu.object);
                    canvas.discardActiveObject();
                    canvas.requestRenderAll();

                    setHasSelection(false);
                    setSelectedObject(null);
                    setContextMenu(null);
                    syncLayers(canvas);
                  }}                  
                  onChange={() => {
                    const canvas = canvasRef.current;

                    if (canvas) {
                      canvas.requestRenderAll();
                      syncLayers(canvas);
                    }
                  }}
                />
              )}
            </div>

            {layers.length === 0 && ready && (
              <div className="mx-auto mt-6 flex max-w-md flex-col items-center text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E8ECDF] text-[#89947A]">
                  <Sparkles size={20} strokeWidth={1.6} />
                </div>

                <h3 className="mt-3 font-editorial text-2xl text-[#536148]">
                  Your canvas is waiting.
                </h3>

                <p className="mt-1 text-xs leading-6 text-[#929083]">
                  Start with text, shapes or images. Create something
                  beautiful, one element at a time.
                </p>

                <button
                  type="button"
                  onClick={() => handleAddText("heading")}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#89947A] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#737F65]"
                >
                  <Plus size={15} />
                  Add your first element
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E4E1D8] bg-[#FFFEFA] px-5 py-3">
            <p className="text-xs text-[#929083]">
              Select an object to move or resize it. Double-click text to edit.
              Right-click an object for quick actions.
            </p>

            <p className="text-xs font-medium text-[#858579]">
              {layers.length} {layers.length === 1 ? "element" : "elements"}
              {hasSelection ? " · Object selected" : ""}
            </p>
          </div>
        </div>

        {/* Properties, Stickers and Layers */}
        <aside className="space-y-4">
          <StickerLibrary onStickerSelect={handleStickerSelect} />

          <PropertiesPanel
            selectedObject={selectedObject}
            onChange={() => {
              const canvas = canvasRef.current;

              if (canvas) {
                canvas.requestRenderAll();
                syncLayers(canvas);
              }
            }}
            onDelete={() => {
              if (selectedObject) {
                deleteLayer(selectedObject);
              }
            }}
          />

          <div className="rounded-2xl border border-[#E8E5DC] bg-[#FFFEFA] p-5 soft-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers3 size={17} className="text-[#89947A]" />
                <h2 className="text-sm font-semibold text-[#45483F]">
                  Layers
                </h2>
              </div>

              <span className="rounded-full bg-[#F0EEE7] px-2 py-1 text-[10px] font-medium text-[#858579]">
                {layers.length}
              </span>
            </div>

            {layers.length === 0 ? (
              <p className="mt-4 text-xs leading-6 text-[#929083]">
                Your design is empty. Add an element to start building your
                composition.
              </p>
            ) : (
              <div className="mt-4 space-y-2">
                {layers.map((layer, index) => {
                  const isSelected = selectedObject === layer.object;
                  const isTop = index === 0;
                  const isBottom = index === layers.length - 1;

                  return (
                    <div
                      key={layer.id}
                      className={`rounded-xl border p-2 transition ${
                        isSelected
                          ? "border-[#C8D0BB] bg-[#E8ECDF]"
                          : "border-transparent bg-[#F8F7F2] hover:border-[#E8E5DC]"
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => selectLayer(layer.object)}
                          disabled={!layer.visible}
                          title={`Select ${layer.name}`}
                          className="flex h-8 w-7 shrink-0 items-center justify-center text-[#89947A] disabled:opacity-40"
                        >
                          {getLayerIcon(layer.type)}
                        </button>

                        <input
                          aria-label={`Rename ${layer.name}`}
                          value={layer.name}
                          onChange={(event) =>
                            renameLayer(layer.object, event.target.value)
                          }
                          className="min-w-0 flex-1 bg-transparent text-xs font-medium text-[#55574D] outline-none"
                        />

                        <button
                          type="button"
                          onClick={() => toggleLayerVisibility(layer.object)}
                          title={layer.visible ? "Hide layer" : "Show layer"}
                          className="flex h-8 w-7 shrink-0 items-center justify-center rounded-lg text-[#929083] transition hover:bg-white hover:text-[#536148]"
                        >
                          {layer.visible ? (
                            <Eye size={15} />
                          ) : (
                            <EyeOff size={15} />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteLayer(layer.object)}
                          title="Delete layer"
                          className="flex h-8 w-7 shrink-0 items-center justify-center rounded-lg text-[#B48C84] transition hover:bg-[#F0DDD9]"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="mt-1 flex items-center justify-end gap-1 border-t border-[#E8E5DC]/70 pt-1">
                        <span className="mr-auto text-[10px] text-[#A09E91]">
                          {isTop
                            ? "Top layer"
                            : isBottom
                              ? "Bottom layer"
                              : "Arrange"}
                        </span>

                        <LayerAction
                          onClick={() => bringToFront(layer.object)}
                          title="Bring to front"
                          disabled={isTop}
                        >
                          <ArrowUpToLine size={14} />
                        </LayerAction>

                        <LayerAction
                          onClick={() => bringForward(layer.object)}
                          title="Bring forward"
                          disabled={isTop}
                        >
                          <ArrowUp size={14} />
                        </LayerAction>

                        <LayerAction
                          onClick={() => sendBackward(layer.object)}
                          title="Send backward"
                          disabled={isBottom}
                        >
                          <ArrowDown size={14} />
                        </LayerAction>

                        <LayerAction
                          onClick={() => sendToBack(layer.object)}
                          title="Send to back"
                          disabled={isBottom}
                        >
                          <ArrowDownToLine size={14} />
                        </LayerAction>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <p className="mt-3 text-[10px] leading-5 text-[#929083]">
              Layers are listed from front to back. Use the arrows to rearrange
              your design.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E8E5DC] bg-[#FFFEFA] p-5 soft-shadow">
            <div className="flex items-center gap-2">
              <Sparkles size={17} className="text-[#D5AAA3]" />
              <h2 className="text-sm font-semibold text-[#45483F]">
                Getting started
              </h2>
            </div>

            <ul className="mt-3 space-y-3 text-xs leading-5 text-[#858579]">
              <li>• Add headings, subtitles and body text.</li>
              <li>• Add shapes to build your composition.</li>
              <li>• Select layers to edit individual elements.</li>
              <li>• Hide layers without deleting them.</li>
              <li>• Rename and rearrange layers.</li>
              <li>• Right-click elements for quick editing.</li>
              <li>• Add decorative stickers from the Sticker Library.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
