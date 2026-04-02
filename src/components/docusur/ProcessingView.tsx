import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, CheckCircle2, Loader2, AlertTriangle, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { downloadBlob, formatFileSize } from '@/lib/pdf/download';
import type { ProcessedResult } from '@/lib/pdf/types';
import JSZip from 'jszip';

interface ProcessingViewProps {
  progress: number;
  status: string;
  result: ProcessedResult | null;
  error: string | null;
  onReset: () => void;
}

const ConfettiParticle = ({ delay, x }: { delay: number; x: number }) => (
  <motion.div
    className="absolute w-2 h-2 rounded-full"
    style={{ left: `${x}%`, top: '40%', background: `hsl(${Math.random() * 360}, 70%, 60%)` }}
    initial={{ opacity: 1, y: 0, scale: 1 }}
    animate={{
      opacity: [1, 1, 0],
      y: [0, -60 - Math.random() * 40, 80 + Math.random() * 40],
      x: [0, (Math.random() - 0.5) * 100],
      scale: [1, 1.2, 0.3],
      rotate: [0, Math.random() * 360],
    }}
    transition={{ duration: 1.5, delay, ease: 'easeOut' }}
  />
);

export const ProcessingView = ({ progress, status, result, error, onReset }: ProcessingViewProps) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const isProcessing = !result && !error;

  useEffect(() => {
    if (result && !error) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [result, error]);

  const handleDownloadAll = async () => {
    if (!result || result.files.length === 0) return;
    if (result.files.length === 1) {
      downloadBlob(result.files[0].blob, result.files[0].filename);
      return;
    }
    const zip = new JSZip();
    for (const file of result.files) {
      zip.file(file.filename, file.blob);
    }
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(zipBlob, 'docusur-résultat.zip');
  };

  if (error) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card p-8 rounded-2xl border border-destructive/30 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <div>
          <p className="text-lg font-bold text-foreground">Erreur</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </div>
        <button onClick={onReset} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold hover:opacity-90 transition text-sm">
          Réessayer
        </button>
      </motion.div>
    );
  }

  if (isProcessing) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card p-8 rounded-2xl border border-border text-center space-y-6">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <Loader2 className="w-8 h-8 text-primary" />
        </motion.div>
        <div className="space-y-3 max-w-md mx-auto">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{status}</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Traitement 100% local — vos fichiers ne quittent jamais votre appareil
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-card p-8 rounded-2xl border border-green-500/30 space-y-6 overflow-hidden">
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <ConfettiParticle key={i} delay={i * 0.05} x={10 + (i * 4)} />
          ))}
        </div>
      )}

      <div className="text-center space-y-2">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }} className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto relative">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </motion.div>
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-green-500" />
          <p className="text-lg font-bold text-foreground">Traitement terminé !</p>
        </div>
        {result?.message && !result.message.startsWith('__') && (
          <p className="text-sm text-muted-foreground">{result.message}</p>
        )}
      </div>

      <div className="space-y-2">
        {result?.files.map((file, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }} className="flex items-center gap-3 bg-secondary/50 p-3 rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Download className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{file.filename}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(file.blob.size)}</p>
            </div>
            <button
              onClick={() => downloadBlob(file.blob, file.filename)}
              className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition"
            >
              Télécharger
            </button>
          </motion.div>
        ))}
      </div>

      {result && result.files.length > 1 && (
        <button
          onClick={handleDownloadAll}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" /> Tout télécharger (ZIP)
        </button>
      )}

      <div className="flex gap-3">
        <button onClick={onReset} className="flex-1 py-2.5 rounded-xl border border-border text-foreground font-semibold hover:bg-secondary transition text-sm">
          Nouveau traitement
        </button>
      </div>
    </motion.div>
  );
};
