import { useTheme } from '@/lib/use-theme';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-secondary hover:bg-secondary/80 transition"
      aria-label="Changer de thème"
    >
      {theme === 'light' ? <Moon className="w-4 h-4 text-muted-foreground" /> : <Sun className="w-4 h-4 text-muted-foreground" />}
    </button>
  );
}
