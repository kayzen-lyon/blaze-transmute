import { motion } from "framer-motion";
import { Check, X, Zap, Crown, Building2, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Gratuit",
    price: "0€",
    period: "pour toujours",
    desc: "Parfait pour un usage personnel occasionnel.",
    icon: Zap,
    featured: false,
    cta: "Commencer gratuitement",
    features: [
      { label: "5 conversions / jour", included: true },
      { label: "Fichiers jusqu'à 25 Mo", included: true },
      { label: "Conversion média (Image, Audio)", included: true },
      { label: "Outils PDF basiques (Fusionner, Diviser)", included: true },
      { label: "Traitement 100% local", included: true },
      { label: "OCR (reconnaissance de texte)", included: false },
      { label: "Signature électronique", included: false },
      { label: "Chiffrement AES-256", included: false },
      { label: "Conversion vidéo", included: false },
      { label: "Support prioritaire", included: false },
    ],
  },
  {
    name: "Pro",
    price: "49€",
    period: "/ mois",
    desc: "Pour les entreprises qui traitent des documents sensibles au quotidien.",
    icon: Crown,
    featured: true,
    cta: "Essai gratuit 14 jours",
    features: [
      { label: "Conversions illimitées", included: true },
      { label: "Fichiers jusqu'à 2 Go", included: true },
      { label: "Tous les outils média", included: true },
      { label: "Tous les outils PDF (32 outils)", included: true },
      { label: "Traitement 100% local", included: true },
      { label: "OCR intelligent (Tesseract.js)", included: true },
      { label: "Signature + horodatage", included: true },
      { label: "Chiffrement AES-256", included: true },
      { label: "Conversion vidéo (FFmpeg.wasm)", included: true },
      { label: "Support prioritaire par email", included: true },
    ],
  },
  {
    name: "Entreprise",
    price: "Sur devis",
    period: "",
    desc: "Solution sur-mesure hébergée et personnalisée par l'agence Kayzen Web.",
    icon: Building2,
    featured: false,
    cta: "Contacter Kayzen Web",
    ctaLink: "https://internet.kayzen-lyon.fr",
    features: [
      { label: "Tout le plan Pro inclus", included: true },
      { label: "Taille de fichier illimitée", included: true },
      { label: "Instance dédiée auto-hébergée", included: true },
      { label: "Intégration API personnalisée", included: true },
      { label: "Branding personnalisé (white-label)", included: true },
      { label: "Automatisation des workflows PDF", included: true },
      { label: "Conformité RGPD renforcée", included: true },
      { label: "SLA garanti 99,9%", included: true },
      { label: "Audit de sécurité dédié", included: true },
      { label: "Support téléphonique prioritaire", included: true },
    ],
  },
];

export function PricingSection() {
  return (
    <section className="mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-12"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
          <Crown className="h-3 w-3" />
          Tarifs transparents
        </div>
        <h2
          className="text-balance font-display text-2xl font-bold text-foreground md:text-3xl"
          style={{ lineHeight: "1.12" }}
        >
          Choisissez votre formule
          <br />
          <span className="text-primary">DocuSûr</span>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground text-pretty leading-relaxed">
          Commencez gratuitement. Passez Pro quand vous en avez besoin. Aucune donnée collectée, quelle que soit la formule.
        </p>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-3">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={`relative rounded-2xl p-6 md:p-7 transition-shadow duration-300 ${
              plan.featured
                ? "glass-strong ring-2 ring-primary/30 shadow-glow"
                : "glass"
            }`}
          >
            {plan.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground">
                Populaire
              </div>
            )}

            <div className="mb-5">
              <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${plan.featured ? "bg-primary/15" : "bg-secondary"}`}>
                <plan.icon className={`h-5 w-5 ${plan.featured ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground">{plan.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-display text-3xl font-bold text-foreground">{plan.price}</span>
                {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{plan.desc}</p>
            </div>

            <div className="mb-6 space-y-2.5">
              {plan.features.map((f) => (
                <div key={f.label} className="flex items-start gap-2.5">
                  {f.included ? (
                    <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-kayzen-green" />
                  ) : (
                    <X className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/40" />
                  )}
                  <span className={`text-xs leading-snug ${f.included ? "text-foreground" : "text-muted-foreground/50"}`}>
                    {f.label}
                  </span>
                </div>
              ))}
            </div>

            {plan.ctaLink ? (
              <a
                href={plan.ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all active:scale-95 ${
                  plan.featured
                    ? "bg-primary text-primary-foreground shadow-glow hover:brightness-110"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                {plan.cta}
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            ) : (
              <button
                className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all active:scale-95 ${
                  plan.featured
                    ? "bg-primary text-primary-foreground shadow-glow hover:brightness-110"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                {plan.cta}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-6 text-center text-[11px] text-muted-foreground"
      >
        Toutes les formules incluent le traitement 100% local · Aucune donnée collectée · Annulation à tout moment
      </motion.p>
    </section>
  );
}
