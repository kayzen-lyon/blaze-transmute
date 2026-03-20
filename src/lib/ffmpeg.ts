import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

let ffmpegInstance: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;

export async function getFFmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance?.loaded) return ffmpegInstance;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const ffmpeg = new FFmpeg();

    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });

    ffmpegInstance = ffmpeg;
    return ffmpeg;
  })();

  return loadPromise;
}

export type ConversionFormat = {
  label: string;
  ext: string;
  mime: string;
  category: "image" | "audio" | "video" | "document";
};

export const FORMAT_OPTIONS: ConversionFormat[] = [
  // Images
  { label: "PNG", ext: "png", mime: "image/png", category: "image" },
  { label: "JPEG", ext: "jpg", mime: "image/jpeg", category: "image" },
  { label: "WebP", ext: "webp", mime: "image/webp", category: "image" },
  { label: "GIF", ext: "gif", mime: "image/gif", category: "image" },
  { label: "BMP", ext: "bmp", mime: "image/bmp", category: "image" },
  // Audio
  { label: "MP3", ext: "mp3", mime: "audio/mpeg", category: "audio" },
  { label: "WAV", ext: "wav", mime: "audio/wav", category: "audio" },
  { label: "AAC", ext: "aac", mime: "audio/aac", category: "audio" },
  { label: "OGG", ext: "ogg", mime: "audio/ogg", category: "audio" },
  { label: "FLAC", ext: "flac", mime: "audio/flac", category: "audio" },
  // Video
  { label: "MP4", ext: "mp4", mime: "video/mp4", category: "video" },
  { label: "WebM", ext: "webm", mime: "video/webm", category: "video" },
  { label: "AVI", ext: "avi", mime: "video/x-msvideo", category: "video" },
  { label: "MOV", ext: "mov", mime: "video/quicktime", category: "video" },
];

export function getFileCategory(file: File): "image" | "audio" | "video" | "document" {
  const type = file.type;
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("audio/")) return "audio";
  if (type.startsWith("video/")) return "video";

  // Fallback: check extension
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext && ["jpg", "jpeg", "png", "webp", "gif", "bmp", "svg", "tiff", "ico"].includes(ext)) return "image";
  if (ext && ["mp3", "wav", "ogg", "flac", "aac", "wma", "m4a"].includes(ext)) return "audio";
  if (ext && ["mp4", "webm", "avi", "mov", "mkv", "flv", "wmv"].includes(ext)) return "video";

  return "document";
}

export function getAvailableFormats(category: "image" | "audio" | "video" | "document"): ConversionFormat[] {
  return FORMAT_OPTIONS.filter((f) => f.category === category);
}

/**
 * Load an image file (including SVG) into an HTMLImageElement.
 * SVGs and other formats that createImageBitmap may not support
 * are handled via object URL + Image element.
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve(img);
      // Don't revoke yet — caller may still need the image
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Impossible de charger l'image : ${file.name}`));
    };
    img.src = url;
  });
}

export async function convertImageCanvas(
  file: File,
  targetFormat: ConversionFormat,
  onProgress?: (p: number) => void
): Promise<Blob> {
  onProgress?.(10);

  const img = await loadImage(file);
  onProgress?.(30);

  // For SVGs without intrinsic size, default to 1024
  let w = img.naturalWidth || img.width;
  let h = img.naturalHeight || img.height;
  if (w === 0 || h === 0) {
    w = 1024;
    h = 1024;
  }

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);

  // Clean up object URL
  URL.revokeObjectURL(img.src);
  onProgress?.(60);

  const quality = targetFormat.ext === "png" ? undefined : 0.92;
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Échec de la conversion Canvas"))),
      targetFormat.mime,
      quality
    );
  });
  onProgress?.(100);
  return blob;
}

export async function convertWithFFmpeg(
  file: File,
  targetFormat: ConversionFormat,
  onProgress?: (p: number) => void
): Promise<Blob> {
  onProgress?.(5);
  const ffmpeg = await getFFmpeg();
  onProgress?.(20);

  const inputExt = file.name.split(".").pop() || "bin";
  const inputName = `input.${inputExt}`;
  const outputName = `output.${targetFormat.ext}`;

  const data = new Uint8Array(await file.arrayBuffer());
  await ffmpeg.writeFile(inputName, data);
  onProgress?.(30);

  ffmpeg.on("progress", ({ progress }) => {
    onProgress?.(30 + Math.round(progress * 60));
  });

  await ffmpeg.exec(["-i", inputName, outputName]);
  onProgress?.(95);

  const result = await ffmpeg.readFile(outputName);
  await ffmpeg.deleteFile(inputName);
  await ffmpeg.deleteFile(outputName);

  onProgress?.(100);
  const resultData = result as Uint8Array;
  return new Blob([new Uint8Array(resultData.buffer as ArrayBuffer)], { type: targetFormat.mime });
}

export async function convertFile(
  file: File,
  targetFormat: ConversionFormat,
  onProgress?: (p: number) => void
): Promise<Blob> {
  const category = getFileCategory(file);

  // Use Canvas API for image conversions (faster, no wasm needed)
  if (category === "image" && ["png", "jpg", "webp", "gif", "bmp"].includes(targetFormat.ext)) {
    return convertImageCanvas(file, targetFormat, onProgress);
  }

  // Use FFmpeg.wasm for audio/video
  return convertWithFFmpeg(file, targetFormat, onProgress);
}
