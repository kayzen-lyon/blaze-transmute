import { motion } from "framer-motion";
import { ShieldCheck, BrainCircuit, Heart, Lock, Box, Database } from "lucide-react";
import { Link } from "react-router-dom";
import { PageLayout } from "@/components/PageLayout";

const pillars = [
  {
    icon: ShieldCheck,
    title: "Souveraineté French Tech",
    description: "Vos fichiers ne traversent jamais l'Atlantique. Hébergé exclusivement sur des serveurs EX2 Éco en France.",
  },
  {
    icon: BrainCircuit,
    title: "IA RAM-Only & Privée",
    description: "Moteur de traitement s'exécutant uniquement en mémoire vive. Zéro écriture disque, destruction immédiate.",
  },
  {
    icon: Heart,
    title: "Engagement ESS (Kayzen)",
    description: "Notre mission est l'impact social et la protection radicale de vos données, pas seulement le profit.",
  },
];

const techDetails = [
  { icon: Lock, title: "Chiffrement de bout en bout", desc: "Transferts SSL/TLS 1.3, AES-256 au repos." },
  { icon: Box, title: "Isolation par Sandboxing", desc: "Opérations dans des containers isolés et éphémères." },
  { icon: Database, title: "Zéro Persistance", desc: "Systèmes de fichiers temporaires (tmpfs) uniquement." },
];

const SecurityPage = () => {
  return (
    <PageLayout>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-16"
      >
        <h1 className="text-balance font-display text-3xl font-bold text-foreground md:text-4xl" style={{ lineHeight: "1.12" }}>
          Votre confidentialité n'est pas une option.
          <br />
          <span className="text-primary">C'est notre architecture.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-sm text-muted-foreground text-pretty leading-relaxed">
          Découvrez comment DocuSûr protège vos documents grâce à une infrastructure 100% française.
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
            <p className="text-xs text-muted-foreground leading-relaxed">{pillar.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Technical Focus */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <h2 className="text-balance font-display text-2xl font-bold text-foreground mb-8 text-center" style={{ lineHeight: "1.15" }}>
          Une ingénierie de pointe pour une protection maximale.
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {techDetails.map((tech, i) => (
            <motion.div
              key={tech.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass rounded-2xl p-6"
            >
              <tech.icon className="h-5 w-5 text-destructive mb-3" />
              <h4 className="font-display text-sm font-bold text-foreground mb-1">{tech.title}</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{tech.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="glass-strong rounded-2xl p-8 text-center"
      >
        <h3 className="font-display text-lg font-bold text-foreground mb-2">
          Besoin d'une instance privée pour votre entreprise ?
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Nous proposons des déploiements sur-mesure pour les secteurs critiques (santé, défense, finance).
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="https://internet.kayzen-lyon.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-95"
          >
            Contacter notre expert sécurité
          </a>
          <Link
            to="/a-propos"
            className="rounded-xl bg-secondary px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-secondary/80 active:scale-95"
          >
            En savoir plus
          </Link>
        </div>
      </motion.div>
    </PageLayout>
  );
};

export default SecurityPage;
