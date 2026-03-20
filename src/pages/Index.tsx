import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { DropZone } from "@/components/DropZone";
import { FileList, ConvertibleFile } from "@/components/FileList";
import { PDFTools } from "@/components/PDFTools";
import { SecurityStatus } from "@/components/SecurityStatus";
import { WhySection } from "@/components/WhySection";
import { Footer } from "@/components/Footer";
import { ConversionFormat, convertFile } from "@/lib/ffmpeg";
import { Shield, Zap, Globe, FileText, Image, Music } from "lucide-react";

let fileIdCounter = 0;

type AppMode = "idle" | "media" | "pdf";

const Index = () => {
  const [files, setFiles] = useState<ConvertibleFile[]>([]);
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<AppMode>("idle");
  const [processingSpeed, setProcessingSpeed] = useState<number | null>(null);
  const conversionStartRef = useRef<number>(0);
  const fileSizeRef = useRef<number>(0);

  const isConverting = files.some((f) => f.status === "converting");

  const handleFilesAdded = useCallback((newFiles: File[]) => {
    const pdfs = newFiles.filter((f) => f.type === "application/pdf");
    const media = newFiles.filter((f) => f.type !== "application/pdf");

    if (pdfs.length > 0 && media.length === 0) {
      // PDF mode
      setPdfFiles((prev) => [...prev, ...pdfs]);
      setMode("pdf");
    } else if (media.length > 0) {
      // Media mode
      const items: ConvertibleFile[] = media.map((file) => ({
        id: `file-${++fileIdCounter}`,
        file,
        status: "idle" as const,
        progress: 0,
        targetFormat: null,
        result: null,
        error: null,
      }));
      setFiles((prev) => [...prev, ...items]);
      setMode("media");

      // Also add any PDFs as media files
      if (pdfs.length > 0) {
        const pdfItems: ConvertibleFile[] = pdfs.map((file) => ({
          id: `file-${++fileIdCounter}`,
          file,
          status: "idle" as const,
          progress: 0,
          targetFormat: null,
          result: null,
          error: null,
        }));
        setFiles((prev) => [...prev, ...pdfItems]);
      }
    }
  }, []);

  const handleClearAll = useCallback(() => {
    setFiles([]);
    setPdfFiles([]);
    setMode("idle");
    setProcessingSpeed(null);
  }, []);

  const handleRemove = useCallback((id: string) => {
    setFiles((prev) => {
      const next = prev.filter((f) => f.id !== id);
      if (next.length === 0) setMode("idle");
      return next;
    });
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

    conversionStartRef.current = performance.now();
    fileSizeRef.current = item.file.size;
    setProcessingSpeed(null);

    try {
      const result = await convertFile(item.file, item.targetFormat, (progress) => {
        setFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, progress } : f))
        );
        if (progress > 5 && progress < 100) {
          const elapsed = (performance.now() - conversionStartRef.current) / 1000;
          if (elapsed > 0.1) {
            const processedBytes = (fileSizeRef.current * progress) / 100;
            setProcessingSpeed(processedBytes / elapsed);
          }
        }
      });

      const elapsed = (performance.now() - conversionStartRef.current) / 1000;
      if (elapsed > 0) setProcessingSpeed(fileSizeRef.current / elapsed);

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
      icon: Image,
      title: "Images & Média",
      desc: "PNG, JPG, WebP, MP4, MP3, WAV — conversion instantanée via WebAssembly.",
    },
    {
      icon: FileText,
      title: "PDF Intelligent",
      desc: "Fusionner, diviser, signer et OCR — moteur Docusûr intégré.",
    },
    {
      icon: Shield,
      title: "Zero-Server",
      desc: "100% local. Zéro transfert. Conforme RGPD par nature.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <div className="gradient-blob gradient-blob--1" />
      <div className="gradient-blob gradient-blob--2" />

      <div className="relative z-10">
        <Header />

        <main className="mx-auto max-w-2xl px-6 pb-8 pt-8 md:pt-16">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 text-center"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              <Zap className="h-3 w-3" fill="currentColor" />
              Conversion & PDF 100% locale
            </div>
            <h1 className="text-balance font-display text-4xl font-bold text-foreground md:text-5xl" style={{ lineHeight: "1.08" }}>
              Convertissez vos fichiers
              <br />
              <span className="text-primary">en un éclair</span>
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-pretty text-muted-foreground leading-relaxed">
              Images, audio, vidéo, PDF — tout se passe dans votre navigateur.
              Rapide, privé, sans inscription. Moteur Docusûr intégré.
            </p>
          </motion.div>

          {/* Drop zone (only when idle or adding more) */}
          {mode !== "pdf" && (
            <DropZone onFilesAdded={handleFilesAdded} />
          )}

          {mode === "pdf" && (
            <DropZone onFilesAdded={handleFilesAdded} />
          )}

          {/* Security Status */}
          <SecurityStatus
            hasFiles={files.length > 0 || pdfFiles.length > 0}
            isConverting={isConverting}
            processingSpeed={processingSpeed}
          />

          {/* Mode indicator */}
          <AnimatePresence>
            {mode !== "idle" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="mt-4 flex items-center justify-center gap-2"
              >
                <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                  mode === "pdf"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-primary/10 text-primary"
                }`}>
                  {mode === "pdf" ? (
                    <>
                      <FileText className="h-3 w-3" />
                      Mode PDF — Moteur Docusûr
                    </>
                  ) : (
                    <>
                      <Music className="h-3 w-3" />
                      Mode Conversion Média
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PDF Tools */}
          {mode === "pdf" && pdfFiles.length > 0 && (
            <div className="mt-5">
              <PDFTools pdfFiles={pdfFiles} onClear={handleClearAll} />
            </div>
          )}

          {/* Media file list */}
          {mode === "media" && files.length > 0 && (
            <div className="mt-5">
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
          {mode === "idle" && (
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

          {/* Why Section */}
          <WhySection />

          {/* Footer */}
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Index;
