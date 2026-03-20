import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { DropZone } from "@/components/DropZone";
import { FileList, ConvertibleFile } from "@/components/FileList";
import { ConversionFormat, convertFile } from "@/lib/ffmpeg";
import { Shield, Zap, Globe } from "lucide-react";

let fileIdCounter = 0;

const Index = () => {
  const [files, setFiles] = useState<ConvertibleFile[]>([]);

  const handleFilesAdded = useCallback((newFiles: File[]) => {
    const items: ConvertibleFile[] = newFiles.map((file) => ({
      id: `file-${++fileIdCounter}`,
      file,
      status: "idle" as const,
      progress: 0,
      targetFormat: null,
      result: null,
      error: null,
    }));
    setFiles((prev) => [...prev, ...items]);
  }, []);

  const handleRemove = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const handleFormatChange = useCallback((id: string, format: ConversionFormat) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, targetFormat: format } : f))
    );
  }, []);

  const handleConvert = useCallback(async (id: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, status: "converting" as const, progress: 0 } : f
      )
    );

    const item = files.find((f) => f.id === id);
    if (!item || !item.targetFormat) return;

    try {
      const result = await convertFile(item.file, item.targetFormat, (progress) => {
        setFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, progress } : f))
        );
      });

      setFiles((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, status: "done" as const, progress: 100, result } : f
        )
      );
    } catch (err) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? { ...f, status: "error" as const, error: (err as Error).message }
            : f
        )
      );
    }
  }, [files]);

  const handleConvertAll = useCallback(() => {
    files
      .filter((f) => f.status === "idle" && f.targetFormat)
      .forEach((f) => handleConvert(f.id));
  }, [files, handleConvert]);

  const features = [
    {
      icon: Shield,
      title: "100% Privé",
      desc: "Conversion dans votre navigateur. Aucun fichier envoyé sur un serveur.",
    },
    {
      icon: Zap,
      title: "Ultra Rapide",
      desc: "WebAssembly et Canvas API pour des conversions instantanées.",
    },
    {
      icon: Globe,
      title: "Open Source",
      desc: "Code ouvert, transparent et gratuit. Pour toujours.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-2xl px-6 pb-24 pt-8 md:pt-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-center"
        >
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl" style={{ lineHeight: "1.1" }}>
            Convertissez vos fichiers
            <br />
            <span className="text-primary">en toute confidentialité</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-balance text-muted-foreground">
            Images, audio, vidéo — tout se passe dans votre navigateur.
            Rien n'est envoyé sur un serveur.
          </p>
        </motion.div>

        {/* Drop zone */}
        <DropZone onFilesAdded={handleFilesAdded} />

        {/* File list */}
        {files.length > 0 && (
          <div className="mt-6">
            <FileList
              files={files}
              onRemove={handleRemove}
              onFormatChange={handleFormatChange}
              onConvert={handleConvert}
              onConvertAll={handleConvertAll}
            />
          </div>
        )}

        {/* Features */}
        {files.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.4 + i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="rounded-xl border border-border bg-card p-5 text-center"
              >
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <f.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Index;
