import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FileText, User, Calendar, Hash, Layers, Type, Download,
  ChevronRight, ShieldCheck, AlertTriangle,
  Fingerprint, Eye, FileWarning, Gauge
} from 'lucide-react';
import { downloadBlob } from '@/lib/pdf/download';
import type { ProcessedResult } from '@/lib/pdf/types';

interface AnalysisData {
  metadata: Record<string, string>;
  sections: { title: string; page: number; level: number; wordCount: number }[];
  summary: { pages: number; words: number; characters: number; sectionsCount: number };
}

interface Props {
  result: ProcessedResult;
  onReset: () => void;
}

const metaIcons: Record<string, typeof FileText> = {
  'Titre': FileText, 'Auteur': User, 'Date de création': Calendar,
  'Dernière modification': Calendar, 'Nombre de pages': Hash,
  'Nombre de mots': Type, 'Sections détectées': Layers,
};

interface ComplianceCheck {
  label: string;
  status: 'ok' | 'warning' | 'danger';
  message: string;
  icon: typeof ShieldCheck;
  action?: { label: string; route: string };
}

function computeCompliance(data: AnalysisData): { score: number; checks: ComplianceCheck[] } {
  const checks: ComplianceCheck[] = [];
  let score = 100;

  const author = data.metadata['Auteur'];
  if (author && author.trim()) {
    checks.push({ label: 'Auteur exposé', status: 'danger', message: `Le champ auteur contient "${author}". Risque de fuite d'identité.`, icon: User, action: { label: 'Purger les métadonnées', route: '/outils/purge-adn' } });
    score -= 25;
  } else {
    checks.push({ label: 'Auteur', status: 'ok', message: 'Aucun auteur identifiable.', icon: User });
  }

  const creator = data.metadata['Créé avec'];
  if (creator && creator.trim()) {
    checks.push({ label: 'Logiciel source visible', status: 'warning', message: `Créé avec "${creator}".`, icon: FileWarning, action: { label: 'Purger les métadonnées', route: '/outils/purge-adn' } });
    score -= 15;
  } else {
    checks.push({ label: 'Logiciel source', status: 'ok', message: 'Non détecté.', icon: FileWarning });
  }

  const producer = data.metadata['Producteur'];
  if (producer && producer.trim() && producer !== 'DocuSûr') {
    checks.push({ label: 'Producteur exposé', status: 'warning', message: `Producteur : "${producer}".`, icon: Fingerprint, action: { label: 'Purger les métadonnées', route: '/outils/purge-adn' } });
    score -= 10;
  } else {
    checks.push({ label: 'Producteur', status: 'ok', message: 'Propre ou absent.', icon: Fingerprint });
  }

  const pages = data.summary.pages;
  const words = data.summary.words;
  const wordsPerPage = pages > 0 ? words / pages : 0;
  if (wordsPerPage < 50 && pages > 3) {
    checks.push({ label: 'Poids suspect', status: 'warning', message: 'Peu de texte par page. Le PDF pourrait contenir des images non optimisées.', icon: Gauge, action: { label: 'Compresser le PDF', route: '/outils/compresser' } });
    score -= 10;
  } else {
    checks.push({ label: 'Optimisation poids', status: 'ok', message: 'Ratio texte/pages correct.', icon: Gauge });
  }

  if (data.summary.sectionsCount <= 1 && pages > 5) {
    checks.push({ label: 'Accessibilité', status: 'warning', message: 'Aucune structure de titres détectée.', icon: Eye });
    score -= 15;
  } else {
    checks.push({ label: 'Accessibilité', status: 'ok', message: 'Structure de titres détectée.', icon: Eye });
  }

  const creationDate = data.metadata['Date de création'];
  if (creationDate && creationDate !== '01/01/1970') {
    checks.push({ label: 'Date de création exposée', status: 'warning', message: `Date visible : ${creationDate}.`, icon: Calendar, action: { label: 'Purger les métadonnées', route: '/outils/purge-adn' } });
    score -= 5;
  } else {
    checks.push({ label: 'Dates', status: 'ok', message: 'Non exposées.', icon: Calendar });
  }

  return { score: Math.max(0, score), checks };
}

const statusColors: Record<string, string> = {
  ok: 'text-green-500',
  warning: 'text-amber-500',
  danger: 'text-destructive',
};

const statusBg: Record<string, string> = {
  ok: 'bg-green-500/10',
  warning: 'bg-amber-500/10',
  danger: 'bg-destructive/10',
};

export const AnalysisResultView = ({ result, onReset }: Props) => {
  const [view, setView] = useState<'tree' | 'json' | 'security'>('tree');
  const navigate = useNavigate();

  const raw = result.message?.replace('__ANALYSIS_JSON__', '') || '{}';
  let data: AnalysisData;
  try { data = JSON.parse(raw); } catch { return null; }

  const { score, checks } = computeCompliance(data);

  const statCards = [
    { label: 'Pages', value: data.summary.pages, color: 'text-primary' },
    { label: 'Mots', value: data.summary.words.toLocaleString('fr-FR'), color: 'text-green-500' },
    { label: 'Caractères', value: data.summary.characters.toLocaleString('fr-FR'), color: 'text-primary' },
    { label: 'Score Santé', value: `${score}%`, color: score >= 80 ? 'text-green-500' : score >= 50 ? 'text-amber-500' : 'text-destructive' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 bg-secondary/50 p-1 rounded-xl">
        {[
          { key: 'tree' as const, label: 'Structure' },
          { key: 'security' as const, label: 'Sécurité' },
          { key: 'json' as const, label: 'JSON brut' },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setView(tab.key)} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${view === tab.key ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Metadata */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" /> Métadonnées
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Object.entries(data.metadata).map(([key, val]) => {
            const Icon = metaIcons[key] || Hash;
            return (
              <div key={key} className="flex items-start gap-2 text-sm">
                <Icon className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{key} :</span>
                <span className="text-foreground font-medium truncate">{val}</span>
              </div>
            );
          })}
        </div>
      </div>

      {view === 'tree' && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" /> Structure du document
          </h3>
          <div className="space-y-1">
            {data.sections.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-sm" style={{ paddingLeft: `${(s.level - 1) * 16}px` }}>
                <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
                <span className="text-foreground font-medium truncate">{s.title}</span>
                <span className="text-xs text-muted-foreground ml-auto shrink-0">p.{s.page}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'security' && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" /> Audit de sécurité
          </h3>
          <div className="space-y-3">
            {checks.map((c, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${statusBg[c.status]}`}>
                <c.icon className={`w-4 h-4 mt-0.5 shrink-0 ${statusColors[c.status]}`} />
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${statusColors[c.status]}`}>{c.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.message}</p>
                  {c.action && (
                    <button onClick={() => navigate(c.action!.route)} className="mt-2 text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                      {c.action.label} <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
                {c.status === 'ok' && <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />}
                {c.status !== 'ok' && <AlertTriangle className={`w-4 h-4 shrink-0 ${statusColors[c.status]}`} />}
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'json' && (
        <div className="bg-card border border-border rounded-xl p-5">
          <pre className="text-xs text-muted-foreground overflow-x-auto max-h-96">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => result.files[0] && downloadBlob(result.files[0].blob, result.files[0].filename)}
          className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" /> Télécharger JSON
        </button>
        <button onClick={onReset} className="flex-1 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-secondary transition">
          Nouvelle analyse
        </button>
      </div>
    </motion.div>
  );
};
