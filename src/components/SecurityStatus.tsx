import { motion, AnimatePresence } from "framer-motion";
import { Shield, ShieldCheck, Cpu, HardDrive, Wifi, WifiOff } from "lucide-react";

interface SecurityStatusProps {
  hasFiles: boolean;
  isConverting: boolean;
  processingSpeed?: number | null; // bytes per second
}

export function SecurityStatus({ hasFiles, isConverting, processingSpeed }: SecurityStatusProps) {
  const formatSpeed = (bps: number) => {
    if (bps > 1024 * 1024) return `${(bps / (1024 * 1024)).toFixed(1)} MB/s`;
    if (bps > 1024) return `${(bps / 1024).toFixed(0)} KB/s`;
    return `${bps.toFixed(0)} B/s`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="mt-5"
    >
      <div className="glass rounded-2xl px-5 py-4">
        <AnimatePresence mode="wait">
          {!hasFiles ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-kayzen-green/10">
                <Shield className="h-4 w-4 text-kayzen-green" />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Prêt pour un traitement local sécurisé
                </span>
                <div className="flex items-center gap-1.5 rounded-lg bg-kayzen-green/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-kayzen-green">
                  <WifiOff className="h-2.5 w-2.5" />
                  Hors-ligne
                </div>
              </div>
            </motion.div>
          ) : isConverting ? (
            <motion.div
              key="converting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10"
                >
                  <ShieldCheck className="h-4 w-4 text-primary" />
                </motion.div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Traitement en cours dans votre RAM
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Analyse locale en cours… Votre CPU travaille pour vous. Aucune donnée envoyée.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {processingSpeed && processingSpeed > 0 && (
                  <div className="flex items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-1.5">
                    <Cpu className="h-3 w-3 text-primary" />
                    <span className="text-xs font-mono font-bold text-primary">
                      {formatSpeed(processingSpeed)}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 rounded-xl bg-kayzen-green/10 px-3 py-1.5">
                  <HardDrive className="h-3 w-3 text-kayzen-green" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-kayzen-green">
                    RAM only
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="ready"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-kayzen-green/10">
                <ShieldCheck className="h-4 w-4 text-kayzen-green" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Fichiers chargés localement — sélectionnez un format pour convertir
              </span>
              <div className="flex items-center gap-1.5 rounded-lg bg-kayzen-green/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-kayzen-green">
                <WifiOff className="h-2.5 w-2.5" />
                Hors-ligne
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
