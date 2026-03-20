import { motion } from "framer-motion";
import {
  Image, FileText, Music, Video,
  Merge, Scissors, ScanText, PenTool,
  ArrowRightLeft, Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ToolId =
  | "convert-image"
  | "convert-audio"
  | "convert-video"
  | "pdf-merge"
  | "pdf-split"
  | "pdf-ocr"
  | "pdf-sign";

export interface Tool {
  id: ToolId;
  label: string;
  desc: string;
  icon: LucideIcon;
  category: "media" | "pdf";
  color: string; // tailwind bg class
  iconColor: string;
  acceptTypes?: string;
}

export const ALL_TOOLS: Tool[] = [
  {
    id: "convert-image",
    label: "Convertir Image",
    desc: "PNG, JPG, WebP, GIF, BMP",
    icon: Image,
    category: "media",
    color: "bg-primary/10",
    iconColor: "text-primary",
    acceptTypes: "image/*",
  },
  {
    id: "convert-audio",
    label: "Convertir Audio",
    desc: "MP3, WAV, AAC, OGG, FLAC",
    icon: Music,
    category: "media",
    color: "bg-accent/10",
    iconColor: "text-accent",
    acceptTypes: "audio/*",
  },
  {
    id: "convert-video",
    label: "Convertir Vidéo",
    desc: "MP4, WebM, AVI, MOV",
    icon: Video,
    category: "media",
    color: "bg-kayzen-glow/10",
    iconColor: "text-kayzen-glow",
    acceptTypes: "video/*",
  },
  {
    id: "pdf-merge",
    label: "Fusionner PDF",
    desc: "Combiner plusieurs PDF en un",
    icon: Merge,
    category: "pdf",
    color: "bg-destructive/10",
    iconColor: "text-destructive",
    acceptTypes: "application/pdf",
  },
  {
    id: "pdf-split",
    label: "Diviser PDF",
    desc: "Séparer chaque page",
    icon: Scissors,
    category: "pdf",
    color: "bg-destructive/10",
    iconColor: "text-destructive",
    acceptTypes: "application/pdf",
  },
  {
    id: "pdf-ocr",
    label: "OCR (Texte)",
    desc: "Extraire le texte d'un scan",
    icon: ScanText,
    category: "pdf",
    color: "bg-destructive/10",
    iconColor: "text-destructive",
    acceptTypes: "application/pdf",
  },
  {
    id: "pdf-sign",
    label: "Signer PDF",
    desc: "Signature manuscrite + horodatage",
    icon: PenTool,
    category: "pdf",
    color: "bg-destructive/10",
    iconColor: "text-destructive",
    acceptTypes: "application/pdf",
  },
];

interface ToolGridProps {
  onSelectTool: (tool: Tool) => void;
}

export function ToolGrid({ onSelectTool }: ToolGridProps) {
  const mediaTools = ALL_TOOLS.filter((t) => t.category === "media");
  const pdfTools = ALL_TOOLS.filter((t) => t.category === "pdf");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="space-y-8"
    >
      {/* Media section */}
      <div>
        <div className="mb-3 flex items-center gap-2 px-1">
          <ArrowRightLeft className="h-3.5 w-3.5 text-primary" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
            Conversion Média
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {mediaTools.map((tool, i) => (
            <ToolCard key={tool.id} tool={tool} index={i} onClick={() => onSelectTool(tool)} />
          ))}
        </div>
      </div>

      {/* PDF section */}
      <div>
        <div className="mb-3 flex items-center gap-2 px-1">
          <FileText className="h-3.5 w-3.5 text-destructive" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-destructive">
            Outils PDF — Moteur Docusûr
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {pdfTools.map((tool, i) => (
            <ToolCard key={tool.id} tool={tool} index={i + 3} onClick={() => onSelectTool(tool)} />
          ))}
        </div>
      </div>

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center justify-center gap-2 text-xs text-muted-foreground"
      >
        <Zap className="h-3 w-3 text-primary" fill="currentColor" />
        <span>Tous les outils fonctionnent 100% dans votre navigateur — aucun serveur impliqué</span>
      </motion.div>
    </motion.div>
  );
}

function ToolCard({
  tool,
  index,
  onClick,
}: {
  tool: Tool;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        duration: 0.45,
        delay: 0.2 + index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="group glass rounded-2xl p-5 text-left transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${tool.color} transition-transform duration-200 group-hover:scale-110`}>
        <tool.icon className={`h-5 w-5 ${tool.iconColor}`} />
      </div>
      <h3 className="font-display text-sm font-bold text-foreground leading-tight">
        {tool.label}
      </h3>
      <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
        {tool.desc}
      </p>
    </motion.button>
  );
}
