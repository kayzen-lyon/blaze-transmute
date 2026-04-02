import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X } from 'lucide-react';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('docusur-cookie-dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem('docusur-cookie-dismissed', '1');
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 bg-card border border-border rounded-2xl p-5 shadow-xl"
        >
          <button onClick={dismiss} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition">
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground mb-1">Zéro cookie. Zéro tracking.</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                DocuSûr ne collecte aucune donnée personnelle et n'utilise aucun cookie de suivi.
                Vos fichiers restent dans la RAM de votre navigateur.
              </p>
              <button
                onClick={dismiss}
                className="mt-3 bg-primary text-primary-foreground px-4 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition"
              >
                Compris
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
