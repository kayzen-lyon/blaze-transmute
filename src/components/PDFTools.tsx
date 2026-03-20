import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Merge,
  Scissors,
  ScanText,
  PenTool,
  Loader2,
  Download,
  Check,
  AlertCircle,
  X,
  ChevronDown,
} from "lucide-react";
import { SignaturePad } from "@/components/SignaturePad";
import { mergePDFs, splitPDF, ocrPDF, signPDF, getPDFPageCount } from "@/lib/pdf-engine";

type PDFAction = "merge" | "split" | "ocr" | "sign";
type PDFStatus = "idle" | "processing" | "done" | "error";

interface PDFFile {
  id: string;
  file: File;
  pageCount?: number;
}

interface PDFToolsProps {
  pdfFiles: File[];
  onClear: () => void;
  defaultAction?: PDFAction;
  onAction?: () => void;
}

let pdfIdCounter = 0;

export function PDFTools({ pdfFiles, onClear, defaultAction, onAction }: PDFToolsProps) {
  const [action, setAction] = useState<PDFAction | null>(defaultAction ?? null);
  const [status, setStatus] = useState<PDFStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Blob | Blob[] | string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSignature, setShowSignature] = useState(defaultAction === "sign");
  const [files, setFiles] = useState<PDFFile[]>(() =>
    pdfFiles.map((f) => ({ id: `pdf-${++pdfIdCounter}`, file: f }))
  );

  const actions: { key: PDFAction; label: string; icon: typeof Merge; desc: string; minFiles: number }[] = [
    { key: "merge", label: "Fusionner", icon: Merge, desc: "Combiner plusieurs PDF en un seul", minFiles: 2 },
    { key: "split", label: "Diviser", icon: Scissors, desc: "Séparer chaque page en fichier individuel", minFiles: 1 },
    { key: "ocr", label: "OCR (Texte)", icon: ScanText, desc: "Extraire le texte d'un PDF scanné", minFiles: 1 },
    { key: "sign", label: "Signer", icon: PenTool, desc: "Ajouter votre signature manuscrite", minFiles: 1 },
  ];

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleAction = async (act: PDFAction) => {
    setAction(act);
    setStatus("idle");
    setResult(null);
    setError(null);
    setProgress(0);

    if (act === "sign") {
      setShowSignature(true);
      return;
    }

    await executeAction(act);
  };

  const executeAction = async (act: PDFAction, signatureData?: string) => {
    setStatus("processing");
    setProgress(0);
    onAction?.();

    try {
      switch (act) {
        case "merge": {
          const blob = await mergePDFs(
            files.map((f) => f.file),
            setProgress
          );
          setResult(blob);
          break;
        }
        case "split": {
          const blobs = await splitPDF(files[0].file, setProgress);
          setResult(blobs);
          break;
        }
        case "ocr": {
          const text = await ocrPDF(files[0].file, setProgress);
          setResult(text);
          break;
        }
        case "sign": {
          if (!signatureData) throw new Error("Signature requise");
          const signed = await signPDF(files[0].file, signatureData, 0, undefined, setProgress);
          setResult(signed);
          break;
        }
      }
      setStatus("done");
    } catch (err) {
      setError((err as Error).message);
      setStatus("error");
    }
  };

  const handleSignatureSave = async (dataUrl: string) => {
    setShowSignature(false);
    setAction("sign");
    await executeAction("sign", dataUrl);
  };

  const downloadResult = () => {
    if (!result) return;

    if (typeof result === "string") {
      // OCR text
      const blob = new Blob([result], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ocr-result.txt";
      a.click();
      URL.revokeObjectURL(url);
    } else if (Array.isArray(result)) {
      // Split pages
      result.forEach((blob, i) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `page-${i + 1}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      });
    } else {
      // Single blob (merge/sign)
      const url = URL.createObjectURL(result);
      const a = document.createElement("a");
      a.href = url;
      a.download = action === "sign" ? "document-signe.pdf" : "document-fusionne.pdf";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
    >
      {/* File list */}
      <div className="space-y-2">
        {files.map((f) => (
          <div
            key={f.id}
            className="group glass-strong flex items-center gap-3 rounded-xl p-3"
          >
            <div className="flex-shrink-0 rounded-lg bg-destructive/10 p-2">
              <FileText className="h-4 w-4 text-destructive" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{f.file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(f.file.size / 1024).toFixed(0)} KB · PDF
              </p>
            </div>
            <button
              onClick={() => removeFile(f.id)}
              className="rounded-md p-1 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      {status === "idle" && !showSignature && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {actions.map((a) => {
            const disabled = files.length < a.minFiles;
            return (
              <motion.button
                key={a.key}
                whileHover={disabled ? {} : { scale: 1.02 }}
                whileTap={disabled ? {} : { scale: 0.97 }}
                onClick={() => !disabled && handleAction(a.key)}
                disabled={disabled}
                className={`rounded-2xl p-4 text-center transition-all ${
                  disabled
                    ? "opacity-40 cursor-not-allowed bg-muted"
                    : "glass hover:shadow-lg hover:border-primary/20 cursor-pointer"
                }`}
              >
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <a.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-xs font-bold text-foreground">{a.label}</p>
                <p className="mt-1 text-[10px] text-muted-foreground leading-tight">{a.desc}</p>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Signature pad */}
      <AnimatePresence>
        {showSignature && (
          <SignaturePad
            onSave={handleSignatureSave}
            onCancel={() => {
              setShowSignature(false);
              setAction(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Processing state */}
      {status === "processing" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-strong rounded-2xl p-6 text-center"
        >
          <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-semibold text-foreground">
            {action === "ocr" ? "Reconnaissance de texte en cours..." : "Traitement en cours..."}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            100% local — aucun transfert serveur
          </p>
          <div className="mx-auto mt-4 h-2 w-48 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="mt-2 text-xs font-mono text-primary">{progress}%</p>
        </motion.div>
      )}

      {/* Done state */}
      {status === "done" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-kayzen-green/15 p-2">
                <Check className="h-5 w-5 text-kayzen-green" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {action === "merge" && "PDF fusionné avec succès"}
                  {action === "split" && `${Array.isArray(result) ? (result as Blob[]).length : 0} pages extraites`}
                  {action === "ocr" && "Texte extrait avec succès"}
                  {action === "sign" && "Document signé avec succès"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Traitement effectué localement
                </p>
              </div>
            </div>
            <button
              onClick={downloadResult}
              className="flex items-center gap-2 rounded-xl bg-kayzen-green px-4 py-2.5 text-xs font-semibold text-accent-foreground transition-all hover:brightness-110 active:scale-95"
            >
              <Download className="h-4 w-4" />
              Télécharger
            </button>
          </div>

          {/* OCR text preview */}
          {action === "ocr" && typeof result === "string" && (
            <div className="mt-4 max-h-60 overflow-auto rounded-xl bg-background border border-border p-4">
              <pre className="whitespace-pre-wrap text-xs text-foreground font-mono leading-relaxed">
                {result.slice(0, 2000)}
                {result.length > 2000 && "\n\n... (texte tronqué, téléchargez le fichier complet)"}
              </pre>
            </div>
          )}
        </motion.div>
      )}

      {/* Error state */}
      {status === "error" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-strong rounded-2xl p-5"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <div>
              <p className="text-sm font-semibold text-foreground">Erreur de traitement</p>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
            <button
              onClick={() => {
                setStatus("idle");
                setAction(null);
              }}
              className="ml-auto rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
            >
              Réessayer
            </button>
          </div>
        </motion.div>
      )}

      {/* Clear button */}
      <div className="flex justify-center">
        <button
          onClick={onClear}
          className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Retour à l'accueil
        </button>
      </div>
    </motion.div>
  );
}
