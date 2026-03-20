import { motion } from "framer-motion";
import { ALL_TOOLS, Tool, ToolCategory } from "@/components/ToolGrid";
import { ArrowRight, Zap } from "lucide-react";

const POPULAR_IDS = [
  "fusionner", "diviser", "compresser", "signer", "ocr",
  "convert-image", "proteger", "pdf-jpg", "filigrane",
  "convert-video", "convert-audio", "numeros",
];

interface HeroToolGridProps {
  onSelectTool: (tool: Tool) => void;
  onShowAll: () => void;
}

export function HeroToolGrid({ onSelectTool, onShowAll }: HeroToolGridProps) {
  const popularTools = POPULAR_IDS.map((id) => ALL_TOOLS.find((t) => t.id === id)).filter(Boolean) as Tool[];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="mb-4 flex items-center justify-between px-1">
        <h2 className="font-display text-sm font-bold text-foreground">
          Outils populaires
        </h2>
        <button
          onClick={onShowAll}
          className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors active:scale-95"
        >
          Voir les {ALL_TOOLS.length} outils
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
        {popularTools.map((tool, i) => (
          <motion.button
            key={tool.id}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.4,
              delay: 0.15 + i * 0.04,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelectTool(tool)}
            className="group glass rounded-xl p-3 text-center transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl ${tool.color} transition-transform duration-200 group-hover:scale-110`}>
              <tool.icon className={`h-5 w-5 ${tool.iconColor}`} />
            </div>
            <h3 className="font-display text-[11px] font-bold text-foreground leading-tight">
              {tool.label}
            </h3>
            <p className="mt-0.5 text-[9px] leading-snug text-muted-foreground line-clamp-1">
              {tool.desc}
            </p>
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-4 flex items-center justify-center gap-2 text-[11px] text-muted-foreground"
      >
        <Zap className="h-3 w-3 text-primary" fill="currentColor" />
        <span>{ALL_TOOLS.length} outils · Gratuit · 100% dans votre navigateur</span>
      </motion.div>
    </motion.div>
  );
}
