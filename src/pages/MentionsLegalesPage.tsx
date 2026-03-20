import { PageLayout } from "@/components/PageLayout";
import { motion } from "framer-motion";

const MentionsLegalesPage = () => {
  return (
    <PageLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-display prose-headings:tracking-tight prose-h1:text-2xl prose-h2:text-lg prose-p:text-muted-foreground prose-p:leading-relaxed"
      >
        <h1>Mentions Légales</h1>

        <h2>1. Éditeur du site</h2>
        <p>
          <strong>KAYZEN SASU</strong> (Entreprise Sociale et Solidaire)<br />
          Siège social : 6 rue Pierre Termier, 69009 Lyon, France<br />
          SIRET : 999 418 346 00014 | RCS : Lyon B 999 418 346<br />
          Capital social : 1 000 €<br />
          Directeur de la publication : Le représentant légal de KAYZEN SASU<br />
          Contact : contact@kayzen.fr
        </p>

        <h2>2. Hébergement</h2>
        <p>
          <strong>EX2 Inc.</strong><br />
          Infrastructure éco-responsable, serveurs localisés en France et dans l'Union Européenne.<br />
          Datacenters alimentés par des énergies renouvelables.
        </p>

        <h2>3. Propriété intellectuelle</h2>
        <p>
          L'ensemble du contenu du site DocuSûr (textes, graphismes, logo, icônes, code source) est la propriété
          exclusive de KAYZEN SASU ou de ses partenaires. Toute reproduction, représentation, modification ou
          exploitation non autorisée est interdite et constitue une contrefaçon au sens des articles L.335-2 et
          suivants du Code de la propriété intellectuelle.
        </p>

        <h2>4. Limitation de responsabilité</h2>
        <p>
          KAYZEN SASU s'efforce de fournir des informations aussi précises que possible. Toutefois, elle ne pourra
          être tenue responsable des omissions, inexactitudes ou carences dans la mise à jour. L'utilisation des
          outils DocuSûr se fait sous la responsabilité de l'utilisateur.
        </p>

        <h2>5. Droit applicable</h2>
        <p>
          Le présent site et ses conditions d'utilisation sont régis par le droit français. Tout litige sera soumis
          à la compétence exclusive des tribunaux de Lyon.
        </p>
      </motion.div>
    </PageLayout>
  );
};

export default MentionsLegalesPage;
