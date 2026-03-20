import { motion } from "framer-motion";
import { Shield, Heart, Zap, Leaf, MapPin } from "lucide-react";
import { PageLayout } from "@/components/PageLayout";

const pillars = [
  {
    icon: Shield,
    title: "Souveraineté French Tech",
    desc: "Labellisé French Tech, chaque ligne de code et chaque octet de donnée reste sous juridiction française.",
  },
  {
    icon: Zap,
    title: "Sécurité RAM-Only",
    desc: "Zéro écriture disque. Vos fichiers transitent uniquement par la mémoire vive pour un traitement instantané.",
  },
  {
    icon: Heart,
    title: "Statut ESS (Kayzen)",
    desc: "KAYZEN SASU réinvestit ses bénéfices dans l'innovation sociale et la protection du patrimoine numérique.",
  },
];

const steps = [
  { num: "1", title: "Traitement en RAM", desc: "Aucune donnée écrite sur disque dur." },
  { num: "2", title: "LLM Local", desc: "IA auto-hébergée, aucune donnée sortante." },
  { num: "3", title: "Zéro Entraînement", desc: "Vos documents ne servent jamais à l'entraînement." },
];

const AboutPage = () => {
  return (
    <PageLayout>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-16"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-1.5 text-xs font-semibold text-destructive">
          <Heart className="h-3 w-3" />
          Économie Sociale et Solidaire
        </div>
        <h1 className="text-balance font-display text-3xl font-bold text-foreground md:text-4xl" style={{ lineHeight: "1.12" }}>
          Plus qu'un outil,
          <br />
          <span className="text-primary">un engagement éthique.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-sm text-muted-foreground text-pretty leading-relaxed">
          DocuSûr est né d'une conviction : la sécurité de vos documents ne doit pas être un luxe.
          En tant que service de l'ESS Kayzen, notre mission est l'impact, pas seulement le profit.
        </p>
      </motion.div>

      {/* Pillars */}
      <div className="grid gap-5 md:grid-cols-3 mb-20">
        {pillars.map((pillar, i) => (
          <motion.div
            key={pillar.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="glass rounded-2xl p-6"
          >
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <pillar.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-display text-base font-bold text-foreground mb-2">{pillar.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{pillar.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Story */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="glass rounded-2xl p-8 md:p-10 mb-16"
      >
        <h2 className="text-balance font-display text-2xl font-bold text-foreground mb-4" style={{ lineHeight: "1.15" }}>
          Ancré à Lyon,
          <br />
          <span className="text-primary">Rayonnant en Europe.</span>
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Basés au cœur du 9ème arrondissement de Lyon, nous concevons des solutions de pointe au sein de l'un des
          pôles technologiques les plus dynamiques de France.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          Notre choix d'hébergement s'est porté sur{" "}
          <span className="font-semibold text-kayzen-green">EX2 Éco</span>, un partenaire partageant nos valeurs
          d'éco-responsabilité.
        </p>

        <div className="flex flex-wrap gap-3 mb-8">
          <div className="flex items-center gap-1.5 rounded-full bg-kayzen-green/10 px-3 py-1.5 text-[11px] font-bold text-kayzen-green">
            <Leaf className="h-3 w-3" /> Éco-responsable
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-[11px] font-bold text-primary">
            <MapPin className="h-3 w-3" /> Lyon, France
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-xl bg-secondary p-4"
            >
              <div className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                {step.num}
              </div>
              <h4 className="font-display text-sm font-bold text-foreground mb-1">{step.title}</h4>
              <p className="text-[11px] text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Legal Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="font-display text-xl font-bold text-foreground mb-4">Transparence Totale</h2>
        <p className="text-sm text-muted-foreground mb-6">
          En tant qu'entreprise de l'ESS, nous publions régulièrement nos rapports d'impact.
        </p>
        <div className="flex justify-center gap-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">SIRET</p>
            <p className="font-display text-sm font-bold text-foreground">999 418 346 00014</p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">RCS</p>
            <p className="font-display text-sm font-bold text-foreground">Lyon B 999 418 346</p>
          </div>
        </div>
      </motion.div>
    </PageLayout>
  );
};

export default AboutPage;
