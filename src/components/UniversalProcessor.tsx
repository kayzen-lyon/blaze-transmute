import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Loader2, Download, Check, AlertCircle, X, Eye, EyeOff,
} from "lucide-react";
import { processors } from "@/lib/pdf/processors";
import { toolConfigs } from "@/lib/pdf/tool-config";
import type { ToolOption, ProcessedResult } from "@/lib/pdf/types";

interface UniversalProcessorProps {
  toolId: string;
  files: File[];
  onClear: () => void;
  onProcessed?: () => void;
}

export function UniversalProcessor({ toolId, files, onClear, onProcessed }: UniversalProcessorProps) {
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [result, setResult] = useState<ProcessedResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<Record<string, string | number>>({});

  const config = toolConfigs[toolId];
  const processor = processors[toolId];
  const toolOptions = config?.options || [];

  // Init default options
  useState(() => {
    const defaults: Record<string, string | number> = {};
    toolOptions.forEach((opt) => {
      if (opt.defaultValue !== undefined) defaults[opt.key] = opt.defaultValue;
    });
    setOptions(defaults);
  });

  const handleProcess = useCallback(async () => {
    if (!processor) {
      setError("Processeur non disponible pour cet outil.");
      setStatus("error");
      return;
    }
    // Validate required options
    for (const opt of toolOptions) {
      if (opt.required && !options[opt.key]) {
        setError(`Le champ "${opt.label}" est requis.`);
        setStatus("error");
        return;
      }
    }

    setStatus("processing");
    setProgress(0);
    setStatusMsg("Initialisation…");
    setError(null);

    try {
      const res = await processor(files, (p, msg) => {
        setProgress(Math.round(p));
        if (msg) setStatusMsg(msg);
      }, options);
      setResult(res);
      setStatus("done");
      onProcessed?.();
    } catch (err) {
      setError((err as Error).message);
      setStatus("error");
    }
  }, [processor, files, options, toolOptions, onProcessed]);

  const downloadAll = async () => {
    if (!result) return;
    if (result.files.length === 1) {
      const f = result.files[0];
      const url = URL.createObjectURL(f.blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = f.filename;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
    // Multiple files → ZIP
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    for (const f of result.files) {
      zip.file(f.filename, f.blob);
    }
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `docusur-${toolId}.zip`;
    a.click();
    URL.revokeObjectURL(url);
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
        {files.map((f, i) => (
          <div key={i} className="glass-strong flex items-center gap-3 rounded-xl p-3">
            <div className="flex-shrink-0 rounded-lg bg-primary/10 p-2">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{f.name}</p>
              <p className="text-xs text-muted-foreground">
                {(f.size / 1024).toFixed(0)} KB
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Options form */}
      {status === "idle" && toolOptions.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-strong rounded-2xl p-5 space-y-4"
        >
          <h4 className="text-sm font-bold text-foreground">Options</h4>
          {toolOptions.map((opt) => (
            <OptionField
              key={opt.key}
              option={opt}
              value={options[opt.key]}
              onChange={(v) => setOptions((prev) => ({ ...prev, [opt.key]: v }))}
            />
          ))}
        </motion.div>
      )}

      {/* Action button */}
      {status === "idle" && (
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleProcess}
          className="w-full rounded-2xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition-all hover:brightness-110"
        >
          Lancer le traitement
        </motion.button>
      )}

      {/* Processing */}
      {status === "processing" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-strong rounded-2xl p-6 text-center"
        >
          <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-semibold text-foreground">{statusMsg}</p>
          <p className="mt-1 text-xs text-muted-foreground">100% local — aucun transfert serveur</p>
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

      {/* Done */}
      {status === "done" && result && (
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
                  {result.files.length} fichier{result.files.length > 1 ? "s" : ""} prêt{result.files.length > 1 ? "s" : ""}
                </p>
                {result.message && (
                  <p className="text-xs text-muted-foreground mt-0.5">{result.message}</p>
                )}
              </div>
            </div>
            <button
              onClick={downloadAll}
              className="flex items-center gap-2 rounded-xl bg-kayzen-green px-4 py-2.5 text-xs font-semibold text-accent-foreground transition-all hover:brightness-110 active:scale-95"
            >
              <Download className="h-4 w-4" />
              Télécharger{result.files.length > 1 ? " tout" : ""}
            </button>
          </div>

          {/* Individual file downloads */}
          {result.files.length > 1 && (
            <div className="mt-4 space-y-2 max-h-60 overflow-auto">
              {result.files.map((f, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-background/50 px-3 py-2">
                  <span className="text-xs font-medium text-foreground truncate">{f.filename}</span>
                  <button
                    onClick={() => {
                      const url = URL.createObjectURL(f.blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = f.filename;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="text-xs text-primary hover:text-primary/80 font-semibold"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Preview for text results */}
          {result.files.length === 1 && result.files[0].filename.endsWith('.txt') && (
            <TextPreview blob={result.files[0].blob} />
          )}
        </motion.div>
      )}

      {/* Error */}
      {status === "error" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-strong rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Erreur</p>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
            <button
              onClick={() => { setStatus("idle"); setError(null); }}
              className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
            >
              Réessayer
            </button>
          </div>
        </motion.div>
      )}

      <div className="flex justify-center">
        <button onClick={onClear} className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
          ← Retour à l'accueil
        </button>
      </div>
    </motion.div>
  );
}

function OptionField({ option, value, onChange }: { option: ToolOption; value: string | number | undefined; onChange: (v: string | number) => void }) {
  const [showPw, setShowPw] = useState(false);

  if (option.type === "select" && option.choices) {
    return (
      <div>
        <label className="text-xs font-semibold text-foreground">{option.label}</label>
        <select
          value={String(value ?? option.defaultValue ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
        >
          {option.choices.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>
    );
  }

  if (option.type === "password") {
    return (
      <div>
        <label className="text-xs font-semibold text-foreground">{option.label}</label>
        <div className="relative mt-1">
          <input
            type={showPw ? "text" : "password"}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            placeholder={option.placeholder}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 pr-10 text-sm text-foreground"
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
          >
            {showPw ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    );
  }

  if (option.type === "number") {
    return (
      <div>
        <label className="text-xs font-semibold text-foreground">{option.label}</label>
        <input
          type="number"
          value={value ?? option.defaultValue ?? ""}
          onChange={(e) => onChange(Number(e.target.value))}
          min={option.min}
          max={option.max}
          className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
        />
      </div>
    );
  }

  return (
    <div>
      <label className="text-xs font-semibold text-foreground">{option.label}</label>
      <input
        type="text"
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        placeholder={option.placeholder}
        className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
      />
    </div>
  );
}

function TextPreview({ blob }: { blob: Blob }) {
  const [text, setText] = useState<string | null>(null);
  useState(() => {
    blob.text().then((t) => setText(t));
  });

  if (!text) return null;
  return (
    <div className="mt-4 max-h-60 overflow-auto rounded-xl bg-background border border-border p-4">
      <pre className="whitespace-pre-wrap text-xs text-foreground font-mono leading-relaxed">
        {text.slice(0, 3000)}
        {text.length > 3000 && "\n\n... (texte tronqué, téléchargez le fichier complet)"}
      </pre>
    </div>
  );
}
