import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/lib/use-theme";
import { Moon, Sun, ShieldCheck, ChevronDown, Menu, X, ArrowRight, FileText, PenTool, Shield, ArrowRightLeft, ScanText, Image, Music, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ALL_TOOLS, Tool, ToolCategory } from "@/components/ToolGrid";
import docusurLogo from "@/assets/docusur-logo.webp";

const MEGA_SECTIONS: { category: ToolCategory; title: string; icon: typeof FileText; color: string }[] = [
  { category: "media", title: "Conversion Média", icon: ArrowRightLeft, color: "text-primary" },
  { category: "pdf-manage", title: "Gestion PDF", icon: FileText, color: "text-destructive" },
  { category: "pdf-edit", title: "Édition PDF", icon: PenTool, color: "text-primary" },
  { category: "pdf-security", title: "Sécurité", icon: Shield, color: "text-kayzen-green" },
  { category: "pdf-convert", title: "Conversion PDF", icon: ArrowRightLeft, color: "text-accent" },
  { category: "pdf-advanced", title: "IA & Avancé", icon: ScanText, color: "text-destructive" },
];

interface HeaderProps {
  onSelectTool?: (tool: Tool) => void;
}

export function Header({ onSelectTool }: HeaderProps) {
  const { theme, toggle } = useTheme();
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    if (megaOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [megaOpen]);

  const handleToolClick = (tool: Tool) => {
    onSelectTool?.(tool);
    setMegaOpen(false);
    setMobileOpen(false);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="glass sticky top-0 z-50"
    >
      <div className="flex items-center justify-between px-4 py-3 md:px-8">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <img src={docusurLogo} alt="DocuSûr" className="h-8 w-auto" />
          <div className="flex items-center gap-2">
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              Docu<span className="text-destructive">Sûr</span>
            </span>
            <a
              href="https://internet.kayzen-lyon.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-block rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary transition-colors hover:bg-primary/20"
            >
              by Kayzen
            </a>
          </div>
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex" ref={megaRef}>
          <button
            onClick={() => setMegaOpen(!megaOpen)}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all active:scale-95 ${
              megaOpen ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            Tous les outils
            <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`} />
          </button>

          <div className="flex items-center gap-1 rounded-full border border-kayzen-green/20 bg-kayzen-green/8 px-2.5 py-1">
            <ShieldCheck className="h-3 w-3 text-kayzen-green" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-kayzen-green">Zero-Server</span>
          </div>

          <a
            href="https://internet.kayzen-lyon.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            kayzen-web.fr
          </a>

          <button
            onClick={toggle}
            className="ml-1 rounded-xl p-2.5 text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground active:scale-95"
            aria-label="Changer de thème"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          {/* Mega-menu dropdown */}
          <AnimatePresence>
            {megaOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-0 right-0 top-full mt-1 mx-4 rounded-2xl border border-border/40 bg-background p-6 shadow-2xl"
                style={{ maxHeight: "80vh", overflowY: "auto" }}
              >
                <div className="grid grid-cols-3 gap-6">
                  {MEGA_SECTIONS.map((section) => {
                    const tools = ALL_TOOLS.filter((t) => t.category === section.category);
                    if (tools.length === 0) return null;
                    return (
                      <div key={section.category}>
                        <div className="mb-3 flex items-center gap-2">
                          <section.icon className={`h-3.5 w-3.5 ${section.color}`} />
                          <h3 className={`text-[11px] font-bold uppercase tracking-wider ${section.color}`}>
                            {section.title}
                          </h3>
                          <span className="text-[10px] text-muted-foreground">({tools.length})</span>
                        </div>
                        <div className="space-y-0.5">
                          {tools.map((tool) => (
                            <button
                              key={tool.id}
                              onClick={() => handleToolClick(tool)}
                              className="group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-all hover:bg-primary/5 active:scale-[0.98]"
                            >
                              <div className={`flex h-7 w-7 items-center justify-center rounded-md ${tool.color} transition-transform duration-150 group-hover:scale-110`}>
                                <tool.icon className={`h-3.5 w-3.5 ${tool.iconColor}`} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                                  {tool.label}
                                </p>
                                <p className="text-[10px] text-muted-foreground leading-snug">{tool.desc}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom CTA */}
                <div className="mt-6 flex items-center justify-between rounded-xl bg-primary/5 px-5 py-3">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-bold text-foreground">{ALL_TOOLS.length} outils</span> · 100% dans votre navigateur · aucun serveur
                  </p>
                  <a
                    href="https://internet.kayzen-lyon.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    Découvrir Kayzen
                    <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <button onClick={toggle} className="rounded-xl p-2.5 text-muted-foreground" aria-label="Thème">
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="rounded-xl p-2.5 text-muted-foreground">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border/30 md:hidden"
          >
            <div className="px-4 py-4 space-y-5 max-h-[70vh] overflow-y-auto">
              {MEGA_SECTIONS.map((section) => {
                const tools = ALL_TOOLS.filter((t) => t.category === section.category);
                if (tools.length === 0) return null;
                return (
                  <div key={section.category}>
                    <h3 className={`text-[11px] font-bold uppercase tracking-wider ${section.color} mb-2 px-1`}>
                      {section.title}
                    </h3>
                    <div className="grid grid-cols-2 gap-1.5">
                      {tools.map((tool) => (
                        <button
                          key={tool.id}
                          onClick={() => handleToolClick(tool)}
                          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-primary/5 active:scale-[0.98]"
                        >
                          <div className={`flex h-7 w-7 items-center justify-center rounded-md ${tool.color}`}>
                            <tool.icon className={`h-3.5 w-3.5 ${tool.iconColor}`} />
                          </div>
                          <p className="text-xs font-semibold text-foreground">{tool.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
