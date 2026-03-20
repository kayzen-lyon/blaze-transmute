import { motion } from "framer-motion";
import {
  Image, FileText, Music, Video,
  Merge, Scissors, ScanText, PenTool,
  ArrowRightLeft, Zap, RotateCw, GripVertical,
  Wrench, Hash, Droplets, Type, Crop,
  EyeOff, Lock, Unlock, Trash2, Archive,
  FileImage, FileSpreadsheet, Presentation,
  Globe, GitCompare, Camera, Shield,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ToolCategory = "media" | "pdf-manage" | "pdf-edit" | "pdf-security" | "pdf-convert" | "pdf-advanced";

export interface Tool {
  id: string;
  label: string;
  desc: string;
  icon: LucideIcon;
  category: ToolCategory;
  color: string;
  iconColor: string;
  acceptTypes?: string;
}

export const ALL_TOOLS: Tool[] = [
  // ===== MÉDIA =====
  { id: "convert-image", label: "Convertir Image", desc: "PNG, JPG, WebP, GIF, BMP", icon: Image, category: "media", color: "bg-primary/10", iconColor: "text-primary", acceptTypes: "image/*" },
  { id: "convert-audio", label: "Convertir Audio", desc: "MP3, WAV, AAC, OGG, FLAC", icon: Music, category: "media", color: "bg-accent/10", iconColor: "text-accent", acceptTypes: "audio/*" },
  { id: "convert-video", label: "Convertir Vidéo", desc: "MP4, WebM, AVI, MOV", icon: Video, category: "media", color: "bg-kayzen-glow/10", iconColor: "text-kayzen-glow", acceptTypes: "video/*" },

  // ===== PDF — GESTION =====
  { id: "fusionner", label: "Fusionner", desc: "Combiner plusieurs PDF", icon: Merge, category: "pdf-manage", color: "bg-destructive/10", iconColor: "text-destructive", acceptTypes: "application/pdf" },
  { id: "diviser", label: "Diviser", desc: "Séparer chaque page", icon: Scissors, category: "pdf-manage", color: "bg-destructive/10", iconColor: "text-destructive", acceptTypes: "application/pdf" },
  { id: "compresser", label: "Compresser", desc: "Réduire la taille", icon: Archive, category: "pdf-manage", color: "bg-destructive/10", iconColor: "text-destructive", acceptTypes: "application/pdf" },
  { id: "pivoter", label: "Pivoter", desc: "Rotation des pages", icon: RotateCw, category: "pdf-manage", color: "bg-destructive/10", iconColor: "text-destructive", acceptTypes: "application/pdf" },
  { id: "organiser", label: "Réorganiser", desc: "Changer l'ordre", icon: GripVertical, category: "pdf-manage", color: "bg-destructive/10", iconColor: "text-destructive", acceptTypes: "application/pdf" },
  { id: "reparer", label: "Réparer", desc: "Reconstruire un PDF", icon: Wrench, category: "pdf-manage", color: "bg-destructive/10", iconColor: "text-destructive", acceptTypes: "application/pdf" },

  // ===== PDF — ÉDITION =====
  { id: "numeros", label: "N° de page", desc: "Ajouter la numérotation", icon: Hash, category: "pdf-edit", color: "bg-primary/10", iconColor: "text-primary", acceptTypes: "application/pdf" },
  { id: "filigrane", label: "Filigrane", desc: "Ajouter un watermark", icon: Droplets, category: "pdf-edit", color: "bg-primary/10", iconColor: "text-primary", acceptTypes: "application/pdf" },
  { id: "modifier", label: "Ajouter texte", desc: "Insérer du texte", icon: Type, category: "pdf-edit", color: "bg-primary/10", iconColor: "text-primary", acceptTypes: "application/pdf" },
  { id: "signer", label: "Signer", desc: "Signature + horodatage", icon: PenTool, category: "pdf-edit", color: "bg-primary/10", iconColor: "text-primary", acceptTypes: "application/pdf" },
  { id: "rogner", label: "Rogner", desc: "Recadrer les pages", icon: Crop, category: "pdf-edit", color: "bg-primary/10", iconColor: "text-primary", acceptTypes: "application/pdf" },
  { id: "censurer", label: "Censurer", desc: "Masquer du texte", icon: EyeOff, category: "pdf-edit", color: "bg-primary/10", iconColor: "text-primary", acceptTypes: "application/pdf" },

  // ===== PDF — SÉCURITÉ =====
  { id: "proteger", label: "Chiffrer (AES-256)", desc: "Protection par mot de passe", icon: Lock, category: "pdf-security", color: "bg-kayzen-green/10", iconColor: "text-kayzen-green", acceptTypes: "application/pdf" },
  { id: "deverrouiller", label: "Déchiffrer", desc: "Retirer la protection", icon: Unlock, category: "pdf-security", color: "bg-kayzen-green/10", iconColor: "text-kayzen-green" },
  { id: "purge-adn", label: "Purge ADN", desc: "Supprimer les métadonnées", icon: Trash2, category: "pdf-security", color: "bg-kayzen-green/10", iconColor: "text-kayzen-green", acceptTypes: "application/pdf" },

  // ===== PDF — CONVERSION =====
  { id: "pdf-jpg", label: "PDF → JPG", desc: "Extraire en images", icon: FileImage, category: "pdf-convert", color: "bg-accent/10", iconColor: "text-accent", acceptTypes: "application/pdf" },
  { id: "jpg-pdf", label: "Images → PDF", desc: "Combiner en PDF", icon: FileText, category: "pdf-convert", color: "bg-accent/10", iconColor: "text-accent" },
  { id: "pdf-word", label: "PDF → Word", desc: "Extraire en .doc", icon: FileText, category: "pdf-convert", color: "bg-accent/10", iconColor: "text-accent", acceptTypes: "application/pdf" },
  { id: "pdf-excel", label: "PDF → Excel", desc: "Extraire en .xlsx", icon: FileSpreadsheet, category: "pdf-convert", color: "bg-accent/10", iconColor: "text-accent", acceptTypes: "application/pdf" },
  { id: "pdf-ppt", label: "PDF → PPT", desc: "Convertir en slides", icon: Presentation, category: "pdf-convert", color: "bg-accent/10", iconColor: "text-accent", acceptTypes: "application/pdf" },
  { id: "word-pdf", label: "Word → PDF", desc: "Convertir .docx", icon: FileText, category: "pdf-convert", color: "bg-accent/10", iconColor: "text-accent" },
  { id: "excel-pdf", label: "Excel → PDF", desc: "Convertir .xlsx", icon: FileSpreadsheet, category: "pdf-convert", color: "bg-accent/10", iconColor: "text-accent" },
  { id: "ppt-pdf", label: "PPT → PDF", desc: "Convertir .pptx", icon: Presentation, category: "pdf-convert", color: "bg-accent/10", iconColor: "text-accent" },
  { id: "html-pdf", label: "HTML → PDF", desc: "Convertir .html", icon: Globe, category: "pdf-convert", color: "bg-accent/10", iconColor: "text-accent" },
  { id: "pdf-a", label: "PDF/A Archive", desc: "Format d'archivage", icon: Archive, category: "pdf-convert", color: "bg-accent/10", iconColor: "text-accent", acceptTypes: "application/pdf" },
  { id: "numeriser", label: "Scan → PDF", desc: "Images en PDF", icon: Camera, category: "pdf-convert", color: "bg-accent/10", iconColor: "text-accent" },

  // ===== PDF — AVANCÉ =====
  { id: "ocr", label: "OCR (Texte)", desc: "Reconnaissance de texte", icon: ScanText, category: "pdf-advanced", color: "bg-destructive/10", iconColor: "text-destructive" },
  { id: "comparer", label: "Comparer", desc: "Différences entre 2 PDF", icon: GitCompare, category: "pdf-advanced", color: "bg-destructive/10", iconColor: "text-destructive", acceptTypes: "application/pdf" },
];

const SECTIONS: { category: ToolCategory; title: string; icon: LucideIcon; iconColor: string }[] = [
  { category: "media", title: "Conversion Média", icon: ArrowRightLeft, iconColor: "text-primary" },
  { category: "pdf-manage", title: "Gestion PDF", icon: FileText, iconColor: "text-destructive" },
  { category: "pdf-edit", title: "Édition PDF", icon: PenTool, iconColor: "text-primary" },
  { category: "pdf-security", title: "Sécurité", icon: Shield, iconColor: "text-kayzen-green" },
  { category: "pdf-convert", title: "Conversion", icon: ArrowRightLeft, iconColor: "text-accent" },
  { category: "pdf-advanced", title: "IA & Avancé", icon: ScanText, iconColor: "text-destructive" },
];

interface ToolGridProps {
  onSelectTool: (tool: Tool) => void;
}

export function ToolGrid({ onSelectTool }: ToolGridProps) {
  let globalIdx = 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="space-y-7"
    >
      {SECTIONS.map((section) => {
        const tools = ALL_TOOLS.filter((t) => t.category === section.category);
        if (tools.length === 0) return null;
        return (
          <div key={section.category}>
            <div className="mb-3 flex items-center gap-2 px-1">
              <section.icon className={`h-3.5 w-3.5 ${section.iconColor}`} />
              <h2 className={`text-xs font-bold uppercase tracking-wider ${section.iconColor}`}>
                {section.title}
              </h2>
              <span className="text-[10px] text-muted-foreground">({tools.length})</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {tools.map((tool) => {
                const idx = globalIdx++;
                return (
                  <ToolCard key={tool.id} tool={tool} index={idx} onClick={() => onSelectTool(tool)} />
                );
              })}
            </div>
          </div>
        );
      })}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center justify-center gap-2 text-xs text-muted-foreground"
      >
        <Zap className="h-3 w-3 text-primary" fill="currentColor" />
        <span>{ALL_TOOLS.length} outils · 100% dans votre navigateur · aucun serveur</span>
      </motion.div>
    </motion.div>
  );
}

function ToolCard({ tool, index, onClick }: { tool: Tool; index: number; onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        duration: 0.4,
        delay: 0.1 + Math.min(index, 15) * 0.03,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="group glass rounded-xl p-3.5 text-left transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${tool.color} transition-transform duration-200 group-hover:scale-110`}>
        <tool.icon className={`h-4 w-4 ${tool.iconColor}`} />
      </div>
      <h3 className="font-display text-xs font-bold text-foreground leading-tight">
        {tool.label}
      </h3>
      <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground line-clamp-2">
        {tool.desc}
      </p>
    </motion.button>
  );
}
