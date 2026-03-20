import { PageLayout } from "@/components/PageLayout";
import { motion } from "framer-motion";

const CgvPage = () => {
  return (
    <PageLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-display prose-headings:tracking-tight prose-h1:text-2xl prose-h2:text-lg prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground"
      >
        <h1>Mentions Légales & CGV</h1>

        <h2>1. Éditeur du Service</h2>
        <p>
          <strong>KAYZEN SASU</strong> (Entreprise Sociale et Solidaire)<br />
          Siège social : 6 rue Pierre Termier, 69009 Lyon, France.<br />
          SIRET : 999 418 346 00014 | RCS : Lyon B 999 418 346.<br />
          Capital social : 1 000 €
        </p>

        <h2>2. Hébergement</h2>
        <p>
          <strong>EX2 Inc.</strong> (Infrastructure Éco-responsable)<br />
          Serveurs localisés exclusivement en France et dans l'Union Européenne.<br />
          Engagement éco-responsable : Datacenters alimentés par des énergies renouvelables.
        </p>

        <h2>3. Confidentialité & Sécurité RAM</h2>
        <p>
          DocuSûr s'engage contractuellement au respect du principe "Zéro stockage". Vos données sont traitées
          exclusivement en mémoire vive (RAM). Aucune donnée n'est écrite sur disque, persistée ou utilisée pour
          l'entraînement de modèles tiers.
        </p>

        <h2>4. Propriété Intellectuelle</h2>
        <p>
          Tous les droits relatifs à la marque DocuSûr, au logo et à la technologie propriétaire de traitement
          documentaire sont la propriété exclusive de KAYZEN SASU. Toute reproduction est interdite sans accord
          préalable.
        </p>

        <h2>5. Conditions Générales de Vente</h2>
        <p>
          L'accès au service DocuSûr est proposé selon deux formules : une offre gratuite avec limitations de volume
          et une offre payante avec accès illimité. Les prix sont indiqués en euros TTC. Le paiement s'effectue
          mensuellement ou annuellement selon la formule choisie.
        </p>

        <h2>6. Protection des Données (RGPD)</h2>
        <p>
          Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès,
          de rectification et de suppression de vos données personnelles. Pour exercer ces droits, contactez-nous à
          l'adresse : <strong>contact@kayzen.fr</strong>
        </p>
      </motion.div>
    </PageLayout>
  );
};

export default CgvPage;
