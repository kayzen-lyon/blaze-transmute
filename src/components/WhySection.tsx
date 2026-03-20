import { motion } from "framer-motion";
import { ShieldCheck, Trash2, Cpu, Lock, FileX, Gauge } from "lucide-react";

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
    desc: "En utilisant les ressources de votre processeur (WebAssembly), SwiftConvert traite vos fichiers à la vitesse de l'éclair, sans file d'attente.",
    badge: "WebAssembly",
  },
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

      <div className="space-y-4">
        {reasons.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, x: i % 2 === 0 ? -16 : 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.5,
              delay: i * 0.1,
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
