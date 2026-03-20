import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileIcon } from "lucide-react";

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

  return (
    <motion.div
      {...getRootProps()}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`
        relative cursor-pointer rounded-2xl border-2 border-dashed p-12 md:p-16
        transition-colors duration-300 ease-out overflow-hidden
        ${
          isDragActive
            ? "border-primary bg-dropzone-bg scale-[1.01]"
            : "border-dropzone-border bg-card hover:border-primary/40 hover:bg-dropzone-bg/50"
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
            <div className="rounded-full bg-primary/10 p-5">
              <FileIcon className="h-8 w-8 text-primary" />
            </div>
            <p className="text-lg font-medium text-primary">
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
            <div className="rounded-full bg-muted p-5">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-foreground">
                Glissez vos fichiers ici
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                ou cliquez pour parcourir · Images, Audio, Vidéo
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {["PNG", "JPG", "MP4", "MP3", "WebM", "WAV"].map((fmt) => (
                <span
                  key={fmt}
                  className="rounded-md bg-muted px-2.5 py-1 text-xs font-mono text-muted-foreground"
                >
                  {fmt}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
