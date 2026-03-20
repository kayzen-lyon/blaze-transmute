import { useState, useMemo, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image, Music, Video, FileText, ChevronDown, X, Download,
  Loader2, Check, AlertCircle, Settings2, Eye, Archive,
} from "lucide-react";
import {
  ConversionFormat, getFileCategory, getAvailableFormats,
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

const categoryIcons = { image: Image, audio: Music, video: Video, document: FileText };
const categoryColors: Record<string, string> = {
  image: "bg-primary/10 text-primary",
  audio: "bg-accent/10 text-accent",
  video: "bg-kayzen-glow/10 text-kayzen-glow",
  document: "bg-muted text-muted-foreground",
};

// ==================== Preview thumbnail ====================

function FilePreview({ file }: { file: File }) {
  const [src, setSrc] = useState<string | null>(null);
  const category = getFileCategory(file);

  useState(() => {
    if (category === "image") {
      const url = URL.createObjectURL(file);
      setSrc(url);
    }
  });

  if (!src) return null;
  return (
    <img
      src={src}
      alt={file.name}
      className="h-12 w-12 rounded-lg object-cover border border-border/30"
      onLoad={() => {/* keep URL alive for display */}}
    />
  );
}

function ResultPreview({ result, format }: { result: Blob; format: ConversionFormat }) {
  const [src, setSrc] = useState<string | null>(null);
  useState(() => {
    if (format.category === "image") {
      setSrc(URL.createObjectURL(result));
    }
  });
  if (!src) return null;
  return (
    <img
      src={src}
      alt="Résultat"
      className="h-12 w-12 rounded-lg object-cover border-2 border-kayzen-green/30"
    />
  );
}

// ==================== File Card ====================

interface FileCardProps {
  item: ConvertibleFile;
  onRemove: (id: string) => void;
  onFormatChange: (id: string, format: ConversionFormat) => void;
  onConvert: (id: string) => void;
}

const FileCard = forwardRef<HTMLDivElement, FileCardProps>(
  ({ item, onRemove, onFormatChange, onConvert }, ref) => {
    const [showFormats, setShowFormats] = useState(false);
    const category = getFileCategory(item.file);
    const Icon = categoryIcons[category];
    const formats = getAvailableFormats(category);
    const ext = item.file.name.split(".").pop()?.toUpperCase() || "";
    const colorClass = categoryColors[category] || categoryColors.document;

    const handleDownload = () => {
      if (!item.result || !item.targetFormat) return;
      const url = URL.createObjectURL(item.result);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${item.file.name.replace(/\.[^/.]+$/, "")}.${item.targetFormat.ext}`;
      a.click();
      URL.revokeObjectURL(url);
    };

    const sizeReduction = item.result && item.targetFormat
      ? ((1 - item.result.size / item.file.size) * 100).toFixed(0)
      : null;

    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="group glass-strong relative rounded-2xl p-4 transition-shadow duration-300 hover:shadow-lg"
      >
        {/* Progress bar */}
        {item.status === "converting" && (
          <motion.div
            className="absolute inset-0 rounded-2xl bg-primary/5"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: item.progress / 100 }}
            style={{ transformOrigin: "left" }}
            transition={{ duration: 0.3 }}
          />
        )}

        <div className="relative flex items-center gap-3">
          {/* Preview or icon */}
          {item.status === "done" && item.result && item.targetFormat ? (
            <div className="flex items-center gap-2">
              <FilePreview file={item.file} />
              <span className="text-muted-foreground text-[10px]">→</span>
              <ResultPreview result={item.result} format={item.targetFormat} />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <FilePreview file={item.file} />
              {!["image"].includes(category) && (
                <div className={`flex-shrink-0 rounded-xl p-2.5 ${colorClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
              )}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">{item.file.name}</p>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
              <span>{formatSize(item.file.size)} · {ext}</span>
              {item.status === "done" && item.result && (
                <>
                  <span className="text-kayzen-green">→ {formatSize(item.result.size)}</span>
                  {sizeReduction && Number(sizeReduction) > 0 && (
                    <span className="rounded-md bg-kayzen-green/10 px-1.5 py-0.5 text-[10px] font-bold text-kayzen-green">
                      -{sizeReduction}%
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Format selector */}
          <div className="relative">
            <button
              onClick={() => setShowFormats(!showFormats)}
              disabled={item.status === "converting" || item.status === "done"}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground transition-all hover:border-primary/30 disabled:opacity-50"
            >
              {item.targetFormat?.label || "Format"}
              <ChevronDown className={`h-3 w-3 transition-transform ${showFormats ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {showFormats && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-20 mt-1 w-36 rounded-xl border border-border/40 bg-background p-1.5 shadow-xl"
                >
                  {formats
                    .filter((f) => f.ext !== item.file.name.split(".").pop()?.toLowerCase())
                    .map((f) => (
                      <button
                        key={f.ext}
                        onClick={() => { onFormatChange(item.id, f); setShowFormats(false); }}
                        className={`w-full rounded-lg px-3 py-2 text-left text-xs font-semibold transition-colors hover:bg-primary/10 hover:text-primary ${
                          item.targetFormat?.ext === f.ext ? "bg-primary/10 text-primary" : "text-foreground"
                        }`}
                      >
                        .{f.ext.toUpperCase()}
                      </button>
                    ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions */}
          {item.status === "idle" && item.targetFormat && (
            <motion.button
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={() => onConvert(item.id)}
              className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow transition-all hover:brightness-110 active:scale-95"
            >
              Convertir
            </motion.button>
          )}

          {item.status === "converting" && (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-xs font-mono font-semibold text-primary">{item.progress}%</span>
            </div>
          )}

          {item.status === "done" && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-xl bg-kayzen-green px-4 py-2 text-xs font-semibold text-accent-foreground transition-all hover:brightness-110 active:scale-95"
            >
              <Download className="h-3.5 w-3.5" />
              Télécharger
            </button>
          )}

          {item.status === "error" && (
            <div className="flex items-center gap-1.5 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="text-xs font-semibold max-w-[120px] truncate" title={item.error || ""}>{item.error || "Erreur"}</span>
            </div>
          )}

          {item.status === "done" && (
            <div className="rounded-full bg-kayzen-green/15 p-1.5">
              <Check className="h-3.5 w-3.5 text-kayzen-green" />
            </div>
          )}

          <button
            onClick={() => onRemove(item.id)}
            className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    );
  }
);
FileCard.displayName = "FileCard";

// ==================== Batch Controls ====================

function BatchFormatSelector({
  files,
  onApplyAll,
}: {
  files: ConvertibleFile[];
  onApplyAll: (format: ConversionFormat) => void;
}) {
  const [open, setOpen] = useState(false);
  const firstFile = files[0];
  if (!firstFile) return null;
  const category = getFileCategory(firstFile.file);
  const formats = getAvailableFormats(category);
  const currentExt = firstFile.file.name.split(".").pop()?.toLowerCase();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary transition-all hover:bg-primary/10 active:scale-95"
      >
        <Settings2 className="h-3.5 w-3.5" />
        Appliquer un format à tous
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-20 mt-1 w-40 rounded-xl border border-border/40 bg-background p-1.5 shadow-xl"
          >
            {formats
              .filter((f) => f.ext !== currentExt)
              .map((f) => (
                <button
                  key={f.ext}
                  onClick={() => { onApplyAll(f); setOpen(false); }}
                  className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  Tout en .{f.ext.toUpperCase()}
                </button>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== Main FileList ====================

interface FileListProps {
  files: ConvertibleFile[];
  onRemove: (id: string) => void;
  onFormatChange: (id: string, format: ConversionFormat) => void;
  onConvert: (id: string) => void;
  onConvertAll: () => void;
}

export const FileList = forwardRef<HTMLDivElement, FileListProps>(
  ({ files, onRemove, onFormatChange, onConvert, onConvertAll }, ref) => {
    const allHaveFormat = files.every((f) => f.targetFormat !== null);
    const hasIdle = files.some((f) => f.status === "idle" && f.targetFormat);
    const allDone = files.length > 0 && files.every((f) => f.status === "done");
    const doneCount = files.filter((f) => f.status === "done").length;

    const totalOriginal = files.reduce((s, f) => s + f.file.size, 0);
    const totalConverted = files.filter((f) => f.result).reduce((s, f) => s + (f.result?.size || 0), 0);

    const handleApplyAll = (format: ConversionFormat) => {
      files.forEach((f) => {
        if (f.status === "idle") onFormatChange(f.id, format);
      });
    };

    const handleDownloadAllZip = async () => {
      const doneFiles = files.filter((f) => f.result && f.targetFormat);
      if (doneFiles.length === 0) return;
      if (doneFiles.length === 1) {
        const item = doneFiles[0];
        const url = URL.createObjectURL(item.result!);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${item.file.name.replace(/\.[^/.]+$/, "")}.${item.targetFormat!.ext}`;
        a.click();
        URL.revokeObjectURL(url);
        return;
      }
      // Multiple → ZIP
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      for (const item of doneFiles) {
        const baseName = item.file.name.replace(/\.[^/.]+$/, "");
        zip.file(`${baseName}.${item.targetFormat!.ext}`, item.result!);
      }
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "docusur-conversion.zip";
      a.click();
      URL.revokeObjectURL(url);
    };

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-3"
      >
        {/* Batch toolbar */}
        {files.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <p className="text-sm font-semibold text-foreground">
                {files.length} fichier{files.length > 1 ? "s" : ""}
              </p>
              {doneCount > 0 && (
                <span className="rounded-md bg-kayzen-green/10 px-2 py-0.5 text-[11px] font-bold text-kayzen-green">
                  {doneCount}/{files.length} terminé{doneCount > 1 ? "s" : ""}
                </span>
              )}
              {allDone && totalConverted > 0 && (
                <span className="text-[11px] text-muted-foreground">
                  {formatSize(totalOriginal)} → {formatSize(totalConverted)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!allDone && <BatchFormatSelector files={files} onApplyAll={handleApplyAll} />}

              {hasIdle && allHaveFormat && (
                <button
                  onClick={onConvertAll}
                  className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-glow transition-all hover:brightness-110 active:scale-95"
                >
                  Tout convertir
                </button>
              )}

              {allDone && (
                <button
                  onClick={handleDownloadAllZip}
                  className="flex items-center gap-2 rounded-xl bg-kayzen-green px-5 py-2.5 text-xs font-semibold text-accent-foreground transition-all hover:brightness-110 active:scale-95"
                >
                  <Archive className="h-4 w-4" />
                  Télécharger en ZIP
                </button>
              )}
            </div>
          </motion.div>
        )}

        <div className="space-y-2.5">
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
);
FileList.displayName = "FileList";
