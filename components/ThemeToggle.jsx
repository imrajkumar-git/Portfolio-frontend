"use client";

import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle light and dark theme"
      className="relative flex h-9 w-16 items-center rounded-full border border-emerald-400/40 bg-black/30 px-1 transition-colors dark:border-sky-400/40 dark:bg-white/5"
    >
      <span
        className={`absolute left-1 flex h-7 w-7 items-center justify-center rounded-full text-sm shadow-glow transition-transform duration-300 ${
          isDark
            ? "translate-x-7 bg-gradient-to-br from-sky-400 to-emerald-400"
            : "translate-x-0 bg-gradient-to-br from-emerald-400 to-sky-300"
        }`}
      >
        {isDark ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
