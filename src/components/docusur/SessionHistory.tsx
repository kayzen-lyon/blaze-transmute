import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, X, ShieldCheck, FileText } from 'lucide-react';
import { getRecentHistory, clearHistory, type HistoryEntry } from '@/lib/session-history';
import { formatFileSize } from '@/lib/pdf/download';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SessionHistory({ open, onClose }: Props) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      getRecentHistory().then(setEntries).catch(() => setEntries([]));
    }
  }, [open]);

  const handleClear = async () => {
    await clearHistory();
    setEntries([]);
  };

  const handleNavigate = (toolId: string) => {
    navigate(`/outils/${toolId}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-background border-l border-border z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-bold text-foreground">Historique récent</h2>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="flex items-center gap-2 bg-primary/5 rounded-xl p-3 mb-6">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Historique stocké localement (IndexedDB). Auto-suppression après 1h.
                </p>
              </div>

              {entries.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Aucune activité récente.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2 mb-6">
                    {entries.map((entry) => (
                      <button
                        key={entry.id}
                        onClick={() => handleNavigate(entry.toolId)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-secondary/50 transition text-left"
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{entry.fileName}</p>
                          <p className="text-xs text-muted-foreground">
                            {entry.toolName} · {formatFileSize(entry.fileSize)} · {new Date(entry.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleClear}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-destructive/20 text-destructive hover:bg-destructive/5 transition text-sm font-semibold"
                  >
                    <Trash2 className="w-4 h-4" /> Effacer l'historique
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
