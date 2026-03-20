import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileIcon, Zap } from "lucide-react";

interface DropZoneProps {
  onFilesAdded: (files: File[]) => void;
}

export function DropZone({ onFilesAdded }: DropZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesAdded(acceptedFiles);
    },
    [onFilesAdded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const rootProps = getRootProps();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onClick={rootProps.onClick}
      onKeyDown={rootProps.onKeyDown}
      onFocus={rootProps.onFocus}
      onBlur={rootProps.onBlur}
      tabIndex={rootProps.tabIndex}
      role={rootProps.role}
      className={`
        relative cursor-pointer rounded-3xl border-2 border-dashed p-12 md:p-16
        transition-all duration-300 ease-apple overflow-hidden
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
            className="flex flex-col items-center gap-4"
          >
            <div className="rounded-2xl bg-primary/10 p-5">
              <FileIcon className="h-8 w-8 text-primary" />
            </div>
            <p className="font-display text-lg font-semibold text-primary">
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
            className="flex flex-col items-center gap-5"
          >
            <div className="rounded-2xl bg-primary/10 p-5">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-display text-xl font-semibold text-foreground">
                Glissez vos fichiers ici
              </p>
              <p className="mt-2 text-sm text-muted-foreground text-pretty">
                ou cliquez pour parcourir · Images, Audio, Vidéo
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-1">
              {["PNG", "JPG", "WebP", "MP4", "MP3", "WAV", "WebM"].map((fmt) => (
                <span
                  key={fmt}
                  className="glass-subtle rounded-lg px-3 py-1 text-xs font-semibold text-muted-foreground"
                >
                  {fmt}
                </span>
              ))}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-primary/70">
              <Zap className="h-3 w-3" fill="currentColor" />
              <span>Conversion locale — aucun upload serveur</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
