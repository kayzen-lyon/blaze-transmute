import { useTheme } from "@/lib/use-theme";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export function Header() {
  const { theme, toggle } = useTheme();

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-between px-6 py-5 md:px-12"
    >
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <span className="text-sm font-bold text-primary-foreground">V</span>
        </div>
        <span className="text-lg font-semibold tracking-tight text-foreground">
          Vert
        </span>
        <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Open Source
        </span>
      </div>

      <button
        onClick={toggle}
        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95"
        aria-label="Changer de thème"
      >
        {theme === "light" ? (
          <Moon className="h-4.5 w-4.5" />
        ) : (
          <Sun className="h-4.5 w-4.5" />
        )}
      </button>
    </motion.header>
  );
}
