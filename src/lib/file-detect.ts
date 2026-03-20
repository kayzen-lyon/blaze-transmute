export type FileMode = "pdf" | "image" | "media" | "document" | null;

interface DetectionResult {
  mode: FileMode;
  label: string;
  badge: string;
  emoji: string;
}

const MIME_MAP: Record<string, FileMode> = {
  "application/pdf": "pdf",
  "image/jpeg": "image",
  "image/png": "image",
  "image/webp": "image",
  "image/gif": "image",
  "image/bmp": "image",
  "image/svg+xml": "image",
  "video/mp4": "media",
  "video/webm": "media",
  "video/quicktime": "media",
  "video/x-msvideo": "media",
  "audio/mpeg": "media",
  "audio/wav": "media",
  "audio/ogg": "media",
  "audio/flac": "media",
  "audio/aac": "media",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "document",
  "application/msword": "document",
  "application/vnd.ms-excel": "document",
};

const EXT_MAP: Record<string, FileMode> = {
  pdf: "pdf",
  jpg: "image", jpeg: "image", png: "image", webp: "image", gif: "image", bmp: "image", svg: "image",
  mp4: "media", webm: "media", avi: "media", mov: "media", mkv: "media",
  mp3: "media", wav: "media", ogg: "media", flac: "media", aac: "media",
  docx: "document", xlsx: "document", doc: "document", xls: "document",
};

export function detectFileMode(file: File): FileMode {
  // Try MIME type first
  if (file.type && MIME_MAP[file.type]) return MIME_MAP[file.type];
  // Fallback to extension
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext && EXT_MAP[ext]) return EXT_MAP[ext];
  return null;
}

export function detectFilesMode(files: File[]): FileMode {
  if (files.length === 0) return null;
  const modes = files.map(detectFileMode);
  // If all same mode, return it; otherwise pick dominant
  const counts: Record<string, number> = {};
  for (const m of modes) {
    if (m) counts[m] = (counts[m] || 0) + 1;
  }
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return (sorted[0]?.[0] as FileMode) ?? null;
}

export function getModeInfo(mode: FileMode): DetectionResult {
  switch (mode) {
    case "pdf":
      return { mode, label: "Mode PDF Sécurisé", badge: "Docusûr Inside", emoji: "📄" };
    case "image":
      return { mode, label: "Mode Image", badge: "Conversion Locale", emoji: "🖼️" };
    case "media":
      return { mode, label: "Mode Média Rapide", badge: "FFmpeg.wasm", emoji: "🎬" };
    case "document":
      return { mode, label: "Mode Document", badge: "Conversion PDF", emoji: "📋" };
    default:
      return { mode: null, label: "Déposez vos fichiers", badge: "", emoji: "📁" };
  }
}
