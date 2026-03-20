import { motion } from "framer-motion";
import {
  ShieldCheck, Trash2, Cpu, Lock, FileX, Gauge,
  Brain, Server, CloudOff, CheckCircle, XCircle,
} from "lucide-react";

const reasons = [
  {
    icon: Lock,
    title: "Confidentialité Absolue",
    desc: "Contrairement aux convertisseurs classiques, vos données ne transitent par aucun serveur. C'est l'outil idéal pour les documents RH, juridiques ou financiers.",
    badge: "Zero-Server",
  },
  {
    icon: Trash2,
    title: "Zéro Trace",
    desc: "Une fois le téléchargement terminé ou l'onglet fermé, la mémoire cache est instantanément vidée. Rien n'est écrit sur disque.",
    badge: "RAM Only",
  },
  {
    icon: Cpu,
    title: "Vitesse Native",
    desc: "En utilisant les ressources de votre processeur (WebAssembly), DocuSûr traite vos fichiers à la vitesse de l'éclair, sans file d'attente.",
    badge: "WebAssembly",
  },
  {
    icon: Brain,
    title: "IA de Proximité (Edge AI)",
    desc: "L'OCR utilisé pour la reconnaissance de texte est une IA de proximité qui respecte le RGPD par nature. Votre document n'alimente aucune base de données d'IA tierce. Le calcul reste sur votre processeur.",
    badge: "RGPD Natif",
  },
];

const comparison = [
  { feature: "Transfert serveur", swift: false, cloud: true },
  { feature: "Risque de fuite de données", swift: false, cloud: true },
  { feature: "Dépendance internet", swift: false, cloud: true },
  { feature: "Rapidité locale", swift: true, cloud: false },
  { feature: "Conformité RGPD native", swift: true, cloud: false },
  { feature: "OCR sans IA tierce", swift: true, cloud: false },
];

export function WhySection() {
  return (
    <section className="mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-10"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-kayzen-green/10 px-4 py-1.5 text-xs font-semibold text-kayzen-green">
          <ShieldCheck className="h-3 w-3" />
          Sécurité de niveau professionnel
        </div>
        <h2 className="text-balance font-display text-2xl font-bold text-foreground md:text-3xl" style={{ lineHeight: "1.12" }}>
          Pourquoi SwiftConvert
          <br />
          <span className="text-primary">est différent ?</span>
        </h2>
      </motion.div>

      {/* Reasons */}
      <div className="space-y-4">
        {reasons.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, x: i % 2 === 0 ? -16 : 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.5,
              delay: i * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="glass-strong rounded-2xl p-6 md:p-7"
          >
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0 rounded-xl bg-primary/10 p-3">
                <r.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-display text-base font-bold text-foreground">
                    {r.title}
                  </h3>
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                    {r.badge}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                  {r.desc}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Comparison table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="mt-10"
      >
        <h3 className="font-display text-lg font-bold text-foreground text-center mb-5">
          SwiftConvert <span className="text-primary">vs</span> Outils Cloud
        </h3>
        <div className="glass-strong rounded-2xl overflow-hidden">
          <div className="grid grid-cols-3 gap-0">
            {/* Header */}
            <div className="border-b border-border px-4 py-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Critère</p>
            </div>
            <div className="border-b border-border px-4 py-3 text-center">
              <p className="text-xs font-bold text-primary uppercase tracking-wider">SwiftConvert</p>
            </div>
            <div className="border-b border-border px-4 py-3 text-center">
              <div className="flex items-center justify-center gap-1">
                <Server className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cloud</p>
              </div>
            </div>

            {/* Rows */}
            {comparison.map((row, i) => (
              <>
                <div key={`f-${i}`} className={`px-4 py-3 ${i < comparison.length - 1 ? "border-b border-border/50" : ""}`}>
                  <p className="text-xs font-medium text-foreground">{row.feature}</p>
                </div>
                <div key={`s-${i}`} className={`flex items-center justify-center px-4 py-3 ${i < comparison.length - 1 ? "border-b border-border/50" : ""}`}>
                  {row.swift ? (
                    <CheckCircle className="h-4 w-4 text-kayzen-green" />
                  ) : (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-kayzen-green/10">
                      <CloudOff className="h-3 w-3 text-kayzen-green" />
                    </div>
                  )}
                </div>
                <div key={`c-${i}`} className={`flex items-center justify-center px-4 py-3 ${i < comparison.length - 1 ? "border-b border-border/50" : ""}`}>
                  {row.cloud ? (
                    <XCircle className="h-4 w-4 text-destructive/60" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive/40" />
                  )}
                </div>
              </>
            ))}
          </div>
        </div>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          0% de risque de fuite de données · 100% de rapidité locale
        </p>
      </motion.div>

      {/* Technical specs bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6 glass rounded-2xl px-6 py-4"
      >
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {[
            { icon: Gauge, label: "Conversion < 2s", sub: "pour les images" },
            { icon: FileX, label: "0 fichier stocké", sub: "sur nos serveurs" },
            { icon: Lock, label: "Chiffrement navigateur", sub: "sandboxed" },
            { icon: Cpu, label: "Multi-thread", sub: "WebAssembly" },
          ].map((spec) => (
            <div key={spec.label} className="flex items-center gap-2.5">
              <spec.icon className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs font-semibold text-foreground">{spec.label}</p>
                <p className="text-[10px] text-muted-foreground">{spec.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
