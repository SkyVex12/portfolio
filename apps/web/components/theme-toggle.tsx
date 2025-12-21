"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Prevent hydration mismatch: don't render theme-dependent UI until mounted
  if (!mounted) {
    return (
      <button
        className="ringy inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3 py-2 text-sm shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5"
        aria-label="Toggle theme"
        disabled
      >
        <span className="opacity-70">Theme</span>
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="ringy inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3 py-2 text-sm shadow-sm backdrop-blur hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
      aria-label="Toggle theme"
    >
      {isDark ? <Moon size={16} /> : <Sun size={16} />}
      <span className="hidden sm:inline">{isDark ? "Dark" : "Light"}</span>
    </button>
  );
}
