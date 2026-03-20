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
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("audio/")) return "audio";
  if (file.type.startsWith("video/")) return "video";
  return "document";
}

export function getAvailableFormats(category: "image" | "audio" | "video" | "document"): ConversionFormat[] {
  return FORMAT_OPTIONS.filter((f) => f.category === category);
}

export async function convertImageCanvas(
  file: File,
  targetFormat: ConversionFormat,
  onProgress?: (p: number) => void
): Promise<Blob> {
  onProgress?.(10);
  const bitmap = await createImageBitmap(file);
  onProgress?.(30);

  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  onProgress?.(60);

  const quality = targetFormat.ext === "png" ? undefined : 0.92;
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Canvas conversion failed"))),
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

  const inputName = `input.${file.name.split(".").pop()}`;
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
  const buf = (result as Uint8Array).buffer;
  return new Blob([new Uint8Array(buf instanceof ArrayBuffer ? buf : new ArrayBuffer(0))], { type: targetFormat.mime });
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
