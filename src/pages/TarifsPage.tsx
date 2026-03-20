import { motion } from "framer-motion";
import { Check, Zap, Shield, Building2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PageLayout } from "@/components/PageLayout";

const plans = [
  {
    name: "Découverte",
    price: "0 €",
    period: "pour toujours",
    description: "Idéal pour tester la puissance du traitement local.",
    icon: Zap,
    features: [
      "5 fichiers par jour",
      "Tous les outils PDF",
      "Traitement 100% local",
      "Aucune inscription requise",
      "Zéro collecte de données",
    ],
    cta: "Commencer gratuitement",
    ctaLink: "/",
    highlight: false,
  },
  {
    name: "Souverain",
    price: "49 €",
    period: "/ mois",
    description: "Pour les professionnels qui exigent confidentialité et performance.",
    icon: Shield,
    features: [
      "Fichiers illimités",
      "Tous les outils PDF (32 outils)",
      "Traitement 100% local",
      "Support prioritaire",
      "Conformité RGPD & HIPAA",
      "Mises à jour en avant-première",
    ],
    cta: "Choisir Souverain",
    ctaLink: "/",
    highlight: true,
  },
  {
    name: "Impact ESS",
    price: "Sur mesure",
    period: "",
    description: "Tarification solidaire pour l'Économie Sociale et Solidaire.",
    icon: Building2,
    features: [
      "Volume adapté à votre structure",
      "Tous les outils PDF",
      "Traitement 100% local",
      "Accompagnement dédié",
      "Conformité RGPD & HIPAA",
      "Facturation adaptée ESS",
    ],
    cta: "Nous contacter",
    ctaLink: "https://internet.kayzen-lyon.fr",
    highlight: false,
    external: true,
  },
];

export default function TarifsPage() {
  return (
    <PageLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-14"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
          Tarifs
        </div>
        <h1 className="text-balance font-display text-3xl font-bold text-foreground md:text-4xl" style={{ lineHeight: "1.12" }}>
          Un prix juste pour une
          <br />
          <span className="text-destructive">confidentialité absolue</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm text-muted-foreground text-pretty leading-relaxed">
          Pas de frais cachés. Pas de serveurs tiers. Choisissez la formule qui correspond à vos besoins.
        </p>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-3 mb-10">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={`relative rounded-2xl p-6 md:p-7 transition-shadow duration-300 ${
              plan.highlight ? "glass-strong ring-2 ring-primary/30 shadow-glow" : "glass"
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground">
                Populaire
              </div>
            )}

            <div className="mb-5">
              <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${plan.highlight ? "bg-primary/15" : "bg-secondary"}`}>
                <plan.icon className={`h-5 w-5 ${plan.highlight ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground">{plan.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-display text-3xl font-bold text-foreground">{plan.price}</span>
                {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
              </div>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{plan.description}</p>
            </div>

            <div className="mb-6 space-y-2.5">
              {plan.features.map((f) => (
                <div key={f} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-kayzen-green" />
                  <span className="text-xs leading-snug text-foreground">{f}</span>
                </div>
              ))}
            </div>

            {plan.external ? (
              <a
                href={plan.ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all active:scale-95 ${
                  plan.highlight
                    ? "bg-primary text-primary-foreground shadow-glow hover:brightness-110"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                {plan.cta}
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            ) : (
              <Link
                to={plan.ctaLink}
                className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all active:scale-95 ${
                  plan.highlight
                    ? "bg-primary text-primary-foreground shadow-glow hover:brightness-110"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                {plan.cta}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-center text-[11px] text-muted-foreground"
      >
        Tous les traitements sont effectués localement dans votre navigateur. Aucune donnée ne quitte votre appareil.
      </motion.p>
    </PageLayout>
  );
}
