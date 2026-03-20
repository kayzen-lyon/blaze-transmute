import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, FileText } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 pb-12">
      {/* About / Docusûr */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="glass rounded-2xl p-6 md:p-7 mb-6"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 rounded-xl bg-primary/10 p-3">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-foreground mb-2">
              À propos de SwiftConvert
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
              SwiftConvert regroupe le meilleur de nos technologies (incluant le moteur <span className="font-semibold text-foreground">Docusûr</span>) pour offrir aux entreprises lyonnaises un outil de productivité souverain. Conversion média, manipulation PDF, OCR intelligent — tout fonctionne sans serveur distant.
            </p>
          </div>
        </div>
      </motion.div>

      {/* CTA Agence */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="glass-strong rounded-3xl p-8 md:p-10 text-center"
      >
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <Shield className="h-7 w-7 text-primary" />
        </div>
        <h3 className="font-display text-xl font-bold text-foreground md:text-2xl" style={{ lineHeight: "1.15" }}>
          Votre entreprise mérite un site
          <br />
          <span className="text-primary">aussi performant et sécurisé</span> que cet outil.
        </h3>
        <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground text-pretty leading-relaxed">
          Besoin d'une solution sur-mesure pour automatiser vos processus PDF ? Nous concevons des applications web pour les entreprises qui ne transigent pas sur la performance et la sécurité des données.
        </p>
        <a
          href="https://www.kayzen-lyon.fr"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:brightness-110 active:scale-95"
        >
          <Zap className="h-4 w-4" fill="currentColor" />
          Contactez l'agence Kayzen
          <ArrowRight className="h-4 w-4" />
        </a>
      </motion.div>

      {/* Bottom bar */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-8 flex flex-col items-center gap-3 text-center"
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} SwiftConvert</span>
          <span className="text-border">·</span>
          <span>Un outil</span>
          <a
            href="https://www.kayzen-lyon.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary transition-colors hover:text-primary/80"
          >
            Kayzen Lyon
          </a>
        </div>
        <p className="text-[11px] text-muted-foreground/60">
          Aucune donnée collectée · Aucun cookie · Moteur Docusûr intégré · 100% local
        </p>
      </motion.div>
    </footer>
  );
}
