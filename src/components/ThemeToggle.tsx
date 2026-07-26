"use client";

import { useTheme } from "@/lib/theme/ThemeProvider";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { dict } = useLanguage();

  return (
    <div className="flex items-center rounded-full border border-slate-700 dark:border-slate-600 p-0.5 text-[10px] sm:text-xs font-medium">
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-label={dict.theme.light}
        className={`min-h-6 sm:min-h-9 rounded-full px-2 py-1 sm:px-3.5 sm:py-2 transition ${
          theme === "light" ? "bg-blue-600 text-white" : "text-slate-300 hover:text-white"
        }`}
      >
        ☀
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-label={dict.theme.dark}
        className={`min-h-6 sm:min-h-9 rounded-full px-2 py-1 sm:px-3.5 sm:py-2 transition ${
          theme === "dark" ? "bg-blue-600 text-white" : "text-slate-300 hover:text-white"
        }`}
      >
        ☾
      </button>
    </div>
  );
}
