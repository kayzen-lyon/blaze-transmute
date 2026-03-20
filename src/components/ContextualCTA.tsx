import { motion } from "framer-motion";
import { ArrowRight, FileText, Zap } from "lucide-react";

interface ContextualCTAProps {
  pdfCount: number;
  mediaCount: number;
}

export function ContextualCTA({ pdfCount, mediaCount }: ContextualCTAProps) {
  // Show contextual CTA after 2+ operations
  if (pdfCount < 2 && mediaCount < 2) return null;

  const isPdfHeavy = pdfCount >= mediaCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="glass rounded-2xl p-5 mt-4"
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 rounded-xl bg-primary/10 p-3">
          {isPdfHeavy ? (
            <FileText className="h-5 w-5 text-primary" />
          ) : (
            <Zap className="h-5 w-5 text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">
            {isPdfHeavy
              ? "Besoin d'un coffre-fort numérique pour votre entreprise ?"
              : "Optimisez la vitesse de votre site web avec nos solutions de performance."}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {isPdfHeavy
              ? "Automatisez vos processus PDF avec une solution sécurisée sur-mesure."
              : "Des images et vidéos optimisées pour un site qui charge en un éclair."}
          </p>
        </div>
        <a
          href="https://internet.kayzen-lyon.fr"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-95"
        >
          {isPdfHeavy ? "Contactez Kayzen" : "En savoir plus"}
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </motion.div>
  );
}
