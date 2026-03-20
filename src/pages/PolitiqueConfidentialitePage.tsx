import { PageLayout } from "@/components/PageLayout";
import { motion } from "framer-motion";

const PolitiqueConfidentialitePage = () => {
  return (
    <PageLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-display prose-headings:tracking-tight prose-h1:text-2xl prose-h2:text-lg prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-strong:text-foreground"
      >
        <h1>Politique de Confidentialité</h1>
        <p>
          Dernière mise à jour : 18 mars 2026. Cette politique décrit comment KAYZEN SASU (ESS), éditeur de DocuSûr,
          traite vos données personnelles conformément au RGPD (Règlement UE 2016/679).
        </p>

        <h2>1. Responsable du traitement</h2>
        <p>
          <strong>KAYZEN SASU</strong> (Entreprise Sociale et Solidaire)<br />
          6 rue Pierre Termier, 69009 Lyon, France<br />
          SIRET : 999 418 346 00014<br />
          Contact DPO : contact@kayzen.fr
        </p>

        <h2>2. Données collectées</h2>
        <p>
          DocuSûr est conçu selon le principe de <strong>minimisation des données</strong>. Nous ne collectons{" "}
          <strong>aucune donnée personnelle</strong> lors de l'utilisation des outils PDF.
        </p>
        <ul>
          <li>
            <strong>Fichiers PDF :</strong> Traités exclusivement dans la mémoire vive (RAM) de votre navigateur.
            Aucun fichier n'est uploadé, stocké ou transmis à un serveur.
          </li>
          <li>
            <strong>Cookies techniques :</strong> Préférence de thème (clair/sombre), consentement cookies.
            Aucun cookie de tracking ou publicitaire.
          </li>
          <li>
            <strong>Données de navigation :</strong> Aucun outil d'analytics tiers n'est utilisé.
          </li>
        </ul>

        <h2>3. Base légale du traitement</h2>
        <p>
          Les cookies techniques sont traités sur la base de l'<strong>intérêt légitime</strong> (fonctionnement du
          service). Aucun traitement supplémentaire n'est effectué, rendant le consentement non requis au sens de
          l'article 6 du RGPD pour ces cookies strictement nécessaires.
        </p>

        <h2>4. Durée de conservation</h2>
        <p>
          Les préférences (thème, consentement) sont stockées dans le localStorage de votre navigateur et persistent
          jusqu'à leur suppression manuelle. Aucune donnée n'est conservée côté serveur.
        </p>

        <h2>5. Transfert de données</h2>
        <p>
          Aucun transfert de données personnelles n'est effectué vers des pays tiers. L'hébergement est assuré par
          EX2 Inc. sur des serveurs localisés exclusivement en France et dans l'Union Européenne.
        </p>

        <h2>6. Vos droits (RGPD)</h2>
        <p>Conformément aux articles 15 à 22 du RGPD, vous disposez des droits suivants :</p>
        <ul>
          <li>Droit d'accès à vos données personnelles</li>
          <li>Droit de rectification</li>
          <li>Droit à l'effacement (« droit à l'oubli »)</li>
          <li>Droit à la limitation du traitement</li>
          <li>Droit à la portabilité des données</li>
          <li>Droit d'opposition</li>
        </ul>
        <p>
          Pour exercer ces droits : <strong>contact@kayzen.fr</strong>
        </p>

        <h2>7. Réclamation</h2>
        <p>
          Si vous estimez que le traitement de vos données constitue une violation du RGPD, vous pouvez introduire
          une réclamation auprès de la <strong>CNIL</strong> (Commission Nationale de l'Informatique et des
          Libertés) — <a href="https://www.cnil.fr/" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>.
        </p>

        <h2>8. Sécurité technique</h2>
        <p>
          DocuSûr utilise le chiffrement AES-256-GCM via la Web Crypto API et le traitement WebAssembly (WASM) pour
          garantir que vos documents ne quittent jamais votre appareil. Aucune donnée n'est écrite sur disque ni
          transmise sur le réseau.
        </p>
      </motion.div>
    </PageLayout>
  );
};

export default PolitiqueConfidentialitePage;
