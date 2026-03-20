import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileIcon, Zap, ArrowLeft, Trash2, Info } from "lucide-react";
import type { Tool } from "@/components/ToolGrid";
import type { FileMode } from "@/lib/file-detect";
import { getModeInfo } from "@/lib/file-detect";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DropZoneProps {
  onFilesAdded: (files: File[]) => void;
  activeTool?: Tool | null;
  onBack?: () => void;
  onClearAll?: () => void;
  compact?: boolean;
  detectedMode?: FileMode;
  hasFiles?: boolean;
}

export function DropZone({
  onFilesAdded,
  activeTool,
  onBack,
  onClearAll,
  compact,
  detectedMode,
  hasFiles,
}: DropZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesAdded(acceptedFiles);
    },
    [onFilesAdded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: activeTool?.acceptTypes
      ? { [activeTool.acceptTypes]: [] }
      : undefined,
  });

  const rootProps = getRootProps();
  const modeInfo = getModeInfo(detectedMode ?? null);

  return (
    <div>
      {/* Top bar: back + mode badge + clear */}
      <AnimatePresence>
        {(activeTool || hasFiles) && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Tous les outils
                </button>
              )}

              {/* Active tool label */}
              {activeTool && (
                <div className="flex items-center gap-2">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${activeTool.color}`}>
                    <activeTool.icon className={`h-3.5 w-3.5 ${activeTool.iconColor}`} />
                  </div>
                  <span className="font-display text-sm font-bold text-foreground">
                    {activeTool.label}
                  </span>
                </div>
              )}

              {/* Dynamic mode badge (when auto-detected, no active tool) */}
              {!activeTool && detectedMode && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1.5"
                >
                  <span className="text-sm">{modeInfo.emoji}</span>
                  <span className="text-xs font-bold text-primary">{modeInfo.label}</span>
                  <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary/80">
                    {modeInfo.badge}
                  </span>
                </motion.div>
              )}
            </div>

            {/* Clear all button — always visible when files present */}
            {hasFiles && onClearAll && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={onClearAll}
                className="flex items-center gap-1.5 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs font-semibold text-destructive transition-all hover:bg-destructive/10 active:scale-95"
              >
                <Trash2 className="h-3 w-3" />
                Tout effacer
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={rootProps.onClick}
        onKeyDown={rootProps.onKeyDown}
        onFocus={rootProps.onFocus}
        onBlur={rootProps.onBlur}
        tabIndex={rootProps.tabIndex}
        role={rootProps.role}
        className={`
          relative cursor-pointer rounded-3xl border-2 border-dashed
          transition-all duration-300 ease-apple overflow-hidden
          ${compact ? "p-8" : "p-10 md:p-14"}
          ${
            isDragActive
              ? "border-primary bg-dropzone-bg shadow-glow scale-[1.01]"
              : "border-dropzone-border bg-card hover:border-primary/40 hover:bg-dropzone-bg/50 hover:shadow-lg"
          }
        `}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {isDragActive ? (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="rounded-2xl bg-primary/10 p-4">
                <FileIcon className="h-7 w-7 text-primary" />
              </div>
              <p className="font-display text-base font-semibold text-primary">
                Déposez vos fichiers ici
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-4"
            >
              <div className={`rounded-2xl p-4 ${activeTool ? activeTool.color : "bg-primary/10"}`}>
                {activeTool ? (
                  <activeTool.icon className={`h-7 w-7 ${activeTool.iconColor}`} />
                ) : (
                  <Upload className="h-7 w-7 text-primary" />
                )}
              </div>
              <div className="text-center">
                <p className="font-display text-lg font-semibold text-foreground">
                  {activeTool
                    ? `Déposez vos fichiers pour ${activeTool.label.toLowerCase()}`
                    : "Glissez vos fichiers ici"}
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground text-pretty">
                  {activeTool
                    ? activeTool.desc
                    : "PDF, Images, Audio, Vidéo, Documents — on détecte tout automatiquement"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-primary/70">
                  <Zap className="h-3 w-3" fill="currentColor" />
                  <span>Traitement 100% local</span>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-full p-1 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                      >
                        <Info className="h-3 w-3" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-[260px] text-center">
                      <p className="text-xs leading-relaxed">
                        Analyse locale en cours… Votre CPU travaille pour vous. Aucune donnée envoyée à Kayzen ou à des tiers.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
