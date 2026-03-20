import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { DropZone } from "@/components/DropZone";
import { FileList, ConvertibleFile } from "@/components/FileList";
import { ConversionFormat, convertFile } from "@/lib/ffmpeg";
import { Shield, Zap, Globe, ArrowRight } from "lucide-react";

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

    const currentFiles = files;
    const item = currentFiles.find((f) => f.id === id);
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
      title: "100% Confidentiel",
      desc: "Vos fichiers restent dans votre navigateur. Aucun envoi serveur.",
    },
    {
      icon: Zap,
      title: "Conversion Instantanée",
      desc: "WebAssembly et Canvas API pour des résultats immédiats.",
    },
    {
      icon: Globe,
      title: "Gratuit & Illimité",
      desc: "Pas de limites de taille ou de nombre. Pour toujours.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Background blobs */}
      <div className="gradient-blob gradient-blob--1" />
      <div className="gradient-blob gradient-blob--2" />

      <div className="relative z-10">
        <Header />

        <main className="mx-auto max-w-2xl px-6 pb-24 pt-8 md:pt-16">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 text-center"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              <Zap className="h-3 w-3" fill="currentColor" />
              Conversion 100% locale
            </div>
            <h1 className="text-balance font-display text-4xl font-bold text-foreground md:text-5xl" style={{ lineHeight: "1.08" }}>
              Convertissez vos fichiers
              <br />
              <span className="text-primary">en un éclair</span>
            </h1>
            <p className="mx-auto mt-5 max-w-md text-pretty text-muted-foreground leading-relaxed">
              Images, audio, vidéo — tout se passe dans votre navigateur.
              Rapide, privé, sans inscription.
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
              className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3"
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
                  className="glass rounded-2xl p-6 text-center"
                >
                  <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-display text-sm font-bold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground text-pretty">
                    {f.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* CTA Kayzen */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-20 text-center"
          >
            <p className="text-sm text-muted-foreground">
              Besoin d'un site aussi rapide que ce convertisseur ?
            </p>
            <a
              href="https://kayzen-lyon.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
            >
              Découvrir Kayzen
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Index;
