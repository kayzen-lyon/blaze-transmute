import { motion } from "framer-motion";
import { ShieldCheck, Server, Lock, Globe, Zap, Heart, Shield, Gauge, FileCheck, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { tools } from "@/constants/tools";
import { ToolCard } from "@/components/docusur/ToolCard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Index = () => {
  const featuredTools = tools.filter((t) =>
    ["fusionner", "compresser", "signer", "ocr", "proteger", "analyse-structure"].includes(t.id)
  );

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      {/* Hero */}
      <section className="relative pt-24 pb-16 text-center overflow-hidden">
        <motion.div variants={itemVariants} className="max-w-4xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-3 mb-7">
            <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest">
              <Zap className="w-3 h-3 text-destructive" /> Labellisé French Tech
            </span>
            <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-destructive/10 text-destructive text-xs font-bold uppercase tracking-widest">
              <Heart className="w-3 h-3" /> Service de l'ESS Kayzen
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[0.95] text-primary">
            DocuSûr.
            <br />
            <span className="text-destructive">Zéro stockage. 100% Français.</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto font-medium leading-relaxed">
            L'outil PDF souverain pour les professionnels. {tools.length} outils de traitement radical en mémoire vive (RAM) : vos données ne sont jamais écrites sur disque.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/outils" className="bg-primary text-primary-foreground px-7 py-3.5 rounded-lg font-bold text-base hover:opacity-90 transition shadow-md">
              Accéder aux {tools.length} outils
            </Link>
            <Link to="/securite" className="bg-secondary border border-border px-7 py-3.5 rounded-lg font-bold text-base hover:bg-accent transition">
              Découvrir la sécurité
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Differentiator */}
      <motion.section variants={itemVariants} className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-destructive mb-4">Pourquoi DocuSûr</p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-primary mb-6 leading-tight">
              La Suite PDF Privée la plus<br /><span className="text-destructive">avancée du marché.</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Vous cherchez une alternative à Adobe ou iLovePDF, mais vous ne pouvez pas laisser vos documents transiter sur des serveurs tiers ?{" "}
              <span className="font-bold text-foreground">DocuSûr est la solution.</span>
            </p>
          </div>

          <motion.div variants={itemVariants} className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-8 md:p-10 mb-14 text-center shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-3">Le Différenciateur Technique</p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              DocuSûr utilise le <span className="font-extrabold text-primary">WebAssembly (WASM)</span> et la{" "}
              <span className="font-extrabold text-primary">Web Crypto API</span> pour transformer votre navigateur en un{" "}
              <span className="text-foreground font-semibold">laboratoire de traitement sécurisé</span>.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: Shield, title: "Zéro Infrastructure", description: "Aucun serveur, aucun risque de fuite. Vos fichiers restent dans votre navigateur.", accent: "text-primary" },
              { icon: FileCheck, title: "Conformité Totale", description: "RGPD, HIPAA, secrets professionnels. Aucune donnée ne quitte votre appareil.", accent: "text-destructive" },
              { icon: Gauge, title: "Vitesse Pure", description: "Pas d'upload. Traitement instantané grâce au moteur WebAssembly local.", accent: "text-primary" },
            ].map((pillar, i) => (
              <motion.div key={i} variants={itemVariants} whileHover={{ y: -4 }} className="group relative rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md p-8 text-center shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="relative z-10 flex flex-col items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center ${pillar.accent} transition-transform duration-200 group-hover:scale-110`}>
                    <pillar.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-primary">{pillar.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{pillar.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Trust Bar */}
      <motion.section variants={itemVariants} className="py-8 border-y border-border bg-secondary/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-[10px]">
            <ShieldCheck className="text-primary w-4 h-4" /> Conformité RGPD
          </div>
          <div className="flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-[10px]">
            <Server className="text-destructive w-4 h-4" /> Infrastructure Lyon/FR
          </div>
          <div className="flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-[10px]">
            <Lock className="text-primary w-4 h-4" /> Sécurité RAM-Only
          </div>
          <div className="flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-[10px]">
            <Globe className="text-destructive w-4 h-4" /> Hébergement EX2 Éco
          </div>
        </div>
      </motion.section>

      {/* Featured Tools */}
      <motion.section variants={itemVariants} className="py-20 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-2">Efficacité. Simplicité. Sécurité.</h2>
            <p className="text-muted-foreground">Une suite complète d'outils PDF pour votre productivité.</p>
          </div>
          <Link to="/outils" className="text-destructive font-bold flex items-center gap-1 hover:underline text-sm">
            Tous les outils <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredTools.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Index;
