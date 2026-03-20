import { useState } from "react";
import { motion } from "framer-motion";
import {
  Image,
  Music,
  Video,
  FileText,
  ChevronDown,
  X,
  Download,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  ConversionFormat,
  getFileCategory,
  getAvailableFormats,
  convertFile,
} from "@/lib/ffmpeg";

export type FileStatus = "idle" | "converting" | "done" | "error";

export interface ConvertibleFile {
  id: string;
  file: File;
  status: FileStatus;
  progress: number;
  targetFormat: ConversionFormat | null;
  result: Blob | null;
  error: string | null;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const categoryIcons = {
  image: Image,
  audio: Music,
  video: Video,
  document: FileText,
};

interface FileCardProps {
  item: ConvertibleFile;
  onRemove: (id: string) => void;
  onFormatChange: (id: string, format: ConversionFormat) => void;
  onConvert: (id: string) => void;
}

function FileCard({ item, onRemove, onFormatChange, onConvert }: FileCardProps) {
  const [showFormats, setShowFormats] = useState(false);
  const category = getFileCategory(item.file);
  const Icon = categoryIcons[category];
  const formats = getAvailableFormats(category);
  const ext = item.file.name.split(".").pop()?.toUpperCase() || "";

  const handleDownload = () => {
    if (!item.result || !item.targetFormat) return;
    const url = URL.createObjectURL(item.result);
    const a = document.createElement("a");
    const baseName = item.file.name.replace(/\.[^/.]+$/, "");
    a.href = url;
    a.download = `${baseName}.${item.targetFormat.ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-xl bg-surface-elevated border border-border p-4 transition-shadow duration-300 hover:shadow-md"
    >
      {/* Progress bar background */}
      {item.status === "converting" && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-primary/5"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: item.progress / 100 }}
          style={{ transformOrigin: "left" }}
          transition={{ duration: 0.3 }}
        />
      )}

      <div className="relative flex items-center gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 rounded-lg bg-muted p-2.5">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>

        {/* File info */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">
            {item.file.name}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {formatSize(item.file.size)} · {ext}
          </p>
        </div>

        {/* Format selector */}
        <div className="relative">
          <button
            onClick={() => setShowFormats(!showFormats)}
            disabled={item.status === "converting" || item.status === "done"}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
          >
            {item.targetFormat?.label || "Format"}
            <ChevronDown className="h-3 w-3" />
          </button>

          {showFormats && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-full z-20 mt-1 w-32 rounded-lg border border-border bg-surface-elevated p-1 shadow-lg"
            >
              {formats.map((f) => (
                <button
                  key={f.ext}
                  onClick={() => {
                    onFormatChange(item.id, f);
                    setShowFormats(false);
                  }}
                  className="w-full rounded-md px-3 py-1.5 text-left text-xs font-medium text-foreground transition-colors hover:bg-muted"
                >
                  {f.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Action button */}
        {item.status === "idle" && item.targetFormat && (
          <button
            onClick={() => onConvert(item.id)}
            className="rounded-lg bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground transition-transform active:scale-95"
          >
            Convertir
          </button>
        )}

        {item.status === "converting" && (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-xs font-mono text-muted-foreground">
              {item.progress}%
            </span>
          </div>
        )}

        {item.status === "done" && (
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground transition-transform active:scale-95"
          >
            <Download className="h-3.5 w-3.5" />
            Télécharger
          </button>
        )}

        {item.status === "error" && (
          <div className="flex items-center gap-1.5 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="text-xs">Erreur</span>
          </div>
        )}

        {/* Status indicator */}
        {item.status === "done" && (
          <div className="rounded-full bg-primary/10 p-1">
            <Check className="h-3.5 w-3.5 text-primary" />
          </div>
        )}

        {/* Remove */}
        <button
          onClick={() => onRemove(item.id)}
          className="rounded-md p-1 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}

interface FileListProps {
  files: ConvertibleFile[];
  onRemove: (id: string) => void;
  onFormatChange: (id: string, format: ConversionFormat) => void;
  onConvert: (id: string) => void;
  onConvertAll: () => void;
}

export function FileList({ files, onRemove, onFormatChange, onConvert, onConvertAll }: FileListProps) {
  const allHaveFormat = files.every((f) => f.targetFormat !== null);
  const hasIdle = files.some((f) => f.status === "idle" && f.targetFormat);
  const allDone = files.length > 0 && files.every((f) => f.status === "done");

  const handleDownloadAll = () => {
    files.forEach((item) => {
      if (item.result && item.targetFormat) {
        const url = URL.createObjectURL(item.result);
        const a = document.createElement("a");
        const baseName = item.file.name.replace(/\.[^/.]+$/, "");
        a.href = url;
        a.download = `${baseName}.${item.targetFormat.ext}`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="space-y-3"
    >
      {/* Batch actions */}
      {files.length > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-muted-foreground">
            {files.length} fichier{files.length > 1 ? "s" : ""}
          </p>
          <div className="flex gap-2">
            {hasIdle && allHaveFormat && (
              <button
                onClick={onConvertAll}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform active:scale-95"
              >
                Tout convertir
              </button>
            )}
            {allDone && (
              <button
                onClick={handleDownloadAll}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform active:scale-95"
              >
                <Download className="h-4 w-4" />
                Tout télécharger
              </button>
            )}
          </div>
        </div>
      )}

      {/* File cards */}
      <div className="space-y-2">
        {files.map((item) => (
          <FileCard
            key={item.id}
            item={item}
            onRemove={onRemove}
            onFormatChange={onFormatChange}
            onConvert={onConvert}
          />
        ))}
      </div>
    </motion.div>
  );
}
