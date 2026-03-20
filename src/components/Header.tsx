import { useTheme } from "@/lib/use-theme";
import { Moon, Sun, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function Header() {
  const { theme, toggle } = useTheme();

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="glass sticky top-0 z-50 flex items-center justify-between px-6 py-4 md:px-12"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-glow">
          <Zap className="h-4.5 w-4.5 text-primary-foreground" fill="currentColor" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            SwiftConvert
          </span>
          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
            by Kayzen
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <a
          href="https://kayzen-lyon.fr"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:block"
        >
          kayzen-lyon.fr
        </a>
        <button
          onClick={toggle}
          className="rounded-xl p-2.5 text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground active:scale-95"
          aria-label="Changer de thème"
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
      </div>
    </motion.header>
  );
}
