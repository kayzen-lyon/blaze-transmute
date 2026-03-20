import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { ToolGrid, Tool, ALL_TOOLS } from "@/components/ToolGrid";
import { DropZone } from "@/components/DropZone";
import { FileList, ConvertibleFile } from "@/components/FileList";
import { UniversalProcessor } from "@/components/UniversalProcessor";
import { SecurityStatus } from "@/components/SecurityStatus";
import { ContextualCTA } from "@/components/ContextualCTA";
import { WhySection } from "@/components/WhySection";
import { Footer } from "@/components/Footer";
import { ConversionFormat, convertFile } from "@/lib/ffmpeg";
import { detectFilesMode, type FileMode } from "@/lib/file-detect";
import { Zap } from "lucide-react";

let fileIdCounter = 0;

const isPdfCategory = (cat: string) => cat.startsWith("pdf-");

const Index = () => {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [files, setFiles] = useState<ConvertibleFile[]>([]);
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [processingSpeed, setProcessingSpeed] = useState<number | null>(null);
  const [detectedMode, setDetectedMode] = useState<FileMode>(null);
  const [pdfOpsCount, setPdfOpsCount] = useState(0);
  const [mediaOpsCount, setMediaOpsCount] = useState(0);
  const conversionStartRef = useRef<number>(0);
  const fileSizeRef = useRef<number>(0);

  const isConverting = files.some((f) => f.status === "converting");
  const hasFiles = files.length > 0 || pdfFiles.length > 0;

  const handleSelectTool = useCallback((tool: Tool) => {
    setActiveTool(tool);
    setFiles([]);
    setPdfFiles([]);
    setProcessingSpeed(null);
    setDetectedMode(isPdfCategory(tool.category) ? "pdf" : "image");
  }, []);

  const handleBack = useCallback(() => {
    setActiveTool(null);
    setFiles([]);
    setPdfFiles([]);
    setProcessingSpeed(null);
    setDetectedMode(null);
  }, []);

  const handleClearAll = useCallback(() => {
    setFiles([]);
    setPdfFiles([]);
    setProcessingSpeed(null);
    setDetectedMode(null);
  }, []);

  const handleFilesAdded = useCallback(
    (newFiles: File[]) => {
      const mode = detectFilesMode(newFiles);
      setDetectedMode(mode);

      const isPdf = activeTool ? isPdfCategory(activeTool.category) : mode === "pdf";

      if (isPdf) {
        setPdfFiles((prev) => [...prev, ...newFiles]);
      } else {
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
      }
    },
    [activeTool]
  );

  const handleRemove = useCallback((id: string) => {
    setFiles((prev) => {
      const next = prev.filter((f) => f.id !== id);
      if (next.length === 0) setDetectedMode(null);
      return next;
    });
  }, []);

  const handleFormatChange = useCallback((id: string, format: ConversionFormat) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, targetFormat: format } : f))
    );
  }, []);

  const handleConvert = useCallback(
    async (id: string) => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, status: "converting" as const, progress: 0 } : f
        )
      );
      const item = files.find((f) => f.id === id);
      if (!item || !item.targetFormat) return;
      conversionStartRef.current = performance.now();
      fileSizeRef.current = item.file.size;
      setProcessingSpeed(null);
      setMediaOpsCount((c) => c + 1);
      try {
        const result = await convertFile(item.file, item.targetFormat, (progress) => {
          setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, progress } : f)));
          if (progress > 5 && progress < 100) {
            const elapsed = (performance.now() - conversionStartRef.current) / 1000;
            if (elapsed > 0.1) setProcessingSpeed((fileSizeRef.current * progress) / 100 / elapsed);
          }
        });
        const elapsed = (performance.now() - conversionStartRef.current) / 1000;
        if (elapsed > 0) setProcessingSpeed(fileSizeRef.current / elapsed);
        setFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, status: "done" as const, progress: 100, result } : f))
        );
      } catch (err) {
        setFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, status: "error" as const, error: (err as Error).message } : f))
        );
      }
    },
    [files]
  );

  const handleConvertAll = useCallback(() => {
    files.filter((f) => f.status === "idle" && f.targetFormat).forEach((f) => handleConvert(f.id));
  }, [files, handleConvert]);

  const showToolGrid = !activeTool && !hasFiles;
  const showWorkspace = activeTool || hasFiles;
  const showPdfProcessor = (activeTool && isPdfCategory(activeTool.category)) || (!activeTool && detectedMode === "pdf");
  const showMediaList = !showPdfProcessor && files.length > 0;

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <div className="gradient-blob gradient-blob--1" />
      <div className="gradient-blob gradient-blob--2" />
      <div className="relative z-10">
        <Header onSelectTool={handleSelectTool} />
        <main className="mx-auto max-w-4xl px-6 pb-8 pt-8 md:pt-14">
          <motion.div
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              <Zap className="h-3 w-3" fill="currentColor" />
              {ALL_TOOLS.length} outils · 100% local · Zero-Server
            </div>
            <h1 className="text-balance font-display text-3xl font-bold text-foreground md:text-4xl" style={{ lineHeight: "1.1" }}>
              Sécurité PDF Française
              <br />
              <span className="text-primary">& Conversion Zero-Server</span>
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-pretty text-sm text-muted-foreground leading-relaxed">
              Déposez n'importe quel fichier — on détecte automatiquement le type et adapte les outils. {ALL_TOOLS.length} outils PDF, média, OCR, signature — tout dans votre navigateur.
            </p>
          </motion.div>

          <DropZone
            onFilesAdded={handleFilesAdded}
            activeTool={activeTool}
            onBack={showWorkspace && !showToolGrid ? handleBack : undefined}
            onClearAll={hasFiles ? handleClearAll : undefined}
            compact={hasFiles}
            detectedMode={detectedMode}
            hasFiles={hasFiles}
          />

          <AnimatePresence mode="wait">
            {hasFiles && (
              <motion.div key="security" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <SecurityStatus hasFiles={hasFiles} isConverting={isConverting} processingSpeed={processingSpeed} />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {showPdfProcessor && pdfFiles.length > 0 && (
              <motion.div key="pdf-proc" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="mt-4">
                <UniversalProcessor
                  toolId={activeTool?.id || "fusionner"}
                  files={pdfFiles}
                  onClear={handleBack}
                  onProcessed={() => setPdfOpsCount((c) => c + 1)}
                />
              </motion.div>
            )}

            {showMediaList && (
              <motion.div key="media-tools" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="mt-4">
                <FileList files={files} onRemove={handleRemove} onFormatChange={handleFormatChange} onConvert={handleConvert} onConvertAll={handleConvertAll} />
              </motion.div>
            )}
          </AnimatePresence>

          <ContextualCTA pdfCount={pdfOpsCount} mediaCount={mediaOpsCount} />

          <AnimatePresence>
            {showToolGrid && (
              <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="mt-10">
                <h2 className="text-center font-display text-lg font-bold text-foreground mb-6">Ou choisissez un outil spécifique</h2>
                <ToolGrid onSelectTool={handleSelectTool} />
              </motion.div>
            )}
          </AnimatePresence>

          <WhySection />
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Index;
